# AutoSAR AI

## Project Description
SAR Narrative Generator with Audit Trail
Problem Statement 
SAR Narrative Generator with Audit Trail - Banks must file Suspicious Activity Reports (SARs) whenever they detect activity that may indicate money laundering, fraud, or other financial crime. Writing these SAR narratives is mandatory, high-risk, and labor-intensive.

There is a need for a solution that can reliably generate clear, consistent, regulator-ready SAR narratives while ensuring transparency and auditability of the underlying data and decisioning steps. This solution must reduce manual effort, support analysts in producing defensible reports on scale, and seamlessly integrate with varied data sources—without being tied to any specific case management platform or technology stack.

Challenge
Banks are required to file high-quality Suspicious Activity Reports (SARs) that clearly and accurately document potential financial crime. However, drafting these narratives is a heavily manual task that takes analysts 5–6 hours per report, and large institutions produce thousands annually. With regulatory expectations rising and scrutiny on narrative clarity intensifying, poorly written SARs can lead to remediation demands or enforcement actions. At the same time, compliance teams are understaffed and struggling to keep pace, resulting in operational bottlenecks, and growing backlogs.

Tech stack
🖥️ Frontend (Analyst Dashboard)
Next.js (App Router)
React
Tailwind CSS
shadcn/ui
👉 Used for:
Case list view
Transaction viewer
SAR draft editor
Audit trail panel
Role-based UI
⚙️ Backend
Next.js API Routes (no separate backend needed)
👉 Handles:
Rule engine logic
Prompt building
Gemini API calls
Audit logging
Simple. Clean. Enough.

🗄️ Database
Supabase (PostgreSQL)
Use it for:
Data 
Data Analysis: Take transaction alerts and customer data as input, Customer kYC data, Account and transaction data, data from case management tools.
Generated SAR drafts
Full audit trail log
🔐 Authentication
Supabase Auth
Gemini API 
Role:
Narrative generation only
Converts structured suspicious summary → regulator-ready SAR draft

## Product Requirements Document
PRODUCT REQUIREMENTS DOCUMENT (PRD) - AutoSAR AI: SAR Narrative Generator with Audit Trail

1. INTRODUCTION

1.1. Document Purpose
This Product Requirements Document (PRD) defines the functional, non-functional, and design requirements for the AutoSAR AI system. This system aims to automate and enhance the generation of Suspicious Activity Report (SAR) narratives by leveraging structured data analysis and Generative AI (Gemini API), while maintaining stringent regulatory defensibility through a comprehensive audit trail.

1.2. Goals and Objectives
Primary Goals:
1. Dramatically reduce the manual effort and time (target 70–80% reduction) required for SAR narrative drafting (current baseline: 5–6 hours per report).
2. Ensure SAR narratives are regulator-ready, consistent, and objective by utilizing structured, deterministic inputs for AI generation.
3. Establish a fully transparent, immutable, and reproducible audit trail covering data ingestion, rule evaluation, AI interaction, and human review/edits.

Key Objectives:
* Achieve sub-5 second target latency for initial draft generation.
* Ensure all generated outputs are traceable to specific input data and logic versions.
* Implement robust role-based access controls to segregate duties (generation vs. approval).

1.3. Scope
In Scope:
* End-to-end workflow from raw data ingestion to final SAR draft submission for review.
* Modular data ingestion and standardization layer.
* Deterministic rule engine for suspicion summary generation.
* Integration with the Gemini API for narrative drafting.
* Comprehensive, version-controlled audit logging database (Supabase).
* Analyst and Reviewer dashboards (Next.js/shadcn/ui).

Out of Scope:
* Automated submission of SARs to regulatory bodies (human approval is mandatory).
* Full fine-tuning of the underlying LLM model.
* Replacement of existing core banking or case management systems—integration only.

2. BUSINESS REQUIREMENTS

2.1. Problem Statement
Writing SAR narratives is mandatory, high-risk, and labor-intensive, consuming 5–6 analyst hours per report. Banks need a scalable solution to generate clear, consistent, regulator-ready narratives that ensures the underlying data lineage and decisioning steps are transparent and auditable, mitigating operational bottlenecks and regulatory risk associated with poorly written reports.

2.2. Target Users and Roles (See Section 7 for detailed Permissions)
1. Analyst (L1): Responsible for case investigation and initial SAR draft preparation.
2. Reviewer / Compliance Officer (L2): Responsible for final validation and approval authority.
3. Administrator (L3): Responsible for system configuration, rule management, and overall governance.

3. FUNCTIONAL REQUIREMENTS

3.1. Data Ingestion and Standardization (FR-INGEST)
FR-INGEST-100: The system must ingest data from at least four primary sources: Transaction Alerts, Customer KYC Data, Account & Transaction Data, and Case Management Tool metadata.
FR-INGEST-110: All incoming data must be normalized into the Standardized Internal Data Model ({case_id, alert_metadata, customer_profile, transaction_summary, transaction_list, case_context, risk_indicators}).
FR-INGEST-120: The ingestion layer must enforce schema validation, type checking, and field mapping based on canonical definitions.
FR-INGEST-130: The system must execute data enrichment calculations (e.g., transaction velocity, historical deviation) during normalization.
FR-INGEST-140: An ingestion audit log must be generated for every case object creation, detailing source system, schema version, and applied transformations.

3.2. Rule Engine Logic (FR-RULE)
FR-RULE-100: The Rule Engine must operate deterministically, utilizing both conditional checks (thresholds) and multi-variable risk scoring based on normalized input data.
FR-RULE-110: The output of the Rule Engine must be a structured suspicion summary object, containing triggered rules, calculated metrics, typology tags, and a derived risk score.
FR-RULE-120: The system must support rule versioning and configurable thresholds managed via the Admin interface.
FR-RULE-130: The Rule Engine must classify the case status: False Positive, Medium Risk, or SAR Required.

3.3. SAR Narrative Generation (FR-NARRATIVE)
FR-NARRATIVE-100: The Narrative Generation module must convert the structured suspicion summary (FR-RULE-110) into a controlled prompt for the Gemini API.
FR-NARRATIVE-110: The generated narrative must adhere strictly to the required SAR narrative structure (Subject Identification, Summary, Detailed Analysis, Rationale, Conclusion). (See Section 5.2)
FR-NARRATIVE-120: The system must employ prompt engineering and guardrails to enforce a formal, objective, third-person, fact-based tone, avoiding speculation or accusation.
FR-NARRATIVE-130: Analysts must be able to request narrative refinement by adjusting structured inputs or selecting pre-defined refinement instructions (e.g., "More concise"). This must generate a new, versioned draft.

3.4. Audit Trail and Traceability (FR-AUDIT)
FR-AUDIT-100: The Audit Trail must capture detailed immutable, time-sequenced events for the entire lifecycle of a case.
FR-AUDIT-110: The audit trail must log specifics for Data Ingestion (schema version, transformations), Rule Decisioning (version, triggered rules), and LLM Interaction (exact prompt, model version, raw response).
FR-AUDIT-120: Every manual edit made by an Analyst to the generated narrative must be logged as a "Human Modification Event," including the before/after state (diff).
FR-AUDIT-130: The Audit Trail panel must be readily accessible within the Analyst/Reviewer dashboard, displaying case-specific details to the Analyst and full details to the Reviewer/Admin.
FR-AUDIT-140: The system must prevent retroactive deletion or modification of any audit log entry.

