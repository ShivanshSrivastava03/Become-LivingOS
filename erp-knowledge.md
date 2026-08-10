# ERP Software: Comprehensive Guide

---

## Market Research

### Market Size & Growth

| Source | 2025 Value | Forecast | CAGR |
|--------|-----------|----------|------|
| **Precedence Research** | $59.42B | $116.54B by 2035 | 6.97% |
| **Mordor Intelligence** | $71.62B | $120.96B by 2031 | 9.12% |
| **Grand View Research** | ~$60B+ | ~$120B+ by 2030 | ~7-8% |

**North America** leads with $18.58B (2025). The **U.S.** alone is $15.06B, projected to reach $30.08B by 2035 (CAGR 7.16%).

**Asia-Pacific** is the fastest-growing region at **11.96% CAGR**, driven by China's manufacturing base, India's digitalization push, and Southeast Asian cloud adoption.

### Key Segments

| Segment | Share / Growth | Notes |
|---------|---------------|-------|
| **Solutions** | 58.91% of market (2025) | Dominant; universal need for GL, SCM, HCM |
| **Services** | Growing at 13.89% CAGR | Consulting, implementation, training |
| **Cloud** | 55.73% of market (2025) | Majority of new installs; subscription model |
| **Hybrid** | Growing at 16.12% CAGR | On-prem financials + cloud analytics |
| **On-premises** | 72% of deployment (2024) | Still largest by share, but declining |
| **Large enterprises** | 37.16% share (2025) | Comprehensive suites, multi-entity |
| **SMEs** | Growing at 14.91% CAGR | Fastest buyer segment; rapid-start bundles |
| **Manufacturing** | 24.89% share (2025) | Largest vertical; BOM tracking, MRP |
| **IT & Telecom** | 16.34% CAGR | Fastest-growing vertical |
| **HR module** | 9.1% CAGR | AI-driven workforce planning |

### Key Players

| Company | Position | Notable Data |
|---------|----------|-------------|
| **SAP** | Market leader | 24,000+ RISE cloud customers (2025) |
| **Oracle** | Strong #2 | Fusion Cloud with AI predictive planning |
| **Microsoft** | Major player | Dynamics 365, tight Office 365 integration |
| **IFS** | Challenger | EUR 1B+ recurring revenue (2024), industrial focus |
| **Acumatica** | Mid-market challenger | 25%+ CAGR since 2021, unlimited-user licensing |
| **Odoo** | Open-source leader | Python-based, modular, huge community |
| **NetSuite (Oracle)** | Cloud-native | Strong in mid-market, 3-way matching |
| **ERPNext** | Open-source | Frappe framework, REST API |

### Market Trends (2025-2026)

1. **AI/ML Integration** -- Predictive analytics, automated forecasting, NLP query interfaces. AI-assisted forecasting can reduce safety-stock buffers by up to 30%.
2. **Cloud Migration** -- 55.73% cloud share and growing. Hybrid models (on-prem financials + cloud analytics) advancing at 16.12% CAGR.
3. **Low-Code Customization** -- Empowering non-technical users to build dashboards, integrate e-commerce, and prototype AI use cases without data science support.
4. **Mandatory e-Invoicing & ESG** -- Regulatory pressure is forcing ERP replacements across Europe and Asia-Pacific.
5. **SME Democratization** -- Subscription pricing and pre-configured industry templates are bringing enterprise-grade ERP to startups and small businesses.
6. **Consultant Shortage** -- ~30,000-40,000 person shortfall for SAP alone. This is a barrier to entry but also an opportunity for products that reduce implementation dependency.
7. **Open-Source Rise** -- ERPNext, Odoo, and Dolibarr are gaining traction as cost-effective alternatives, especially in emerging markets and among tech-savvy startups.

### Implementation Challenges

- **High cost**: Mid-size ERP projects often exceed $1M including implementation, training, and data migration. Total cost of ownership frequently doubles when change management is factored in.
- **Long timelines**: Payback periods often exceed 3 years.
- **Consultant dependency**: Skilled ERP consultants are scarce and expensive.
- **Integration complexity**: Connecting ERP to existing tools (CRM, e-commerce, payment processors) is the #1 source of implementation pain.
- **Data migration**: Legacy data is messy; cleansing and migration can consume 30-40% of project effort.

---

## What ERP Actually Is

