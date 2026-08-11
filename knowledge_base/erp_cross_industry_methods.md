# Cross-Industry ERP Methods and Patterns

This file catalogs business methods, technical patterns, and domain practices that appear in almost all mature open-source ERPs (ERPNext, Odoo, Tryton, Dolibarr, OFBiz, iDempiere, etc.). These are the “common denominator” capabilities any new ERP should implement.

---

## 1. Master Data vs Transactional Data

### 1.1 Concept

**Definition**: Clear separation between master data (relatively static) and transactional data (time-stamped events).[web:4][web:7]

**Why it exists**:
- Master data defines “who/what” (customers, items, accounts).
- Transactions define “what happened” (orders, invoices, stock movements).

**How it works**:
- Master entities: `Customer`, `Supplier`, `Item`, `Account`, `Warehouse`, `Employee`, `Asset`, `Project`.[web:4][web:7]
- Transaction entities: `SalesOrder`, `PurchaseOrder`, `Invoice`, `PaymentEntry`, `StockLedgerEntry`, `JournalEntry`, `WorkOrder`, `Payslip`.[web:15][page:7]

**Backend implications**:
- Master data changes affect future transactions; historical transactions keep references to old master data.
- Master data often has versioning or effective dating for price lists, BOMs, etc.[web:50]

**ERP implementations**:
- ERPNext: Items, Customers, Suppliers vs Sales/Purchase/Stock/Accounting transactions.[web:7]
- Odoo: Products, Partners vs Orders, Invoices, Moves.[web:4][web:15]
- Tryton, Dolibarr: similar split.[web:32][web:33]

---

## 2. Document State Machines

### 2.1 Concept

**Definition**: Each transaction type has a finite set of states and allowed transitions.[web:46][web:49]

**Why it exists**:
- Enforce business rules (e.g., cannot bill before delivery).
- Prevent invalid operations.
- Support audit and reporting.

**How it works**:
- States: Draft → Submitted → (Partially processed) → Completed / Cancelled.
- Transitions triggered by actions (submit, deliver, bill, cancel).
- Guards enforce preconditions (stock availability, credit limit, approvals).

**Examples**:
- SalesOrder: Draft → To Deliver → To Bill → Completed / Cancelled.[web:46]
- PurchaseOrder: Draft → To Receive → To Bill → Completed / Cancelled.[web:35]
- WorkOrder: Planned → Not Started → In Progress → Completed / Stopped.[web:49][web:52]

**Backend implications**:
- State machine per document type.
- Transition functions with validations.
- Event hooks for side effects (inventory, accounting).

**ERP implementations**:
- ERPNext: `status` fields on SO/PO/Invoice/WorkOrder with explicit submit/cancel.[web:46]
- Odoo: `state` fields on orders and invoices; workflow logic in models.[web:15]

---

## 3. Ledger-Based Accounting

### 3.1 Concept

**Definition**: All financial postings flow through an immutable General Ledger (GL) using double-entry bookkeeping.[web:4][web:15]

**Why it exists**:
- Ensure financial integrity.
- Enable standard reports (P&L, balance sheet, trial balance).

**How it works**:
- Every transaction (invoice, payment, stock movement if integrated) creates balanced journal entries.
- Posted entries are immutable; corrections via reversal entries.[web:15]

**Backend implications**:
- `JournalEntry` and `JournalEntryLine` tables.
- Validation: sum(debit) == sum(credit).
- Period close locks ranges; no edits to posted entries.

**ERP implementations**:
- Odoo: `account.move` and `account.move.line`.[web:15]
- ERPNext: `JournalEntry`, auto-posting from invoices/payments.[web:4]
- Tryton, OFBiz: similar GL structures.

---

## 4. Perpetual Inventory with Stock Ledger

### 4.1 Concept

**Definition**: Every stock movement updates quantity and value in real time via an immutable stock ledger.[page:7][web:7]

**Why it exists**:
- Accurate, auditable inventory.
- Real-time valuation and availability.

**How it works**:
- Each receipt, issue, transfer, or adjustment creates a `StockLedgerEntry` with:
  - item, warehouse, qty (+/-), rate, value, reference, posting date.[page:7]
- Aggregated view via `Bin`/`Quant` (qty, reserved qty, valuation rate, value).[page:7][web:15]

