# Hostel Management System (HMS) — Final Backend & Database Specification

This is the single build-reference document for HMS. It merges two prior inputs — the domain/semantic spec and the frontend module catalogue (`HMS_MODULES.md`, screens/controls only) — and rewrites everything from a **backend and database-design** angle: every module below is described as entities, fields, relationships, state machines, business rules, and endpoints, not as UI.

It also adds what the frontend catalogue and earlier drafts left open:
- **Room Allotment** and **Room Change** as their own fully specified modules (previously folded into "Applications, allotment and occupancy").
- **Mess Management** and **Mess Staff** as new, separate modules (menu, meal plans, mess attendance, stock).
- **Staff Payroll & Salaries** as a new financial module — wardens, branch admins, and all other staff.
- Resolution of the earlier `TBD` items: Attendance is not a separate module — it's covered by Gate Desk Operations (§8) using `gate_entry`; this is stated explicitly so it isn't re-built twice.

Mobile-app-only for field roles, mobile+web for oversight roles — carried over from the original constraint. Multi-branch HO oversight is a first-class permission dimension throughout.

---

## 0. Global Conventions (apply to every module)

**Roles:** `HO_ADMIN`, `BRANCH_ADMIN`, `ACCOUNTANT`, `WARDEN` *(branch-level operational head — distinct from `BRANCH_ADMIN` if the org separates admin/warden duties; treat as the same role if not)*, `MAINTENANCE_STAFF`, `MESS_STAFF` *(new — §9)*, `SECURITY_GUARD`, `RESIDENT`, `GUARDIAN` *(read-only, no login required by default)*.

**Scoping rule:** every table that isn't organisation-wide master data carries a `branch_id`. Every query, every endpoint, every row-level check resolves `(role, branch_id)` before touching data. `HO_ADMIN` is the only role that can span branches natively; everyone else is branch-scoped, enforced server-side, never client-side.

**Identity & audit columns on every table:** `id (uuid, pk)`, `branch_id (fk, nullable only for org-level tables)`, `created_at`, `updated_at`, `created_by`, `updated_by`. Every write additionally emits an `audit_log` row (actor, role, action, entity, before/after diff) — this is not optional per module, it's a platform-level trigger/interceptor.

**Money:** every monetary column is stored as integer minor units (paise) with a currency column, never floating point. Rate/policy changes are effective-dated, never retroactive to already-issued invoices/payslips.

**State machines:** every entity with a `status` field has its transitions enforced in the backend (not just UI-hidden) via an explicit allowed-transition table per entity.

**Events:** significant state changes emit a domain event (`entity`, `action`, `payload`, `branch_id`, `occurred_at`) to an event stream. Notifications (§14) and audit are event-driven consumers, never triggered ad hoc from request handlers.

---

## 1. Module Map

| # | Module | Key entities | New/Deepened here |
|---|---|---|---|
| 1 | Identity & Access | `user_account`, `role_grant` | |
| 2 | Branch & HO Oversight | `branch`, `block` | |
| 3 | Room & Bed Inventory | `room`, `bed`, `asset` | |
| 4 | **Room Allotment** | `application`, `allotment` | ✅ deepened |
| 5 | **Room Change** | `room_change_request` | ✅ new, standalone |
| 6 | Resident Directory | `resident`, `guardian` | |
| 7 | Fees, Invoices & Collections | `fee_plan`, `invoice`, `payment` | |
| 7b | Dues & Recovery | (uses invoice/payment) | |
| 7c | Refunds & Deposits | `refund`, `deposit_ledger` | |
| 8 | Gate Desk & Attendance | `gate_entry`, `outpass`, `standing_pass`, `watchlist_entry` | resolves Attendance TBD |
| 8b | Visitor/Outpass Approvals, Watchlist & Incidents | `incident` | |
| 9 | **Mess Management & Mess Staff** | `mess_menu`, `meal_plan`, `mess_attendance`, `mess_stock` | ✅ new |
| 10 | Complaints & Maintenance | `complaint`, `work_order` | |
| 11 | Notices & Communication | `notice`, `notice_receipt` | |
| 12 | **Staff Directory, Payroll & Salaries** | `staff_member`, `staff_transfer`, `payroll_run`, `payslip` | ✅ new financial module |
| 13 | Reports & Analytics | snapshot tables | |
| 14 | Notifications & Alerts | `message_outbox`, `alert` | |
| 15 | Settings, Policy & Audit | `organisation.settings`, `branch.policy_overrides`, `audit_log` | |

