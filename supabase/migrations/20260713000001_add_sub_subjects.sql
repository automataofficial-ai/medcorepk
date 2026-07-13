-- Migration: Add sub-subjects and related tables
-- Created: 2026-07-13
-- Purpose: Support hierarchical MCQ organization with sub-topics within blocks

-- 1. Create sub_subjects table
CREATE TABLE IF NOT EXISTS public.sub_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_id UUID NOT NULL REFERENCES public.blocks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add columns to mcqs table
ALTER TABLE public.mcqs
ADD COLUMN IF NOT EXISTS sub_subject_id UUID REFERENCES public.sub_subjects(id) ON DELETE CASCADE;

ALTER TABLE public.mcqs
ADD COLUMN IF NOT EXISTS is_fcps_pearl BOOLEAN DEFAULT FALSE;

-- 3. Add column to sessions table
ALTER TABLE public.sessions
ADD COLUMN IF NOT EXISTS sub_subject_id UUID REFERENCES public.sub_subjects(id) ON DELETE CASCADE;

-- 4. Create sub_subject_progress table
CREATE TABLE IF NOT EXISTS public.sub_subject_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sub_subject_id UUID NOT NULL REFERENCES public.sub_subjects(id) ON DELETE CASCADE,
  attempts INTEGER DEFAULT 0,
  best_score DECIMAL(5,2) DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  total_attempted INTEGER DEFAULT 0,
  last_attempt_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, sub_subject_id)
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sub_subjects_block_id ON public.sub_subjects(block_id);
CREATE INDEX IF NOT EXISTS idx_mcqs_sub_subject_id ON public.mcqs(sub_subject_id);
CREATE INDEX IF NOT EXISTS idx_sessions_sub_subject_id ON public.sessions(sub_subject_id);
CREATE INDEX IF NOT EXISTS idx_sub_subject_progress_user_id ON public.sub_subject_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_sub_subject_progress_sub_subject_id ON public.sub_subject_progress(sub_subject_id);

-- 6. Seed initial sub-subjects for Pharmacology
INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'General Pharmacology',
  'Fundamental principles of pharmacology, pharmacokinetics, and pharmacodynamics',
  0
FROM public.blocks b WHERE LOWER(b.title) LIKE '%pharmacology%'
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'CNS (Central Nervous System)',
  'Psychotropic drugs, analgesics, anesthetics, and anticonvulsants',
  1
FROM public.blocks b WHERE LOWER(b.title) LIKE '%pharmacology%'
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'ANS (Autonomic Nervous System)',
  'Adrenergic, cholinergic, and other autonomic drugs',
  2
FROM public.blocks b WHERE LOWER(b.title) LIKE '%pharmacology%'
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'Respiratory',
  'Drugs used in respiratory conditions and asthma',
  3
FROM public.blocks b WHERE LOWER(b.title) LIKE '%pharmacology%'
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'Cardiovascular',
  'Antihypertensives, antianginals, antiarrhythmics, and cardiac drugs',
  4
FROM public.blocks b WHERE LOWER(b.title) LIKE '%pharmacology%'
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'Antibiotics',
  'Antibacterial, antiviral, antifungal, and antiparasitic drugs',
  5
FROM public.blocks b WHERE LOWER(b.title) LIKE '%pharmacology%'
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'Endocrine & Reproductive',
  'Hormonal drugs and reproductive system medications',
  6
FROM public.blocks b WHERE LOWER(b.title) LIKE '%pharmacology%'
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'Renal Pharmacology',
  'Diuretics and drugs affecting renal function',
  7
FROM public.blocks b WHERE LOWER(b.title) LIKE '%pharmacology%'
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'GIT (Gastrointestinal Tract)',
  'Drugs affecting the gastrointestinal system',
  8
FROM public.blocks b WHERE LOWER(b.title) LIKE '%pharmacology%'
ON CONFLICT DO NOTHING;