3.5. Analyst Workflow and Human-in-the-Loop (FR-WORKFLOW)
FR-WORKFLOW-100: The system must enforce Segregation of Duties: Analysts generate drafts; Reviewers approve/reject.
FR-WORKFLOW-110: The SAR Draft Editor must allow editing by the Analyst, with all edits creating a new revision version in the audit trail.
FR-WORKFLOW-120: Submission for Review must lock the case draft from further Analyst editing.
FR-WORKFLOW-130: Reviewer action (Approve/Reject) must be explicitly logged. Rejection must require a mandatory textual reason which is logged and returned to the Analyst.
FR-WORKFLOW-140: Upon Reviewer Approval, the final SAR narrative version is archived as immutable.

4. NON-FUNCTIONAL REQUIREMENTS (NFR)

4.1. Performance and Latency (NFR-PERF)
NFR-PERF-100: Initial SAR draft generation (Alert → Draft Ready) must complete in under 10 seconds (Target: 2–5 seconds).
NFR-PERF-110: Rule engine evaluation must complete in less than 1 second.
NFR-PERF-120: The system must support processing volumes equivalent to 500–2,000 SAR drafts per day and handle 50–200 concurrent analyst sessions without performance degradation below NFR-PERF-100.

4.2. Security and Governance (NFR-SEC)
NFR-SEC-100: Authentication must be handled via Supabase Auth.
NFR-SEC-110: Role-Based Access Control (RBAC) must govern UI visibility and action permissions (drafting, editing, approving, viewing audit logs).
NFR-SEC-120: The Gemini API interaction must log the model version used and the full prompt/response payload for governance review.
NFR-SEC-130: The system must implement retry logic for LLM calls (2 attempts with exponential backoff) before falling back to a structured template.

4.3. Data Retention and Security (NFR-DATA)
NFR-DATA-100: Customer KYC and Transaction Data must be retained for a minimum of 5 years post-account closure, encrypted at rest and in transit (Supabase features utilized).
NFR-DATA-110: Generated SAR Narratives and supporting Audit Logs must be retained for 5–7 years, in alignment with AML regulations.
NFR-DATA-120: Audit logs must be maintained in an append-only, immutable structure to ensure integrity.

4.4. LLM Interaction Constraints (NFR-LLM)
NFR-LLM-100: The system will rely exclusively on structured prompt engineering and input summarization; direct model fine-tuning is prohibited to minimize model risk.
NFR-LLM-110: A fallback mechanism must be available to generate a structured SAR draft using only Rule Engine outputs if the Gemini API fails persistently.
NFR-LLM-120: Post-LLM output validation must confirm the presence of mandatory sections and numerical consistency before presenting the draft to the analyst.

5. DESIGN AND USER EXPERIENCE REQUIREMENTS

5.1. Frontend Technology and Aesthetics (UX-DESIGN)
UX-DESIGN-100: The frontend (Next.js, React, Tailwind CSS, shadcn/ui) must result in a professional, clean, enterprise-grade dashboard reflecting financial compliance UX standards.
UX-DESIGN-110: The UI must adhere to WCAG 2.1 AA accessibility standards, including full keyboard navigability and screen reader compatibility.
UX-DESIGN-120: Color schemes should be conservative (blues, greys, whites) and the design must emphasize clear visual hierarchy for complex data presentation.

5.2. SAR Narrative Formatting (UX-SAR)
UX-SAR-100: The final narrative structure must align with regulatory guidance (e.g., FinCEN principles), comprising five mandatory conceptual sections: Identification, Summary, Analysis, Rationale, and Conclusion.
UX-SAR-110: The UI must clearly present stylistic constraints to the analyst, such as enforcing third-person narration and objective language.

5.3. Dashboard Layout (UX-DASH)
UX-DASH-100: The primary Case View must provide a persistent, clear display of the unique Case Identifier.
UX-DASH-110: The dashboard must feature tightly coupled, co-located panels for the SAR Draft Editor and the Audit Trail view.
UX-DASH-120: Critical actions (e.g., Submit for Review, Approve) must require explicit confirmation prompts.

6. TECHNICAL REQUIREMENTS

6.1. Architecture Stack (TECH-STACK)
TECH-STACK-100: Frontend built with Next.js (App Router), React, Tailwind CSS, and shadcn/ui components.
TECH-STACK-110: Backend logic (Rule Engine, Prompt Building, Audit Logging) must reside within Next.js API Routes.
TECH-STACK-120: Supabase (PostgreSQL) will serve as the unified data store for Case Data, Generated Drafts, and the Audit Trail.
TECH-STACK-130: Gemini API will be utilized exclusively for narrative generation.

6.2. Data Model Integration (TECH-DATA)
TECH-DATA-100: The ingestion adapter modules must abstract source system variations to interact solely with the canonical internal data schema.
TECH-DATA-110: Supabase database schema must support temporal queries and version control required for audit logging and SAR history.

6.3. Security Controls (TECH-SEC)
TECH-SEC-100: RBAC logic must be implemented to restrict data views and action invocation based on user role.
TECH-SEC-110: All secrets and API keys must be securely managed (e.g., Next.js environment variables).

7. USER ROLES AND PERMISSIONS (Detailed)

| Role | View Assigned Cases | View Full Transaction Data | Generate Draft | Edit Draft | Approve SAR | View Case Audit Trail | View System-Wide LLM Logs |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Analyst (L1) | Yes | Read-Only | Yes | Yes | No | Case Specific | No |
| Reviewer (L2) | Yes (Jurisdiction) | Yes | No | Conditional (Override) | Yes | Full (Case) | Limited |
| Administrator (L3)| Yes | Yes | No | No | No | Full (System) | Full |

8. DATA RETENTION AND SECURITY

DATA-RET-100: All PII/PCI data must employ field-level masking where not strictly required for the current investigation stage.
DATA-RET-110: Audit logs are considered immutable and must be time-stamped, user-attributed, and retained for 5–7 years.
DATA-RET-120: A process must exist to archive closed case data from active tables to long-term storage within Supabase while maintaining linkage to the immutable audit logs.

## Technology Stack
# Technology Stack: AutoSAR AI (SAR Narrative Generator with Audit Trail)

This document outlines the recommended technology stack, frameworks, databases, and tools employed in the development of the AutoSAR AI project. The stack prioritizes speed of development, scalability for internal enterprise use, robust auditability, and minimal coupling to proprietary external systems.

## 🖥️ Frontend (Analyst Dashboard)

The frontend is built using modern JavaScript technologies to deliver a responsive, enterprise-grade user interface optimized for complex data visualization and regulatory workflows.

*   **Framework:** Next.js (App Router)
    *   **Justification:** Provides server-side rendering (SSR) and static site generation (SSG) capabilities for initial load performance, along with API route capabilities to avoid the need for a separate backend service for many operations. The App Router simplifies data fetching and layout management.
*   **Core Library:** React
    *   **Justification:** Industry standard for building dynamic, component-based user interfaces.