---

## 2. Identity & Access

**Entities**
- `user_account` — id, name, contact, credential_hash/OTP binding, status (active/suspended)
- `role_grant` — user_id, role, branch_id (nullable for org-wide `HO_ADMIN`), status

**Business rules**
- A user can hold multiple `role_grant` rows (multi-branch, multi-role); the active session resolves one `(role, branch)` context at a time.
- Revoking a grant must invalidate any live session token tied to it, not just future logins.
- `impersonated_by` is stamped on every write made under HO's impersonate-branch-admin mode.

**Endpoints:** `POST /auth/login`, `POST /auth/refresh`, `GET /me/permissions`.

---

## 3. Branch & HO Oversight

**Entities**
- `branch` — id, name, code (unique), city, region, address, status (setup/active/suspended/closed)
- `block` — id, branch_id, name, gender_restriction (nullable)

**Business rules**
- `branch.status = setup` blocks all allotment/billing until `activate`.
- Suspension blocks new allotments but does not stop billing for existing residents.
- Bulk room generation on branch creation must be idempotent per submission (retry-safe).

**HO rollup data model:** HO dashboards read from daily snapshot tables (`occupancy_daily`, `finance_daily`, `complaints_daily`, `gate_daily`) — never live-aggregated from operational tables on request. A nightly job materializes these per branch.

**Endpoints:** `GET /branches`, `POST /branches`, `POST /branches/{id}/activate`, `POST /branches/{id}/suspend`, `GET /dashboard/network`.

---

## 4. Room & Bed Inventory

**Entities**
- `room` — id, branch_id, block_id, room_number, type, rent (base), capacity, status (derived: vacant/partial/occupied; manual override: maintenance/blocked)
- `bed` — id, room_id, label, status (vacant/occupied/reserved/maintenance)
- `asset` — id, room_id, name, condition, notes (fixtures/furniture tied to a room, for damage/refund deduction reference)

**Business rules**
- `room.status` is derived from bed occupancy, except `maintenance`/`blocked` which are manual and win until released.
- `capacity` must always equal count of active beds — enforced by a nightly reconciliation job, not just at write time.
- Rent changes on a room must never retroactively alter already-issued invoices — allotments snapshot rent at commit time (see §5).
- `bed.status = reserved` (pending allotment, not yet checked in) is distinct from `occupied` (checked-in resident) — this distinction is load-bearing for every "available beds" query.

**Endpoints:** `GET /beds/available`, `PATCH /rooms/{id}`, `POST /rooms/{id}/status`.

---

## 5. Room Allotment (deepened)

Covers the full lifecycle from application to a resident occupying a bed.

**Entities**
- `application` — id, branch_id, applicant details, preferred_room_type, preferred_block, priority_score, status (submitted/waitlisted/approved/rejected), documents (fk to attachment)
- `allotment` — id, resident_id, bed_id, branch_id, start_date, agreed_rent *(snapshot — independent of later room.rent changes)*, deposit_amount, fee_plan_id, status (reserved/checked_in/notice_period/vacated), checkin_date, checkout_date

**Workflow / state machine**
```
application: submitted → waitlisted → approved → (bed matched) → rejected
allotment:   reserved → checked_in → notice_period → vacated
```
1. **Bed matching** — candidate beds filtered by block gender restriction, preferred type/block; manual override requires a reason.
2. **Allotment confirmation** — start date, `agreed_rent` (defaults from room, editable with a mandatory concession reason), deposit, fee plan. This step *previews* the invoices it will create.
3. **Atomic commit** (single transaction): bed → `reserved`, `allotment` row created, admission + deposit invoices issued, resident status → pending-checkin, welcome notification queued. If any step fails, none commit.
4. **Check-in** is a distinct, separate action from allotment: it records actual arrival, flips bed to `occupied`, allotment to `checked_in`, and is the event that activates recurring billing (not the allotment date).
5. **Pending queue** — approved applicants with no bed yet; alert when age exceeds a configured threshold.

**Business rules**
- `agreed_rent` is a snapshot on `allotment`, never re-derived from `room.rent` — this is what makes rent changes non-retroactive.
- An application cannot be approved into a bed that fails the block's gender restriction without an explicit manual override + reason.
- Only one active (`checked_in`) allotment per bed at a time; historical allotments are kept, not deleted.

