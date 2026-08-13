# Open-Source ERP Implementation Map

This file maps key ERP concepts to their implementations in major open-source ERPs (ERPNext, Odoo, Tryton, Dolibarr, OFBiz, iDempiere), with code references, approaches, advantages, and limitations.

---

## 1. Inventory Valuation (FIFO, Moving Average)

### ERPNext

- **Approach**: Perpetual valuation with `Stock Ledger Entry` and `Bin` tables; FIFO and Moving Average methods.[page:2][page:7]
- **Code**: `erpnext/stock/stock_ledger.py`, `erpnext/stock/doctype/stock_ledger_entry/stock_ledger_entry.py`.[page:7]
- **Advantages**: Real-time valuation; detailed audit trail; backdated reposting.[page:2][page:7]
- **Limitations**: Complex reposting logic; performance on large datasets.

### Odoo

- **Approach**: `stock.move` and `stock.valuation.layer`; supports FIFO, average, standard.[web:15]
- **Code**: `addons/stock_account/models/stock_move.py`, `addons/stock_account/models/stock_valuation_layer.py`.[web:15]
- **Advantages**: Integrated with accounting; flexible valuation methods.
- **Limitations**: Configuration complexity; performance tuning needed.

### Tryton

- **Approach**: `StockMove` and valuation modules; configurable methods.[web:32][web:45]
- **Code**: `tryton/stock/inventory.py`, `tryton/account_stock_continental`.[web:32][web:45]
- **Advantages**: Modular design; clean separation.
- **Limitations**: Smaller community; fewer out-of-box features.

### Dolibarr

- **Approach**: Weighted Average Cost (WAC) and standard valuation.[web:33][web:38]
- **Code**: `htdocs/stock/` modules.[web:33]
- **Advantages**: Simple; suitable for SMBs.
- **Limitations**: Limited advanced valuation methods.

---

## 2. Accounting (Double-Entry, GL)

### Odoo

- **Approach**: `account.move` (journal entries) and `account.move.line` (GL lines); double-entry enforced.[web:4][web:15]
- **Code**: `addons/account/models/account_move.py`.[web:15]
- **Advantages**: Tight integration with all modules; robust.
- **Limitations**: Complex model; steep learning curve.

### ERPNext

- **Approach**: `Journal Entry` and `GL Entry`; auto-posting from invoices/payments.[web:4]
- **Code**: `erpnext/accounts/doctype/journal_entry/`.[web:4]
- **Advantages**: Simple UI; integrated with stock and manufacturing.
- **Limitations**: Less flexible than Odoo for complex scenarios.

### Tryton

- **Approach**: `AccountMove` and `AccountMoveLine`; strict double-entry.[web:45]
- **Code**: `tryton/account/move.py`.[web:45]
- **Advantages**: Clean design; strong accounting focus.
- **Limitations**: Smaller ecosystem.

### OFBiz

- **Approach**: `GlEntry` and `AcctgTrans` (accounting transactions).[web:4]
- **Code**: `framework/entity/src/main/java/org/ofbiz/accounting/gl/`.[web:4]
- **Advantages**: Highly configurable; enterprise-grade.
- **Limitations**: Complex data model; XML-heavy configuration.

---

## 3. Sales Order-to-Cash

### ERPNext

- **Approach**: `Sales Order` → `Delivery Note` → `Sales Invoice` → `Payment Entry`.[web:46]
- **Code**: `erpnext/selling/doctype/sales_order/`.[web:46]
- **Advantages**: Clear workflow; integrated with stock and accounting.
- **Limitations**: Less flexible for custom workflows.

### Odoo

- **Approach**: `sale.order` → `stock.picking` → `account.move` → `account.payment`.[web:15]
- **Code**: `addons/sale/`, `addons/stock/`, `addons/account/`.[web:15]
- **Advantages**: Highly configurable; studio for customization.
- **Limitations**: Complexity; performance tuning.

### Dolibarr

- **Approach**: `Commande` (order) → `Livraison` (delivery) → `Facture` (invoice) → `Paiement`.[web:33]
- **Code**: `htdocs/commercial/`.[web:33]
- **Advantages**: Simple; suitable for SMBs.
- **Limitations**: Limited advanced features.

---

## 4. Procure-to-Pay

### ERPNext

- **Approach**: `Material Request` → `RFQ` → `Supplier Quotation` → `Purchase Order` → `Purchase Receipt` → `Purchase Invoice` → `Payment Entry`.[web:35]
- **Code**: `erpnext/buying/doctype/purchase_order/`.[web:35]
- **Advantages**: Integrated with MRP and stock.
- **Limitations**: Complex for simple needs.

### Odoo

- **Approach**: `purchase.order` → `stock.picking` → `account.move` → `account.payment`.[web:15]
- **Code**: `addons/purchase/`.[web:15]
- **Advantages**: Flexible; three-way matching.[web:33]
- **Limitations**: Configuration overhead.

---

## 5. Manufacturing (BOM, Work Orders)

### Odoo