**Backend implications**:
- Append-only stock ledger; backdated changes trigger reposting.[page:2][page:7]
- Valuation engine (FIFO, moving average, etc.) reads ledger to compute layers or average rates.[page:2]

**ERP implementations**:
- ERPNext: `Stock Ledger Entry` and `Bin` tables; FIFO/moving average engines.[page:2][page:7]
- Odoo: `stock.move` and `stock.quant` with valuation layers.[web:15]
- Tryton: `StockMove` and valuation modules.[web:32][web:45]

---

## 5. Inventory Valuation Methods

### 5.1 Concept

**Definition**: Methods to assign cost to inventory and COGS: FIFO, LIFO, Moving Average, Weighted Average, Standard Cost.[page:2][web:7][web:33][web:38]

**Why it exists**:
- Different industries and jurisdictions require different methods.
- Affects profitability and tax.

**How it works**:
- **FIFO**: Maintain ordered layers of receipts; consume oldest first.[page:2]
- **Moving Average**: Maintain single blended rate per item-warehouse; recalc on each receipt.[page:2]
- **Standard Cost**: Use predetermined cost; post variances separately.[web:56]

**Backend implications**:
- Valuation method per item or company.
- Layer structures for FIFO; average rate fields for moving average.
- Reposting engine for backdated changes.[page:2]

**ERP implementations**:
- ERPNext: FIFO and Moving Average as core methods; detailed layer logic.[page:2][page:7]
- Dolibarr: Weighted Average Cost (WAC) and standard valuation.[web:33][web:38]
- Tryton: Configurable valuation methods via modules.[web:45]

---

## 6. Three-Way Matching in Procurement

### 6.1 Concept

**Definition**: Match Purchase Order, Goods Receipt, and Supplier Invoice before payment.[web:33]

**Why it exists**:
- Prevent overpayment and fraud.
- Ensure goods/services received match what was ordered and billed.

**How it works**:
- System compares:
  - PO lines (qty, price).
  - Receipt lines (qty received).
  - Invoice lines (qty, price billed).
- Flags exceptions: over-billing, under-delivery, price variance beyond tolerance.[web:33]

**Backend implications**:
- Matching engine linking PO, receipt, and invoice.
- Exception queue for AP clerks.
- Configurable tolerances.

**ERP implementations**:
- Odoo: PO–receipt–bill matching with tolerance settings.[web:33]
- ERPNext: linkage between PO, Purchase Receipt, and Purchase Invoice; matching checks.[web:35]

---

## 7. Approval Workflows

### 7.1 Concept

**Definition**: Configurable process where documents require approval before certain actions.[web:31][web:39]

**Why it exists**:
- Internal control and segregation of duties.
- Compliance with company policies.

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

**ERP implementations**:
- Odoo: approval flows via studio or custom modules.[web:39]
- ERPNext: workflow engine with state transitions and user roles.[web:31]

---

## 8. Pricing and Discount Engines

### 8.1 Concept

**Definition**: Dynamic determination of prices and discounts based on rules.[web:4]

**Why it exists**:
- Support complex pricing strategies (customer groups, volume discounts, promotions).

**How it works**:
- Price lists with conditions (customer group, item group, territory, date range).
- Discount rules with priority and stacking logic.
- Minimum margin checks to prevent unprofitable sales.

**Backend implications**:
- Price list tables and discount rule tables.
- Pricing engine that evaluates rules in order.
- Integration with sales and POS.

**ERP implementations**:
- Odoo: pricelists, discounts, and promotions.[web:4]
- ERPNext: price lists, selling settings, and discount rules.[web:4]

---

## 9. Tax Determination and Calculation

### 9.1 Concept

**Definition**: Determine applicable taxes and compute amounts based on jurisdiction and transaction attributes.[web:4]

**Why it exists**:
- Legal compliance (VAT, GST, sales tax, withholding tax).
- Accurate financial reporting.

**How it works**:
- Tax rules based on:
  - Customer/supplier location.
  - Item tax category.
  - Transaction type (domestic, export, inter-state).
  - Date (for rate changes).
- Tax calculation: exclusive, inclusive, compound, withholding.[web:4][web:16]

