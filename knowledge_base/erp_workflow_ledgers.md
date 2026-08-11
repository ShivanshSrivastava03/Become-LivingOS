# ERP Workflows and Ledgers

This file documents transaction lifecycles, state machines, and ledger structures an ERP backend must implement.

---

## 1. Transaction Lifecycle Patterns

### 1.1 Document State Machine Pattern

**Definition**: Each transaction type (order, invoice, payment, work order) has a finite set of states and allowed transitions.[web:46][web:49]

**Why it exists**:
- Enforces business logic (e.g., cannot bill before delivery).
- Prevents invalid operations.
- Supports audit trails and reporting.

**How it works**:
- Each document has a `status` field.
- Transitions triggered by actions (submit, deliver, bill, cancel).
- Guards enforce preconditions.

**Examples**:
- SalesOrder: Draft → To Deliver → To Bill → Completed / Cancelled.[web:46]
- PurchaseOrder: Draft → Approved → To Receive → To Bill → Completed / Cancelled.[web:35]
- WorkOrder: Planned → Not Started → In Progress → Completed / Stopped.[web:49][web:52]

**Backend implications**:
- State machine per document type.
- Transition functions with validations.
- Event hooks for side effects (inventory, accounting).

---

## 2. Sales Order-to-Cash Workflow

### 2.1 States and Transitions

**Documents**:
- Quotation
- Sales Order (SO)
- Delivery Note
- Sales Invoice
- Payment Entry

**Lifecycle**:

1. **Quotation**
   - States: Draft → Sent → Converted / Expired.
   - Conversion: Creates SO with same items and prices.[web:46]

2. **Sales Order**
   - States: Draft → Submitted (To Deliver and Bill) → Partially Delivered → Delivered → To Bill → Billed → Completed / Cancelled.[web:46]
   - Transitions:
     - Submit: Locks order, checks credit limit, reserves stock.
     - Create Delivery: Moves to Partially Delivered / Delivered.
     - Create Invoice: Moves to Billed.
     - Payment: Moves to Completed.

3. **Delivery Note**
   - States: Draft → Submitted → Completed / Cancelled.
   - Side effects:
     - Creates `StockLedgerEntry` (decrease).
     - Updates `Bin` (qty, reserved qty).

4. **Sales Invoice**
   - States: Draft → Submitted (Unpaid) → Partially Paid → Paid / Overdue / Cancelled.[web:15]
   - Side effects:
     - Posts revenue and AR journal entries.
     - Updates AR sub-ledger.

5. **Payment Entry**
   - States: Draft → Submitted / Cancelled.
   - Side effects:
     - Allocates to one or more invoices.
     - Posts bank/cash and AR journal entries.
     - Reduces outstanding amount on invoices.[web:15]

**Business rules**:
- Cannot deliver more than ordered.
- Cannot bill more than delivered (configurable).
- Cannot cancel document if downstream docs exist (or must cancel them first).

**Accounting impact**:
- SO: None (usually).
- Delivery: Inventory movement (no GL impact unless configured).
- Invoice: Debit AR, Credit Revenue; Debit COGS, Credit Inventory (if perpetual).
- Payment: Debit Bank/Cash, Credit AR.

---

## 3. Procure-to-Pay Workflow

### 3.1 States and Transitions

**Documents**:
- Material Request / Purchase Requisition
- RFQ
- Supplier Quotation
- Purchase Order (PO)
- Purchase Receipt
- Purchase Invoice
- Payment Entry

**Lifecycle**:

1. **Material Request**
   - States: Draft → Submitted → Approved / Rejected.
   - Can trigger RFQ or PO.

2. **RFQ / Supplier Quotation**
   - States: Draft → Sent → Received → Converted / Expired.
   - Used to select supplier and price.

3. **Purchase Order**
   - States: Draft → Submitted (To Receive and Bill) → Partially Received → Received → To Bill → Billed → Completed / Cancelled.[web:35]
   - Transitions:
     - Submit: Check approval thresholds.
     - Receipt: Update status.
     - Invoice: Update status.
     - Payment: Close.