ERP (Enterprise Resource Planning) is a category of software that manages and integrates the core business processes of an organization. The key word is **integrated** -- an ERP isn't just a collection of modules; it's a single system where data flows between departments without duplication or manual handoff.

The original concept (Gartner coined the term in 1990) was about planning how to use enterprise-wide resources (materials, people, money, time). Modern ERPs have evolved far beyond that, but the core principle remains: **a single source of truth for the entire organization's operational data**.

---

## How ERPs Work -- Architecture Patterns

### 1. Monolithic ERP (Traditional)

This is the SAP/Oracle/NetSuite model. Everything runs in one application, one database, one codebase.

```
+--------------------------------------------------+
|              Monolithic ERP                        |
|                                                    |
|  +----------+  +----------+  +----------+         |
|  | Finance  |  |  HR/Pay  |  | Supply   |         |
|  |          |  |  Roll    |  | Chain    |         |
|  +----+-----+  +----+-----+  +----+-----+         |
|       |              |              |               |
|       +--------------+--------------+               |
|                       |                            |
|               +-------+-------+                    |
|               |   Shared DB    |                   |
|               | (single schema)|                   |
|               +---------------+                    |
+--------------------------------------------------+
```

**Pros**: Strong data consistency, no integration headaches between modules, ACID transactions across departments.
**Cons**: Hard to customize, upgrades are painful, slow to deploy, vendor lock-in is extreme.

### 2. Modular / Composable ERP (Modern)

Separate services for each domain, integrated via APIs or an event bus. This is where the market is heading.

```
+-------------+     +-------------+     +-------------+
|  Finance    |     |   HR/Pay    |     |  Supply     |
|  Service    |<--->|  Service    |<--->|  Chain      |
+------+------+     +------+------+     |  Service    |
       |                    |              +------+------+
       |                    |                     |
       +--------------------+---------------------+
                              |
                       +------+------+
                       |   Event Bus  |
                       | (Kafka /     |
                       |  RabbitMQ)   |
                       +-------------+
```

**Pros**: Easier to customize, can swap modules, better scalability, easier to integrate with external tools.
**Cons**: Eventual consistency challenges, more complex ops, integration testing is harder.

### 3. ERP as a Platform (Your Sweet Spot)

The ERP provides the data model, core transactions, integration layer, and security framework. Your product sits **on top** as a layer that reads/writes through the ERP's APIs.

```
+----------------------------------------------------+
|              Your Product (SaaS)                     |
|          (analytics, AI, niche features)            |
+----------------------------------------------------+
                      |  REST / Webhooks / SDK
+----------------------------------------------------+
|              ERP Platform                            |
|                                                    |
|  +-----------+  +-----------+  +-----------+       |
|  |    GL     |  | Inventory |  |   Sales   |       |
|  |  Module   |  |  Module   |  |  Module   |       |
|  +-----------+  +-----------+  +-----------+       |
|  +-----------+  +-----------+  +-----------+       |
|  | Purchasing|  |   HR/Pay  |  |    CRM    |       |
|  |  Module   |  |  Module   |  |  Module   |       |
|  +-----------+  +-----------+  +-----------+       |
|  +---------------------------------------------+   |
|  |     Integration Layer (APIs, Events)        |   |
|  +---------------------------------------------+   |
+----------------------------------------------------+
```

---

## Core Modules -- What Every ERP Has

| Module | What It Does | Key Data Entities |
|--------|-------------|-------------------|
| **General Ledger (GL)** | Records all financial transactions | Accounts, journal entries, periods |
| **Accounts Payable (AP)** | Tracks money owed to vendors | Invoices, purchase orders, payments |
| **Accounts Receivable (AR)** | Tracks money owed by customers | Invoices, sales orders, receipts |
| **Inventory/Stock** | Manages physical goods | Items, warehouses, stock levels, movements |
| **Purchasing** | Buys goods/services | RFQs, POs, goods receipts, invoices |
| **Sales** | Sells goods/services | Quotes, sales orders, deliveries, invoices |
| **Manufacturing (MRP)** | Plans and tracks production | BOMs, work orders, routing, scheduling |
| **HR/Payroll** | Manages employees and compensation | Employees, positions, payroll runs, benefits |
| **CRM** | Manages customer relationships | Contacts, deals, activities, pipelines |
| **Project Management** | Tracks projects and resources | Projects, tasks, timesheets, budgets |
| **Reporting/Analytics** | Generates financial and operational reports | Dashboards, KPIs, financial statements |