**Endpoints:** `POST /applications`, `POST /applications/{id}/decision`, `POST /allotments`, `POST /allotments/{id}/checkin`, `GET /allotments/pending`.

---

## 6. Room Change (new, standalone)

Distinct from allotment: a room change moves an **already-active** resident from one bed/room to another, and must reconcile billing and history rather than create a fresh allotment from scratch.

**Entities**
- `room_change_request` — id, resident_id, current_allotment_id, requested_room_type/block (or specific target bed), reason, status (requested/approved/rejected/completed), requested_by (resident or admin), approved_by, effective_date

**Workflow**
```
requested → approved → completed
requested → rejected
```
1. Resident (self-service) or admin raises a request: reason, preferred type/block, or a specific target bed if admin-initiated.
2. Admin reviews against availability (reuses §4 bed-matching logic) and any policy constraints (e.g. minimum stay before a change is allowed, room-change fee if configured).
3. **On approval + effective date reached:** the current `allotment` is closed (`status = vacated`, `checkout_date = effective_date`, source bed → `vacant`), and a **new** `allotment` row is created against the target bed (`status = checked_in`, `checkin_date = effective_date`), preserving the resident's continuous tenancy across two allotment records rather than mutating one row in place — this keeps historical rent/room data intact per allotment period.
4. Billing reconciliation: if rent differs between old and new room, the invoice for the transition period is pro-rated between the two rates as of `effective_date`. A room-change fee, if policy-configured, is added as an ad-hoc invoice line.
5. Target bed is marked `reserved` between approval and `completed` so it isn't double-booked by a concurrent allotment.

**Business rules**
- A room change never edits history — it always produces a new `allotment` record linked to the same `resident_id`, so a resident's full room history is queryable end to end.
- A pending room change request blocks the source bed from being released prematurely and the target bed from being allotted to anyone else.
- Room-change policy (minimum stay, fee, approval requirement, cooling-off period) is a `Settings` (§15) value, not hardcoded — resolved per branch with organisation-level inheritance.

**Endpoints:** `POST /room-change-requests`, `POST /room-change-requests/{id}/decision`, `POST /room-change-requests/{id}/complete`, `GET /room-change-requests?resident_id=`.

---

## 7. Resident Directory

**Entities**
- `resident` — id, branch_id, name, contact, enrolment_number, status (pending/active/notice_period/vacated/suspended)
- `guardian` — id, name, contact, relation
- `resident_guardian` — join table

**Business rules**
- Duplicate detection on phone + enrolment number at creation.
- Field-level visibility enforced server-side per role (e.g. `SECURITY_GUARD` sees name/room/photo/guardian-contact only during an active verification lookup, and that read is itself audited).
- `VACATED` residents remain queryable (billing/refund history) but excluded from active-occupancy counts.
- Suspension blocks exit privileges/gate approvals but does not stop billing.

**Endpoints:** `GET /residents`, `PATCH /residents/{id}`, `POST /residents/{id}/suspend`.

---

## 8. Fees, Invoices & Collections (+ Dues/Recovery + Refunds/Deposits)

**Entities**
- `fee_plan`, `fee_component` — versioned, effective-dated fee structures
- `fee_assignment` — resident ↔ fee_plan with negotiated overrides
- `invoice`, `invoice_line` — status (draft/issued/partially_paid/paid/overdue/written_off/cancelled)
- `payment`, `payment_allocation` — allocation across open invoices, oldest-due-first by default
- `deposit_ledger` — held/adjusted/refunded/balance per resident
- `refund` — status (requested/recommended/approved/paid/rejected)

**Business rules (carried over, backend-critical)**
- Invoice generation per cycle is idempotent per resident per period — a retried run must never double-bill.
- Invoice numbers are gap-free per branch per financial year — allocate inside the same transaction as issue.
- Rate/tax changes apply from an effective date; issued invoices are immutable once issued (corrections are new lines/credit notes, not edits).
- A reversed payment is a new reversing entry, never an edit to the original.
- Refund approved amount can never exceed the refundable deposit balance; a rejected refund cannot later be "approved" — a new request must be raised.
- Late-fee accrual, ageing buckets (0–15/16–30/31–60/60+), and the escalation ladder are policy-configurable per branch (§15), resolved through a single settings resolver.

