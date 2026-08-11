# Industry-Specific Open-Source ERP Landscape

**Research snapshot:** 11 August 2026 (India time)  
**Scope:** Open-source ERP and ERP-like operational systems for particular industries. Generic ERP platforms are included only as comparators or as a foundation for a vertical application.

> **Interpretation note.** “Open source” in this report means publicly inspectable source code under a recognized open-source licence that permits use, modification and redistribution, subject to that licence. A public GitHub repository alone is not enough. Project maturity is judged from code activity, documentation, release evidence, community/adoption signals and breadth of operational workflows—not from marketing language.

## Executive findings

1. **Healthcare is the strongest deep-vertical area.** OpenMRS, OpenEMR, Bahmni and GNU Health cover real clinical objects and workflows. OpenMRS reports 3,000+ community members, 8,000+ facilities, 70+ countries and 15 million patient records; these are project-reported figures, not an independently audited user count. [OpenMRS](https://openmrs.org/)
2. **Retail POS, school management, farm management and hotel booking/PMS have usable open-source options**, but coverage is uneven by geography, compliance requirements and integrations.
3. **Manufacturing is bifurcated:** ERPNext and metasfresh are broad ERP foundations; Carbon is a newer manufacturing ERP/MES/QMS with an AGPL community edition plus proprietary enterprise code. [Carbon licensing](https://docs.carbon.ms/docs/platform/licensing)
4. **Many apparent vertical ERPs are only student CRUD projects.** A pharmacy or salon repository that has products, invoices and a dashboard is not equivalent to a maintained, auditable production platform.
5. **The largest gaps are modern construction, logistics execution, automotive dealership/workshop, real-estate brokerage/property operations, hospitality depth beyond reservations, salon/fitness subscriptions, and regulated medical supply/manufacturing.**
6. **The best opportunity is usually not “another ERP.”** It is a focused, API-first workflow system with excellent local compliance, mobile/offline support, integrations and migration tools, connected to a generic accounting/ERP core.

## 1. Classification and verification

### Software categories

| Category | What it normally does | ERP relevance |
|---|---|---|
| ERP | Finance, purchasing, sales, inventory, HR, projects and sometimes manufacturing | Operational backbone |
| Vertical ERP | ERP-shaped product built around one industry's objects and workflows | Highest relevance |
| HIS/EMR/EHR | Patient, encounter, clinical, laboratory, pharmacy and billing records | Healthcare operational backbone; not always full finance ERP |
| PMS | Hotel rooms, reservations, folios, housekeeping and rate management | Hospitality backbone |
| POS | Sales transaction, payment, stock and receipt workflows | Retail/restaurant core, not full ERP by itself |
| WMS/TMS/FMS | Warehouse, transport, fleet, route and shipment operations | Logistics backbone |
| LIMS | Samples, tests, instruments, results, quality and chain of custody | Laboratory backbone |
| Practice-management system | Appointments, case/customer records, billing and work execution | Clinics, law, accounting, salons and professional services |

### Licence test

| Label | Meaning in this report | Typical consequence |
|---|---|---|
| Open source | OSI-approved or clearly recognized FOSS licence covering the relevant code | Self-host, modify and redistribute within licence terms |
| Open core | Core is open, but enterprise modules or files are commercial | Audit the exact module boundary before committing |
| Source available | Code is visible but licence restricts use, redistribution or commercial use | Do not call it open source |
| Freeware/free SaaS | Free access or download without source rights | Not open source |
| Unclear | Repository, licence or ownership is inconsistent | Excluded from “strong option” rankings |

### Practical verification checklist

For procurement or development, verify the current repository `LICENSE`, dependency licences, edition boundaries, release tags, security policy, backups, upgrade path and data export. A GPL/AGPL application can be commercially used, but redistribution and network-use obligations may apply. LGPL generally permits linking with proprietary modules under conditions; permissive MIT/BSD/Apache licences are easier for proprietary extensions. Legal review is still required.

## 2. Industry map

| Business category | Meaningful open-source systems found | Availability and maturity |
|---|---|---|
| Hospitals and clinics | OpenMRS, Bahmni, OpenEMR, GNU Health, OpenClinic GA, HospitalRun, Danphe EMR | Strong for EMR/HIS; medium for complete hospital ERP |
| Pharmacies | Pharmacy repositories, ERPNext customisations, OpenEMR integrations | Available but fragmented; no dominant modern pharmacy ERP |
| Diagnostic laboratories | Open-LIMS, Labber, caLIMS, Baobab LIMS, iSkyLIMS, Senaite/Bika lineage | Medium for research/quality labs; weaker for clinical networks |
| Dental clinics | OpenEMR adaptations and small practice systems | Weak; no clearly dominant modern dental vertical |
| Medical distributors/inventory | ERPNext/metasfresh plus custom medical workflows | Generic foundation; regulated distribution depth is weak |
| Clothing/fashion retail | uniCenta, OSPOS, NexoPOS, ERPNext retail, retail projects with variants | Medium POS; weak deep fashion planning/size curves |
| Supermarket/grocery | OSPOS, uniCenta, ERPNext, Grocy for household inventory | Medium for POS; weak enterprise grocery replenishment |
| Electronics/furniture/jewelry/hardware/book retail | OSPOS/uniCenta/NexoPOS and generic ERP customisation | Medium transaction layer; weak category-specific workflows |
| Multi-store retail/wholesale | ERPNext, metasfresh, OSPOS, uniCenta, Dolibarr | Medium; omnichannel and advanced replenishment gaps |
| General manufacturing | ERPNext, metasfresh, Tryton, Apache OFBiz | Strongest general open-source ERP area; implementation-heavy |
| Complex/HMLV manufacturing | Carbon ERP/MES/QMS, ERPNext, Axelor/other foundations | Emerging; Carbon is promising but open-core boundary matters |
| Textile/garment | ERPNext customisations and small textile projects | Weak-to-medium; planning and compliance gaps |
| Food manufacturing | ERPNext, metasfresh, Dolibarr customisation | Medium; traceability, recipes and QA require work |
| Pharmaceutical/chemical manufacturing | ERPNext/metasfresh plus bespoke modules | Weak for regulated batch release, validation and serialisation |
| Electronics/automotive/furniture/metal/job-work | ERPNext, Carbon, metasfresh, OpenBoxes in supply contexts | Medium foundations; deep quality/traceability varies |
| Hotels/resorts/hostels | QloApps, HotelDruid, Open Hotel PMS projects, Kamra, HAIP | Medium; QloApps is established for booking/PMS, newer API-first options emerging |
| Restaurants/cafes/bars | uniCenta, Floreant, Chromis, SambaPOS 3, Nutrix, ERPNext POS | Medium POS; weak modern kitchen, delivery and fiscal integration consistency |
| Travel agencies | OpenTripPlanner is routing, not ERP; booking projects and generic CRM/ERP | No mature end-to-end open-source agency ERP found |
| Construction/contractors | OpenConstructionERP, Wilson, ERPNext projects | Emerging; OpenConstructionERP is deep in BOQ/scheduling, adoption still needs validation |
| Real-estate agencies/property managers | ORPMS, ERPNext applications, Condo and small property systems | Weak-to-medium; brokerage and lease accounting gaps |
| Facility management/architecture/engineering | ERPNext/ProjectLibre-style tools, generic project ERP | No dominant vertical open-source platform found |
| Farms/agriculture | Ekylibre, FarmOS, ERPNext agriculture customisations, OpenForis tools | Medium FMIS; commercial farm ERP depth varies |
| Dairy/livestock/veterinary | Ekylibre, farmOS, OpenVPMS/Ababu for veterinary | Medium agriculture; veterinary is improving but fragmented |
| Agricultural supply/food distribution/cold storage/cooperatives | ERPNext/metasfresh, farmOS integrations, OpenBoxes | Generic supply-chain foundations; weak cold-chain/cooperative depth |
| Logistics/transport/fleet | Fleetbase/FleetOps, OpenGTS, Traccar, fleet-management projects | Medium TMS/fleet components; weak end-to-end freight ERP |
| Warehousing/freight/courier/last-mile | Fleetbase, OpenBoxes, Traccar, Open Door Logistics | Components exist; integrated operational suite is weak |
| Schools/colleges/universities | OpenEduCat, Gibbon, RosarioSIS, openSIS Classic, Frappe Education | Strong SIS coverage; ERP/finance and modern UX vary |
| Coaching/training centres | OpenEduCat, Moodle plus ERP/POS customisation | Learning systems strong; business operations weak |
| Law/accounting/consulting/agencies/freelancers | Kimai, Taiga, ERPNext, Dolibarr, Invoice Ninja, Odoo comparator | Strong generic tools; deep practice management weak |
| Automotive dealerships | Automotis and small repositories | Poor; Automotis is old and adoption evidence is limited |
| Auto-repair workshops | Torqvoice, small Flask/Laravel projects, ERPNext customisation | Emerging/weak; parts, labour, VIN and warranty integration gaps |
| Salons/beauty/barbers | Open Salon, small Laravel projects | Weak-to-emerging; modern AGPL project exists but limited adoption evidence |
| Gyms/fitness/sports clubs | GYM One, MotionGym, wger, small MIT/Apache projects | Weak; memberships and attendance exist, mature billing/CRM/mobile less so |
| NGOs/nonprofits | NGO-ERP projects, ERPNext/Dolibarr, CiviCRM | Medium CRM/fundraising; full grant/project/accounting ERP varies |
| Government/religious/funeral organisations | Generic FOSS ERP/CRM and small projects | No mature broadly applicable vertical ERP found |
| Veterinary clinics | OpenVPMS, OpenVPM, Ababu, OpenVetMed | Medium; OpenVPM is modern but early in adoption |
| Printing/publishing/media | ERPNext/Job costing, small print-management projects, Koha for libraries | Weak as an integrated commercial ERP |
| Recycling/waste | Generic ERP plus fleet/scale modules | No mature open-source vertical ERP found |
| Energy/renewables | OpenEMS and energy-management tools; generic ERP for finance/projects | Operational energy tools exist, full business ERP gap remains |
| Telecom | OCS Inventory/OSS/BSS components and generic ERP | No mature open-source telecom business ERP found |
| Import/export/wholesale | ERPNext, metasfresh, Dolibarr, Apache OFBiz | Medium; trade compliance and logistics integration require customisation |

## 3. Significant project profiles

### Healthcare

#### OpenMRS — EMR platform; deep vertical

- Website: [openmrs.org](https://openmrs.org/); source: [OpenMRS GitHub](https://github.com/openmrs/openmrs-core).
- Licence: Mozilla Public License 2.0 for core; verify each module.
- Typical stack: Java/Spring ecosystem with modern React-based OpenMRS 3 frontend and REST/FHIR-oriented integration.
- Domain model: patient, person, provider, location, visit, encounter, observation, order, diagnosis, drug, concept dictionary and program enrolment.
- Workflow: registration → visit/encounter → observations/orders → results/prescription → reporting and programme follow-up.
- Specialisation: **deep vertical EMR**, not a general accounting ERP.
- Adoption: project reports 3,000+ community members, 8,000+ facilities, 70+ countries and 15 million patient records. Treat these as self-reported adoption signals.
- Strengths: internationalisation, configurable concepts, APIs, FHIR direction, public-health programme support and a large community.
- Gaps: implementation and terminology work, finance/procurement, hospital-wide billing, local insurance and polished turnkey deployment.

#### Bahmni — hospital information system; deep vertical

- Website/source: [Bahmni](https://bahmni.org/) and [GitHub](https://github.com/Bahmni).
- Licence: AGPL-family components; verify version and component licences before redistribution.
- Built around OpenMRS and intended to add hospital-facing registration, clinical, laboratory, pharmacy, billing and reporting workflows.
- Domain model: patient → admission/visit → consultation → diagnosis/orders → lab/radiology → pharmacy → billing/discharge.
- Specialisation: **deep vertical HIS**; much closer to hospital operations than a generic ERP.
- Strengths: integrated low-resource hospital workflow and implementation ecosystem.
- Gaps: deployment complexity, country-specific billing/insurance, interoperability and long-term upgrade discipline.

#### OpenEMR — ambulatory EMR/practice management; deep vertical

- Website: [open-emr.org](https://www.open-emr.org/); source: [GitHub](https://github.com/openemr/openemr).
- Licence: GPLv3; self-hostable.
- Stack: PHP web application, SQL database; APIs and FHIR/interoperability features are available in the project.
- Functions: scheduling, patients, encounters, prescriptions, labs, documents, clinical decision rules, billing/claims, eligibility, reporting and access control.
- Specialisation: **deep vertical outpatient system**.
- Adoption signals: ONC certification, 30+ languages and a professional support/vendor ecosystem are stated by the project. [OpenEMR](https://www.open-emr.org/)
- Gaps: hospital inpatient depth, local regulatory workflows outside supported markets and the operational burden of secure upgrades.

#### GNU Health — health information and hospital system; deep vertical

- Website: [gnuhealth.org](https://www.gnuhealth.org/); source: [GNU Health GitLab](https://codeberg.org/gnuhealth).
- Licence: GPL-family components; verify current module licences.
- Stack: Tryton/Python/PostgreSQL ecosystem.
- Functions: patient records, clinical encounters, demographics, public health, hospital administration, pharmacy and reporting; broader social-medicine orientation.
- Specialisation: **deep vertical health information system**.
- Strengths: data sovereignty, international/public-health orientation and standards-minded architecture.
- Gaps: turnkey UX, local insurance and implementation capacity.

### Pharmacy and laboratory

| Project | Category/licence | What it manages | Verdict |
|---|---|---|---|
| Open-LIMS | LIMS, GPLv3 | Samples, tests, results, users and laboratory workflow | Genuine lab vertical, but activity and deployment evidence must be checked per release |
| Labber | LIMS, AGPLv3 | Sample and laboratory records | Real vertical model; appears niche |
| caLIMS | LIMS, BSD 3-Clause | Experimental sample lifecycle, results and repositories | Strong for research workflows, not a retail pharmacy or clinical ERP |
| Baobab LIMS | LIMS, GPLv3, Docker | Biospecimen lifecycle from receipt to storage/reuse | Genuine specialty LIMS; not a complete diagnostic-lab billing ERP |
| Senaite/Bika lineage | LIMS, GPL-family | Quality, samples, results and lab operations | Useful for laboratories; verify current project/edition status |
| Small pharmacy repositories | Usually MIT/GPL, PHP/Python/Java | Products, batches, expiry, stock, sales, invoices and reports | Many are educational or small-business projects; no single dominant mature option found |

**Pharmacy gap:** A production pharmacy needs batch/lot and expiry controls, FEFO, controlled-drug audit trails, prescription validation, substitutions, supplier recalls, insurance/e-invoicing, cold-chain records, barcode/GS1 support and jurisdiction-specific tax. Generic ERP inventory can cover purchasing and stock, but not the regulated clinical and dispensing layer without a specialist module.

### Retail and fashion

#### OSPOS and uniCenta — POS/retail backbone; industry-adapted

- [OSPOS](https://github.com/opensourcepos/opensourcepos) is a web POS commonly associated with PHP/CodeIgniter and MySQL/MariaDB; the core is MIT-licensed according to its project materials.
- [uniCenta oPOS](https://unicenta.com/) is a long-running Java POS under GPLv3, with source and community releases. [uniCenta source/licence](https://unicenta.com/)
- Functions: products/SKUs, customers, suppliers, stock, purchases, sales, returns, registers, receipts, discounts and reports.
- Best fit: general retail, grocery, hardware, books, electronics and small multi-register stores.
- Missing depth: fashion buying plans, colour/size matrices, seasonality, assortment planning, wholesale-to-retail allocation, e-commerce synchronisation and enterprise replenishment.

#### Fashion/clothing model

A genuinely fashion-specific system needs: style → colour → size → variant/SKU → barcode; season/collection; supplier purchase order; goods receipt; store/warehouse stock; POS sale; return/exchange; markdown; assortment and sell-through analytics. Most open projects implement products and stock but not the full planning and merchandising model. Therefore clothing retail has **medium POS availability but weak deep-vertical coverage**.

### Manufacturing

#### ERPNext — generic ERP with strong manufacturing modules

- Source/licence: [Frappe ERPNext](https://github.com/frappe/erpnext), GPLv3.
- Stack: Python/Frappe, MariaDB, browser UI and REST/RPC APIs; self-hosting and Docker deployment are supported through the Frappe ecosystem.
- Functions: items, variants, BOMs, routings, work orders, job cards, subcontracting, quality, stock, purchasing, sales, accounting, assets, HR and projects.
- Specialisation: **generic ERP with industry-adapted manufacturing**, not a deep process-industry or fashion ERP.
- Strengths: broad integrated data model and large community.
- Gaps: advanced APS, MES depth, regulated validation, complex costing, shop-floor UX and vertical compliance often need custom apps.

#### Carbon — manufacturing ERP/MES/QMS; vertical/open core

- Source: [Carbon GitHub](https://github.com/crbnos/carbon).
- Licence: community ERP + MES under AGPLv3; `packages/ee` and files marked `.ee` require commercial licensing. [Carbon licensing](https://docs.carbon.ms/docs/platform/licensing)
- Stack: TypeScript/Node.js ecosystem, PostgreSQL and modern web tooling; Docker/self-hosting documented.
- Functions: manufacturing orders, BOM/engineering, inventory, quality and production execution, with a focus on complex assembly, contract manufacturing and configure-to-order.
- Specialisation: **vertical ERP/MES/QMS**, but **open core**, not fully open code.
- Strengths: modern UX and domain focus.
- Gaps: relatively young ecosystem, enterprise-code boundary, implementation partners and independently verified adoption.

#### metasfresh — distribution/manufacturing ERP; industry-adapted

- Source: [metasfresh GitHub](https://github.com/metasfresh/metasfresh); GPLv2.
- Java/PostgreSQL ecosystem with distribution, procurement, sales, warehouse and manufacturing capabilities.
- Strong for wholesale/distribution and integrated operations; less opinionated than a deep shop-floor MES.

### Hospitality

#### QloApps — hotel PMS/booking engine; vertical

- Source: [QloApps GitHub](https://github.com/Qloapps/QloApps); OSL-3.0 core, with module-level licences including AFL-3.0 and vendor-specific terms. [Repository details](https://github.com/Qloapps/QloApps)
- Stack: PHP, Smarty/JavaScript, MySQL; Docker image and conventional PHP hosting are documented.
- Functions: property website, rooms/properties, bookings, rates, guests, staff and booking channels; PMS plus booking engine and hotel website.
- Specialisation: **vertical hotel commerce/PMS**, strongest around reservations and direct booking.
- Adoption signal: repository displayed 10.2k stars and 661 forks at research time; GitHub stars are interest signals, not deployments.
- Gaps: enterprise-grade night audit, revenue management, housekeeping depth, fiscal integrations and API-first integrations vary by module.

#### Kamra and HAIP — newer API-first PMS options

- [Kamra](https://kamrapms.com/) advertises AGPLv3, front desk, billing/taxes, restaurant POS, housekeeping and direct booking in a Frappe-based application.
- [HAIP](https://github.com/telivity-otaip/haip) is reported as Apache-2.0, TypeScript/NestJS/PostgreSQL/React/Redis/BullMQ, with reservations, rooms, guests, housekeeping, folios, night audit and integrations. Its 2026 claims are promising but too recent for mature-adoption status.
- Verdict: hospitality has credible vertical activity, but the market still lacks a universally mature open-source PMS with broad OTA, payment, fiscal and support coverage.

#### Restaurants

uniCenta, Floreant, Chromis and SambaPOS 3 represent older or desktop-oriented POS approaches; [Nutrix](https://github.com/nutrixpos/pos) is GPL-2.0 and focuses on restaurant/retail inventory and sales. A restaurant backbone needs menu/recipe, modifiers, tables, orders, kitchen display, prep stations, wastage, purchasing, stock, staff shifts, delivery and fiscal receipts. Open-source coverage is **medium for POS, weak for modern integrated restaurant operations**.

### Construction and real estate

#### OpenConstructionERP — construction ERP; emerging deep vertical

- Source/site: [OpenConstructionERP](https://github.com/datadrivenconstruction/OpenConstructionERP), [project site](https://openconstructionerp.com/).
- Licence: AGPLv3, with a commercial alternative described by the project.
- Functions claimed: estimates/BOQ, tendering, contracts, site tasks, 4D schedule, 5D cost model, CAD/BIM takeoff, catalogues and reports.
- Specialisation: **deep vertical construction platform**.
- Strengths: domain-specific estimating and schedule/cost concepts that generic ERP lacks.
- Gaps: very recent public activity, limited independent adoption evidence, BIM/CAD reliability, regional contract/accounting compliance and implementation ecosystem.

Real-estate operations need property/unit/parcel, listing, lead, viewing, offer, reservation, sale/lease, tenant, rent schedule, deposits, maintenance, broker commission, owner statement and compliance. ORPMS and small repositories exist, but **no mature open-source brokerage + property-management leader** was verified.

### Agriculture

#### Ekylibre — farm management information system; deep vertical

- Source: [Ekylibre GitHub](https://github.com/ekylibre/ekylibre); AGPLv3.
- Stack: Ruby on Rails, PostgreSQL and PostGIS.
- Domain model: farm, plot, crop, intervention, input, equipment, animal/production records, stock, purchase/sale and accounting-related operations.
- Specialisation: **deep agricultural FMIS**, stronger than a generic ERP for field and farm activity.
- Strengths: geospatial farm model and production operations.
- Gaps: localisation, device/mobile/offline workflows, dairy/livestock specialisation and modern integrations.

farmOS is an important open-source farm-record platform but is not a complete ERP. Generic ERP is usually needed for accounting, procurement and payroll.

### Logistics

#### Fleetbase — logistics operating system; vertical platform

- Source: [Fleetbase GitHub](https://github.com/fleetbase/fleetbase); AGPLv3.
- Functions: orders, logistics planning, fulfilment, fleet/vehicle, locations, tracking and operational control; FleetOps is an extension.
- Specialisation: **vertical logistics platform**, not necessarily a complete freight-forwarding ERP.
- Strengths: modular supply-chain operations, API orientation and extensibility.
- Gaps: carrier contracts, customs, rating, accounting, EDI, proof-of-delivery edge cases, offline driver experience and mature implementation network.

Traccar and OpenGTS are useful GPS/fleet components, while OpenBoxes is a warehouse/supply-chain system. Combining components is possible, but integration is the hard part.

### Education

#### OpenEduCat — education ERP; vertical/open core risk

- Source: [OpenEduCat GitHub](https://github.com/openeducat/openeducat_erp); LGPLv3 for the community repository.
- Stack: Python/Odoo ecosystem, PostgreSQL and web UI.
- Functions: admissions, students, courses, batches, attendance, timetable, examinations, fees, facilities, HR and portals.
- Specialisation: **vertical education ERP built on a generic framework**.
- Important licence note: the project states that enterprise modules such as biometric attendance, face recognition and multi-campus capabilities may be separately licensed. Audit edition boundaries.

Gibbon, RosarioSIS and openSIS Classic are stronger as student-information systems than as full finance/procurement ERPs. Education is therefore **strong in SIS, medium in integrated institutional ERP**.

### Automotive

Automotis is an AGPL dealership project, but its repository history dates to the early 2010s and does not provide strong evidence of a modern maintained ecosystem. Small MIT repair-shop repositories cover customers, vehicles, repair jobs, parts and billing. Torqvoice is a newer self-hosted workshop-management initiative. The missing domain model is: vehicle/VIN → customer/owner → appointment → inspection → estimate → work order → technician/labour → parts → warranty → invoice → service history. Automotive is **weak overall**, especially dealerships, parts interchange, warranty and OEM integrations.

### Veterinary, salons and gyms

- **OpenVPMS**: established veterinary practice-management project; open-source ecosystem, but licence/subscription conditions must be read carefully.
- **OpenVPM**: modern API-first AGPLv3 veterinary PIMS with patient, appointment, SOAP note, billing and inventory workflows; promising but early adoption. [OpenVPM](https://openvpm.com/)
- **Ababu**: AGPLv3 veterinary clinical software; useful niche project, adoption and release continuity need validation.
- **Open Salon**: AGPLv3, Preact/Tailwind/Hono/SQLite, appointments and staff management for salons, spas, barbers and similar appointment businesses. [Open Salon](https://github.com/clawnify/open-salon)
- **GYM One**: gym management repository with a custom licence; do not assume it is OSI-compliant until the licence is reviewed. [GYM One](https://github.com/mayerbalintdev/gym-one)
- **MotionGym and wger**: useful gym/workout components; wger is AGPLv3 but is primarily workout/nutrition management, not a complete membership ERP. [wger](https://wger.readthedocs.io/en/2.0/)

These sectors have many repositories but few production-grade, integrated platforms with subscriptions, payments, memberships, staff commissions, mobile apps, messaging, tax and retention analytics.

### Professional services, NGOs and other sectors

Kimai (time tracking), Invoice Ninja (invoicing), Taiga (projects), Dolibarr/ERPNext (generic business ERP) and CiviCRM (constituent/fundraising CRM) can form useful stacks. However, law firms need matter, conflict, trust accounting, legal billing and document workflows; accounting firms need engagements, workpapers and tax deadlines; agencies need resource planning and margin by project; NGOs need grants, restricted funds, donor reporting and programme outcomes. **No single dominant, modern, fully open vertical ERP was verified across these professional-service niches.**

Government, religious organisations, funeral services, recycling, telecom, renewable-energy business operations, printing and publishing also have components or small projects, but no mature broad vertical ERP was verified. Open-source operational tools exist in energy monitoring, library/publishing and asset management; they should not be mislabeled as complete ERPs.

## 4. Technical architecture and domain models

### Common architecture patterns

| Pattern | Examples | Advantage | Risk |
|---|---|---|---|
| Framework ERP/app | ERPNext, OpenEduCat, GNU Health/Tryton | Reusable permissions, accounting, workflow and reporting | Vertical logic can become customisation debt |
| Specialist monolith | OpenEMR, QloApps, uniCenta | Coherent domain workflow and simple deployment | Older stacks, harder modular replacement |
| Modular API platform | Fleetbase, OpenMRS, OpenVPM, HAIP | Integrations, mobile clients and specialised services | More deployment and versioning complexity |
| Component ecosystem | Traccar + WMS + ERP, farmOS + ERP | Best-of-breed flexibility | Data synchronisation and support responsibility |

### Healthcare workflow and data model

`Patient → Appointment/Admission → Encounter → Diagnosis/Observation → Order → Lab/Radiology → Prescription/Pharmacy → Billing → Discharge/Follow-up`

Unique objects include concepts/terminologies, encounter types, observations, specimens, orders, medication regimens, providers, departments, insurance claims, consent and audit trails. A generic ERP has customers, products and invoices, but not clinical provenance, terminology, privacy segmentation or medical-record auditability.

### Fashion/retail workflow and data model

`Supplier → Style/Collection → Colour/Size Variant → SKU/Barcode → Purchase/Receipt → Store/Warehouse Stock → POS Sale → Return/Exchange → Markdown → Accounting`

Unique objects include style, season, colourway, size curve, variant matrix, assortment, sell-through, markdown and store allocation. Generic item masters usually require custom tables and screens for these concepts.

### Manufacturing workflow and data model

`Sales order/forecast → Engineering revision → BOM/routing → Material planning → Purchase/subcontract → Work order → Operation/job card → Quality inspection → Finished stock → Shipment/costing`

Unique objects include revision-controlled BOM, routing, work centre, operation, scrap, lot/serial, nonconformance, CAPA, traceability and finite capacity. Carbon’s MES/QMS orientation is more domain-native than a basic ERP inventory module; ERPNext is broader and usually easier to extend across finance and HR.

### Hotel workflow and data model

`Reservation/Channel → Rate/Room allocation → Check-in → Folio/charges → Housekeeping/Maintenance → Payment → Night audit → Check-out → Reporting`

Unique objects include room type, room inventory, rate plan, occupancy, folio, stay, housekeeping status, channel mapping, tax rule and night audit. A generic ERP can model customers and invoices but not overbooking, room availability or channel distribution naturally.

### Construction workflow and data model

`Lead/Tender → BOQ/Estimate → Contract → Budget → Procurement/Subcontract → Site task → 4D schedule → Progress valuation → Variation/claim → Retention → Completion`

Unique objects include WBS, cost code, BOQ line, measurement, drawing/BIM reference, variation, subcontract, site diary, retention and progress certificate. These are difficult to reproduce elegantly in a generic ERP without a vertical project model.

## 5. Generic ERP versus vertical system

| Decision factor | Generic ERP + vertical app | Specialist vertical system |
|---|---|---|
| Finance, purchasing, HR | Usually strongest | May be limited |
| Industry workflow | Requires design/customisation | Usually built in |
| Domain UX | Adequate after work | Usually better from day one |
| Integrations | Broad ERP connectors | Often narrower or immature |
| Deployment | One platform if already adopted | New system and migration |
| Customisation | Framework can be powerful | Domain changes can be harder |
| Upgrades | Custom code creates debt | Fork/vendor dependency risk |
| Compliance | Generic baseline | Better if the project targets the jurisdiction |
| Best choice | Multi-department business with unusual processes | Business whose core value is domain execution |

**Use generic ERP** when accounting, procurement, inventory and HR are central, the domain is not highly regulated, and the organisation has development/implementation capacity. **Use a vertical system** when the primary records are clinical encounters, rooms/stays, specimens, work orders, BOQs, routes, memberships or farm interventions—objects that drive daily operations and cannot be represented cleanly as generic products and contacts.

A practical hybrid is often best: vertical application owns the domain workflow; generic ERP owns general ledger, purchasing, payroll and shared master data through APIs/events.

## 6. Adoption and developer-experience assessment

### What adoption evidence is reliable

- Release tags, changelogs, security advisories and active issue/PR response.
- Named implementers, public production references and reproducible demos.
- Contributors and community activity, interpreted over time rather than raw stars.
- Documentation for installation, upgrades, backup, migration and API usage.
- Integrations with payment, tax, EDI, laboratories, booking channels, barcode hardware or government systems.

### Recurring complaints across the landscape

- Installation depends on old PHP/Java/Python versions or undocumented server assumptions.
- Demo quality exceeds production hardening; backups, observability and upgrades are under-documented.
- Mobile and offline operation is missing, especially in logistics, agriculture, construction and field healthcare.
- Local taxes, fiscal printers, insurance, e-invoicing, payment gateways and language support are country-specific.
- APIs exist but are incomplete, unstable or poorly versioned.
- Community editions may omit the most valuable modules; open-core boundaries are easy to misunderstand.
- Student projects often lack tests, migrations, security review, role separation and data-export guarantees.

### What users tend to value

- Data ownership and self-hosting.
- Ability to change workflows and integrate local services.
- No per-user/per-room/per-student lock-in.
- Community translations and local implementer freedom.
- A single operational database instead of spreadsheets and disconnected SaaS tools.

## 7. Underserved industries ranked

| Rank | Industry/use case | Current state | Core gap | Opportunity |
|---:|---|---|---|---|
| 1 | Medical distribution and pharmacy | Many small systems; generic ERP workarounds | Regulation, batch/expiry, recalls, dispensing, insurance and integrations | API-first pharmacy/distribution platform with country packs |
| 2 | Automotive workshop/dealership | Old or small repositories | VIN/parts/warranty/OEM, technician workflow, mobile and integrations | Workshop-first system connected to inventory/accounting |
| 3 | Construction contractors | New deep projects, generic alternatives | BOQ, measurement, site/mobile, variations, subcontract and claims | AGPL construction core with local cost libraries |
| 4 | Freight forwarding and last-mile | Components rather than suite | Rate cards, customs, carrier EDI, POD, routing, billing and mobile | Event-driven TMS with open carrier connectors |
| 5 | Real-estate brokerage/property management | Small/old property tools | Listings-to-lease-to-maintenance-to-owner accounting | Multi-tenant property operating system |
| 6 | Fashion merchandising/manufacturing | POS exists, planning weak | Variants, seasons, assortment, PLM, sourcing and sell-through | Fashion domain app on a proven ERP core |
| 7 | Hospitality operations | Booking/PMS projects exist | OTA, fiscal, housekeeping, revenue and restaurant integration | API-first PMS with open channel adapters |
| 8 | Regulated pharma/chemical manufacturing | Generic manufacturing foundations | Validation, batch release, quality, serialisation and audit | QMS/MES/ERP vertical with compliance packs |
| 9 | Salons/fitness subscriptions | Many small apps | Membership lifecycle, commissions, packages, payments and retention | Mobile-first appointment/membership platform |
| 10 | NGO/grant/cooperative operations | CRM and generic ERP pieces | Restricted funds, grant budgets, donor reporting and outcomes | Transparent grant-to-ledger operational ERP |

**Technical difficulty:** healthcare and regulated manufacturing are high-complexity due to safety, privacy and validation; retail/salon/gym are lower-to-medium; construction/logistics/real estate are medium-to-high because of workflow, documents, mobile and integrations. Open-source viability is highest where data ownership, local deployment and customisation are strategic and a partner ecosystem can sell implementation/support.

## 8. Industry-by-industry deep-research conclusions

| Industry | Strongest verified direction | Maturity | Main gap |
|---|---|---:|---|
| Healthcare | OpenMRS/Bahmni for hospitals; OpenEMR for clinics; GNU Health for public health | High | Full finance, local compliance and turnkey upgrades |
| Pharmacy | Specialist small projects plus ERP customisation | Low-medium | Regulated dispensing and supply chain |
| Clothing/fashion | OSPOS/uniCenta for POS; ERPNext foundation | Medium POS / low deep vertical | Merchandising, PLM and omnichannel |
| Restaurants | uniCenta/Floreant/Chromis/Nutrix | Medium POS | Modern KDS, delivery, fiscal and multi-unit operations |
| Hotels | QloApps; Kamra/HAIP emerging | Medium | Mature integrations, audit and revenue management |
| Construction | OpenConstructionERP; generic ERP projects | Emerging | Independently verified adoption and mobile/site depth |
| Agriculture | Ekylibre; farmOS plus ERP | Medium | Localisation, offline/mobile and commodity/cooperative workflows |
| Manufacturing | ERPNext/metasfresh; Carbon for newer MES/QMS direction | Medium-high foundation | APS, quality, validation and shop-floor UX |
| Logistics | Fleetbase plus tracking/WMS components | Medium components | End-to-end freight, customs, EDI and billing |
| Education | OpenEduCat, Gibbon, RosarioSIS, openSIS | Medium-high SIS | Integrated institutional ERP and modern UX |
| Automotive | Small workshop/dealership projects | Low | Industry integrations and maintained ecosystem |
| Real estate | ORPMS and generic applications | Low-medium | Brokerage, lease, maintenance and accounting together |
| Salons/beauty | Open Salon and small apps | Low-emerging | Payments, memberships, mobile and retention |
| Gyms/fitness | GYM One/MotionGym/wger components | Low | Subscription lifecycle and production support |
| Professional services | Kimai/Taiga/Invoice Ninja/Dolibarr/ERPNext | Medium components | Matter/engagement/grant-specific depth |

## 9. Final landscape matrix

Scores: **High** = credible maintained choices; **Medium** = usable choices with material limitations; **Low** = fragments, old projects or weak adoption evidence; **Emerging** = promising but too recent to call mature.

| Industry | Availability | Maturity | Specialisation | Open-source quality | Opportunity |
|---|---|---|---|---|---|
| Hospitals | High | High | Deep | High, project-specific licences | Medium |
| Clinics | High | High | Deep | High | Medium |
| Pharmacies | Medium | Low-medium | Deep in isolated apps | Mixed | Very high |
| Laboratories | Medium | Medium | Deep LIMS | High in selected projects | High |
| Clothing retail | Medium | Medium POS / low vertical | Medium | High POS, weak fashion depth | High |
| General retail | High | Medium-high | Industry-adapted | High | Medium |
| Manufacturing | High | Medium-high | Medium-high | High foundations; Carbon open core | Medium |
| Hotels | Medium | Medium | High | Mixed but improving | High |
| Restaurants | Medium | Medium POS | Medium | Mixed/older | High |
| Construction | Medium | Emerging | High | AGPL option, adoption unproven | Very high |
| Agriculture | Medium | Medium | High | Ekylibre AGPL; farmOS not ERP | High |
| Logistics | Medium | Medium components | High | AGPL platforms plus components | Very high |
| Education | High | Medium-high | High SIS | High, edition boundaries matter | Medium |
| Automotive | Low | Low | Potentially high | Weak/old/fragmented | Very high |
| Real estate | Low-medium | Low-medium | Medium | Fragmented | Very high |
| Salons | Low-emerging | Low | Medium | Open Salon promising | High |
| Gyms | Medium repositories | Low | Medium | Licence and maintenance vary | High |
| Professional services | Medium components | Medium | Low-medium | Good generic tools | High for niche practices |
| Veterinary | Medium | Medium/emerging | Deep | OpenVPMS legacy; OpenVPM modern | High |
| NGO/nonprofit | Medium | Medium | Medium | CRM/ERP components | High |
| Recycling/waste | Low | Low | Potentially high | No mature vertical verified | High |
| Telecom | Low | Low | High | No mature business ERP verified | High |
| Renewable energy | Medium operational tools | Low for ERP | Medium-high | Components, not full ERP | High |
| Printing/publishing/media | Low-medium | Low-medium | Medium | Fragmented | Medium-high |
| Government/religious/funeral | Low | Low | High | No mature broad vertical verified | Medium-high |

## A. Open-source vertical ERP map

The strongest genuinely vertical/open-source families are: **healthcare** (OpenMRS, Bahmni, OpenEMR, GNU Health), **laboratory** (Open-LIMS, Labber, caLIMS, Baobab LIMS), **agriculture** (Ekylibre), **education** (OpenEduCat and SIS products), **hotel/PMS** (QloApps plus emerging Kamra/HAIP), **logistics** (Fleetbase), **manufacturing** (Carbon’s AGPL community core), **veterinary** (OpenVPMS/OpenVPM), and **construction** (OpenConstructionERP, emerging).

Retail and restaurants have many operational POS systems but fewer complete vertical ERPs. Automotive, real estate, pharmacy, professional practice, recycling, telecom and government have the largest shortage of modern, maintained, integrated vertical platforms.

## B. Top open-source option by industry

| Industry | Strongest starting point | Qualification |
|---|---|---|
| Hospital | Bahmni or OpenMRS | Choose Bahmni for integrated hospital workflow; OpenMRS for configurable EMR programmes |
| Clinic | OpenEMR | Strong outpatient practice-management and billing orientation |
| Pharmacy | No clear mature leader | Combine specialist dispensing work with a generic ERP only after regulatory validation |
| Laboratory | Senaite/Bika lineage or Open-LIMS | Select by clinical versus research/quality requirements |
| Retail | OSPOS or uniCenta | POS/inventory, not a deep fashion or omnichannel ERP |
| Manufacturing | ERPNext | Broadest integrated starting point; Carbon for evaluating modern MES/QMS direction |
| Hotel | QloApps | Strong booking/PMS foundation; validate current integrations |
| Restaurant | uniCenta/Floreant/Nutrix | Select by hardware, kitchen and fiscal needs |
| Construction | OpenConstructionERP | Promising deep model; verify production maturity before deployment |
| Agriculture | Ekylibre | Best specialised farm-management direction found |
| Logistics | Fleetbase | Strong operational platform; add WMS/accounting/customs carefully |
| Education | OpenEduCat | Education ERP; audit community/enterprise modules |
| Automotive | No mature leader | Build or integrate a workshop vertical rather than adopt an old dealership project |
| Real estate | No mature leader | Generic ERP + property application is currently safer |
| Salon | Open Salon | Emerging, modern and AGPL; adoption is not yet proven |
| Gym | GYM One or MotionGym | Treat as small-project starting points, not mature enterprise products |
| Veterinary | OpenVPMS/OpenVPM | Legacy ecosystem versus modern early-stage API-first project |
| Professional services | ERPNext/Dolibarr + Kimai/Invoice Ninja | Component strategy is more credible than a single vertical ERP |

## C. Most mature verticals

1. Healthcare EMR/HIS.
2. Education SIS.
3. General manufacturing/distribution foundations.
4. Retail POS.
5. Agriculture FMIS, for farms willing to implement and localise.
6. Laboratory information management, especially research/quality workflows.

## D. Weakest verticals

Automotive dealership/workshop, pharmacy distribution, real-estate brokerage/property operations, modern construction execution, freight forwarding, fashion merchandising, salon/fitness membership, recycling, telecom, funeral services, religious organisations and integrated media/printing.

## E. Ten opportunity areas

1. Pharmacy dispensing + regulated medical distribution.
2. Automotive workshop with VIN, parts, warranty and mobile technician flows.
3. Construction contractor ERP with BOQ, measurement, site diary and claims.
4. Freight-forwarding and last-mile TMS with open EDI/API connectors.
5. Fashion PLM-to-POS with variant, season and assortment models.
6. Hotel PMS with open channel management, fiscal and revenue modules.
7. Multi-tenant property management with owner accounting and maintenance.
8. NGO/cooperative grant, restricted-fund and outcome accounting.
9. Salon/fitness membership, appointment, commission and retention platform.
10. Validated pharma/chemical MES-QMS-ERP for batch, audit and release controls.

## F. Generic versus vertical decision rule

Choose a generic ERP when the organisation mainly needs accounting, procurement, stock, sales, HR and projects, and its specialised process is limited or stable. Choose a vertical system when the specialised workflow creates the operational records, screens, permissions, compliance and integrations that staff use all day. For most mid-sized businesses, the most maintainable architecture is a vertical application for domain execution plus a generic ERP or accounting core for ledgers and shared back office.

## G. Research limitations

This is a landscape study, not a security audit or legal licence opinion. GitHub stars, repository dates and vendor-reported user counts are signals rather than proof of production deployments. Projects with unclear licences, no maintained repository, no meaningful domain model or only a demo were not elevated to strong options. “Current to 2026” means the repositories and official pages available in the research window; fast-moving projects and licence boundaries should be rechecked immediately before procurement.

## Source register

- [OpenMRS official site](https://openmrs.org/)
- [OpenEMR official site](https://www.open-emr.org/)
- [OpenMRS core repository](https://github.com/openmrs/openmrs-core)
- [Frappe ERPNext repository](https://github.com/frappe/erpnext)
- [metasfresh repository](https://github.com/metasfresh/metasfresh)
- [Carbon repository](https://github.com/crbnos/carbon) and [Carbon licensing](https://docs.carbon.ms/docs/platform/licensing)
- [QloApps repository](https://github.com/Qloapps/QloApps)
- [Ekylibre repository](https://github.com/ekylibre/ekylibre)
- [Fleetbase repository](https://github.com/fleetbase/fleetbase)
- [OpenEduCat repository](https://github.com/openeducat/openeducat_erp)
- [OSPOS repository](https://github.com/opensourcepos/opensourcepos)
- [uniCenta official site](https://unicenta.com/)
- [OpenConstructionERP repository](https://github.com/datadrivenconstruction/OpenConstructionERP)
- [OpenVPM official site](https://openvpm.com/)
- [Open Salon repository](https://github.com/clawnify/open-salon)
- [wger documentation](https://wger.readthedocs.io/en/2.0/)
- [caLIMS repository](https://github.com/NCIP/calims)
- [Open-LIMS repository](https://github.com/open-lims/open-lims)
- [Labber repository](https://github.com/libersoft/labber)
- [Baobab LIMS repository](https://github.com/BaobabLims/baobab.lims)
- [OpenVPMS repository](https://github.com/CharltonIT/openvpms)
- [Open-source hospital search evidence](https://github.com/opensource-emr/hospital-management-emr)
- [Fleet-management search evidence](https://github.com/genforge/Fleet-Management-System)