---

## Key Nuances and Challenges

### 1. The Chart of Accounts is the Spine

Everything in financial ERP revolves around the **chart of accounts** -- a hierarchical structure of accounts (Assets, Liabilities, Equity, Revenue, Expenses). Every transaction is a debit/credit pair that must balance. This is the hardest thing to get right because:

- Different countries have different accounting standards (GAAP, IFRS, local standards)
- Multi-currency transactions need real-time exchange rates and gain/loss tracking
- Period closing workflows vary by jurisdiction
- Intercompany transactions (between subsidiaries) need elimination logic

### 2. Inventory Valuation Methods

The same physical item can be valued differently:

- **FIFO** (First In, First Out)
- **LIFO** (Last In, First Out)
- **Weighted Average**
- **Standard Cost** (predefined, adjusted periodically)
- **Actual Cost** (real-time)

Each method produces different COGS and profit numbers. Your ERP must support the method your customers need, and switching methods mid-stream is a data migration nightmare.

### 3. Multi-Company, Multi-Currency, Multi-Language

Real ERPs operate across:
- Multiple legal entities (companies within a group)
- Multiple currencies with daily exchange rates
- Multiple languages for UI and documents
- Multiple fiscal year calendars (some countries use April-March, not Jan-Dec)

Supporting all of this is what separates a toy system from a real ERP.

### 4. The Integration Problem

ERPs don't exist in isolation. They need to talk to external systems:

```
+----------------------------------------------------------+
|                     Your ERP                               |
|                                                            |
|  +-----------+  +-----------+  +-----------+              |
|  |  E-comm   |  | Payments  |  | Shipping  |              |
|  | (Shopify, |  | (Stripe,  |  | (FedEx,   |              |
|  | WooCommerce)| | PayPal)   |  | DHL APIs) |              |
|  +-----+-----+  +-----+-----+  +-----+-----+              |
|        |                |                |                  |
|  +-----+-----+  +-----+-----+  +-----+-----+              |
|  |    CRM    |  |  Banking  |  |  IoT /    |              |
|  |(Salesforce|  |(Bank feeds|  |  SCADA    |              |
|  |  HubSpot) |  |  ACH/Wire)|  | sensors   |              |
|  +-----------+  +-----------+  +-----------+              |
|                                                            |
|  Integration Patterns:                                     |
|  - Pull:  ERP queries external APIs                       |
|  - Push:  ERP sends data out                              |
|  - Events: Webhooks / Kafka subscriptions                 |
|  - Files:  SFTP / CSV / XML / EDI                         |
|  - Middleware: MuleSoft, Zapier, Make                     |
+----------------------------------------------------------+
```

### 5. Workflow and Approval Engines

ERPs aren't just data stores -- they have **business workflows**:

```
Purchase Order Workflow:

+----------+     +-----------+     +----------+     +----------+
|  Create  | --> | Validate  | --> | Approve  | --> |   Post   |
|   PO     |     | (budget   |     | (>$10K   |     |  (GL     |
|          |     |  check)   |     |  manager) |     |  entry)  |
+----------+     +-----------+     +----------+     +----------+
                                                       |
                                                  +----+----+
                                                  | Notify  |
                                                  | Vendor  |
                                                  +---------+
```

Key requirements for a workflow engine:
- Conditional routing (if amount > X, route to Y)
- Parallel approvals (any 2 of 3 approvers)
- Escalation (if not approved in 48 hours, escalate)
- Audit trails (who approved what, when)

### 6. The "Single Transaction" Problem

In a real ERP, one business action triggers updates across multiple modules:

```
Customer places order
    |
    v
+-------------+   +-------------+   +-------------+
|  Sales      |   | Inventory   |   | Accounting  |
|  Module     |-->|  Module     |-->|  Module     |
| Creates     |   | Reserves    |   | Creates AR  |
| Sales Order |   | stock       |   | receivable  |
+------+------+   +------+------+   +------+------+
       |                 |                |
       |                 |                |
       v                 v                v
+-------------+   +-------------+   +-------------+
| Warehouse   |-->|  Shipping   |-->| Accounting  |
| Generates   |   |  Module     |   | Creates     |
| pick list   |   | Creates     |   | revenue     |
+-------------+   | shipment    |   | entry       |
                  +------+------+   +-------------+
                         |
                         v
                  +-------------+
                  | Accounting  |
                  | Creates     |
                  | revenue     |
                  | entry       |
                  +-------------+
```

