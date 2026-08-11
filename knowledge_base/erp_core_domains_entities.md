# ERP Core Domains and Entities

This file captures the core business domains, key concepts, and domain entities an ERP backend must understand and implement. It is designed as AI context for reasoning about ERP structure and behavior.

---

## 1. Core ERP Domains Overview

### Domain List

- Accounting & Finance
- Sales
- CRM
- Purchasing & Procurement
- Inventory
- Warehousing
- Manufacturing
- Supply Chain
- HR & Payroll
- Projects
- Asset Management
- Logistics
- POS
- Payments
- Taxation
- Reporting

Each domain below focuses on business concepts, methods, rules, and the entities needed to implement them.

---

## 2. Accounting & Finance

### 2.1 Core Concepts

- **Double-entry bookkeeping**: Every transaction posts equal debits and credits, preserving the accounting equation Assets = Liabilities + Equity.[web:4][web:15]
- **Chart of Accounts (COA)**: Hierarchical list of accounts (assets, liabilities, equity, income, expenses) used for classification and reporting.[web:4]
- **Journal Entries**: Primary vehicle for posting financial transactions into the General Ledger.[web:15]
- **Fiscal Years & Periods**: Time buckets for reporting and period closing (month, quarter, year).[web:4]
- **Cost Centers & Profit Centers**: Dimensions for tracking costs and revenues by department, project, or business unit.[web:15]
- **Accrual vs cash basis**: Recognize revenues/expenses when earned/incurred vs when cash moves.[web:4]
- **Multi-currency and multi-company**: Support for different base currencies and legal entities, with consolidation and FX handling.[web:17][web:18]

### 2.2 Accounting Entities (Domain Model)

#### Entity: Account

- **Purpose**: Represent a ledger account in the COA.
- **Important fields**: `code`, `name`, `type` (asset/liability/equity/income/expense), `currency`, `company`, `parent_account`, `is_leaf`, `allow_manual_entries`.[web:4][web:15]
- **Relationships**: Belongs to a `Company`; optional parent in COA tree; referenced by `JournalEntryLine`, `Invoice`, `Payment`.
- **Lifecycle**: Created → Active → (optionally) blocked for posting → Never deleted (historical integrity).
- **Dependencies**: Financial reports, validations, posting logic.

#### Entity: JournalEntry

- **Purpose**: Encapsulate a balanced set of postings to accounts.
- **Important fields**: `number`, `date`, `company`, `currency`, `lines[]`, `total_debit`, `total_credit`, `status` (draft/posted/cancelled), `source_doc_type`, `source_doc_id`.[web:4][web:15]
- **Relationships**: Lines reference `Account`, optional `Party`, `CostCenter`, `Project`.
- **Lifecycle**: Draft → Posted (immutable) → Cancelled via reversal.
- **Business rules**: Sum(debit) = sum(credit); cannot edit when posted; cancellations via reversing entries only.[web:15]

#### Entity: GeneralLedgerEntry (can be the same as JournalEntryLine)

- **Purpose**: Atomic posting line; forms the General Ledger.
- **Important fields**: `account_id`, `debit`, `credit`, `company`, `currency`, `posting_date`, `journal_entry_id`, `reference`, `dimensions` (cost center, project).
- **Lifecycle**: Created on journal posting; immutable.[web:15]
- **Calculations**: Account balance = Σ(debits) - Σ(credits) over filtered period.

#### Entity: FiscalPeriod

- **Purpose**: Represent an accounting period within a fiscal year.
- **Important fields**: `fiscal_year`, `period_name`, `start_date`, `end_date`, `status` (open/closing/closed/locked).[web:4]
- **Relationships**: Belongs to `Company`; groups `JournalEntry` postings.
- **Business rules**: Only open periods can accept new postings; closing/closed periods locked against changes except allowed adjustments.

### 2.3 Accounting Ledgers

See also section “ERP Ledgers” in a later file, but the key ledgers are:

- **General Ledger (GL)**: All accounts and all postings.[web:4][web:15]
- **Accounts Receivable (AR)**: Sub-ledger for customer balances.
- **Accounts Payable (AP)**: Sub-ledger for supplier balances.
- **Asset Ledger**: Sub-ledger for fixed assets and depreciation.
- **Cost Ledger/Analytic Ledger**: Track costs by dimensions (cost centers, projects).

---

## 3. Sales Domain

### 3.1 Core Concepts