**Endpoints:** `POST /invoices/generate`, `POST /payments`, `POST /payments/{id}/reverse`, `POST /refunds`, `POST /refunds/{id}/decide`.

---

## 9. Mess Management & Mess Staff (new)

Two related but distinct concerns: what's on the menu / who's eating (Mess Management), and the staff who run it (Mess Staff) — kept separate so mess operations can be staffed and reported on independently of the menu itself.

### 9.1 Mess Management

**Entities**
- `mess_menu` — id, branch_id, day_of_week (or specific date for one-off/festival menus), meal_type (breakfast/lunch/snacks/dinner), items (array or join to `mess_menu_item`), is_special (bool), effective_from/to
- `mess_menu_item` — id, menu_id, item_name, category (veg/non-veg/vegan/jain, etc.), allergens (array)
- `meal_plan` — id, branch_id, name, meals_included (breakfast/lunch/snacks/dinner combination), price, billing_frequency (monthly/per-meal)
- `resident_meal_plan` — resident_id, meal_plan_id, start_date, end_date, opt_out_days *(for planned absences — mirrors leave, avoids charging for meals not taken if policy allows)*
- `mess_attendance` — id, resident_id, branch_id, meal_type, date, status (taken/skipped/no_show), marked_by (self-scan, staff, or biometric device reference)
- `mess_stock` — id, branch_id, item_name, unit, quantity_on_hand, reorder_level, last_restocked_date
- `mess_stock_movement` — id, stock_id, type (received/consumed/wasted/adjusted), quantity, date, recorded_by

