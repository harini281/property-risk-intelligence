/*
# Create reports and saved_properties tables for Property Risk Intelligence Platform

## Overview
This migration creates two tables to support the Reports feature and the ability
for users to save/bookmark properties they are interested in. Both tables are
owner-scoped (multi-user app with sign-in).

## New Tables

### 1. reports
- `id` (uuid, primary key)
- `user_id` (uuid, not null, defaults to auth.uid() — the report owner)
- `address` (text, not null — the property address the report covers)
- `report_type` (text, not null — one of: homeowner, insurance, contractor, investor)
- `risk_score` (integer — overall risk score 0-100 at time of generation)
- `summary` (text — AI-generated summary text)
- `status` (text, default 'completed' — generation status)
- `created_at` (timestamptz, default now())

### 2. saved_properties
- `id` (uuid, primary key)
- `user_id` (uuid, not null, defaults to auth.uid() — the owner)
- `address` (text, not null — the property address)
- `risk_score` (integer — overall risk score)
- `notes` (text — optional user notes about the property)
- `created_at` (timestamptz, default now())

## Security
- RLS enabled on both tables.
- Owner-scoped CRUD: each authenticated user can only access rows they own
  (auth.uid() = user_id) for SELECT, INSERT, UPDATE, and DELETE.
- Owner columns default to auth.uid() so inserts that omit user_id succeed.

## Important Notes
1. The frontend uses Supabase email/password auth, so all policies are scoped
   TO authenticated with ownership checks via auth.uid().
2. user_id columns have DEFAULT auth.uid() so the client can insert without
   explicitly passing the owner — the database fills it from the session.
3. Both tables are safe to re-run (idempotent CREATE TABLE IF NOT EXISTS,
   DROP POLICY IF EXISTS before each CREATE POLICY).
*/

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  address text NOT NULL,
  report_type text NOT NULL CHECK (report_type IN ('homeowner', 'insurance', 'contractor', 'investor')),
  risk_score integer,
  summary text,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_reports" ON reports;
CREATE POLICY "select_own_reports" ON reports FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reports" ON reports;
CREATE POLICY "insert_own_reports" ON reports FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reports" ON reports;
CREATE POLICY "update_own_reports" ON reports FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reports" ON reports;
CREATE POLICY "delete_own_reports" ON reports FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Saved properties table
CREATE TABLE IF NOT EXISTS saved_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  address text NOT NULL,
  risk_score integer,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_saved_properties" ON saved_properties;
CREATE POLICY "select_own_saved_properties" ON saved_properties FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_saved_properties" ON saved_properties;
CREATE POLICY "insert_own_saved_properties" ON saved_properties FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_saved_properties" ON saved_properties;
CREATE POLICY "update_own_saved_properties" ON saved_properties FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_saved_properties" ON saved_properties;
CREATE POLICY "delete_own_saved_properties" ON saved_properties FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_properties_user_id ON saved_properties(user_id);
