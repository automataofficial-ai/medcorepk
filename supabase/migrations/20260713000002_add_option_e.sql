-- Migration: Add option E to MCQs table
-- Created: 2026-07-13
-- Purpose: Support 5-option MCQs

-- Add option_e and explanation_e columns
ALTER TABLE public.mcqs
ADD COLUMN IF NOT EXISTS option_e TEXT,
ADD COLUMN IF NOT EXISTS explanation_e TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_mcqs_created_at ON public.mcqs(created_at);
