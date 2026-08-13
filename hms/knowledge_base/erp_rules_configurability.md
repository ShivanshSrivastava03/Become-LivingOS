# ERP Business Rules and Configurability

This file catalogs business rules, their types, and how to structure configurability in an ERP backend.

---

## 1. Types of Business Rules

### 1.1 Validation Rules

**Purpose**: Prevent invalid data or transactions.

**Examples**:
- IF `SalesOrder.total` > `Customer.credit_limit` THEN block order unless override.[web:15]
- IF `PurchaseOrder.amount` > threshold THEN require approval.[web:39]
- IF `StockLedgerEntry` would make `Bin.actual_qty` < 0 THEN block (if negative stock disallowed).[page:7]
- IF `JournalEntry.debit` != `JournalEntry.credit` THEN reject.[web:15]

**Representation**:
- Rule engine with conditions and actions.
- Conditions expressed as expressions over fields.
- Actions: block, warn, require override.

---

### 1.2 Pricing Rules

**Purpose**: Determine prices and discounts dynamically.

**Examples**:
- IF `Customer.group` = "Wholesale" THEN apply price list "Wholesale".[web:4]
- IF `SalesOrder.quantity` >= 100 THEN apply 5% discount.
- IF `Item.category` = "Clearance" AND `date` in promotion period THEN apply promotional price.

**Representation**:
- Price list tables with conditions (customer group, item group, territory, date range).
- Discount rules with priority and stacking rules.

---

### 1.3 Approval Rules

**Purpose**: Enforce internal controls.

**Examples**:
- IF `PurchaseOrder.total` > $10,000 THEN require manager approval.[web:39]
- IF `JournalEntry` affects "Cash" account THEN require CFO approval.
- IF `SalesOrder` for high-risk customer THEN require credit manager approval.

**Representation**:
- Approval workflow definitions with conditions and approver roles.
- Multi-level approval chains.

---

### 1.4 Tax Rules

**Purpose**: Determine which taxes apply.

**Examples**:
- IF `Customer.country` = "India" AND `Item.tax_category` = "Standard" THEN apply GST 18%.[web:4]
- IF `Transaction.type` = "Export" THEN apply 0% tax.
- IF `Customer.tax_exempt` = true THEN no tax.

**Representation**:
- Tax rule tables with conditions (jurisdiction, item group, customer group, transaction type).
- Effective dating for tax rate changes.

---

### 1.5 Inventory Rules

**Purpose**: Control stock behavior.

**Examples**:
- IF `Bin.actual_qty` < `Item.reorder_level` THEN generate procurement suggestion.[web:3]
- IF `Item.valuation_method` = "FIFO" THEN use FIFO layers for valuation.[page:2]
- IF `Item.has_batch_no` = true THEN enforce batch selection on issue.

**Representation**:
- Item-level and warehouse-level settings.
- Automated procurement policies.

---

### 1.6 Accounting Rules

**Purpose**: Control financial posting behavior.

**Examples**:
- IF `Company.enable_perpetual_inventory` = true THEN post inventory movements to GL.[web:4]
- IF `FiscalPeriod.status` = "Closed" THEN block postings to that period.[web:4]
- IF `Account.allow_manual_entries` = false THEN block manual journals to that account.

**Representation**:
- Company and account-level flags.
- Period control tables.

---

### 1.7 Permission Rules

**Purpose**: Control access.

**Examples**:
- IF `User.role` = "Accounts User" THEN allow create/read on Invoices, deny on Journal Entries.
- IF `User.role` = "Stock Manager" THEN allow stock adjustments.

**Representation**:
- Role-based access control (RBAC).
- Document-level and field-level permissions.

---

### 1.8 Workflow Rules

**Purpose**: Automate process flow.

**Examples**:
- ON `SalesInvoice` overdue > 30 days THEN send dunning email.[web:15]
- ON `Bin.actual_qty` < safety stock THEN create purchase requisition.[web:3]
- ON `WorkOrder` completion THEN notify QA for inspection.[web:52]

**Representation**:
- Event-triggered rules with conditions and actions.
- Configurable via UI.

---

### 1.9 Compliance Rules

**Purpose**: Meet regulatory requirements.

**Examples**:
- IF `Transaction.country` = "India" AND `Document.type` = "Sales Invoice" THEN include GST fields and sequential numbering.[web:4]
- IF `Employee.salary` > threshold THEN apply higher tax bracket.[web:16]

**Representation**:
- Country/region-specific modules.
- Statutory report generators.

---

## 2. Rule Representation in Backend

### 2.1 Hardcoded Rules

**When to hardcode**:
- Core accounting principles (double-entry balance).
- Ledger immutability.
- Fundamental state transitions.

**Why**:
- Changing these breaks system integrity.
- Too risky to expose as configuration.

**Examples**:
- `sum(debit) == sum(credit)` for journal entries.[web:15]
- Posted documents cannot be edited; only reversed.[web:15]

---

### 2.2 Configurable Rules

**When to configure**:
- Business-specific thresholds.
- Industry-specific behaviors.
- Company policies.

**How**:
- Store rule definitions in database.
- Use rule engine to evaluate conditions and execute actions.

