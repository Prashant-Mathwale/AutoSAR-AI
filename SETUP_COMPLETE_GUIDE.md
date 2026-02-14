# 🚀 AutoSAR AI - Complete Setup Guide

## Step 1: Fix the UUID Error

### Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**

### Run This SQL (Copy/Paste Everything):

```sql
-- ================================================
-- AutoSAR AI - Database Schema (UUID FIX)
-- ================================================

-- Drop existing tables (WARNING: Deletes existing data)
DROP TABLE IF EXISTS audit_trail_logs CASCADE;
DROP TABLE IF EXISTS sar_drafts CASCADE;
DROP TABLE IF EXISTS llm_interaction_logs CASCADE;
DROP TABLE IF EXISTS rule_engine_outputs CASCADE;
DROP TABLE IF EXISTS case_data_normalized CASCADE;
DROP TABLE IF EXISTS cases CASCADE;

-- Create cases table with TEXT case_id (not UUID)
CREATE TABLE cases (
  case_id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'NEW',
  analyst_id TEXT,
  reviewer_id TEXT,
  ingestion_version TEXT DEFAULT 'v1.0',
  rule_engine_version TEXT DEFAULT 'v2.0'
);

-- Create case_data_normalized table
CREATE TABLE case_data_normalized (
  case_id TEXT PRIMARY KEY REFERENCES cases(case_id) ON DELETE CASCADE,
  alert_metadata JSONB,
  customer_profile JSONB,
  transaction_summary JSONB,
  transaction_list JSONB,
  case_context JSONB,
  risk_indicators JSONB
);

-- Create rule_engine_outputs table
CREATE TABLE rule_engine_outputs (
  case_id TEXT PRIMARY KEY REFERENCES cases(case_id) ON DELETE CASCADE,
  execution_timestamp TIMESTAMPTZ DEFAULT NOW(),
  rule_engine_config_id TEXT,
  triggered_rules TEXT[],
  calculated_metrics JSONB,
  typology_tags TEXT[],
  aggregated_risk_score INTEGER,
  suspicion_summary_json JSONB,
  final_classification TEXT
);

-- Create sar_drafts table
CREATE TABLE sar_drafts (
  draft_id SERIAL PRIMARY KEY,
  case_id TEXT REFERENCES cases(case_id) ON DELETE CASCADE,
  version_number NUMERIC(10, 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  narrative_text TEXT,
  source_event TEXT,
  created_by_user_id TEXT,
  is_final_submission BOOLEAN DEFAULT FALSE,
  prompt_log_id INTEGER,
  UNIQUE(case_id, version_number)
);

-- Create llm_interaction_logs table
CREATE TABLE llm_interaction_logs (
  log_id SERIAL PRIMARY KEY,
  case_id TEXT REFERENCES cases(case_id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  model_version TEXT,
  prompt_template_version TEXT,
  structured_input_json JSONB,
  rendered_prompt TEXT,
  raw_response JSONB,
  post_processing_notes TEXT
);

-- Create audit_trail_logs table
CREATE TABLE audit_trail_logs (
  audit_log_id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id TEXT,
  case_id TEXT REFERENCES cases(case_id) ON DELETE CASCADE,
  event_type TEXT,
  description TEXT,
  detail_payload JSONB,
  is_immutable BOOLEAN DEFAULT TRUE
);

-- Create indexes for performance
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_created_at ON cases(created_at DESC);
CREATE INDEX idx_audit_logs_case_id ON audit_trail_logs(case_id);
CREATE INDEX idx_sar_drafts_case_id ON sar_drafts(case_id);

-- Grant permissions to anon and authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
```

### Click "RUN" button

You should see:
```
Success. No rows returned
```

---

## Step 2: Set Environment Variables

### Open `.env.local` file

Paste your keys:

```env
# From Supabase → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional - from https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIzaSy...
```

---

## Step 3: Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

---

## Step 4: Test Upload

1. Open http://localhost:3000/dashboard
2. Click **"Upload Data"** button
3. Click **"Choose JSON File"**
4. Select `/public/transaction_data.json`
5. Click **"Upload & Process"**

**Expected Result:**
```
✅ Successfully processed 7 customers
✅ 3 SARs generated
✅ Auto-redirects to first case
✅ No UUID errors!
```

---

## ✅ Success Indicators

### In Terminal:
```bash
✓ Compiled /api/cases/upload
POST /api/cases/upload 200 in 2000ms
✓ Compiled /cases/[caseId]
GET /cases/SAR-2026-XXXXX 200
```

### In Browser:
- Dashboard shows 3 cases
- Can click and view each case
- Can edit SAR narrative
- Can mark as handled
- Can download report

---

## 🐛 Troubleshooting

### Still getting UUID errors?
1. Make sure you ran the SQL in Supabase
2. Check that case_id is TEXT not UUID:
   - Go to Supabase → Table Editor → cases → case_id column
   - Type should be "text" not "uuid"

### Can't connect to Supabase?
1. Check `.env.local` has correct keys
2. Restart dev server: `npm run dev`
3. Check Supabase project is not paused

### No cases appearing?
1. Check browser console (F12)
2. Check terminal for errors
3. Verify tables were created in Supabase

---

## 📊 What Each Table Does

| Table | Purpose |
|-------|---------|
| `cases` | Main case records |
| `case_data_normalized` | Customer & transaction data |
| `rule_engine_outputs` | Risk analysis results |
| `sar_drafts` | SAR narratives (versioned) |
| `audit_trail_logs` | Complete audit history |
| `llm_interaction_logs` | AI generation logs |

---

## 🎯 Next Steps After Setup

1. ✅ Upload test data
2. ✅ Review generated SARs
3. ✅ Edit narratives
4. ✅ Mark cases as handled
5. ✅ Download reports

---

**You're all set! The UUID error is now fixed.** 🚀