**Backend implications**:
- Tax rule tables with effective dates.
- Tax engine that evaluates rules and computes amounts.
- Tax ledger for reporting.

**ERP implementations**:
- Odoo: tax rules, fiscal positions, and automatic tax computation.[web:4]
- ERPNext: tax templates, GST/VAT modules, and tax ledgers.[web:4]

---

## 10. Multi-Currency and FX Handling

### 10.1 Concept

**Definition**: Support transactions in multiple currencies and handle exchange rate fluctuations.[web:17][web:18]

**Why it exists**:
- Global operations and cross-border trade.

**How it works**:
- Transaction currency and functional (company) currency.
- Spot rates for transaction posting.
- Period-end revaluation of monetary balances; unrealized FX gains/losses.[web:18][web:20]

**Backend implications**:
- Currency table with daily rates.
- FX revaluation routines.
- Multi-currency GL and sub-ledgers.

**ERP implementations**:
- Odoo: multi-currency invoices, payments, and revaluation.[web:18]
- ERPNext: multi-currency transactions and exchange rate management.[web:17]

---

## 11. MRP and Production Planning

### 11.1 Concept

**Definition**: Material Requirements Planning computes material and production needs based on demand, BOMs, and inventory.[web:3][web:52]

**Why it exists**:
- Ensure materials are available for production and delivery.
- Optimize inventory and reduce stockouts.

**How it works**:
- Inputs: demand (SOs, forecasts), BOMs, inventory, open POs/WOs, lead times, safety stock.[web:52]
- Outputs: planned production orders, planned purchase orders, exception messages.[web:3]

**Backend implications**:
- MRP run engine with pegging (link requirements to source demand).
- Time-phased requirement tables.

**ERP implementations**:
- Odoo: MRP module with BOMs, work orders, and planning.[web:52]
- ERPNext: MRP reports and production planning tools.[web:3]

---

## 12. Payroll and HR Core

### 12.1 Concept

**Definition**: Calculate employee compensation, deductions, and net pay; manage attendance and timesheets.[web:16]

**Why it exists**:
- Legal compliance and employee satisfaction.

**How it works**:
- Salary structures with components (basic, allowances, deductions).
- Attendance/timesheets for overtime and project time.
- Tax tables and statutory contributions.[web:16]

**Backend implications**:
- Payroll engine with configurable formulas.
- Payslip generation and posting to GL.

**ERP implementations**:
- Odoo: payroll module with salary rules.[web:16]
- ERPNext: HR and payroll with salary structures and payslips.[web:16]

---

## 13. Project and Task Management

### 13.1 Concept

**Definition**: Track projects, tasks, time, and costs for internal or customer projects.[web:54]

**Why it exists**:
- Project profitability and resource planning.

**How it works**:
- Projects with tasks, budgets, and timelines.
- Timesheets linked to projects/tasks.
- Billing based on time & materials or fixed price.[web:54]

**Backend implications**:
- Project and task entities.
- Timesheet entries and billing integration.

**ERP implementations**:
- Odoo: project module with tasks and timesheets.[web:54]
- ERPNext: projects, tasks, and timesheets.[web:54]

---

## 14. Reporting and Analytics

### 14.1 Concept

**Definition**: Generate standard and custom reports from ledgers and transactional data.[web:4]

**Why it exists**:
- Decision support and compliance.

**How it works**:
- Predefined reports (trial balance, P&L, stock ledger, sales analysis).
- Custom report builders with filters and aggregations.

**Backend implications**:
- Report definition tables.
- Query builders and export formats.

**ERP implementations**:
- All major open-source ERPs have extensive reporting modules.[web:4]

---

## 15. Audit Trails and Versioning

### 15.1 Concept

**Definition**: Record changes to critical data and keep historical versions of key entities.[web:37][web:50]

**Why it exists**:
- Compliance and traceability.

**How it works**:
- Audit logs for who changed what and when.
- Versioning for BOMs, price lists, etc.[web:50]

**Backend implications**:
- Audit log tables.
- Versioning logic for master data.

**ERP implementations**:
- Odoo, ERPNext, Tryton all implement audit and versioning features.[web:37][web:50]

---

This file provides the cross-industry baseline. Industry-specific adaptations and methods are covered in the companion `erp_industry_specific_methods.md` file.