# ERP Methods and Calculations

This file catalogs the core business methods and numerical calculations an ERP backend must perform, with emphasis on definitions, inputs, outputs, algorithms, and implications.

---

## 1. Accounting Methods

### 1.1 Double-Entry Bookkeeping

**Definition**: System where every transaction posts equal debits and credits, keeping the accounting equation in balance.[web:4][web:15]

**Purpose**: Ensure integrity of financial records and enable generation of financial statements from the General Ledger.[web:4]

**Inputs**:
- Transaction type (sale, purchase, payment, adjustment).
- Amount.
- Accounts affected.
- Debit/credit designation per account.

**Outputs**:
- Balanced journal entry.
- GL postings per account.

**Formula/Algorithm**:
- For each journal entry: \(\sum debit = \sum credit\).[web:4]
- Account balance over a period: \(balance = \sum debit - \sum credit\).[web:15]

**Business rules**:
- Posted entries immutable; corrections via reversal.[web:15]
- Assets/expenses usually increased by debits; liabilities/equity/revenue increased by credits.[web:4]

**Backend implications**:
- `JournalEntry` with `JournalEntryLine` referencing accounts.
- Validation on submit that debits == credits.[web:15]
- Ledger tables query-only; no direct edits.

---

### 1.2 Accrual Accounting

**Definition**: Recognize revenue when earned and expenses when incurred, regardless of cash movement.[web:4]

**Purpose**: Match income and expenses to the period they relate to.

**Inputs**:
- Contracts, invoices, schedules.
- Expense obligations.

**Outputs**:
- Accrual entries (e.g., accrued expenses, deferred revenue).

**Algorithm (examples)**:
- **Accrued expense**: Expense incurred but not yet billed.
  - Debit Expense, Credit Accrued Liabilities.
- **Deferred revenue**: Cash received before performance.
  - Debit Cash/Bank, Credit Deferred Revenue.

**Business assumptions**:
- Performance obligations clearly defined.
- Period close involves identifying unbilled/unearned elements.

**Backend implications**:
- Accrual engine at period close.
- Schedules for reversing accruals in next period.

---

### 1.3 Depreciation Methods

**Straight-Line**:

- **Formula**: \(annual\ depreciation = (cost - salvage\ value)/useful\ life\).[web:4]
- **Monthly**: \(monthly = annual/12\).

**Declining Balance**:

- **Formula**: \(depreciation\ rate = 1 - (salvage/cost)^{1/life}\).[web:4]
- Period depreciation = book value × rate.

**Units of Production**:

- **Formula**: \(depreciation\ per\ unit = (cost - salvage)/total\ estimated\ units\).[web:4]
- Period depreciation = units produced × depreciation per unit.

**Purpose**: Allocate asset cost systematically; handle different usage profiles.

**Inputs**:
- Asset cost, salvage, useful life, production units.

**Outputs**:
- Depreciation amount per period.

**Backend implications**:
- Depreciation schedule table per asset.[web:4]
- Monthly job generating depreciation journal entries.

---

## 2. Inventory Valuation Methods

### 2.1 FIFO (First In, First Out)

**Definition**: Assumes oldest stock is issued first; cost layers consumed chronologically.[page:2][page:7]

**Purpose**: Reflect physical flow for many goods and meet statutory reporting needs.[web:2]

**Inputs**:
- Stock receipts (qty, cost, date).
- Stock issues (qty, date).

**Outputs**:
- Cost of goods sold (COGS) per issue.
- Remaining inventory value.

**Data model**:
- Stock layers per item-warehouse: ordered list of `[qty, rate, receipt_date]`.[page:7]

**Algorithm (issue)**:
1. Determine quantity to issue.
2. Loop over layers from oldest:
   - If layer qty ≤ remaining: consume whole layer.
   - Else: consume partial layer, reduce layer qty.
3. Sum consumed qty × rate for COGS.
4. Update layers and totals.

**Business rules**:
- Backdated receipts require recomputing subsequent issues (“reposting”).[page:2][page:7]
- Negative stock usually disallowed; if allowed, creates negative layers.

**Accounting impact**:
- Issue: Debit COGS, Credit Inventory.

**Backend implications**:
- Immutable stock ledger; valuation engine calculates layers.[page:7]
- Reposting process triggered for backdated changes.[page:2]

---

### 2.2 Moving Average (Perpetual Average)

**Definition**: Maintains a single blended cost rate per item-warehouse; recalculated on each receipt.[page:2][page:7]

**Formula (receipt)**:
- \(new\_qty = old\_qty + received\_qty\).
- \(new\_value = old\_value + received\_qty × received\_rate\).
- \(new\_avg\_rate = new\_value / new\_qty\).[page:2]

**Formula (issue)**:
- COGS = issue qty × current avg rate.
- Avg rate unchanged.[page:2]

**Purpose**: Smooth price fluctuations; simpler than FIFO.[web:2][web:38]

**Inputs/Outputs**: Same as FIFO but with a single rate.[page:2]

