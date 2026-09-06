-- ==============================================================================
-- PARIKSHA AI — SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Officers & Civil Servants)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'New Officer',
  email TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'Statistical Officer',
  department TEXT NOT NULL DEFAULT 'Census Operations',
  cadre TEXT NOT NULL DEFAULT 'SSS',
  avatar TEXT NOT NULL DEFAULT 'SO',
  xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. OFFICER SKILLS / COMPETENCIES TABLE
CREATE TABLE IF NOT EXISTS officer_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_profile_skill UNIQUE(profile_id, skill_name)
);

-- 3. QUIZZES TABLE (AI-generated & predefined assessments)
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Intermediate',
  question_count INTEGER NOT NULL DEFAULT 5,
  questions JSONB NOT NULL DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. QUIZ ATTEMPTS / RESULTS TABLE
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE SET NULL,
  quiz_title TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 5,
  answers JSONB DEFAULT '[]'::JSONB,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ENROLLED COURSES TABLE (iGOT Karmayogi & MoSPI pathways)
CREATE TABLE IF NOT EXISTS enrolled_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id TEXT,
  title TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'iGOT Karmayogi',
  progress INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Enrolled',
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. DISCUSSIONS / COLLABORATION TABLE
CREATE TABLE IF NOT EXISTS discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT 'SO',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Permissive for development; can be scoped with Supabase Auth later
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE officer_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrolled_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on officer_skills" ON officer_skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on quizzes" ON quizzes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on quiz_attempts" ON quiz_attempts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on enrolled_courses" ON enrolled_courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on discussions" ON discussions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================
INSERT INTO profiles (name, email, role, department, cadre, avatar, xp, streak)
VALUES ('New Officer', 'officer@mospi.gov.in', 'Statistical Officer', 'Census Operations', 'SSS', 'SO', 0, 0)
ON CONFLICT (email) DO NOTHING;