4. **Purchase Receipt**
   - States: Draft → Submitted → Completed / Cancelled.
   - Side effects:
     - Creates `StockLedgerEntry` (increase).
     - Updates `Bin`.

5. **Purchase Invoice**
   - States: Draft → Submitted (Unpaid) → Partially Paid → Paid / Overdue / Cancelled.
   - Side effects:
     - Posts expense/inventory and AP entries.

6. **Payment Entry**
   - Similar to sales; reduces AP outstanding.

**Business rules**:
- Three-way match before payment.[web:33]
- Approval required if PO value exceeds threshold.
- Cannot receive more than ordered (or allow over-receipt with tolerance).

**Accounting impact**:
- PO: None (usually).
- Receipt: Inventory increase (no GL unless configured).
- Invoice: Debit Expense/Inventory, Credit AP.
- Payment: Debit AP, Credit Bank/Cash.

---

## 4. Manufacturing Workflow

### 4.1 States and Transitions

**Documents**:
- Sales Order / Forecast
- MRP Run
- Production Plan
- Work Order / Manufacturing Order
- Stock Entry (Material Consumption / Finished Goods)
- Quality Inspection (optional)

**Lifecycle**:

1. **Demand**
   - Sources: Sales Orders, forecasts, service orders.

2. **MRP Run**
   - Input: Demand, BOMs, inventory, open POs/WOs.[web:52]
   - Output: Planned production orders and purchase requests.

3. **Work Order**
   - States: Planned → Not Started → In Progress → Completed / Stopped.[web:49][web:52]
   - Transitions:
     - Start: Reserve materials.
     - Issue materials: Consume raw materials.
     - Complete: Post finished goods.
   - Side effects:
     - Material consumption entries (stock decrease).
     - Finished goods entries (stock increase).
     - Costing entries (WIP, variance).

4. **Quality Inspection**
   - States: Pending → Accepted / Rejected.
   - May block completion or trigger rework.

**Business rules**:
- Cannot consume more than BOM allows (configurable).
- Cannot complete if required materials not available.
- Scrap tracking and by-products.

**Accounting impact**:
- Material consumption: Debit WIP, Credit Inventory.
- Finished goods: Debit Finished Goods, Credit WIP.
- Variances: Debit/Credit variance accounts.

---

## 5. Payroll Workflow

### 5.1 States and Transitions

**Documents**:
- Attendance / Timesheet
- Salary Structure
- Payroll Entry
- Payslip
- Payment Entry

**Lifecycle**:

1. **Attendance/Timesheet**
   - States: Draft → Approved.
   - Used to compute overtime, project time.

2. **Payroll Entry (batch)**
   - States: Draft → Submitted → Paid.
   - Generates payslips for employees in scope.

3. **Payslip**
   - States: Draft → Submitted → Paid.
   - Side effects:
     - Posts salary expense and liabilities.

4. **Payment Entry**
   - Bank transfer or cash payment.

**Business rules**:
- Cannot submit payslip without approved attendance.
- Period-based; cannot double-pay same period.

---

## 6. ERP Ledgers

### 6.1 General Ledger (GL)

**Purpose**: Central record of all financial postings.[web:4][web:15]

**What gets recorded**:
- Every journal entry line: account, debit, credit, date, reference.

**How entries are created**:
- Automatically from invoices, payments, stock movements (if integrated), payroll, assets.
- Manually via manual journal entry.

**Immutability**:
- Posted entries immutable; corrections via reversal entries.[web:15]

**Corrections**:
- Create reversing entry with same accounts and opposite amounts.
- Optionally create corrected entry.

**Historical state**:
- All entries retained; period close locks ranges.

**Reports**:
- Trial balance, P&L, balance sheet, account statements.

---

### 6.2 Accounts Receivable (AR) Ledger

**Purpose**: Sub-ledger tracking customer balances.[web:15]

**What gets recorded**:
- Sales invoices, credit notes, payments, adjustments.

**How entries are created**:
- From sales invoices and payment entries.

**Immutability**:
- Same as GL; entries immutable after posting.

**Reports**:
- Aging report, customer statement, outstanding summary.

---

### 6.3 Accounts Payable (AP) Ledger

**Purpose**: Sub-ledger tracking supplier balances.[web:15]