**Backend implications**:
- `Bin`/`Quant` holds `qty`, `avg_rate`, `value`.[page:7][web:15]
- Backdated receipts require forward recomputation.[page:2]

---

### 2.3 Standard Costing

**Definition**: Use predetermined standard cost for inventory and production; treat differences as variances.[web:56]

**Inputs**:
- BOM (standard quantities).[web:50]
- Standard material costs.
- Standard labor rates and times.
- Standard overhead rates.

**Outputs**:
- Standard cost per unit.
- Material, labor, overhead variances.

**Formulas**:
- Standard material cost = Σ(component qty × standard component price).
- Standard labor cost = Σ(operation time × labor rate).
- Standard overhead = allocation base × overhead rate.

**Business rules**:
- Inventory valued at standard cost; variances posted separately.[web:56]
- Standard costs revised periodically; changes controlled.

**Backend implications**:
- Standard cost table per product.
- Variance accounts and reports.

---

## 3. Manufacturing Methods

### 3.1 Material Requirements Planning (MRP)

**Definition**: Algorithm to compute material and production requirements based on demand, BOMs, inventory, and lead times.[web:3]

**Inputs**:
- Demand (sales orders, forecasts).[web:52]
- BOMs.[web:50]
- On-hand inventory and open POs.
- Lead times (purchase, production).
- Safety stock.

**Outputs**:
- Planned production orders.
- Planned purchase orders.
- Exception messages (shortages, lateness).

**Core algorithm**:
1. Calculate gross requirements for finished goods.
2. Net against available inventory: \(net = max(0, gross - (on\_hand + on\_order - safety))\).[web:3]
3. Apply lot sizing rules (EOQ, MOQ, fixed batch).
4. Offset by lead times (compute release dates).[web:3]
5. Explode BOMs to compute component requirements.
6. Repeat for all BOM levels.

**Business assumptions**:
- BOMs are accurate and current.[web:52]
- Lead times reflect reality.
- Safety stock policies defined.

**Backend implications**:
- MRP run engine with pegging (link each requirement to source demand).[web:3]
- Time-phased tables for requirements per date.

---

### 3.2 Routing and Capacity Planning

**Definition**: Routing defines operation sequence; capacity planning ensures work centers have available time.[web:49][web:53]

**Inputs**:
- Routings per product.[web:50]
- Work center capacity (hours/day, shifts).[web:53]
- Planned orders from MRP.[web:52]

**Outputs**:
- Operation schedules.
- Load vs capacity metrics.

**Algorithm (simplified)**:
1. For each work order, expand routing operations with required time per period.
2. Sum required time per work center per day/week.
3. Compare to available capacity; mark overloads.[web:53]

**Backend implications**:
- Scheduling engine; Gantt/finite capacity scheduling for advanced use.[web:54][web:55]

---

## 4. Procurement and Matching Methods

### 4.1 Three-Way Matching

**Definition**: Matching Purchase Order, Goods Receipt, and Invoice before payment.[web:33]

**Inputs**:
- PO lines (items, quantities, prices).
- Receipt lines (items, quantities).
- Invoice lines (items, quantities, prices).

**Outputs**:
- Match status (matched, partial, exception).
- Approved payable amount.

**Algorithm**:
1. For each line, determine the minimum of PO qty, received qty, and invoiced qty.
2. Detect price differences vs PO (within tolerance or not).
3. Compute approved amount = min qty × PO price.
4. Flag exceptions where invoice exceeds PO/receipt or price tolerance.[web:33]

**Backend implications**:
- Matching engine linking three document types.
- Exception queue for AP clerks.

---

## 5. Payroll and HR Calculations

### 5.1 Payroll Calculation

**Purpose**: Convert attendance and salary structure into gross pay, deductions, and net pay.[web:16]

**Inputs**:
- Salary structure (basic, allowances, deduction formulas).[web:16]
- Attendance/timesheets.
- Tax tables and social contributions.

**Outputs**:
- Payslips per employee.
- Journal entries.

**Typical flow**:
1. Compute gross salary: basic + allowances + overtime + bonuses.
2. Compute taxable income after pre-tax deductions.
3. Apply progressive tax brackets to taxable income.[web:16]
4. Compute statutory contributions (social security, pension) and other deductions.
5. Net pay = gross - total deductions.

**Progressive tax example**:
- Assume brackets:
  - 0–₹250,000: 0%
  - ₹250,001–₹500,000: 5%
  - ₹500,001–₹1,000,000: 20%
  - Above ₹1,000,000: 30%

For taxable income ₹750,000:
- Tax = (₹250,000 × 0%) + (₹250,000 × 5%) + (₹250,000 × 20%) = 0 + 12,500 + 50,000 = ₹62,500.

**Backend implications**:
- Tax engine with configurable brackets.
- Payroll scheduler per period.[web:16]

---

## 6. Multi-Currency and FX Calculations

### 6.1 Transaction Conversion

**Definition**: Convert foreign currency transactions to functional currency for posting.[web:17][web:18]

