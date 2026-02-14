-- Drop existing tables if they exist (careful - this deletes data!)
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

-- Create indexes for better performance
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_created_at ON cases(created_at DESC);
CREATE INDEX idx_audit_logs_case_id ON audit_trail_logs(case_id);
CREATE INDEX idx_sar_drafts_case_id ON sar_drafts(case_id);

-- Enable Row Level Security (optional - disable for testing)
-- ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE case_data_normalized ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE rule_engine_outputs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sar_drafts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE audit_trail_logs ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