**What gets recorded**:
- Purchase invoices, debit notes, payments, adjustments.

**Reports**:
- Vendor aging, outstanding summary.

---

### 6.4 Stock Ledger

**Purpose**: Immutable record of all stock movements.[page:7][web:7]

**What gets recorded**:
- Every stock movement: item, warehouse, qty, rate, value, reference.

**How entries are created**:
- From receipts, deliveries, transfers, manufacturing entries, adjustments.

**Immutability**:
- Append-only; backdated changes require reposting chain.[page:2][page:7]

**Corrections**:
- Reverse via negative movement or repost engine.

**Historical state**:
- Full history of movements; used for valuation and audit.

**Reports**:
- Stock ledger report, item-wise movement, warehouse movement.

---

### 6.5 Asset Ledger

**Purpose**: Track asset transactions and depreciation.[web:4]

**What gets recorded**:
- Acquisition, depreciation, revaluation, disposal.

**Reports**:
- Asset register, depreciation schedule, net book value.

---

### 6.6 Payroll Ledger

**Purpose**: Record payroll transactions per employee and period.[web:16]

**What gets recorded**:
- Gross pay, deductions, net pay, tax withheld.

**Reports**:
- Payroll register, tax reports, statutory filings.

---

### 6.7 Cost / Analytic Ledger

**Purpose**: Track costs and revenues by dimensions (cost centers, projects, products).[web:15]

**What gets recorded**:
- Analytic lines with amount, account, dimension values.

**Reports**:
- Cost center P&L, project profitability, product margin.

---

## 7. Approval Workflows

### 7.1 Concept

**Definition**: Configurable process where documents must be approved by designated users before certain actions.[web:31][web:39]

**Why it exists**:
- Internal control.
- Segregation of duties.
- Compliance.

**How it works**:
- Define rules: document type, conditions (amount, department, cost center).
- Define approvers (roles, users, hierarchy).
- Define levels (single, multi-level).

**Examples**:
- PO > $10,000 requires manager approval.[web:39]
- Journal entries affecting certain accounts require CFO approval.
- Sales orders for high-risk customers require credit manager approval.

**Backend implications**:
- Approval workflow engine.
- Pending approvals queue.
- Audit trail of approvals.

---

## 8. Event-Driven Automation

### 8.1 Concept

**Definition**: Use events (document created, status changed) to trigger actions (notifications, tasks, integrations).[web:40][web:44]

**Why it exists**:
- Reduce manual work.
- Ensure consistency.
- Enable integrations.

**How it works**:
- Define triggers (e.g., Sales Invoice submitted).
- Define actions (send email, create task, call webhook).

**Examples**:
- On low stock: create purchase requisition.
- On overdue invoice: send dunning email.
- On work order completion: notify QA.

**Backend implications**:
- Event bus or hooks.
- Configurable automation rules.

---

## 9. Audit Trails and Versioning

### 9.1 Audit Trails

**Definition**: Record who did what and when for critical changes.[web:37]

**Why it exists**:
- Compliance.
- Debugging.
- Security.

**How it works**:
- Log changes to key fields (amounts, accounts, status).
- Store user, timestamp, old value, new value.

**Backend implications**:
- Audit log tables.
- UI to view history.

---

### 9.2 Versioning

**Definition**: Keep historical versions of documents (e.g., BOM, price lists).[web:50]

**Why it exists**:
- Traceability.
- Revert if needed.

**How it works**:
- On change, create new version; old version remains referenced by historical transactions.

**Examples**:
- BOM versioning: each work order references specific BOM version.[web:50]
- Price list versioning with effective dates.

---

## 10. Effective Dating

**Definition**: Entities have validity periods (e.g., price lists, tax rules, exchange rates).[web:4]

**Why it exists**:
- Handle future-dated changes.
- Ensure correct rates/prices at transaction time.

**How it works**:
- Fields: `effective_from`, `effective_to`.
- Lookup uses date of transaction to find applicable record.

**Examples**:
- Exchange rate table with date ranges.
- Tax rates with start/end dates.

---

This file focuses on workflows, state machines, and ledgers. Domain entities and calculations are documented in the companion files.