- **Quotation**: Commercial offer with price and terms but no commitment.[web:46]
- **Sales Order (SO)**: Binding customer order; drives reservation, delivery, billing.[web:46]
- **Delivery/Shipment**: Physical movement of goods to customer.
- **Sales Invoice**: Financial document requesting payment; posts revenue and AR.[web:15]
- **Pricing**: Price lists, discounts, surcharges, tax rules.[web:4]
- **Credit Management**: Credit limits, risk categories, blocking rules.[web:15]

### 3.2 Sales Entities

#### Entity: Customer

- **Purpose**: Party that buys goods/services.
- **Important fields**: `name`, `type` (individual/company), `tax_id`, `currency`, `customer_group`, `territory`, `credit_limit`, `payment_terms`, `default_price_list`, `contact_points[]`, `billing_address`, `shipping_address`.[web:4]
- **Relationships**: Linked to `SalesOrder`, `SalesInvoice`, `Payment`, `Project`.
- **Lifecycle**: Lead → Prospect → Customer → (optionally) inactive.
- **Business rules**: Credit checks on order; pricing based on group/territory; tax rules based on location.

#### Entity: SalesOrder

- **Purpose**: Represent confirmed customer demand, with full details.
- **Fields**: `number`, `customer_id`, `order_date`, `requested_delivery_date`, `status` (draft/to deliver/to bill/completed/cancelled), `lines[]`, `warehouse`, `price_list`, `taxes`, `grand_total`, `currency`.[web:46]
- **Relationships**: References `Customer`, `Warehouse`, `SalesQuotation` (optional), generates `DeliveryNote` and `SalesInvoice`.
- **Lifecycle & states**:
  - Draft → Submitted (confirm) → To Deliver and Bill → Completed/Cancelled.[web:46]
- **Business rules**: Credit limit enforcement; stock reservation; cannot bill beyond delivered quantities.

#### Entity: DeliveryNote / Shipment

- **Purpose**: Record physical delivery of goods.
- **Fields**: `number`, `sales_order_id`, `customer_id`, `posting_date`, `lines[]` (item, delivered_qty), `warehouse`, `status`.
- **Relationships**: Consumes `SalesOrder`; creates `StockLedgerEntry` (inventory decrease).[web:7]
- **Business rules**: Cannot deliver more than ordered; stock availability checks.

#### Entity: SalesInvoice

- **Purpose**: Financial record of sale.
- **Fields**: `number`, `customer_id`, `posting_date`, `due_date`, `lines[]`, `taxes`, `grand_total`, `outstanding_amount`, `status`.[web:15]
- **Relationships**: References `SalesOrder` and/or `DeliveryNote`; creates `JournalEntry` posting revenue and AR.[web:4]
- **Business rules**: No invoices without a valid underlying order/delivery (configurable); overdue detection; dunning workflows.

---

## 4. CRM Domain

### 4.1 Core Concepts

- **Lead**: Potential customer with basic info.[web:4]
- **Opportunity**: Qualified lead with potential revenue and probability.
- **Pipeline**: Stages from first contact to closure.

### 4.2 CRM Entities

#### Entity: Lead

- **Purpose**: Capture raw interest.
- **Fields**: `name`, `source`, `contact_info`, `status` (new/contacted/qualified/disqualified), `assigned_to`, `industry`, `estimated_value`.
- **Lifecycle**: New → Contacted → Qualified/Disqualified → Converted to Customer.

#### Entity: Opportunity

- **Purpose**: Manage potential deals.
- **Fields**: `customer_or_lead`, `stage` (e.g., proposal, negotiation), `expected_closing_date`, `probability`, `expected_revenue`, `sales_team`.
- **Business rules**: Probability and stage drive pipeline forecasts.

---

## 5. Purchasing & Procurement

### 5.1 Core Concepts

- **Purchase Requisition/Material Request**: Internal request for items or services.[web:46]
- **Request for Quotation (RFQ)**: Ask suppliers for offers.
- **Supplier Quotation**: Supplier’s response (pricing, terms).
- **Purchase Order (PO)**: Commitment to buy.[web:35]
- **Goods Receipt**: Record incoming goods; updates inventory.
- **Supplier Invoice**: Financial liability for purchases.
- **Three-way matching**: PO vs receipt vs invoice before payment.[web:33]

### 5.2 Procurement Entities

#### Entity: Supplier