- **Approach**: `mrp.bom` (BOM), `mrp.workcenter`, `mrp.routing`, `mrp.workorder`.[web:49][web:50][web:52]
- **Code**: `addons/mrp/`.[web:52]
- **Advantages**: Comprehensive; PLM, quality, maintenance integration.[web:56]
- **Limitations**: Complexity; performance.

### ERPNext

- **Approach**: `BOM`, `Work Order`, `Workstation` (work center), `Operation`.[web:7]
- **Code**: `erpnext/manufacturing/doctype/bom/`, `work_order/`.[web:7]
- **Advantages**: Integrated with stock and accounting.
- **Limitations**: Less advanced than Odoo for complex manufacturing.

---

## 6. MRP

### Odoo

- **Approach**: MRP scheduler computes planned orders based on demand, BOMs, and inventory.[web:52]
- **Code**: `addons/mrp/models/mrp_production.py`.[web:52]
- **Advantages**: Integrated with manufacturing and purchasing.
- **Limitations**: Complex; tuning needed.

### ERPNext

- **Approach**: MRP reports and production planning tools.[web:3]
- **Code**: `erpnext/manufacturing/doctype/production_plan/`.[web:3]
- **Advantages**: Simple; integrated.
- **Limitations**: Less advanced than Odoo.

---

## 7. Payroll

### Odoo

- **Approach**: `hr.payroll` with salary rules and payslips.[web:16]
- **Code**: `addons/hr_payroll/`.[web:16]
- **Advantages**: Flexible; configurable rules.
- **Limitations**: Localization needed per country.

### ERPNext

- **Approach**: `Salary Structure`, `Payslip`, `Payroll Entry`.[web:16]
- **Code**: `erpnext/hr/doctype/salary_structure/`, `payslip/`.[web:16]
- **Advantages**: Integrated with HR and accounting.
- **Limitations**: Localization needed.

---

## 8. Project Management

### Odoo

- **Approach**: `project.project`, `project.task`, `account.analytic.line` (timesheets).[web:54]
- **Code**: `addons/project/`, `addons/hr_timesheet/`.[web:54]
- **Advantages**: Integrated with HR and accounting.
- **Limitations**: Complexity.

### ERPNext

- **Approach**: `Project`, `Task`, `Timesheet`.[web:54]
- **Code**: `erpnext/projects/doctype/project/`.[web:54]
- **Advantages**: Simple; integrated.
- **Limitations**: Less advanced than Odoo.

---

## 9. Tax and Compliance

### Odoo

- **Approach**: Tax rules, fiscal positions, and localization modules.[web:4]
- **Code**: `addons/account/` tax models.[web:4]
- **Advantages**: Extensive localization; flexible.
- **Limitations**: Complexity.

### ERPNext

- **Approach**: Tax templates, GST/VAT modules, and tax ledgers.[web:4]
- **Code**: `erpnext/accounts/doctype/tax_rule/`.[web:4]
- **Advantages**: Simple; integrated.
- **Limitations**: Less extensive localization.

---

## 10. Multi-Currency

### Odoo

- **Approach**: Multi-currency invoices, payments, and revaluation.[web:18]
- **Code**: `addons/account/` currency models.[web:18]
- **Advantages**: Robust; integrated.
- **Limitations**: Complexity.

### ERPNext

- **Approach**: Multi-currency transactions and exchange rate management.[web:17]
- **Code**: `erpnext/accounts/doctype/exchange_rate/`.[web:17]
- **Advantages**: Simple; integrated.
- **Limitations**: Less advanced than Odoo.

---

## 11. Approval Workflows

### ERPNext

- **Approach**: Workflow engine with state transitions and user roles.[web:31]
- **Code**: `erpnext/workflow/doctype/workflow/`.[web:31]
- **Advantages**: Configurable; integrated.
- **Limitations**: UI complexity.

### Odoo

- **Approach**: Approval flows via studio or custom modules.[web:39]
- **Code**: `addons/approval/` (custom modules).[web:39]
- **Advantages**: Flexible.
- **Limitations**: Often requires customization.

---

## 12. Audit Trails and Versioning

### Odoo

- **Approach**: Audit log modules and versioning for BOMs, price lists.[web:37][web:50]
- **Code**: `addons/auditlog/`, `addons/mrp/` BOM versioning.[web:50]
- **Advantages**: Comprehensive.
- **Limitations**: Performance impact.

### ERPNext

- **Approach**: Versioning and audit logs for key entities.[web:37]
- **Code**: `erpnext/` versioning logic.[web:37]
- **Advantages**: Integrated.
- **Limitations**: Less extensive than Odoo.

---

## 13. Limitations Across Open-Source ERPs

- **Complexity**: Advanced features come with configuration and performance overhead.
- **Localization**: Payroll, tax, and compliance often require country-specific modules.
- **Performance**: Large datasets require tuning (indexes, caching, archiving).
- **Customization**: Often needed for industry-specific needs; requires development skills.

---

This file maps key ERP concepts to open-source implementations, with code references and practical insights. Use this alongside the cross-industry and industry-specific methods files for a complete picture.