**Examples**:
- Approval thresholds by document type and amount.[web:39]
- Credit limit per customer.
- Tax rules per jurisdiction.[web:4]

---

### 2.3 User-Defined Rules

**When to allow**:
- Custom workflows.
- Company-specific validations.

**How**:
- Provide UI for defining conditions and actions.
- Use expression language or visual builder.

**Examples**:
- Custom discount rules.
- Custom notifications.

---

### 2.4 Formula-Based Rules

**When to use**:
- Calculations that vary by company/industry.

**How**:
- Allow user-defined formulas (e.g., for salary components, custom pricing).

**Examples**:
- Salary component: `Basic = Gross × 0.4`.[web:16]
- Custom surcharge formula.

---

### 2.5 Workflow-Based Rules

**When to use**:
- Multi-step processes with conditions.

**How**:
- Visual workflow builder with states, transitions, and actions.

**Examples**:
- Multi-level approval workflows.[web:39]
- Custom order-to-cash flows.

---

## 3. Framework: Core vs Configurable vs Custom

### 3.1 Core Logic (Cannot Safely Be Changed)

- Double-entry bookkeeping mechanics.[web:4][web:15]
- Ledger immutability and reversal pattern.[web:15]
- Stock ledger append-only behavior.[page:7]
- Fundamental state machines (e.g., invoice cannot be created without customer).

**Rationale**:
- Changing these breaks accounting integrity or auditability.

---

### 3.2 Configuration (Business-Specific Settings)

- Chart of accounts structure.[web:4]
- Fiscal year settings.[web:4]
- Valuation method per item (FIFO, Moving Average).[page:2]
- Tax rates and rules per jurisdiction.[web:4]
- Approval thresholds.[web:39]
- Credit limits and payment terms.[web:15]

**Rationale**:
- Vary by company but follow standard patterns.

---

### 3.3 Business Rules (Configurable Conditions/Actions)

- Pricing rules and discounts.[web:4]
- Inventory reorder policies.[web:3]
- Dunning workflows.
- Custom validations.

**Rationale**:
- Reflect company policies and competitive strategies.

---

### 3.4 Formulas (User-Defined Calculations)

- Salary structure formulas.[web:16]
- Custom costing formulas.
- Custom surcharges.

**Rationale**:
- Companies need flexibility in calculations.

---

### 3.5 Workflows (Configurable Processes)

- Approval chains.[web:39]
- Custom order flows.
- Industry-specific workflows.

**Rationale**:
- Processes vary significantly by industry and company.

---

### 3.6 Custom Modules (Industry/Company-Specific)

- Healthcare patient billing.
- Construction project costing.
- Restaurant recipe costing.

**Rationale**:
- Core ERP cannot anticipate all industry needs.

---

## 4. Rule Engine Design

### 4.1 Components

- **Rule Definition**: Store conditions, actions, priority, scope.
- **Expression Evaluator**: Parse and evaluate conditions.
- **Action Executor**: Execute actions (block, warn, notify, create doc).
- **Priority & Conflict Resolution**: Handle overlapping rules.

### 4.2 Example Rule Definition

```json
{
  "name": "High Value PO Approval",
  "document_type": "PurchaseOrder",
  "condition": "total > 10000",
  "action": "require_approval",
  "approver_role": "Purchase Manager",
  "priority": 10,
  "active": true
}
```

### 4.3 Evaluation Flow

1. On document submit, fetch applicable rules.
2. Sort by priority.
3. Evaluate conditions.
4. Execute actions (block if any rule blocks).
5. Log evaluation results for audit.

---

## 5. Examples of Complex Rule Scenarios

### 5.1 Credit Management

**Rules**:
- IF `Customer.credit_limit` exceeded THEN block new SO unless override by Credit Manager.
- IF `Customer.overdue_invoices` > threshold THEN block new SO.
- IF `Customer.risk_category` = "High" THEN require advance payment.

**Backend**:
- Credit check function called on SO submit.
- Override mechanism with audit trail.

---

### 5.2 Pricing and Discounts

**Rules**:
- Base price from price list.
- Apply quantity discount.
- Apply customer group discount.
- Apply promotional discount.
- Enforce minimum margin (block if margin < threshold).

**Backend**:
- Pricing engine with rule chaining.
- Margin calculation and validation.

---

### 5.3 Tax Determination

**Rules**:
- Determine tax based on:
  - Customer location (ship-to, bill-to).
  - Item tax category.
  - Transaction type (domestic, export, inter-state).
  - Date (for rate changes).

**Backend**:
- Tax rule table with effective dates.
- Tax engine that evaluates rules in priority order.

---

## 6. Audit and Traceability

### 6.1 Rule Execution Log

**What to log**:
- Which rules fired.
- Condition results.
- Actions taken.
- User overrides.

**Why**:
- Debugging.
- Compliance.
- Understanding behavior.

---

### 6.2 Configuration History

**What to track**:
- Changes to rules, thresholds, workflows.
- Who changed what and when.

**Why**:
- Audit requirements.
- Rollback if needed.

---

This file focuses on business rules and configurability. Domain entities, calculations, and workflows are documented in the companion files.