- **Purpose**: Party providing goods/services.
- **Fields**: `name`, `tax_id`, `supplier_group`, `currency`, `payment_terms`, `lead_time_days`, `minimum_order_qty`, `preferred` flag, `rating` (delivery, quality).[web:33]
- **Relationships**: Linked to `PurchaseOrder`, `PurchaseInvoice`, `Payment`.

#### Entity: PurchaseOrder

- **Purpose**: Authorize purchase.
- **Fields**: `number`, `supplier_id`, `order_date`, `expected_delivery_date`, `status` (draft/approved/to receive/to bill/completed/cancelled), `lines[]`, `warehouse`, `taxes`, `total`.[web:35]
- **Relationships**: Source for `PurchaseReceipt` and `PurchaseInvoice`.
- **Business rules**: Approval thresholds; preferred supplier validation; cannot receive/bill beyond ordered quantities.

#### Entity: PurchaseReceipt (Goods Receipt Note)

- **Purpose**: Confirm physical receipt.
- **Fields**: `number`, `purchase_order_id`, `posting_date`, `lines[]` (item, received_qty), `warehouse`, `status`.
- **Relationships**: Creates `StockLedgerEntry` (inventory increase).[web:7]

#### Entity: PurchaseInvoice

- **Purpose**: Record supplier bill.
- **Fields**: `number`, `supplier_id`, `posting_date`, `due_date`, `lines[]`, `taxes`, `grand_total`, `outstanding_amount`, `status`.
- **Relationships**: Matched against `PurchaseOrder` and `PurchaseReceipt`; posts AP and expense/inventory.[web:15]

---

## 6. Inventory & Warehousing

### 6.1 Core Concepts

- **Perpetual inventory**: Every stock movement updates balances and valuation in real time.[page:2][web:7]
- **Stock Ledger**: Immutable record of all movements; source of truth for valuation.[page:7]
- **Bins/Quants**: Aggregated per item/warehouse snapshot (qty, value, valuation rate).[page:7][web:15]
- **Valuation methods**: FIFO, LIFO, Moving Average, Standard Cost, Weighted Average.[page:2][web:7][web:33][web:38]
- **Serial/Batch numbers**: Traceability for individual units or lots.[page:7]
- **Stock reservations**: Commit inventory for orders while keeping total available in sync.[page:7]

### 6.2 Inventory Entities

#### Entity: Item (Product)

- **Purpose**: Represent stockable/purchasable/sellable entities.
- **Fields**: `item_code`, `name`, `item_group`, `is_stock_item`, `stock_uom`, `valuation_method`, `default_warehouse`, `reorder_level`, `reorder_qty`, `has_serial_no`, `has_batch_no`, `standard_cost`, `tax_category`.[web:7][web:4]
- **Relationships**: Linked to `Warehouse`, `StockLedgerEntry`, `BOM`, `PriceList`, `Supplier`.

#### Entity: Warehouse

- **Purpose**: Logical/physical storage location.
- **Fields**: `name`, `code`, `company`, `parent_warehouse`, `is_group`, `address`, `stock_account`.[web:7]
- **Hierarchy**: Company → Region → Warehouse → Bin.

#### Entity: StockLedgerEntry

- **Purpose**: Immutable record of stock movement.[page:7]
- **Fields**: `item_id`, `warehouse_id`, `posting_date`, `qty` (+/-), `incoming_rate`, `valuation_rate`, `stock_value`, `voucher_type`, `voucher_no`, `company`, `is_cancelled`.
- **Business rules**: Append-only; cancellations via reversal; backdated entries trigger recalculation (reposting).[page:7]

#### Entity: Bin / StockQuant

- **Purpose**: Aggregated view of current stock per item/warehouse.
- **Fields**: `item_id`, `warehouse_id`, `actual_qty`, `reserved_qty`, `valuation_rate`, `stock_value`, possibly `stock_queue` for FIFO.[page:7][web:15]
- **Behavior**: Updated whenever new `StockLedgerEntry` is posted.

---

## 7. Manufacturing

### 7.1 Core Concepts

- **Bill of Materials (BOM)**: Hierarchical list of components and operations required to build a product.[web:50]
- **Routing/Operations**: Sequence of manufacturing steps, each with duration, work center, and cost.[web:49][web:52]
- **Work Center**: Resource (machine, labor cell) with capacity and cost rate.[web:53]
- **Work Order/Production Order**: Instruction to produce a quantity of a product using a BOM/routing.[web:52]
- **Scrap & By-products**: Waste or secondary outputs tracked for costing.[web:56]

