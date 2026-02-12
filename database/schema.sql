-- AutoSAR AI Database Schema
-- PostgreSQL schema for Supabase
-- Version: 1.0.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ROLES AND PERMISSIONS
-- =============================================

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL CHECK (name IN ('Analyst', 'Reviewer', 'Admin')),
  permissions_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, permissions_json) VALUES
  ('Analyst', '{"can_generate": true, "can_edit": true, "can_approve": false, "can_view_full_audit": false}'),
  ('Reviewer', '{"can_generate": false, "can_edit": true, "can_approve": true, "can_view_full_audit": true}'),
  ('Admin', '{"can_generate": false, "can_edit": false, "can_approve": false, "can_view_full_audit": true, "can_configure": true}')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- USERS (extends Supabase auth.users)
-- =============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'Analyst' CHECK (role IN ('Analyst', 'Reviewer', 'Admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- CASES
-- =============================================

CREATE TABLE IF NOT EXISTS cases (
  case_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  status TEXT NOT NULL DEFAULT 'Alert Received' 
    CHECK (status IN ('Alert Received', 'Drafting', 'Pending Review', 'Approved', 'Rejected', 'Closed-FP')),
  analyst_id UUID REFERENCES users(id),
  reviewer_id UUID REFERENCES users(id),
  ingestion_version TEXT NOT NULL DEFAULT 'v1.0.0',
  rule_engine_version TEXT NOT NULL DEFAULT 'v1.0.0',
  customer_name TEXT,
  alert_date DATE,
  risk_level TEXT CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
  INDEX idx_cases_status (status),
  INDEX idx_cases_analyst (analyst_id),
  INDEX idx_cases_created (created_at DESC)
);

-- =============================================
-- CASE DATA NORMALIZED
-- =============================================

CREATE TABLE IF NOT EXISTS case_data_normalized (
  case_id UUID PRIMARY KEY REFERENCES cases(case_id) ON DELETE CASCADE,
  alert_metadata JSONB NOT NULL DEFAULT '{}',
  customer_profile JSONB NOT NULL DEFAULT '{}',
  transaction_summary JSONB NOT NULL DEFAULT '{}',
  transaction_list JSONB NOT NULL DEFAULT '[]',
  case_context JSONB DEFAULT '{}',
  risk_indicators JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =============================================
-- RULE ENGINE OUTPUTS
-- =============================================

CREATE TABLE IF NOT EXISTS rule_engine_outputs (
  case_id UUID PRIMARY KEY REFERENCES cases(case_id) ON DELETE CASCADE,
  execution_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  rule_engine_config_id TEXT NOT NULL DEFAULT 'v1.0.0',
  triggered_rules JSONB NOT NULL DEFAULT '[]',
  calculated_metrics JSONB NOT NULL DEFAULT '{}',
  typology_tags TEXT[] DEFAULT '{}',
  aggregated_risk_score NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (aggregated_risk_score >= 0 AND aggregated_risk_score <= 100),
  suspicion_summary_json JSONB NOT NULL DEFAULT '{}',
  final_classification TEXT NOT NULL CHECK (final_classification IN ('False Positive', 'Medium Risk', 'SAR Required'))
);

-- =============================================
-- SAR DRAFTS (Versioned)
-- =============================================

CREATE TABLE IF NOT EXISTS sar_drafts (
  draft_id BIGSERIAL PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  narrative_text TEXT NOT NULL,
  source_event TEXT NOT NULL CHECK (source_event IN ('LLM_Initial', 'Analyst_Edit', 'Reviewer_Override', 'LLM_Regenerate')),
  created_by_user_id UUID REFERENCES users(id),
  is_final_submission BOOLEAN DEFAULT FALSE,
  prompt_log_id BIGINT,
  UNIQUE (case_id, version_number),
  INDEX idx_sar_drafts_case (case_id, version_number DESC)
);

-- =============================================
-- LLM INTERACTION LOGS
-- =============================================

CREATE TABLE IF NOT EXISTS llm_interaction_logs (
  log_id BIGSERIAL PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  model_version TEXT NOT NULL,
  prompt_template_version TEXT NOT NULL,
  structured_input_json JSONB NOT NULL,
  rendered_prompt TEXT NOT NULL,
  raw_response JSONB NOT NULL,
  post_processing_notes TEXT,
  generation_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  INDEX idx_llm_logs_case (case_id, timestamp DESC)
);

-- Add foreign key after table creation
ALTER TABLE sar_drafts 
  ADD CONSTRAINT fk_sar_drafts_prompt 
  FOREIGN KEY (prompt_log_id) 
  REFERENCES llm_interaction_logs(log_id);

-- =============================================
-- AUDIT TRAIL LOGS (Immutable)
-- =============================================

CREATE TABLE IF NOT EXISTS audit_trail_logs (
  audit_log_id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES users(id),
  case_id UUID NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'INGESTION_COMPLETE', 
    'RULE_DECISION', 
    'DRAFT_EDIT', 
    'SAR_APPROVED', 
    'SAR_REJECTED',
    'LLM_CALL',
    'CASE_ASSIGNED',
    'STATUS_CHANGE'
  )),
  description TEXT NOT NULL,
  detail_payload JSONB DEFAULT '{}',
  is_immutable BOOLEAN DEFAULT TRUE,
  INDEX idx_audit_case_time (case_id, timestamp DESC),
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_event (event_type)
);

-- Prevent updates and deletes on audit logs
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    RAISE EXCEPTION 'Deletion from audit_trail_logs is not allowed';
  ELSIF (TG_OP = 'UPDATE' AND OLD.is_immutable = TRUE) THEN
    RAISE EXCEPTION 'Updates to immutable audit_trail_logs entries are not allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_immutability
BEFORE UPDATE OR DELETE ON audit_trail_logs
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_modification();

-- =============================================
-- SCHEMA VERSIONING
-- =============================================

CREATE TABLE IF NOT EXISTS ingestion_schema_versions (
  version_id TEXT PRIMARY KEY,
  definition_json_schema JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT FALSE,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS prompt_template_versions (
  version_id TEXT PRIMARY KEY,
  template_structure TEXT NOT NULL,
  guardrails_applied JSONB DEFAULT '{}',
  created_by_admin_id UUID REFERENCES users(id),
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  description TEXT
);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_data_normalized ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_engine_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sar_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_interaction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail_logs ENABLE ROW LEVEL SECURITY;

-- Users: Can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Cases: Analysts see assigned cases, Reviewers see all, Admins see all
CREATE POLICY "Analysts see assigned cases" ON cases
  FOR SELECT USING (
    analyst_id = auth.uid() OR 
    reviewer_id = auth.uid() OR
    (SELECT role FROM users WHERE id = auth.uid()) IN ('Admin', 'Reviewer')
  );

-- Case data: Same as cases
CREATE POLICY "Case data follows case access" ON case_data_normalized
  FOR SELECT USING (
    case_id IN (
      SELECT case_id FROM cases 
      WHERE analyst_id = auth.uid() 
         OR reviewer_id = auth.uid()
         OR (SELECT role FROM users WHERE id = auth.uid()) IN ('Admin', 'Reviewer')
    )
  );

-- Audit logs: Analysts see case-specific, Reviewers and Admins see all for their cases
CREATE POLICY "Audit access by role" ON audit_trail_logs
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'Admin' OR
    case_id IN (
      SELECT case_id FROM cases 
      WHERE analyst_id = auth.uid() OR reviewer_id = auth.uid()
    )
  );

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to update last_updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cases_updated_at
BEFORE UPDATE ON cases
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically log case status changes
CREATE OR REPLACE FUNCTION log_case_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO audit_trail_logs (
      user_id,
      case_id,
      event_type,
      description,
      detail_payload
    ) VALUES (
      auth.uid(),
      NEW.case_id,
      'STATUS_CHANGE',
      'Case status changed',
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER case_status_change_audit
AFTER UPDATE ON cases
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION log_case_status_change();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_cases_analyst_status ON cases(analyst_id, status);
CREATE INDEX idx_cases_reviewer_status ON cases(reviewer_id, status);
CREATE INDEX idx_audit_logs_timestamp ON audit_trail_logs(timestamp DESC);
CREATE INDEX idx_sar_drafts_final ON sar_drafts(case_id) WHERE is_final_submission = TRUE;

-- JSONB indexes for common queries
CREATE INDEX idx_case_data_customer ON case_data_normalized USING GIN (customer_profile);
CREATE INDEX idx_case_data_transactions ON case_data_normalized USING GIN (transaction_list);
CREATE INDEX idx_rule_outputs_rules ON rule_engine_outputs USING GIN (triggered_rules);

-- =============================================
-- INITIAL DATA
-- =============================================

-- Insert default schema version
INSERT INTO ingestion_schema_versions (version_id, definition_json_schema, active, description)
VALUES (
  'v1.0.0',
  '{
    "type": "object",
    "required": ["case_id", "alert_metadata", "customer_profile"],
    "properties": {
      "case_id": {"type": "string"},
      "alert_metadata": {"type": "object"},
      "customer_profile": {"type": "object"},
      "transaction_summary": {"type": "object"},
      "transaction_list": {"type": "array"}
    }
  }'::jsonb,
  true,
  'Initial schema version'
) ON CONFLICT (version_id) DO NOTHING;

-- Insert default prompt template
INSERT INTO prompt_template_versions (
  version_id,
  template_structure,
  is_active,
  description
)
VALUES (
  'SAR_V1_Base',
  'You are a professional SAR narrative generator. Generate a formal, objective SAR narrative based on the following structured data: {structured_input}',
  true,
  'Base SAR generation prompt'
) ON CONFLICT (version_id) DO NOTHING;

-- =============================================
-- VIEWS FOR REPORTING
-- =============================================

-- View for case dashboard
CREATE OR REPLACE VIEW case_dashboard AS
SELECT 
  c.case_id,
  c.status,
  c.created_at,
  c.customer_name,
  c.risk_level,
  u_analyst.full_name as analyst_name,
  u_reviewer.full_name as reviewer_name,
  reo.aggregated_risk_score,
  reo.final_classification,
  (SELECT COUNT(*) FROM sar_drafts WHERE case_id = c.case_id) as draft_count,
  (SELECT version_number FROM sar_drafts WHERE case_id = c.case_id ORDER BY version_number DESC LIMIT 1) as latest_version
FROM cases c
LEFT JOIN users u_analyst ON c.analyst_id = u_analyst.id
LEFT JOIN users u_reviewer ON c.reviewer_id = u_reviewer.id
LEFT JOIN rule_engine_outputs reo ON c.case_id = reo.case_id;

-- Grant permissions
GRANT SELECT ON case_dashboard TO authenticated;

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE cases IS 'Central table for SAR investigation cases';
COMMENT ON TABLE audit_trail_logs IS 'Immutable audit trail for all system actions';
COMMENT ON TABLE sar_drafts IS 'Versioned SAR narrative drafts';
COMMENT ON TABLE llm_interaction_logs IS 'Detailed logs of all LLM API interactions';
COMMENT ON COLUMN cases.status IS 'Current status: Alert Received, Drafting, Pending Review, Approved, Rejected, Closed-FP';
COMMENT ON COLUMN rule_engine_outputs.aggregated_risk_score IS 'Composite risk score (0-100)';