**Business rules**
- The published `mess_menu` for "today" is resolved by `branch_id + date/day_of_week`, with date-specific rows overriding the recurring weekly template (so a festival-day menu doesn't require editing the weekly template).
- `mess_attendance` is the authoritative source for **meal count** (used for mess-fee reconciliation and for cooking-quantity planning) — it is not derived from `resident_meal_plan` alone, since a resident on a plan can still skip a meal.
- `mess_stock.quantity_on_hand` is only ever changed via `mess_stock_movement` rows (never a direct field edit), so consumption/wastage is always auditable and reorder alerts are computed from a consistent ledger.
- Reorder alert fires when `quantity_on_hand <= reorder_level`; this feeds Notifications (§14) to `MESS_STAFF` / `BRANCH_ADMIN`.
- Meal-plan billing (monthly fee vs per-meal) is a `fee_component` inside the existing Fees module (§8) — mess billing is not a parallel invoicing system, it plugs into the same `fee_plan`/`invoice` machinery to avoid two sources of truth for what a resident owes.

**Query semantics (examples)**
- *"How many people are eating dinner tonight"* → count `mess_attendance` where `date = today, meal_type = dinner, status = taken`, falling back to `resident_meal_plan` headcount if attendance hasn't been marked yet (a **projection**, not a substitute — must be labeled as projected in the response).
- *"What's low in the mess"* → `mess_stock` where `quantity_on_hand <= reorder_level`.

**Endpoints:** `GET /mess/menu?date=`, `POST /mess/menu`, `GET /mess/meal-plans`, `POST /residents/{id}/meal-plan`, `POST /mess/attendance`, `GET /mess/stock`, `POST /mess/stock/movements`, `GET /mess/stock/reorder-alerts`.

**Permissions:** `MESS_STAFF` manages menu, attendance marking, and stock for their branch; `BRANCH_ADMIN`/`HO_ADMIN` read + approve meal-plan pricing changes; `RESIDENT` reads menu and their own attendance/opt-outs.

### 9.2 Mess Staff

Kept as a role/sub-directory rather than a fully separate entity — `staff_member` (§12) with `role = MESS_STAFF` and a `department = mess`. What's specific to them lives here:

- **Assignment:** which meal shifts (breakfast/lunch/snacks/dinner) each mess staff member is responsible for, per branch — modeled as `staff_shift` rows (see §12) scoped to `department = mess`.
- **Duties tracked:** menu updates they make (attributed via `created_by`/`updated_by` on `mess_menu`), stock movements they record, attendance they mark on behalf of residents (e.g. at a physical counter).
- **Reporting hook:** mess staff performance/activity (meals served, stock discrepancies recorded) rolls into the same Reports module (§13) as maintenance staff performance, for consistency.

**Business rule:** a mess staff member deactivation/transfer is blocked while they have an open stock discrepancy pending review — mirrors the existing rule that maintenance staff can't be reassigned mid-open-complaint.

---

## 10. Complaints & Maintenance

**Entities:** `complaint`, `complaint_event`, `work_order`, referencing `asset` (§4) and `staff_member` (§12).

**Business rules**
- Status progression enforced via a state machine, not free-text; resolution requires a note.
- Reopen window is configurable per category/priority; reopen increments a counter feeding staff quality metrics.
- Staff deactivation/transfer blocked until their open complaints are reassigned.
- Recurring failures on the same `asset` should be flaggable (replace-vs-repair signal) rather than silently repeated as new complaints.

**Endpoints:** `POST /complaints`, `POST /complaints/{id}/assign`, `POST /complaints/{id}/resolve`, `POST /complaints/{id}/reopen`.

---

## 11. Notices & Communication

**Entities:** `notice`, `notice_target` (audience definition), `notice_receipt` (delivery/read tracking).

**Business rules**
- Audience is resolved and **snapshotted at publish time** — someone joining later doesn't retroactively receive an old notice unless it's pinned and unexpired.
- Delivery failure per channel must be visible/retryable, not silently dropped.

**Endpoints:** `POST /notices`, `POST /notices/{id}/publish`, `GET /notices/{id}/receipts`.

---

## 12. Staff Directory, Payroll & Salaries (new financial module)

Covers every internal staff role — warden/branch admin, accountant, maintenance staff, security guard, mess staff — as employees of the hostel, distinct from residents/customers.

**Entities**
- `staff_member` — id, branch_id, user_id (fk to `user_account` if they also log in), name, role, department, employment_type (full-time/part-time/contract), status (active/inactive), joining_date
- `staff_shift` — id, staff_id, branch_id, shift_date, start_time, end_time, department (gate/maintenance/mess/admin) — generalizes the guard-shift concept from the gate module to any shift-based staff
- `staff_transfer` — id, staff_id, from_branch_id, to_branch_id, status (requested/approved/effected), effective_date
- `salary_structure` — id, staff_id (or role+branch template), basic, allowances (array of {type, amount}), deductions (array of {type, amount}), effective_from/to *(effective-dated, like fee plans — a raise or policy change never rewrites a past payslip)*
- `payroll_run` — id, branch_id, period (month/year), status (draft/processing/finalized/paid), generated_at
- `payslip` — id, payroll_run_id, staff_id, gross, deductions, net, status (draft/issued/paid), paid_date, payment_reference
- `salary_advance` — id, staff_id, amount, date, recovery_plan (e.g. deducted over N payroll runs), status

**Workflow / state machine**
```
payroll_run: draft → processing → finalized → paid
payslip:     draft → issued → paid
```
1. **Run generation** — for a branch + period, pull each active `staff_member`'s current `salary_structure`, apply attendance/shift-based deductions if the org uses hourly/shift-linked pay (via `staff_shift`), apply any pending `salary_advance` recovery installment, produce draft `payslip` rows. This mirrors invoice generation (§8) and must be equally **idempotent per staff per period**.
2. **Review** — branch admin/HO reviews the draft run, can adjust individual payslips (with a mandatory reason, audited), before finalizing.
3. **Finalize** locks the payslips (no further edits without a reversing adjustment entry, same immutability principle as invoices).
4. **Payment** — mark paid with method/reference/date, same shape as `payment` in §8 but on the payables side rather than receivables.

**Business rules**
- `salary_structure` is effective-dated; a payslip always references the structure version active during that period, so a later raise never rewrites a historical payslip.
- A `staff_transfer` in progress must move `role_grant` (login access) atomically with the branch reassignment — a half-completed transfer must never leave someone with access to neither branch (mirrors the same rule from the source catalogue's staff-transfer module).
- A staff member mid-shift cannot be transferred.
- Salary advances are tracked as a liability against the staff member and auto-deducted per the recovery plan in subsequent payroll runs — never silently forgiven without an explicit write-off action (mirrors invoice write-offs).
- `HO_ADMIN` approves payroll for all branches; `BRANCH_ADMIN` initiates/reviews for their own branch; `ACCOUNTANT` can generate and adjust drafts but not finalize/pay without admin approval (mirrors the threshold-approval pattern in Refunds, §8).
- Payroll data (salary structures, payslips) is the most sensitive data in the system after resident personal data — it must be excluded from any general "staff directory" read that isn't specifically payroll-scoped, even for `BRANCH_ADMIN` unless they hold explicit payroll permission.

**Endpoints:** `GET /staff`, `POST /staff-transfers`, `POST /staff-transfers/{id}/decide`, `POST /payroll-runs`, `POST /payroll-runs/{id}/finalize`, `GET /payroll-runs/{id}/payslips`, `POST /payslips/{id}/pay`, `POST /staff/{id}/salary-advance`.

---

## 13. Reports & Analytics

Backed by the same daily snapshot tables referenced in §3 (`occupancy_daily`, `finance_daily`, `complaints_daily`, `gate_daily`) plus a `mess_daily` and `payroll_monthly` snapshot added for the new modules. Reports are always read from snapshots or the audit log, never by aggregating live operational tables on request, so report load never competes with transactional writes.

**Endpoints:** `GET /reports/occupancy`, `GET /reports/collections`, `GET /reports/mess-consumption`, `GET /reports/payroll-summary`, `GET /reports/compare` (branch comparison).

---

## 14. Notifications & Alerts

**Entities:** `message_outbox`, `alert`, `alert_rule` (thresholds), user notification preferences.

**Business rules**
- Every notification originates from a domain event — never ad hoc code in a request handler — so the set of possible notifications is enumerable and testable.
- Failed channel delivery falls back to another channel rather than silently dropping; the fallback is itself recorded.
- Safety and financial notices cannot be muted by user preference; quiet hours don't apply to them.

**New event bindings for this document's additions:**
- Mess stock reorder alert → `MESS_STAFF`, `BRANCH_ADMIN`.
- Room change approved/completed → resident, guardian.
- Payslip issued/paid → the staff member.
- Payroll run pending approval → `BRANCH_ADMIN`/`HO_ADMIN`.

---

## 15. Settings, Policy & Audit

**Entities:** `organisation.settings`, `branch.policy_overrides`, `gate_rule`, `alert_rule`, `audit_log`.

**Business rules**
- Every setting is resolved through **one resolver** used by every module — no module reads a settings level directly. This is what lets §5 (room-change policy), §9 (mess billing), and §12 (payroll thresholds) all share one inheritance/override mechanism instead of three bespoke ones.
- Branch-level overrides are always visible against their inherited value, with a one-tap revert.
- Rate/policy changes are effective-dated; they must never retroactively rewrite already-issued invoices, payslips, or SLA targets.
- `audit_log` is read-only by construction — no API path can write, edit, or bulk-clear it. Sensitive reads (finance, resident PII, gate verification) are logged, not just writes.

---

## 16. Cross-Cutting Backend Requirements

- **Multi-tenancy / branch scoping** enforced at the query layer (row-level), not just the API layer — a bug in one endpoint must not leak cross-branch data.
- **Idempotency** required on: invoice generation, payroll run generation, bulk room generation, payment webhooks (dedup by idempotency key).
- **Immutability + reversal, never edit-in-place** for: invoices, payslips, payments — corrections are new reversing/adjusting entries.
- **Effective dating** for: fee plans, salary structures, tax/rate settings, room-change and mess policy — a change applies from a boundary, not retroactively.
- **Offline-tolerant writes** (client-generated ids, dedup on sync) specifically for gate desk and maintenance workbench, since those roles operate on poor connectivity.
- **Event-sourced notifications and audit** — both are consumers of the same domain event stream, not separately triggered.
- **Server-side enforcement of every permission** — UI hiding a control is never the security boundary.

---

## 17. Resolved Open Items (from the earlier draft)

- **Attendance / Gate Log** — not a separate module. Fully covered by §8 (`gate_entry`), which already tracks entry/exit, duration, and overstay. No separate attendance table needed unless a future requirement (e.g. class/academic attendance) emerges outside the gate context.
- **Mess / Meal Management** — now fully specified in §9, including a separate Mess Staff sub-role and stock/menu management, no longer TBD.
- **Inter-branch resident transfer** — not addressed in the source catalogue for residents (only staff transfers, §12); if needed, model it the same way as Room Change (§6): close the old allotment, open a new one at the destination branch, never mutate history in place.
- **Financial module for staff salaries** — delivered in §12.
