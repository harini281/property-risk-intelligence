-- Properties and risk assessments storage for the backend persistence workflow

CREATE TABLE IF NOT EXISTS properties (
  id bigserial PRIMARY KEY,
  address text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  CONSTRAINT uq_properties_coordinates UNIQUE (latitude, longitude)
);

CREATE TABLE IF NOT EXISTS risk_assessments (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id bigint REFERENCES properties(id) ON DELETE SET NULL,
  overall_risk_level text NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_risk_assessments" ON risk_assessments;
CREATE POLICY "select_own_risk_assessments" ON risk_assessments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_risk_assessments" ON risk_assessments;
CREATE POLICY "insert_own_risk_assessments" ON risk_assessments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_risk_assessments" ON risk_assessments;
CREATE POLICY "update_own_risk_assessments" ON risk_assessments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_risk_assessments" ON risk_assessments;
CREATE POLICY "delete_own_risk_assessments" ON risk_assessments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_risk_assessments_user_id ON risk_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_generated_at ON risk_assessments(generated_at DESC);