### 7.2 Manufacturing Entities

#### Entity: BOM

- **Purpose**: Define components and operations for a finished or intermediate product.
- **Fields**: `product_id`, `type` (manufacture/subcontract), `quantity`, `components[]` (item, qty, scrap), `operations[]` (operation_id, work_center_id, time, sequence), `is_default`, `is_active`.[web:50]
- **Relationships**: References `Item`, `WorkCenter`; used by `WorkOrder`, MRP.

#### Entity: WorkCenter

- **Purpose**: Represent a production resource.
- **Fields**: `name`, `capacity` (units per hour or hours per day), `cost_rate` (per hour), `efficiency`, `calendar` (working days), `location`.[web:53]
- **Relationships**: Used in `Operation`, `WorkOrder`.

#### Entity: Operation

- **Purpose**: Step in routing; defines work content.
- **Fields**: `code`, `description`, `work_center_id`, `sequence`, `time_per_unit`, `setup_time`, `queue_time`.

#### Entity: WorkOrder / ManufacturingOrder

- **Purpose**: Execute BOM to produce finished goods.
- **Fields**: `product_id`, `bom_id`, `planned_qty`, `status` (planned/not started/in progress/completed/stopped), `planned_start`, `planned_end`, `actual_start`, `actual_end`, `operations_status[]`, `material_consumed[]`, `finished_goods[]`, `scrap[]`.[web:49][web:52]

#### Entity: Routing (if separate from BOM)

- **Purpose**: Sequence of operations independent of BOM definition.
- **Fields**: `name`, `operations[]`.

---

## 8. HR & Payroll

### 8.1 Core Concepts

- **Employee master**: Core record for each worker.[web:16]
- **Attendance & timesheets**: Capture presence/overtime and project time.[web:16]
- **Leave/absence**: Manage entitlements and usage.
- **Payroll**: Calculate gross pay, deductions, net pay per employee.

### 8.2 HR Entities

#### Entity: Employee

- **Purpose**: Represent a worker with HR and payroll data.
- **Fields**: `employee_id`, `name`, `department`, `designation`, `company`, `date_of_joining`, `employment_type`, `salary_structure`, `bank_account`, `tax_id`, `status` (active/inactive), `reports_to`.
- **Relationships**: Linked to `Timesheet`, `Attendance`, `Payslip`, `Project`, `Department`.

#### Entity: AttendanceRecord

- **Purpose**: Record daily presence.
- **Fields**: `employee_id`, `date`, `status` (present/absent/half day/on leave), `check_in_time`, `check_out_time`.

#### Entity: Timesheet

- **Purpose**: Record hours worked per project/task.
- **Fields**: `employee_id`, `date`, `entries[]` (project/task, hours, work_type), `approved_by`.

#### Entity: SalaryStructure

- **Purpose**: Define pay components and formulas.
- **Fields**: `name`, `components[]` (basic, allowances, overtime, deductions), `country`, `tax_rules`.[web:16]

#### Entity: Payslip

- **Purpose**: Result of payroll run for an employee.
- **Fields**: `employee_id`, `period`, `gross_pay`, `deductions[]`, `net_pay`, `tax_withheld`, `status` (draft/confirmed/paid).

---

## 9. Projects

### 9.1 Core Concepts

- **Project**: Time-bound endeavor with budget, tasks, and resources.
- **Task**: Work unit with assignee, dates, and dependencies.
- **Timesheet**: Basis for time & materials billing.
- **Project Billing**: Fixed-price vs time & materials.

### 9.2 Project Entities

#### Entity: Project

- **Purpose**: Track work, cost, and revenue for initiatives.
- **Fields**: `name`, `customer_id` (optional), `type` (internal/external), `status` (open/completed/cancelled), `start_date`, `end_date`, `budget_cost`, `budget_revenue`, `manager_id`.

#### Entity: Task

- **Purpose**: Represent deliverable units.
- **Fields**: `project_id`, `name`, `sequence`, `status`, `planned_start`, `planned_end`, `actual_start`, `actual_end`, `assignee`, `dependencies[]`.

#### Entity: ProjectTimesheetEntry

- **Purpose**: Link time to projects/tasks for costing/billing.
- **Fields**: `employee_id`, `project_id`, `task_id`, `date`, `hours`, `billable`, `rate`.

---

