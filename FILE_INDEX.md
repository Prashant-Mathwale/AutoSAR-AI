# 📋 Component & File Index

## Quick Reference for All Files in the Project

### 🏠 Root Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.ts` | Tailwind CSS settings |
| `next.config.js` | Next.js framework config |
| `postcss.config.js` | PostCSS configuration |
| `.eslintrc.json` | ESLint rules |
| `.env.local` | Your secret keys (git-ignored) |
| `.env.example` | Template for environment variables |
| `.gitignore` | Files to exclude from git |

### 📄 Documentation Files

| File | Description |
|------|-------------|
| `README.md` | Main project README |
| `QUICK_START.md` | 5-minute getting started guide |
| `SETUP_COMPLETE.md` | Detailed setup instructions |
| `PROJECT_SUMMARY.md` | Complete feature overview |
| `autosar_ai_all_documentation.md` | Full technical specifications |

### 🗄️ Database

| File | Purpose |
|------|---------|
| `database/schema.sql` | Complete PostgreSQL schema |

### 🎨 Application Pages

| File | Route | Description |
|------|-------|-------------|
| `src/app/page.tsx` | `/` | Redirects to dashboard |
| `src/app/layout.tsx` | All pages | Root layout with fonts |
| `src/app/globals.css` | - | Global Tailwind styles |
| `src/app/(main)/dashboard/page.tsx` | `/dashboard` | Main dashboard with case list |
| `src/app/(main)/cases/[caseId]/page.tsx` | `/cases/[id]` | Case detail page (3 tabs) |

### 🔌 API Routes

| File | Endpoint | Purpose |
|------|----------|---------|
| `src/app/api/sar-generation/route.ts` | `/api/sar-generation` | Generate SAR narratives |

### 🧩 UI Components

| File | Component | Usage |
|------|-----------|-------|
| `src/components/ui/button.tsx` | `<Button>` | Buttons with variants |

### 🧠 Core Business Logic

| File | Purpose |
|------|---------|
| `src/core/rules/engine.ts` | Risk scoring & rule evaluation |
| `src/core/rules/rules.config.ts` | Thresholds, weights, jurisdictions |
| `src/core/llm/geminiService.ts` | Gemini AI integration |

### 🛠️ Utilities & Libraries

| File | Purpose |
|------|---------|
| `src/lib/utils.ts` | Helper functions (cn, formatDate, etc.) |
| `src/lib/db/index.ts` | Supabase client initialization |
| `src/lib/db/schema.types.ts` | TypeScript types for database |

### 📦 Scripts

| File | Purpose |
|------|---------|
| `setup.js` | Directory structure setup script |

---

## 🎯 Key Files to Understand First

If you're new to the codebase, start with these in order:

1. **`QUICK_START.md`** - Get it running
2. **`src/app/(main)/dashboard/page.tsx`** - See the main UI
3. **`src/app/(main)/cases/[caseId]/page.tsx`** - Understand case workflow
4. **`src/core/rules/engine.ts`** - Learn the risk scoring
5. **`src/core/llm/geminiService.ts`** - See AI integration
6. **`src/app/api/sar-generation/route.ts`** - API endpoint logic

---

## 📂 Directory Structure Map

```
HOH/
│
├── 📄 Configuration & Docs (9 files)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.local
│   └── *.md (documentation)
│
├── 🗄️ database/
│   └── schema.sql
│
└── 📁 src/
    │
    ├── 🎨 app/                      # Pages & Routes
    │   ├── layout.tsx               # Root layout
    │   ├── page.tsx                 # Home page
    │   ├── globals.css              # Styles
    │   │
    │   ├── (main)/                  # Main app routes
    │   │   ├── dashboard/
    │   │   │   └── page.tsx         # Dashboard UI
    │   │   └── cases/
    │   │       └── [caseId]/
    │   │           └── page.tsx     # Case details
    │   │
    │   └── api/                     # API endpoints
    │       └── sar-generation/
    │           └── route.ts         # SAR API
    │
    ├── 🧩 components/               # React components
    │   └── ui/
    │       └── button.tsx           # Button component
    │
    ├── 🧠 core/                     # Business logic
    │   ├── llm/
    │   │   └── geminiService.ts     # AI service
    │   └── rules/
    │       ├── engine.ts            # Risk engine
    │       └── rules.config.ts      # Configuration
    │
    └── 🛠️ lib/                      # Utilities
        ├── db/
        │   ├── index.ts             # DB client
        │   └── schema.types.ts      # Types
        └── utils.ts                 # Helpers
```

---

## 🔍 Finding What You Need

### Want to modify...

**The dashboard UI?**
→ `src/app/(main)/dashboard/page.tsx`

**Risk scoring rules?**
→ `src/core/rules/rules.config.ts`

**SAR narrative prompt?**
→ `src/core/llm/geminiService.ts`

**Case detail page?**
→ `src/app/(main)/cases/[caseId]/page.tsx`

**API endpoint?**
→ `src/app/api/sar-generation/route.ts`

**Database schema?**
→ `database/schema.sql`

**Styling/colors?**
→ `src/app/globals.css` + `tailwind.config.ts`

---

## 📊 File Statistics

- **Total Pages**: 2 (Dashboard, Case Detail)
- **API Routes**: 1 (SAR Generation)
- **Core Services**: 3 (Rules Engine, Gemini, DB)
- **UI Components**: 1 (Button, more can be added)
- **Configuration Files**: 6
- **Documentation Files**: 5

---

## 🎓 Learning Path

### For Frontend Developers
1. Start with `src/app/(main)/dashboard/page.tsx`
2. Review `src/app/(main)/cases/[caseId]/page.tsx`
3. Explore `src/components/ui/`
4. Check `src/app/globals.css`

### For Backend Developers
1. Start with `src/app/api/sar-generation/route.ts`
2. Review `src/core/rules/engine.ts`
3. Explore `src/core/llm/geminiService.ts`
4. Check `database/schema.sql`

### For Full Stack Developers
1. Start with `QUICK_START.md`
2. Run the app and explore `/dashboard`
3. Read through `PROJECT_SUMMARY.md`
4. Dive into any file that interests you!

---

This index is your map to the entire codebase. Happy coding! 🚀
