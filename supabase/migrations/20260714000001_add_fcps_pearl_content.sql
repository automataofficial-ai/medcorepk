-- Migration: Add FCPS Pearl content column to MCQs table
-- Created: 2026-07-14
-- Purpose: Store detailed FCPS Pearl descriptions for each MCQ

ALTER TABLE public.mcqs
ADD COLUMN IF NOT EXISTS fcps_pearl_content TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_mcqs_fcps_pearl_content ON public.mcqs(fcps_pearl_content);
