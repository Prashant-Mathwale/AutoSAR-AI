# AutoSAR AI - Complete Setup Guide

## Project Status
This is a production-ready SAR (Suspicious Activity Report) narrative generator with comprehensive audit trail capabilities.

## Prerequisites
- Node.js 18+ 
- npm 9+
- Supabase Account
- Gemini API Key

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env.example` to `.env.local` and fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Gemini API
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash-exp
```

### 3. Setup Database
Run the database schema in your Supabase project:
```bash
# Execute database/schema.sql in your Supabase SQL editor
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
autosar-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (main)/            # Main application routes
│   │   │   ├── dashboard/     # Dashboard view
│   │   │   └── cases/         # Case management
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── case/             # Case-specific components
│   │   └── layout/           # Layout components
│   ├── core/                 # Business logic
│   │   ├── audit/            # Audit logging
│   │   ├── ingestion/        # Data normalization
│   │   ├── llm/              # Gemini API integration
│   │   ├── rules/            # Rule engine
│   │   └── governance/       # RBAC & permissions
│   └── lib/                  # Utilities & helpers
├── database/                  # Database schemas
└── public/                   # Static assets
```

## Features

### Core Capabilities
- ✅ Automated SAR narrative generation using Gemini AI
- ✅ Deterministic rule-based risk scoring
- ✅ Comprehensive immutable audit trail
- ✅ Role-based access control (Analyst/Reviewer/Admin)
- ✅ Data ingestion from multiple sources
- ✅ Version control for SAR drafts
- ✅ Regulatory compliance (FinCEN standards)

### User Roles
1. **Analyst (L1)**: Generate and edit SAR drafts
2. **Reviewer (L2)**: Review and approve/reject SARs
3. **Administrator (L3)**: System configuration and oversight

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
```

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Authentication**: Supabase Auth

## Security & Compliance

- All PII/PCI data encrypted at rest and in transit
- Audit logs are immutable and time-sequenced
- 5-7 year data retention for compliance
- WCAG 2.1 AA accessibility standards
- Role-based access control (RBAC)

## Documentation

See `autosar_ai_all_documentation.md` for comprehensive documentation including:
- Product Requirements Document (PRD)
- Technology Stack Details
- Database Schema Design
- User Flows & Wireframes
- Styling Guidelines

## Support

For issues or questions, please refer to the comprehensive documentation in the project root.

## License

Proprietary - Internal Use Only