## 10. Asset Management

### 10.1 Core Concepts

- **Fixed Asset**: Long-lived resource (equipment, buildings).
- **Depreciation**: Systematic allocation of cost.[web:4]
- **Capitalization**: Move from CWIP to active asset.

### 10.2 Asset Entities

#### Entity: Asset

- **Purpose**: Track fixed assets and their financial lifecycle.
- **Fields**: `asset_id`, `name`, `category`, `acquisition_date`, `available_for_use_date`, `cost`, `salvage_value`, `useful_life`, `depreciation_method`, `depreciation_start_date`, `accumulated_depreciation`, `book_value`, `location`, `cost_center`, `status` (draft/depreciating/fully depreciated/sold/scrapped).[web:4]

#### Entity: DepreciationSchedule

- **Purpose**: Precomputed periods and amounts.
- **Fields**: `asset_id`, `period`, `amount`, `status` (planned/posted).

#### Entity: AssetTransaction

- **Purpose**: Capitalization, transfer, revaluation, disposal.
- **Fields**: `asset_id`, `type`, `date`, `amount`, `journal_entry_id`.

---

## 11. Logistics & POS

### 11.1 Logistics Entities

#### Entity: Shipment

- **Purpose**: Represent a collection of deliveries with freight.
- **Fields**: `shipment_id`, `carrier_id`, `origin`, `destination`, `ship_date`, `tracking_number`, `incoterm`, `weight`, `dim_weight`, `freight_cost`, `status`.

#### Entity: Carrier

- **Purpose**: Third-party logistics provider.
- **Fields**: `name`, `service_levels[]`, `contract_rates[]`, `account_number`.

### 11.2 POS Entities

#### Entity: POSSession

- **Purpose**: Cashier’s shift.
- **Fields**: `terminal_id`, `cashier_id`, `opening_cash`, `closing_cash`, `start_time`, `end_time`, `status`.

#### Entity: POSTransaction

- **Purpose**: Retail sale.
- **Fields**: `session_id`, `items[]`, `payment_methods[]`, `customer_id` (optional), `taxes`, `total`.

---

## 12. Taxation & Payments

### 12.1 Tax Entities

#### Entity: TaxRule

- **Purpose**: Determine which tax applies to a transaction.
- **Fields**: `name`, `tax_id`, `rate`, `jurisdiction`, `applicable_on` (item group, customer group, location), `effective_from`, `effective_to`, `is_compound`, `included_in_price`.[web:4]

#### Entity: TaxLedgerEntry

- **Purpose**: Record tax amounts for reporting.
- **Fields**: `tax_id`, `document_type`, `document_id`, `base_amount`, `tax_amount`, `period`.

### 12.2 Payment Entities

#### Entity: PaymentEntry

- **Purpose**: Record incoming or outgoing payment.
- **Fields**: `payment_type` (receive/pay/transfer), `party_type`, `party_id`, `date`, `amount`, `currency`, `exchange_rate`, `bank_account_id`, `references[]` (invoice allocations), `status`.[web:4][web:15]

---

## 13. Reporting Entities

### Entity: ReportDefinition

- **Purpose**: Describe reusable report queries and layouts.
- **Fields**: `name`, `domain` (accounting/stock/sales/etc.), `filters_schema`, `aggregation_logic`, `layout`, `export_formats`.

### Entity: KPI

- **Purpose**: Define key performance indicators.
- **Fields**: `name`, `formula`, `data_sources[]`, `target_value`, `periodicity`, `dimensions`.

---

## 14. Patterns in Domain Model

### 14.1 Master vs Transaction Entities

- **Master entities**: Product, Customer, Supplier, Warehouse, Employee, Account, Asset.[web:4][web:7]
- **Transaction entities**: SalesOrder, PurchaseOrder, Invoice, PaymentEntry, StockLedgerEntry, JournalEntry, WorkOrder, Payslip.[web:15][page:7]
- **AI implication**: Master changes affect future transactions; transactions are historical facts.

### 14.2 Ledger + Aggregate Pattern

- **Ledger**: Append-only detailed entries (GL, StockLedgerEntry). Values derived, not edited.[page:7][web:15]
- **Aggregate**: Snapshot tables (account balances, stock bins) updated by ledger postings for fast queries.

---

This file focuses on domain structure and entity definitions. Calculations, methods, workflows, industry-specific adaptations, and design patterns are covered in the other companion markdown files in this knowledge base.