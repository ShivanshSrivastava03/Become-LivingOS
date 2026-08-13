# Industry-Specific ERP Methods and Needs

This file catalogs methods and specific needs by industry, focusing on what a generic ERP does not natively understand but open-source ERPs often implement via specialized modules or customizations.

---

## 1. Retail & Fashion

### 1.1 Common Methods

- SKU and barcode management for fast POS and scanning.[web:4]
- Variant handling (size, color, style) for fashion products.[web:4]
- Promotions, markdowns, and loyalty programs.[web:4][web:11]
- POS workflows with offline capability and shift management.[web:4]

### 1.2 Specific Needs

- **Size/Color matrix**: Order and stock at variant level; UI for matrix entry.
- **Seasonal collections**: Launch/end dates; seasonal performance reporting.
- **Markdown rules**: Automatically reduce prices based on age and stock turns.
- **Stock ageing**: Identify stale inventory for clearance.[web:6][web:7]

### 1.3 ERP Implementations

- Odoo: variants (`product.template` with attributes), POS, loyalty, promotions.[web:4]
- ERPNext: item variants, POS, stock ageing report.[web:7]

---

## 2. Manufacturing (Discrete & Process)

### 2.1 Common Methods

- BOMs with multi-level structures.[web:50][web:52]
- Routings and work centers with capacity and costing.[web:49][web:53]
- Work orders with operation tracking and scrap.[web:52]
- Quality checks and non-conformance tracking.[web:56]

### 2.2 Specific Needs

- **Job shop**: Custom orders, job costing, and routing per job.
- **Batch/lot production**: Batch numbers, yield, and batch quality.
- **Co-products/by-products**: Modeling multiple outputs from one process.[web:56]
- **Process manufacturing**: Formulas, scalability (batch size), and potency.

### 2.3 ERP Implementations

- Odoo MRP: BOMs, routings, work orders, PLM, quality.[web:52][web:54][web:56]
- ERPNext manufacturing: work orders, material consumption, FG receipt.[web:7]

---

## 3. Healthcare & Hospitals

### 3.1 Common Methods

- Patient registration and demographic management.
- Encounter/visit management (OPD/IPD).
- Diagnosis coding (ICD) and procedure coding (CPT).
- Appointment scheduling and doctor calendars.

### 3.2 Specific Needs

- **Clinical workflows**: Triage, admission, rounds, discharge summaries.
- **Insurance claims**: Pre-authorization, claim submission, adjudication.
- **Medical records**: EMR with privacy and access controls (HIPAA-like).[web:41]
- **Lab integrations**: Lab orders, results, and billing.

### 3.3 ERP Implementations

- Odoo and ERPNext have healthcare modules/projects; most open-source ERPs integrate with specialized HIS systems.[web:41]

---

## 4. Pharmacy

### 4.1 Common Methods

- Batch/lot and expiry tracking.[web:45]
- FEFO (First Expiry, First Out) dispensing logic.[web:45]
- Prescription-to-dispense workflows.

### 4.2 Specific Needs

- **Controlled substances**: Schedule tracking, audit trail, and reporting.
- **Drug interactions**: Checking and alerting pharmacists.
- **Insurance/PBM integration**: Co-pay calculations and claim adjudication.

### 4.3 ERP Implementations

- ERPNext and Odoo often integrate with external pharmacy systems; FEFO and batch tracking implemented via inventory modules.[web:45]

---

## 5. Restaurant

### 5.1 Common Methods

- Menu and recipe management (ingredients and quantities).
- Table management and kitchen order tickets.
- POS optimized for orders and splits.

### 5.2 Specific Needs

- **Recipe costing**: Cost per dish based on ingredients and prep.[web:58]
- **Course timing**: Appetizer/main/dessert sequencing.
- **Modifiers**: Extra toppings, allergies, exclusions.

### 5.3 ERP Implementations

- Odoo POS for restaurants with table management and kitchen integration; recipe costing via BOM-like structures.[web:58]

---

## 6. Hotel

### 6.1 Common Methods

- Room inventory and availability management.
- Rate plans (daily pricing, packages).[web:4]
- Reservation and check-in/check-out workflows.

### 6.2 Specific Needs

- **Channel management**: OTAs (Booking.com, Expedia), GDS connectivity.
- **Revenue management**: Dynamic pricing, ADR, RevPAR.[web:23]
- **Housekeeping**: Room status (clean, dirty, out-of-order).

### 6.3 ERP Implementations

- Odoo has hospitality modules; others rely on PMS (Property Management Systems) integrations.[web:23]

---

## 7. Construction

### 7.1 Common Methods

- Projects/jobs with WBS and cost codes.[web:54]
- Progress billing and retention (holdback).[web:54]

### 7.2 Specific Needs

- **Change orders**: Contract amendments with pricing and schedule impact.[web:54]
- **WIP reporting**: Cost vs billing; over/under billing.
- **Subcontractor management**: Commitments, progress payments, lien waivers.

### 7.3 ERP Implementations

- Odoo and ERPNext project modules plus customizations; specialized construction ERPs often used.[web:54]

---

## 8. Logistics & Transportation

### 8.1 Common Methods

- Shipment and tracking management.
- Carrier contracts and freight calculation.[web:23]

### 8.2 Specific Needs

- **Route optimization**: Minimizing cost/time.[web:23]
- **Dim-weight pricing**: Chargeable weight based on size.[web:23]
- **Incoterms**: FOB, CIF, EXW, DDP responsibilities.

### 8.3 ERP Implementations

- Dolibarr, Odoo, ERPNext integrate with carriers and shipping APIs; specialized TMS systems exist.[web:23]

---

## 9. Agriculture

### 9.1 Common Methods

- Farm, plot, and crop cycle management.
- Input (seed, fertilizer, chemical) tracking.

### 9.2 Specific Needs

- **Yield per acre** reporting.
- **Traceability** from field to consumer.
- **Regulatory compliance** for chemical application.

### 9.3 ERP Implementations

- ERPNext community modules and custom apps, often linked to specialized agri platforms.[web:41]

---

## 10. Education

### 10.1 Common Methods

- Student, course, and enrollment management.
- Timetables and exams.

### 10.2 Specific Needs

- **GPA calculation** and transcripts.
- **Attendance requirements** for exam eligibility.
- **Fee structures and scholarships**.

### 10.3 ERP Implementations

- ERPNext Education module; Odoo education vertical implementations.[web:54]

---

## 11. Automotive (Dealer & Service)

### 11.1 Common Methods

- Vehicle master (VIN, make, model).
- Service work orders and parts inventory.

### 11.2 Specific Needs

- **Flat-rate labor** tables for standardized times.
- **Warranty claims**: Manufacturer reimbursement workflows.
- **Recall management**: VIN-based campaigns and repair tracking.

### 11.3 ERP Implementations

- Odoo and ERPNext used with custom dealer/service modules or third-party systems.[web:59]

---

## 12. Real Estate

### 12.1 Common Methods

- Property and unit master data.
- Lease and rent roll management.

### 12.2 Specific Needs

- **Rent proration** and escalation clauses.
- **CAM (Common Area Maintenance)** cost allocation.
- **Mortgage and amortization** schedules.

### 12.3 ERP Implementations

- Odoo and ERPNext customizations; specialized real estate ERPs exist.[web:54]

---

This file focuses on industry-specific methods and needs that drive specialized modules or customizations in open-source ERPs. Cross-industry methods are documented in the companion `erp_cross_industry_methods.md` file.