*   **Styling & Component Library:** Tailwind CSS & shadcn/ui
    *   **Justification (Tailwind):** Utility-first CSS framework enabling rapid, consistent styling that aligns with clean, professional enterprise UI aesthetics.
    *   **Justification (shadcn/ui):** Provides high-quality, accessible, copy-pasteable React components built on Radix UI and Tailwind CSS. This accelerates development while adhering to WCAG 2.1 AA standards required for compliance tooling.
*   **Key Use Cases:** Case list view, Transaction viewer, SAR draft editor, Integrated Audit Trail panel, Role-based UI rendering.

## ⚙️ Backend and Core Logic

The system adopts a serverless-friendly approach, utilizing Next.js API Routes to encapsulate all necessary backend processing within the application structure.

*   **Framework:** Next.js API Routes
    *   **Justification:** Simplifies deployment (single service deployment) and maintains code locality. It is sufficient for handling the required orchestration, data transformation, and external API calls (Gemini).
*   **Core Logic Handled:**
    *   Deterministic Rule Engine evaluation (based on structured input).
    *   Complex Prompt Building logic for the LLM.
    *   Orchestration of Gemini API calls, including retry and governance logic.
    *   Audit logging persistence.
    *   Data ingestion and standardization gateway middleware.

## 🗄️ Database & State Management

A single, robust platform is chosen to manage transactional data, generated drafts, and the critical, immutable audit trail.

*   **Database Platform:** Supabase (PostgreSQL)
    *   **Justification:** Offers a managed PostgreSQL database, providing the necessary transactional integrity, JSONB support for flexible case objects, and robust indexing required for rapid audit log retrieval. It supports the required long-term retention policies.
*   **Data Stored:**
    *   Normalized Case Objects (Customer KYC, Transaction Summary, Alert Metadata).
    *   Generated SAR Drafts (versioned).
    *   Full, immutable Audit Trail Log entries.

## 🔐 Authentication and Authorization

*   **Authentication Service:** Supabase Auth
    *   **Justification:** Integrates seamlessly with the database, providing mature, secure authentication mechanisms out-of-the-box. Essential for implementing Role-Based Access Control (RBAC) required for segregation of duties (Analyst vs. Reviewer vs. Admin).

## 🧠 AI Core Engine

The generative AI component is treated as a specialized, controlled service provider.

*   **Service:** Gemini API (Google)
    *   **Role:** Narrative generation only. Converts the structured, deterministic output from the internal Rule Engine into regulator-ready SAR narrative text.
    *   **Governance:** Strict governance applies, including full logging of prompts/responses, prompt version control, and reliance on prompt engineering rather than resource-intensive fine-tuning to maintain model risk control.

---

## Data Ingestion Standardization Mechanism

All incoming data, regardless of source (Transaction Alerts, KYC, Case Management), is normalized into a unified internal schema before processing.