If any step fails, you need **compensation** (rollback or partial reversal). This is where distributed transactions or saga patterns come in.

---

## Building a Product on Top of an Existing ERP

This is the more practical path for a startup. You integrate with an existing ERP (Odoo, SAP, NetSuite, etc.) and build your value-add layer.

### Integration Approaches

```
Your Product Layer
==================
        |
   +----+----+
   |Integration|
   |  Layer    |
   +----+----+
        |
   +----+----+----+----+----+
   |    |    |    |    |    |
   v    v    v    v    v    v
+----+ +----+ +------+ +----+ +----+
|REST| |Web-| |DB    | |Mid-| |SDK |
|API | |hooks||connec-| |dle-| |(Odoo|
|    | |     ||tor   | |ware| |Python|
+----+ +----+ +------+ |/ESB| |client|
                       +----+ +----+
```

| Approach | How | Best For |
|----------|-----|----------|
| **REST API** | Call ERP's REST endpoints directly | Real-time integrations, simple CRUD |
| **Webhooks** | ERP pushes events to your service | Event-driven reactions (new order, payment received) |
| **Database connector** | Read/write directly to ERP's DB | Bulk operations, reporting (risky -- bypasses business logic) |
| **Middleware/ESB** | Use an integration bus | Complex multi-system workflows |
| **SDK/Client library** | Use ERP's official SDK | When available (Odoo has a great Python client) |

### Key Considerations

1. **API rate limits** -- ERPs throttle API calls. Design for batch operations where possible.
2. **API versioning** -- ERP vendors change APIs. Pin to versions and handle migrations.
3. **Data ownership** -- Who "owns" the data? Your product should be a layer, not a replacement.
4. **Upgrade compatibility** -- When the ERP upgrades, your integration must not break. Avoid depending on internal DB schemas.
5. **Authentication** -- OAuth2, API keys, or session-based. Handle token refresh properly.
6. **Idempotency** -- Your integration must handle duplicate messages gracefully (retries, idempotency keys).

### Popular ERPs to Build On Top Of

| ERP | Best For | API Quality | Notes |
|-----|----------|-------------|-------|
| **Odoo** | Small-mid businesses, open source | Excellent (XML-RPC + JSON-RPC) | Python-friendly, huge ecosystem, modular |
| **NetSuite** | Mid-large businesses | Good (RESTlets, SuiteScript) | Cloud-native, expensive, Oracle-owned |
| **SAP** | Large enterprises | Mixed (OData, RFC, BAPI) | Complex, steep learning curve, dominant in manufacturing |
| **Microsoft Dynamics 365** | Mid-large, Microsoft ecosystem | Good (Web API, CDS) | Tight Office 365 integration |
| **QuickBooks** | Small businesses, accounting | Moderate (QBO API) | Popular for fintech products |
| **ERPNext** | Open-source, mid-size | Good (REST API) | Python/Node, Frappe framework |

**Odoo is probably your best bet** if you want to build on top of an open-source ERP -- it has a clean API, Python ecosystem, and a large community.

---

## Building Your Own ERP

### The Data Model is Everything

Start with the **General Ledger** -- it's the foundation everything else rests on.

```
Account (hierarchical chart of accounts)
  |
  +-- 1000-1999: Assets
  |     +-- 1000: Cash & Equivalents
  |     +-- 1100: Accounts Receivable
  |     +-- 1200: Prepaid Expenses
  |     +-- 1500: Inventory
  |
  +-- 2000-2999: Liabilities
  |     +-- 2000: Accounts Payable
  |     +-- 2100: Accrued Expenses
  |     +-- 2500: Long-term Debt
  |
  +-- 3000-3999: Equity
  |     +-- 3000: Owner's Equity
  |     +-- 3100: Retained Earnings
  |
  +-- 4000-4999: Revenue
  |     +-- 4000: Product Revenue
  |     +-- 4100: Service Revenue
  |
  +-- 5000-5999: Expenses
        +-- 5000: Cost of Goods Sold
        +-- 5100: Salaries & Wages
        +-- 5200: Operating Expenses
```

**Journal Entry** -- the atomic transaction unit:

