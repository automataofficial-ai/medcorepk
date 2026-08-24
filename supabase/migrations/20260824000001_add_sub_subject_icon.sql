-- Migration: Add icon column to sub_subjects
-- Created: 2026-08-24
-- Purpose: The admin panel (app/admin/sub-subjects) and the subject listing page
--          (app/subject/[subject]/[paperId]) both read and write sub_subjects.icon,
--          but the column was never created. PostgREST rejected the unknown column
--          with PGRST204, which surfaced as HTTP 400 on create and HTTP 500 on edit.

ALTER TABLE public.sub_subjects
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '📚';

-- Backfill existing rows that predate the column
UPDATE public.sub_subjects
SET icon = '📚'
WHERE icon IS NULL;