*   **Standardization Strategy:** Modular Adapter Architecture
    *   Adapter modules are created per source system to map source-specific fields (e.g., \`txn_amt\`) to the **Canonical Internal Data Schema** (e.g., \`amount\`).
    *   **Validation:** Schema validation middleware ensures data integrity (mandatory fields, type checking) at the ingestion gateway.
*   **Standardized Internal Case Object Structure:**
    ```json
    {
      case_id,
      alert_metadata: {},
      customer_profile: {},
      transaction_summary: {},
      transaction_list: [],
      case_context: {},
      risk_indicators: []
    }
    ```
*   **Traceability Control:** Every ingestion step logs the source system, schema version, and transformation rules applied to ensure full data lineage and regulatory traceability.

## 📊 Rule Engine Logic

The logic is intentionally deterministic and non-ML based to ensure explainability and auditability.

*   **Implementation Location:** Next.js API Routes.
*   **Complexity:** Balances simple, threshold-based conditional checks (e.g., transaction velocity thresholds) with multi-variable risk scoring (composite indicators using KYC factors, geographical risk, and deviation from profile).
*   **Output:** The engine generates a **Structured Suspicion Summary Object** (including triggered rules, calculated metrics, and typology tags) which serves as the controlled input prompt for the LLM, ensuring narrative safety and consistency.

## 🎼 Audit Trail Granularity and Immutability

The Audit Trail is a primary compliance control, designed for full end-to-end reconstruction.

*   **Granularity:** Capture must include details from every stage:
    1.  **Data Ingestion:** Source ID, Schema Version, Transformation Logs.
    2.  **Rule Engine:** Rule Version, Triggered Rules, Calculated Scores, Final Classification.
    3.  **LLM Interaction:** Prompt Template Version, Exact Input Sent, Model Version, Full LLM Response.
    4.  **Analyst Interaction:** Edits (Diff Log), Reviewer Approval Timestamp, Justification for Overrides.
*   **Mechanism:** Logs are stored in **immutable, append-only tables** within PostgreSQL, ensuring time-sequenced and user-attributed entries linked to the unique case ID.

## 🔒 Data Retention and Security

Retention policies strictly adhere to AML regulatory mandates (5–7 years minimum).

*   **Data Tiers:** Active data resides in primary tables; closed/archived cases are migrated to partitioned, long-term retention tables.
*   **Encryption:** All sensitive data (KYC, Transactions, SARs, Audit Logs) is encrypted at rest (PostgreSQL features) and in transit (HTTPS/TLS).
*   **Security Control:** Role-Based Access Control (RBAC) ensures data minimization by restricting access to sensitive fields based on the user's role (e.g., Analysts cannot view system-wide audit logs).

## 🚀 Non-Functional Requirements (Performance & Scalability)

The system is optimized for compliance workflow efficiency rather than customer-facing speed.

*   **Target SAR Generation Time:** 2–5 seconds (Maximum 10 seconds).
*   **Scalability:** Architecture supports horizontal scaling of stateless API routes and asynchronous queuing for bulk SAR generation during peak periods.
*   **Resilience:** Built-in LLM fallback mechanisms (retry logic, fallback to template-based draft if API fails) ensure high uptime for the core compliance process.

## 👤 User Roles and Permissions (RBAC Enforcement)

Strict segregation of duties is enforced via defined roles linked to database access policies.

| Role | Generation | Editing | Final Approval | Audit Log Access |
| :--- | :--- | :--- | :--- | :--- |
| **Analyst** | Yes (Draft v1) | Yes (Revisions) | No | Case-specific (Read) |
| **Reviewer** | No | Minor Edits Only | Yes | Full Case Audit (Read) |
| **Administrator** | No | No | No | Full System Access |

*   **Key Principle:** No single user can generate and approve the same SAR, enforcing mandatory human oversight of AI-generated content.

## 🎨 Design and UX Preferences

The interface must simulate an enterprise AML control panel, prioritizing clarity, accessibility, and traceability over aesthetics.

*   **Aesthetics:** Minimalistic, professional, low-contrast color palette (blues, greys, whites).
*   **Accessibility Mandate:** Adherence to **WCAG 2.1 AA Compliance** is required for all components, supporting keyboard navigation and screen readers.
*   **Key UX Pattern:** The Audit Trail Panel must be persistently visible alongside the SAR Draft Editor to ensure immediate traceability of every generated or edited text block.

## Project Structure
# Project Structure Document: AutoSAR AI (SAR Narrative Generator with Audit Trail)

This document details the logical and physical file and folder organization for the AutoSAR AI project, built using Next.js (App Router), Supabase, and utilizing the Gemini API for narrative generation.

## 1. Top-Level Directory Structure

The root structure follows standard Next.js conventions, augmented by specific configuration and data structure directories.

```
/autoSAR-ai
├── .next/                     # Next.js build output (ignored by Git)
├── node_modules/              # Project dependencies (ignored by Git)
├── public/                    # Static assets (images, favicons)
├── src/                       # Core application source code
├── .env.local                 # Local environment variables (e.g., API keys) (ignored by Git)
├── .eslintrc.json             # ESLint configuration
├── .gitignore                 # Git exclusion rules
├── next.config.js             # Next.js framework configuration
├── package.json               # Project dependencies and scripts
├── postcss.config.js          # PostCSS configuration (for Tailwind)
├── README.md                  # Project overview and setup instructions
└── tailwind.config.ts         # Tailwind CSS configuration
```

## 2. Core Application Source Code (`src/`)

The `src` directory houses all application logic, separated into UI components, application routing, data handling, and core business logic (Rule Engine, LLM handlers).

```
/src
├── app/                       # Next.js App Router structure
│   ├── (auth)/                # Authentication routes (login, logout)
│   ├── (main)/                # Main authenticated application routes
│   │   ├── cases/             # Case management views
│   │   │   ├── [caseId]/      # Dynamic Case Detail View
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── page.tsx   # Main view: Data, Draft Editor, Audit Trail
│   │   │   │   └── layout.tsx
│   │   │   ├── page.tsx       # Case List View
│   │   │   └── types.ts       # Case & UI specific types
│   │   ├── dashboard/         # Analyst/Reviewer high-level overview
│   │   │   └── page.tsx
│   │   ├── layout.tsx         # Main layout (Sidebar, Navigation)
│   │   └── global.css         # Global styles (includes Tailwind imports)
│   ├── api/                   # Next.js API Routes (Backend Logic)
│   │   ├── auth/[...nextauth]/
│   │   ├── cases/             # Case CRUD and Status updates
│   │   ├── data/              # Data ingestion endpoints (mock/real adapters)
│   │   └── sar-generation/    # LLM orchestration and prompt building
│   │       └── route.ts       # Endpoint for initiating draft generation
│   ├── favicon.ico
│   └── layout.tsx             # Root layout (Provider setup, Auth context)
│
├── components/                # Reusable React Components (UI Layer)
│   ├── ui/                    # shadcn/ui components (or custom wrappers)
│   ├── layout/                # Navigation, Sidebar, Footer components
│   ├── case/                  # Components specific to the Case Detail View
│   │   ├── AuditTrailPanel.tsx
│   │   ├── DraftEditor.tsx
│   │   └── DataViewer.tsx
│   └── common/                # Generic components (Buttons, Cards, Forms)
│
├── lib/                       # Utility functions, hooks, and external services
│   ├── api/                   # Client-side API interaction wrappers
│   ├── db/                    # Supabase Client Initialization & Helpers
│   │   ├── schema.types.ts    # TypeScript definitions derived from Supabase schema
│   │   └── index.ts
│   ├── hooks/                 # Custom React Hooks
│   ├── providers/             # React Context Providers (e.g., AuthContext)
│   ├── utils.ts               # General helper functions (e.g., formatting)
│   └── validation/            # Zod schemas for form and data validation
│
└── core/                      # Business logic & Domain Services (Backend/API Routes utilized)
    ├── audit/                 # Logic for logging and retrieving audit events
    │   └── logger.ts          # Centralized audit logging service
    ├── ingestion/             # Data normalization and standardization layer
    │   ├── adapters/          # Source-specific mapping logic
    │   │   ├── transactionAdapter.ts
    │   │   └── kycAdapter.ts
    │   ├── normalization.ts   # Core mapping and transformation functions
    │   └── index.ts
    ├── llm/                   # Gemini API interaction and Prompt Engineering
    │   ├── prompts/           # Versioned prompt templates
    │   │   ├── v1_base_sar.txt
    │   │   └── v2_refinement.txt
    │   ├── geminiService.ts   # API calling wrapper (retry logic, governance logging)
    │   └── promptBuilder.ts   # Logic to assemble structured input into final prompt
    ├── rules/                 # Rule Engine implementation
    │   ├── engine.ts          # Main execution logic for rule evaluation
    │   ├── rules.config.ts    # Configurable thresholds and risk weights
    │   └── ruleSchema.ts      # Definition of individual rule structures
    └── governance/            # RBAC and security enforcement logic
        └── permissions.ts
```

## 3. Detailed Component Breakdown

### `src/app/api/` (Backend Services)

This directory implements the server-side logic, including data processing, rule execution, and LLM interaction.

| Path | Role | Dependencies |
| :--- | :--- | :--- |
| `route.ts` | **Primary LLM Invocation** | `core/llm/geminiService`, `core/rules/engine` |
| `cases/route.ts` | Case Management API | `lib/db` |
| `data/route.ts` | Data Ingestion Endpoint | `core/ingestion` |
| `sar-generation/route.ts` | Orchestrates prompt building and LLM call | `core/llm/promptBuilder` |

### `src/core/` (Business Logic Domain)

This section encapsulates the core intellectual property of the application—the logic that transforms raw data into defensible SAR narratives.

#### `src/core/ingestion/` (Data Standardization)
*   **`adapters/`**: Contains small modules defining how to map fields from Source A (e.g., Transaction Alerts JSON) to the Canonical Internal Data Model.
*   **`normalization.ts`**: Contains functions that perform cross-source standardization (e.g., ISO 8601 date conversion, currency standardization).

#### `src/core/rules/` (Deterministic Decisioning)
*   **`engine.ts`**: The main execution file that imports logic from specific rule definitions (e.g., velocity checks, deviation scoring) and outputs the structured suspicion summary object.
*   **`rules.config.ts`**: Central configuration for all thresholds and risk weights, enabling Administrator configuration.

#### `src/core/llm/` (Narrative Generation Control)
*   **`prompts/`**: Stores prompt templates as static files, enabling version control (`v1`, `v2`, etc.).
*   **`geminiService.ts`**: Handles all external calls to the Gemini API, including exponential backoff logic, API key management, and governance logging (logging prompt sent and response received).
*   **`promptBuilder.ts`**: Responsible for taking the structured output from the Rule Engine and mapping it into the selected versioned prompt template format.

#### `src/core/audit/`
*   **`logger.ts`**: The single point of entry for writing to the audit log (Supabase). Enforces immutability and captures mandatory fields (timestamp, user, event type, associated case ID).

### `src/components/case/` (Analyst Interface)

These components are tightly integrated within the dynamic case route (`src/app/(main)/cases/[caseId]/page.tsx`).

*   **`DraftEditor.tsx`**: Contains the text area for SAR narrative editing. Manages local revision state and triggers the "Save Revision" action, updating the audit trail.
*   **`AuditTrailPanel.tsx`**: Fetches and displays the chronological audit log for the specific case ID. Includes specialized views for displaying diffs between versions and raw LLM inputs/outputs.
*   **`DataViewer.tsx`**: Displays normalized customer KYC, account context, and transaction summaries, structured for easy review by the analyst.

## 4. Configuration and Environment

| File | Purpose | Security Note |
| :--- | :--- | :--- |
| `next.config.js` | Next.js framework specific settings (e.g., image optimization, middleware configuration). | N/A |
| `tsconfig.json` | TypeScript configuration, ensuring strict typing across backend and frontend. | N/A |
| `.env.local` | Stores sensitive keys (Supabase credentials, Gemini API Key). | Must be excluded from Git (`.gitignore`). |
| `tailwind.config.ts` | Defines color palette (conservative/enterprise focus) and component configuration (`shadcn/ui`). | N/A |

## 5. Data Model Representation (Conceptual)

While the actual database schema resides in Supabase, the structure of key data objects is reflected in TypeScript definitions (`src/lib/db/schema.types.ts` and case-specific types).

**Canonical Internal Case Object (Internal Schema)**:

```typescript
interface InternalCase {
  case_id: string;
  ingestion_timestamp: string;
  
  // Data Sources Normalized
  alert_metadata: { alert_id, rule_triggered, severity_level };
  customer_profile: { customer_id, full_name, risk_rating, expected_profile };
  transaction_summary: { total_value, transaction_count, velocity_score };
  transaction_list: Array<{ transaction_id, amount, counterparty_country }>;
  case_context: { analyst_notes, prior_case_history };
  
  // Rule Engine Output
  risk_indicators: Array<{ metric, value, score }>;
  typology_tags: string[];
  final_risk_score: number;
  
  // SAR Draft State
  sar_draft: {
    current_version: number;
    status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
    latest_narrative: string;
  }
}
```

**Audit Trail Entry Structure (Stored in `audit_logs` table)**:

```typescript
interface AuditLogEntry {
  log_id: string;
  case_id: string;
  timestamp: string;
  user_id: string; // Analyst or Reviewer ID
  event_type: 'INGESTION' | 'RULE_EVALUATION' | 'LLM_GENERATION' | 'MANUAL_EDIT' | 'APPROVAL';
  
  // Governance Payload based on Event Type
  payload: {
    // For LLM_GENERATION:
    prompt_version?: string;
    model_version?: string;
    input_summary?: object; 
    
    // For MANUAL_EDIT:
    diff?: { before: string, after: string };
    
    // For RULE_EVALUATION:
    triggered_rules?: string[];
    final_classification?: string;
  }
}
```

## Database Schema Design
AutoSAR AI: Schema Design Document

1. Introduction

This document outlines the database schema design for the AutoSAR AI system, built upon Supabase (PostgreSQL). The schema is structured to support the ingestion of disparate financial data sources, track the entire SAR generation lifecycle, maintain a comprehensive, immutable audit trail, and store generated narrative drafts securely.

2. Core Entities and Relationships

The schema is centered around the concept of a \"Case,\" which represents a single Suspicious Activity Report investigation. Relationships are established to link case data, system configurations, and audit logs.

3. Table Definitions

3.1. users (Supabase Auth Integration)
Stores user authentication details. Assumed table provided by Supabase Auth.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | uuid | PRIMARY KEY | User ID from Supabase Auth |
| email | text | UNIQUE, NOT NULL | User email address |
| role | text | NOT NULL | Role assigned to the user (Analyst, Reviewer, Admin) |

3.2. roles (RBAC Mapping)
Defines the specific roles and permissions mapping within the application logic, supplementing Supabase Auth roles.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | serial | PRIMARY KEY | Role ID |
| name | text | UNIQUE, NOT NULL | e.g., 'Analyst', 'Reviewer', 'Admin' |
| permissions_json | jsonb | NOT NULL | Structured permissions definition (as per user_roles_and_permissions input) |

3.3. cases
The central entity representing a singular SAR investigation or alert cluster.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| case_id | uuid | PRIMARY KEY | Unique identifier for the investigation case |
| created_at | timestamp with time zone | NOT NULL | Timestamp of case creation/ingestion |
| last_updated_at | timestamp with time zone | NOT NULL | Last modification time |
| status | text | NOT NULL | e.g., 'Alert Received', 'Drafting', 'Pending Review', 'Approved', 'Closed-FP' |
| analyst_id | uuid | REFERENCES users(id) | Assigned analyst (nullable) |
| reviewer_id | uuid | REFERENCES users(id) | Assigned reviewer (nullable) |
| ingestion_version | text | NOT NULL | Version of the ingestion schema used for this case |
| rule_engine_version | text | NOT NULL | Version of the rule engine configuration used |

3.4. case_data_normalized
Stores the standardized, unified view of input data for a case. This maps the complex, varied source data into the internal canonical schema.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| case_id | uuid | PRIMARY KEY, REFERENCES cases(case_id) | Foreign Key to the Case |
| alert_metadata | jsonb | NOT NULL | Normalized fields from Transaction Alerts |
| customer_profile | jsonb | NOT NULL | Normalized KYC and Customer data |
| transaction_summary | jsonb | NOT NULL | Aggregated transaction metrics derived during ingestion |
| transaction_list | jsonb | NOT NULL | Array of normalized, detailed transaction records |
| case_context | jsonb | NULL | Additional context data (e.g., source system metadata) |
| risk_indicators | jsonb | NULL | Derived metrics calculated during enrichment (velocity, etc.) |

3.5. rule_engine_outputs
Captures the structured output generated by the deterministic rule engine, which feeds the LLM prompt builder.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| case_id | uuid | PRIMARY KEY, REFERENCES cases(case_id) | Foreign Key to the Case |
| execution_timestamp | timestamp with time zone | NOT NULL | When the rule engine ran |
| rule_engine_config_id | text | NOT NULL | Identifier for the specific rule set version used |
| triggered_rules | jsonb | NOT NULL | List of rules that fired |
| calculated_metrics | jsonb | NOT NULL | Velocity scores, dispersion counts, etc. |
| typology_tags | text[] | NULL | Assigned AML typology classifications |
| aggregated_risk_score | numeric(5,2) | NOT NULL | Final composite score |
| suspicion_summary_json | jsonb | NOT NULL | The structured input summary object passed to the LLM (Rationale statements) |
| final_classification | text | NOT NULL | 'False Positive', 'Medium Risk', 'SAR Required' |

3.6. sar_drafts
Stores the various versions of the generated and edited SAR narrative text.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| draft_id | bigserial | PRIMARY KEY | Unique draft version identifier |
| case_id | uuid | NOT NULL, REFERENCES cases(case_id) | Associated Case |
| version_number | integer | NOT NULL | Sequential version count (1, 2, 3...) |
| created_at | timestamp with time zone | NOT NULL | Timestamp of version creation |
| narrative_text | text | NOT NULL | The full SAR narrative content for this version |
| source_event | text | NOT NULL | Describes how this version was created ('LLM_Initial', 'Analyst_Edit', 'Reviewer_Override', 'LLM_Regenerate') |
| created_by_user_id | uuid | REFERENCES users(id) | User responsible for this version generation/edit |
| is_final_submission | boolean | DEFAULT FALSE | True if this is the version submitted for final approval |
| prompt_log_id | bigint | REFERENCES llm_interaction_logs(log_id) | Link to the specific LLM interaction (if applicable) |
| UNIQUE (case_id, version_number) | | Enforces version uniqueness per case |

3.7. llm_interaction_logs
Detailed, immutable logging of every interaction with the Gemini API, critical for auditability.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| log_id | bigserial | PRIMARY KEY | Unique interaction log ID |
| case_id | uuid | NOT NULL, REFERENCES cases(case_id) | Associated Case |
| timestamp | timestamp with time zone | NOT NULL | Time of API call |
| model_version | text | NOT NULL | Gemini model used (e.g., 'gemini-2.5-pro') |
| prompt_template_version | text | NOT NULL | Version of the prompt template used |
| structured_input_json | jsonb | NOT NULL | The rule engine output passed to the prompt builder |
| rendered_prompt | text | NOT NULL | The final, complete prompt sent to Gemini |
| raw_response | jsonb | NOT NULL | Full response object from the Gemini API |
| post_processing_notes | text | NULL | Notes on validation or cleanup applied post-LLM |

3.8. audit_trail_logs
The comprehensive, append-only log capturing every action across the system lifecycle (Ingestion, Rule Engine, Analyst Interaction, Approval).

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| audit_log_id | bigserial | PRIMARY KEY | Unique immutable log entry ID |
| timestamp | timestamp with time zone | NOT NULL | Time of event |
| user_id | uuid | REFERENCES users(id) | User who performed the action (System identifier if automated) |
| case_id | uuid | NOT NULL, REFERENCES cases(case_id) | Case affected |
| event_type | text | NOT NULL | e.g., 'INGESTION_COMPLETE', 'RULE_DECISION', 'DRAFT_EDIT', 'SAR_APPROVED', 'LLM_CALL' |
| description | text | NOT NULL | Concise summary of the action |
| detail_payload | jsonb | NULL | Detailed context (e.g., rule version used, threshold value, edit diff) |
| is_immutable | boolean | DEFAULT TRUE | Control flag for the append-only nature of the log |

4. Relationships Summary (Conceptual Mapping)

1.  **One-to-One/One-to-Zero-or-One:**
    *   `cases` to `case_data_normalized` (1:1 based on `case_id`)
    *   `cases` to `rule_engine_outputs` (1:1 based on `case_id`)

2.  **One-to-Many:**
    *   `cases` to `sar_drafts` (1:N, tracking versions)
    *   `cases` to `llm_interaction_logs` (1:N, tracking multiple LLM calls if regeneration occurs)
    *   `cases` to `audit_trail_logs` (1:N, tracking all actions against the case)
    *   `users` to `cases` (via `analyst_id` and `reviewer_id`)

3.  **Foreign Keys:**
    *   All tables reference `users` where appropriate for accountability (`created_by_user_id`, `analyst_id`, `reviewer_id`).
    *   Audit logs and draft tables explicitly link back to `cases` to maintain relationship integrity.

5. Data Normalization and Standardization Tables

To support the modular adapter structure and versioning of transformation logic, configuration tables are necessary, though they do not store case-specific data directly.

5.1. ingestion_schema_versions
Tracks versions of the canonical internal data schema.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| version_id | text | PRIMARY KEY | Schema version tag (e.g., 'v1.0.1') |
| definition_json_schema | jsonb | NOT NULL | The JSON Schema definition for validation |
| active | boolean | NOT NULL | Is this the currently enforced schema? |
| applied_at | timestamp with time zone | NOT NULL | When this version became effective |

5.2. prompt_template_versions
Tracks versions of the structured prompts used to communicate with the LLM.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| version_id | text | PRIMARY KEY | Prompt template version tag (e.g., 'SAR_V3_Concise') |
| template_structure | text | NOT NULL | The underlying structural template logic |
| guardrails_applied | jsonb | NULL | Constraints enforced on the LLM output |
| created_by_admin_id | uuid | REFERENCES users(id) | Admin who versioned the prompt |
| is_active | boolean | NOT NULL | Current active version for generation |

6. Security and Data Integrity Controls Embedded in Schema

*   **Immutability:** `audit_trail_logs` and `llm_interaction_logs` are designed as append-only tables, ensuring historical record integrity. Drafts (`sar_drafts`) retain previous versions rather than being overwritten.
*   **Referential Integrity:** Extensive use of Foreign Keys ensures that an audit log or draft cannot exist without a valid parent `case`.
*   **Role Enforcement:** The `roles` table and the application logic leveraging `users.role` enforce the segregation of duties (Analyst cannot Approve; Reviewer has access to sensitive LLM logs).
*   **Encryption:** All data persistence relies on Supabase's underlying PostgreSQL encryption at rest, augmented by strict RLS policies for data in transit and application-level handling of highly sensitive PII fields (though PII is stored normalized in `case_data_normalized`, application encryption should be applied if PII masking is not sufficient).

## User Flow
USERFLOW DOCUMENTATION: AutoSAR AI - SAR Narrative Generator with Audit Trail

1. INTRODUCTION AND SCOPE
This document details the user flows, interaction patterns, and wireframe descriptions for the AutoSAR AI platform. The system is designed to support AML Analysts in generating regulator-ready Suspicious Activity Report (SAR) narratives efficiently while maintaining a comprehensive, immutable audit trail for defensibility.

The primary user of this system is the AML Analyst, with secondary roles including Reviewers (Compliance Officers) and Administrators.

2. CORE USER FLOWS

2.1. Flow 1: New Alert Triage and Case Initialization

Actors: AML Analyst (L1)
Goal: Process an incoming transaction alert and determine if it requires SAR investigation.

| Step | Action/Interaction | System Response/Screen Description | Audit Trail Impact |
|---|---|---|---|
| 1.0 | Analyst logs into the Dashboard (Supabase Auth). | Dashboard loads showing Case List View. Initial view filtered by 'Unassigned' or 'Assigned to Me'. UI enforces Role-Based Access Control (RBAC). | Authentication logged. |
| 1.1 | Analyst views the Case List (Table component using shadcn/ui). | Displays key metrics: Case ID, Customer Name Snippet, Alert Date, Current Status, Rule Score. | N/A |
| 1.2 | Analyst selects a new, unassigned alert/case from the list. | System assigns the case to the Analyst (if applicable) and transitions to the Case Detail View. | Case assignment logged. |
| 1.3 | System triggers Data Ingestion and Standardization. | Frontend updates: Data Ingestion Status panel shows progress bar and schema version used. | Ingestion Audit Log created (Data lineage, transformation rules, source IDs). |
| 1.4 | System executes the Rule Engine Logic. | Frontend updates: Rule Output Panel displays triggered rules, calculated metrics, risk score, and typology tags. | Rule Engine Decision Audit Log created (Version, thresholds applied, final classification). |
| 1.5 | Analyst reviews classification (e.g., High Risk - SAR Required). | Analyst confirms the Rule Engine classification or marks it as False Positive (requires mandatory justification logged). | Decision confirmation/override logged. |
| 1.6 | If SAR Required, Analyst proceeds to drafting phase. | Analyst clicks \”Generate SAR Draft\”. | Workflow transition logged. |

Wireframe Description (Conceptual): Case List View -> Case Detail View (Split layout: Left Panel for Data Inputs/Rules, Right Panel for SAR Editor/Audit Trail).

2.2. Flow 2: Automated SAR Narrative Generation (V1 Draft)

Actors: AML Analyst (L1)
Goal: Generate the first version of the SAR narrative using the Gemini LLM based on structured case data.

| Step | Action/Interaction | System Response/Screen Description | Audit Trail Impact |
|---|---|---|---|
| 2.1 | Analyst initiates generation (Step 1.6 completion). | System executes Prompt Building and Gemini API Call in the background. Target latency: 2–5 seconds. | N/A |
| 2.2 | System receives and validates LLM output. | Output passes mandatory section checks and numerical consistency validation. If validation fails, a fallback template is used, and an alert is raised. | LLM Interaction Audit Log created (Prompt version, structured input, model version, raw response). |
| 2.3 | System stores Draft V1 and displays it. | SAR Draft Editor panel populates with the regulator-ready narrative. Audit Trail Panel is updated to show generation details. | Draft Version 1 stored; LLM response logged. |
| 2.4 | Analyst reviews the initial draft against mandatory sections (Subject Identification, Summary, Details, Rationale, Context, Conclusion). | Analyst uses the unified interface (WCAG AA compliant, clean enterprise aesthetics) to read the output. | N/A |

Wireframe Description (Conceptual): SAR Draft Editor component showing narrative text with section headers clearly demarcated. Audit Trail Panel shows "LLM Generation Complete" event.

2.3. Flow 3: Iterative Refinement (LLM Regeneration or Manual Edit)

Actors: AML Analyst (L1)
Goal: Improve the SAR draft iteratively using human-in-the-loop controls.

| Step | Action/Interaction | System Response/Screen Description | Audit Trail Impact |
|---|---|---|---|
| 3.1 (Mode 1) | Analyst chooses to regenerate the draft. | Analyst may modify the structured input summary fields (e.g., changing the time window) or select a refinement instruction (e.g., \”Make tone more objective\”). | Changes to structured input trigger new prompt generation logic. |
| 3.2 (Mode 1) | Analyst clicks \”Regenerate Draft\”. | LLM generates Draft V2. System validates V2. | New LLM Interaction Log created for V2. Version increment (V1 \u2192 V2) recorded. |
| 3.3 (Mode 2) | Analyst directly edits the text in the Draft Editor. | Analyst modifies sentences or adds clarification. Clicks \”Save Revision\”. | System captures a diff (Before/After) between the current version and the previous save state. |
| 3.4 (Mode 2) | System prompts for mandatory justification for significant manual edits or overrides. | A mandatory input modal appears if rule-defined thresholds for editing are met. | "Human Modification Event" logged, including Analyst ID, timestamp, and justification/reason. |
| 3.5 | Analyst repeats steps 3.1–3.4 until satisfied. | Draft version number increments (V3, V4, etc.). All prior versions are preserved and viewable in the Audit Trail Panel. | All iterative changes are immutable and logged chronologically. |

Interaction Pattern: Non-destructive editing is enforced. Manual edits never overwrite previous LLM outputs; they create new, attributed versions.

2.4. Flow 4: Review and Approval (Submission to Compliance)

Actors: AML Analyst (L1), Reviewer/Compliance Officer (L2)
Goal: Finalize the SAR narrative and submit it for regulatory filing readiness.

| Step | Action/Interaction | System Response/Screen Description | Audit Trail Impact |
|---|---|---|---|
| 4.1 (Analyst) | Analyst finalizes the draft and clicks \”Submit for Review\”. | Case status changes to \”Pending Review\”. The SAR Draft Editor and associated data inputs are locked for the Analyst. | Submission timestamp and Analyst ID logged. Case state change recorded. |
| 4.2 (Reviewer) | Reviewer accesses the case via their dashboard queue. | Reviewer sees the final draft (Version N), the originating Rule Engine output, and the complete Audit Trail. | Reviewer gains full read access to all underlying data and logs (per L2 permissions). |
| 4.3 (Reviewer) | Reviewer compares the final draft against the Audit Trail logs and source data. | Reviewer uses version comparison views (if Analyst made edits) and checks LLM Prompt Logs for transparency. | N/A |
| 4.4 (Reviewer) | Reviewer decides to Approve or Reject. | If Approved: Clicks \”Approve SAR\”. If Rejected: Enters mandatory rejection reason and returns to Analyst. | Final Approval event logged, permanently locking the SAR narrative snapshot. Rejection event logged with reason. |
| 4.5 (System) | Upon approval, the system finalizes the record. | Case status changes to \”Approved/Filed\”. The final narrative, inputs, and full audit trail are archived according to retention policies (5-7 years). | Final immutable SAR record created and retention timers initiated. |

3. INTERACTION PATTERNS AND UI ELEMENTS

3.1. Data Transparency and Audit Trail Panel
The Audit Trail Panel is a persistent element in the Case Detail View.
Interaction: Details are displayed in expandable/collapsible panels (using shadcn/ui Accordion/Dialogs) to manage information density while ensuring WCAG accessibility.
Traceability: Clicking on any audit event (e.g., a specific rule trigger) highlights the corresponding data point in the input panels (e.g., highlighting the velocity metric calculation).

3.2. Role-Based Access Control (RBAC) Rendering
UI elements conditionally render based on the authenticated role:
\u2022 Analyst: \”Generate Draft\”, \”Submit for Review\” buttons visible. \”Approve\” button hidden.
\u2022 Reviewer: \”Approve\”, \”Reject\” buttons visible. \”Generate Draft\” button hidden or disabled.
\u2022 Administrator: Access to system settings menus for Rule Threshold configuration and Prompt Version Management.

3.3. Gemini API Fallback Handling
If the LLM call times out (exceeds 10 seconds) or fails:
\u2022 Notification: A clear banner alerts the Analyst: \”LLM Generation Failed. Falling back to structured template.\”
\u2022 Draft Content: The SAR Editor is populated with a standardized, template-based narrative derived directly from the Rule Engine summary, ensuring no interruption to the process, albeit with potentially lower narrative fluency than the full LLM output.
\u2022 Audit: Fallback reason is explicitly recorded in the LLM Interaction Log.

3.4. Data Normalization Visualization
In the KYC/Transaction Summary panel:
\u2022 Field Mapping Indicator: Next to key data points (e.g., customer risk rating), a small icon allows the Analyst to hover and see the source field name (e.g., \”Cust\_Risk\_Lvl from Core Banking\”). This supports traceability of the standardized internal schema.

4. GOVERNANCE CHECKPOINTS

4.1. Explainability Gate
After Rule Engine evaluation (Step 1.4), the structured summary (e.g., \”Activity inconsistent with declared business profile\”) must be clear before prompting the LLM. This ensures the LLM is building on explainable foundations, satisfying regulatory requirements for deterministic input.

4.2. Human Override/Edit Gate
Any manual edit to the LLM-generated narrative that significantly alters the core suspicion statement must require mandatory justification and logging, enforced via UI confirmation prompts before saving the revision.

4.3. Separation of Duties Gate
The system enforces that the User ID that submits the case for review cannot be the User ID that ultimately approves the filing, verified against Supabase Auth data during the approval step.

## Styling Guidelines
AutoSAR AI Styling Guidelines Document

1. Introduction
1.1 Purpose
This document defines the styling guidelines, visual language, color palette, typography, and UI/UX principles for the AutoSAR AI platform. The objective is to ensure a clean, professional, and highly usable interface that aligns with the requirements of a financial compliance and regulatory reporting tool.

1.2 Scope
These guidelines apply to all components developed using Next.js, React, Tailwind CSS, and shadcn/ui for the Analyst Dashboard, SAR Draft Editor, and Audit Trail Panel.

1.3 Design Philosophy: Clarity, Traceability, Professionalism
The primary design goal is to simulate an internal enterprise compliance tool. Aesthetics must prioritize clarity, functional hierarchy, and regulatory professionalism over visual novelty. The interface must explicitly support traceability and auditability.

2. Color Palette
The color scheme is conservative, utilizing neutrals to foreground critical data and action states required in a regulated environment.

2.1 Primary Colors (Neutrals)
Background: #FFFFFF (White) - For primary content areas.
Surface: #F8FAFC (Slate-50 / Gray-50) - Used for card backgrounds, panels, and subtle separation.
Text Primary: #0F172A (Slate-900 / Gray-900) - High contrast for main body text and labels.
Text Secondary: #64748B (Slate-500 / Gray-500) - Used for hints, metadata, and less critical information.

2.2 Action & Status Colors
These colors are used sparingly to denote system states, hierarchy, and user interaction points, ensuring sufficient contrast (WCAG AA compliance).

Success (Approved/Confirmed): #10B981 (Emerald-500)
Warning (Pending Review/Caution): #F59E0B (Amber-500)
Error (Validation Failure/Rejection): #EF4444 (Red-500)
Informational (Status Updates/Audit): #3B82F6 (Blue-500)

2.3 Interaction Colors (Interactive Elements)
Primary Accent (Buttons, Links): #1D4ED8 (Blue-700 or Blue-800) - Used for primary call-to-action elements.
Focus State: A visible border (e.g., 2px solid #3B82F6) must accompany all interactive elements (buttons, inputs, focusable elements) to ensure keyboard navigability and accessibility.

3. Typography
Typography must ensure maximum readability for dense, structured data review.

3.1 Font Family
System Default: Use the default sans-serif stack provided by Tailwind CSS (e.g., system-ui, Inter, Helvetica Neue). Consistency across the interface is key.

3.2 Sizing Scale (Tailwind Defaults Applied Conservatively)
H1 (Page Title): text-3xl (Used sparingly for main dashboard title)
H2 (Panel Header): text-xl, font-semibold (e.g., SAR Draft Editor, Audit Trail Panel titles)
Body Text (Paragraphs, Descriptions): text-base (16px)
Labels & Metadata: text-sm (14px)
Micro Text (Audit Timestamps, Tooltips): text-xs (12px)

3.3 Weights
Use standard weights (Regular 400, Medium 500, Semi-Bold 600) to establish hierarchy. Bold text should only be used to highlight specific data points within the narrative or status indicators.

4. Layout and Spacing
The layout must strictly adhere to structured data presentation, utilizing clear grid structures and consistent padding/margin derived from the 8-point spacing scale inherent in Tailwind CSS.

4.1 Structure
The main Analyst Dashboard utilizes a multi-panel layout to present interrelated information simultaneously:
1. Case/Alert List (Left Navigation/Sidebar if needed)
2. Main Workspace (Case Data Viewer, SAR Editor)
3. Audit Trail Panel (Persistent sidebar, often collapsible or expandable)

4.2 Spacing
Use consistent spacing values (p-2, m-4, gap-4) to delineate sections clearly. Avoid excessive whitespace that diminishes data density, but ensure enough separation to prevent cognitive overload when reading complex transaction lists or audit logs.

5. UI/UX Principles for Compliance Workflows

5.1 Accessibility (WCAG 2.1 AA Mandate)
All UI elements must adhere to WCAG 2.1 AA standards. This includes:
Keyboard Navigability: Full operation via keyboard (Tab, Enter, Space).
Screen Reader Support: Correct use of semantic HTML and ARIA attributes, especially for complex controls like expandable audit sections and data tables.
Contrast Ratios: Text contrast against backgrounds must meet 4.5:1 minimum.
Focus Visibility: Clear, distinguishable focus rings must be present on all interactive components.

5.2 Data Visualization and Tables
Data density is high; tables must be optimized for review and comparison.
Transaction Lists and Audit Logs must use structured tables (via shadcn/ui Table components).
Highlighting: Critical data (e.g., high-risk amounts, specific dates referenced in the narrative) should be visually highlighted using the secondary text color or subtle background shading if part of a selected row.

5.3 Role-Based Visualization (RBAC Enforcement)
UI rendering must be conditional based on the authenticated user role:
Analyst: SAR Draft Editor is fully editable. Audit Trail is view-only, showing only case-specific context. LLM Prompt Logs are hidden.
Reviewer: SAR Draft Editor shows a "Diff View" comparing analyst edits vs. original LLM output. Full Audit Trail access granted.
Administrator: Access to configuration panels (Rule Thresholds, Prompt Versioning).

5.4 Audit Trail Prominence
The Audit Trail Panel is a core compliance feature, not secondary metadata. It must be:
Prominently visible, often docked to the side or easily toggled.
Interactive: Using expandable/collapsible sections (accordions) to manage the high volume of logged data (Ingestion, Rule Engine, LLM Interaction, Human Edits).
Change Tracking: Manual edits must show a clear "redline" diff view against the previous version (LLM output or prior analyst edit).

5.5 Narrative Editor Controls (SAR Draft)
The SAR Draft Editor must enforce non-destructive editing and version control:
Immutable Sections: Certain system-generated statements (e.g., legal disclaimers, primary source declarations) should be visually locked or read-only if mandated.
Versioning: Every Save/Submit action must increment a clear version number (v1.0, v1.1, v2.0).
LLM Regeneration: If the analyst triggers a regeneration, the previous version must be retained, and the new output clearly marked as the latest iteration.

5.6 State Management Indicators
Clear, persistent visual cues are required for case status:
Case List: Use clear status badges (e.g., Green: Approved, Amber: Pending Review, Red: Rejected).
Input Forms: Mandatory fields in the structured summary input must show validation errors immediately upon focus loss (blur).

6. Component Implementation Notes (shadcn/ui & Tailwind)
The implementation should leverage shadcn/ui primitives, ensuring styling overrides maintain the established color palette and enterprise aesthetic.

6.1 Buttons
Primary CTA (Submit for Review, Approve): Blue-700 background, white text.
Secondary Actions (Regenerate, Cancel): Light grey background (Slate-200), Slate-800 text.
Destructive Actions (e.g., Override FP): Red-600 background.

6.2 Input Fields
Standard Tailwind input styles should be slightly muted (light border, subtle hover state) unless an error is present, where the border color shifts to Red-500.

6.3 Modals and Dialogs
Used primarily for confirmation of high-risk actions (e.g., Final Approval, Rejection with Reason) or displaying long audit trail context snippets. Must maintain focus trapping and strong keyboard accessibility.

6.4 LLM Output Presentation
The generated SAR narrative text within the editor should use standard justified or left-aligned body text, maintaining the formal, objective tone required for regulatory reporting. Use monospace font sparingly, perhaps only for displaying raw system logs in the Audit Panel, not the final narrative.