```
Journal Entry
  |
  +-- id: UUID
  +-- date: Date
  +-- period_id: ForeignKey -> FiscalPeriod
  +-- reference: String (e.g., "SO-00123")
  +-- description: Text
  +-- lines[] (each line is a debit/credit pair)
  |     +-- account_id: ForeignKey -> Account
  |     +-- debit: Decimal (nullable)
  |     +-- credit: Decimal (nullable)
  |     +-- description: Text
  +-- must_balance: Boolean (sum(debits) == sum(credits))
```

Every other module (inventory, sales, purchasing) ultimately creates journal entries. If your GL can't handle this, nothing else works.

### Key Technical Decisions

| Decision | Options | Guidance |
|----------|---------|----------|
| **Database** | PostgreSQL, MySQL, SQL Server | PostgreSQL -- JSONB for flexible metadata, strong ACID |
| **Framework** | Django, Laravel, Spring Boot, custom | Django is popular for ERP (Odoo is built on it) |
| **Multi-tenancy** | Shared DB + tenant_id, separate DB per tenant, schema-per-tenant | Shared DB simplest to start; separate DBs for enterprise clients |
| **Currency** | Store amounts in base + foreign currency columns | Never store only one currency -- you need both for reporting |
| **Audit trail** | Append-only event log | Every change logged with who/when/what -- non-negotiable for financial software |
| **Workflow engine** | State machines (XState, django-fsm), or custom | Start simple, add complexity as needed |
| **Precision** | Decimal / integer (cents) | Never use floating point for money -- rounding errors accumulate |

### The Hardest Parts (Lessons from Existing ERPs)

```
Difficulty Spectrum (easiest -> hardest)
=========================================

1. UI/UX              [****......]  Low difficulty, high impact
2. REST API           [******....]  Straightforward CRUD
3. Reporting          [********..]  Complex queries, well-understood
4. Inventory          [**********]  Needs lot tracking, valuations, movements
5. Multi-currency     [**********]  Exchange rates, gains/losses, revaluation
6. Workflow engine    [**********]  State machines, conditional routing
7. Period closing     [***********]  Lock periods, prevent edits, allow adjustments
8. Intercompany       [***********]  Eliminations, consolidation, FX
9. Audit trail        [***********]  Immutable logs, compliance, traceability
10. Multi-tenant      [************]  Data isolation, per-tenant config
11. GL + double-entry [************]  Every transaction must balance, always
```

1. **Period closing** -- Accounting periods must be locked after closing. You need a workflow that prevents edits to closed periods while allowing adjustments via re-opening (with audit trail).

2. **Rounding and precision** -- Financial calculations need exact decimal arithmetic (not floating point). Use `Decimal` in Python, `BigDecimal` in Java, or store amounts as integers (cents) to avoid floating-point errors.

3. **Concurrent modifications** -- Two users editing the same invoice simultaneously. You need optimistic locking (version numbers) or pessimistic locking (row-level locks).

4. **Reporting across modules** -- A "profitability by customer" report needs data from Sales, Inventory, AP, and AR. This requires a **data warehouse** or a read-optimized reporting layer separate from the transactional OLTP database.

5. **Internationalization** -- Not just translation. Different date formats, number formats (1,000.00 vs 1.000,00), tax structures (VAT, GST, sales tax), and legal entity structures.

6. **Scalability of the GL** -- A company with 10 years of transactions can have millions of journal entries. Your GL must be designed for:
   - Fast period balance queries
   - Efficient year-end closing
   - Archiving old entries without losing them

### Architecture for a Modern ERP

```
+----------------------------------------------------------+
|                     Your ERP                               |
|                                                            |
|  +-------------+  +-------------+  +---------------+     |
|  |   API Layer  |  |  Auth/Perm  |  |   Audit Log   |     |
|  | (REST/Graph) |  |  (RBAC/ABAC)|  |  (immutable)  |     |
|  +------+------+  +------+------+  +------+--------+     |
|         |                 |                   |              |
|  +------+--------+--------+---------+---------+--------+  |
|  |            Application Services                       |  |
|  |                                                      |  |
|  |  +-----------+  +-----------+  +-----------+  +----+ |  |
|  |  |    GL     |  | Inventory |  |   Sales   |  |Purch| |  |
|  |  | Service   |  |  Service  |  |  Service  |  |ase  | |  |
|  |  +-----+-----+  +-----+-----+  +-----+-----+  +--+--+ |  |
|  |        |              |              |            |    |  |
|  |  +-----+--------------+--------------+--------+---+    |  |
|  |  |         Event Bus (Kafka / RabbitMQ)              |  |
|  |  +---------------------------------------------------+  |
|  +--------------------------------------------------------+  |
|                         |                                     |
|            +------------+------------+                      |
|            |   PostgreSQL (OLTP)     |                      |
|            |  (transactional, ACID)  |                      |
|            +-------------------------+                      |
|                                                            |
|  +-------------------------------------------+             |
|  |  Read Model / Reporting DB                |             |
|  |  (materialized views, or ClickHouse /     |             |
|  |   TimescaleDB for analytics)              |             |
|  +-------------------------------------------+             |
+----------------------------------------------------------+
```

