-- Migration: Add references column to MCQs table
-- Created: 2026-07-13
-- Purpose: Store textbook references and sources for each MCQ

ALTER TABLE public.mcqs
ADD COLUMN IF NOT EXISTS references TEXT;

-- Create index for references column
CREATE INDEX IF NOT EXISTS idx_mcqs_references ON public.mcqs(references);