**Formula**:
- Functional amount = foreign amount × spot rate (on transaction date).[web:20]

### 6.2 Period-End Revaluation

**Definition**: Revalue monetary balances at closing exchange rate; post unrealized gain/loss.[web:18][web:20]

**Formula**:
- Revalued amount = foreign balance × closing rate.
- FX gain/loss = revalued amount - carrying amount.

**Backend implications**:
- FX revaluation routines; postings to FX gain/loss accounts.[web:20]

---

## 7. Tax Calculations

### 7.1 Exclusive Tax (Add-on)

**Formula**:
- Tax amount = net × tax rate.
- Gross = net + tax.[web:4]

### 7.2 Inclusive Tax (Embedded)

**Formula**:
- Net = gross / (1 + tax rate).
- Tax = gross - net.[web:4]

### 7.3 Compound Tax

**Formula**:
- Tax1 = base × rate1.
- Tax2 = (base + Tax1) × rate2.

Used where local rules tax other taxes (rare but real in some regions).[web:4]

### 7.4 Withholding Tax

**Formula**:
- WHT = payment amount × withholding rate.
- Net payment = payment amount - WHT.[web:16]

**Backend implications**:
- Tax tables per jurisdiction.
- WHT ledgers and reporting.

---

## 8. Inventory & Supply Chain Calculations

### 8.1 Economic Order Quantity (EOQ)

**Definition**: Order size minimizing sum of ordering and holding costs.[web:3]

**Formula**:
- \(EOQ = \sqrt{ \frac{2DS}{H} }\).
- D = annual demand; S = order cost; H = holding cost per unit per year.

### 8.2 Reorder Point

**Formula**:
- Reorder point = average daily demand × lead time + safety stock.[web:3]

### 8.3 Safety Stock (basic rule-of-thumb)

**Formula**:
- Safety stock = (max daily demand × max lead time) − (avg daily demand × avg lead time).[web:3]

**Backend implications**:
- Stored per item-warehouse; drives MRP and automated procurement.[page:7]

---

## 9. Project and Performance Calculations

### 9.1 Earned Value Management (EVM)

**Definitions**:
- Planned Value (PV): Budgeted cost of work scheduled.
- Earned Value (EV): Budgeted cost of work performed.
- Actual Cost (AC): Actual cost of work performed.[web:54]

**Formulas**:
- Schedule variance (SV) = EV − PV.
- Cost variance (CV) = EV − AC.
- Schedule performance index (SPI) = EV / PV.
- Cost performance index (CPI) = EV / AC.

**Backend implications**:
- Project cost collection and budget baselines.

---

## 10. Logistics and Freight Calculations

### 10.1 Dimensional Weight and Freight

**Dimensional weight**:
- \(dim\_weight = (L × W × H) / factor\) (factor like 5000 or 6000 depending on carrier).[web:23]

**Chargeable weight**:
- Max(actual weight, dimensional weight).

**Freight cost**:
- Base charge + chargeable weight × per-kg rate + optional per-km rate + surcharges (fuel, remote area).[web:23]

**Backend implications**:
- Carrier contract tables; freight estimator services.

---

## 11. Margin and Profitability Calculations

### 11.1 Gross Margin

**Formula**:
- Gross margin = (revenue − COGS) / revenue × 100.

### 11.2 Net Margin

**Formula**:
- Net margin = net income / revenue × 100.

### 11.3 Inventory Turnover

**Formula**:
- Inventory turnover = COGS / average inventory.
- Days inventory outstanding = 365 / turnover.

These drive dashboards and performance reports.

---

## 12. Example Calculation: FIFO Issue

**Scenario**:
- Item A in warehouse Main.
- Layer 1: 50 units @ $10.
- Layer 2: 80 units @ $12.
- Total: 130 units.

Issue 60 units.

**Steps**:
1. Consume 50 from Layer 1: COGS1 = 50 × $10 = $500.
2. Remaining to issue: 10 units.
3. Consume 10 from Layer 2: COGS2 = 10 × $12 = $120.
4. Total COGS = $500 + $120 = $620.
5. New layers:
   - Layer 1 gone.
   - Layer 2 now 70 units @ $12.
6. New inventory value = 70 × $12 = $840.

**Accounting impact**:
- Debit COGS $620.
- Credit Inventory $620.

---

## 13. Example Calculation: Moving Average Receipt

**Scenario**:
- Item B current: 100 units @ avg $5 → value $500.
- New receipt: 40 units @ $6.

**Steps**:
1. New quantity = 100 + 40 = 140.
2. New value = 500 + (40 × 6) = 500 + 240 = $740.
3. New avg rate = 740 / 140 ≈ $5.2857.

Issue 20 units afterwards:
- COGS = 20 × 5.2857 ≈ $105.71.
- New qty = 140 − 20 = 120.
- New value ≈ 740 − 105.71 ≈ $634.29.

---

This file focuses on numerical methods and formulas. Domain entities and workflows are documented in the core-domains file and workflow files of the knowledge base.