**Data flow through the system:**

```
User Action (e.g., "Create Sales Order")
    |
    v
+-------------------------+
|  API Layer (authenticated)|
+------------+------------+
             |
             v
+-------------------------+
|  Sales Service           |
|  - Validate order        |
|  - Check inventory       |
|  - Create journal entry  +----> Event Bus ----> Inventory Service
|  - Reserve stock         |                   (updates stock)
+-------------------------+                   (creates GL entry)
             |
             v
+-------------------------+
|  Audit Log               |
|  (immutable record of    |
|   what happened, by whom)|
+-------------------------+
```

---

## Practical Advice for Your Situation

Given that you want to do **both** (build on top of an ERP AND build an ERP):

```
Recommended Path
================

Phase 1: Learn (months 1-3)
    |
    +--> Build on top of Odoo
         +-- Integrate via Python client + XML-RPC/JSON-RPC
         +-- Build a value-add module (your first product)
         +-- Document gaps: what do customers ask for?
    |
    v

Phase 2: Differentiate (months 4-8)
    |
    +--> Identify your ERP's niche
         +-- What gaps did you find in Odoo?
         +-- What vertical can you serve better?
         +-- What can you do that no one else does?
    |
    v

Phase 3: Build (months 9-18)
    |
    +--> Build your own ERP (focused, niche-first)
         +-- Start with GL + chart of accounts
         +-- Use PostgreSQL + Django (or similar)
         +-- Build the event bus early for modularity
         +-- Focus on a vertical: manufacturing, construction, etc.
    |
    v

Phase 4: Reuse (ongoing)
    |
    +--> Your integration layer from Phase 1 is reusable
         +-- API adapter patterns work with any ERP
         +-- That's a product in itself (integration platform)
         +-- Your Odoo product can become an integration partner
              for your own ERP
```

1. **Start by building on top of Odoo** -- it's open source, Python-based, has excellent APIs, and you'll learn the ERP domain deeply by integrating with it. This also gives you a revenue path (selling add-ons to Odoo users).

2. **As you build on Odoo, document the gaps** -- what do customers ask for that Odoo doesn't provide well? Those gaps are your ERP's differentiators.

3. **When you build your own ERP, focus on a niche** -- don't try to be a general-purpose ERP. Pick a vertical (manufacturing, construction, healthcare, e-commerce) or a specific capability (inventory-heavy, project-heavy, multi-currency) and do it better than generalists.

4. **The integration layer is reusable** -- the API adapter patterns you build for Odoo (or any ERP) can be abstracted into a generic integration framework that works with any ERP. That's a product in itself.

5. **Start with the data model** -- before writing any business logic, design your chart of accounts, your transaction model, and your audit trail. Everything else is built on top of this foundation.

---

## Summary

| Goal | Recommended Path |
|------|-----------------|
| **Product on top of ERP** | Integrate with Odoo via its Python client + XML-RPC/JSON-RPC APIs. Build your value-add layer on top of its data model. |
| **Build your own ERP** | Start with the GL and chart of accounts. Use PostgreSQL + Django (or similar). Focus on a niche vertical. Build the event bus early for modularity. |
| **Both** | Build on Odoo first to learn the domain. Document gaps. Build your ERP to fill those gaps in a more focused way. Reuse integration patterns from your Odoo product. |

### Key Numbers to Remember

| Metric | Value |
|--------|-------|
| Global ERP market (2025) | $59-72B |
| Projected market (2031-2035) | $116-121B |
| Cloud share (2025) | 55.7% |
| SME growth CAGR | 14.9% |
| Asia-Pacific CAGR | 12.0% |
| Manufacturing vertical share | 24.9% |
| SAP RISE customers | 24,000+ |
| Average mid-size ERP project cost | $1M+ |
| ERP consultant shortage | ~30K-40K (SAP alone) |
