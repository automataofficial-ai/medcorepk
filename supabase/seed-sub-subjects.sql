-- Seed sub-subjects for Pharmacology block
-- First, get the Pharmacology block ID (adjust as needed)

-- Insert Pharmacology sub-subjects
INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'General Pharmacology',
  'Fundamental principles of pharmacology, pharmacokinetics, and pharmacodynamics',
  0
FROM public.blocks b WHERE LOWER(b.title) = 'pharmacology'
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'CNS (Central Nervous System)',
  'Psychotropic drugs, analgesics, anesthetics, and anticonvulsants',
  1
FROM public.blocks b WHERE LOWER(b.title) = 'pharmacology'
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'ANS (Autonomic Nervous System)',
  'Adrenergic, cholinergic, and other autonomic drugs',
  2
FROM public.blocks b WHERE LOWER(b.title) = 'pharmacology'
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'Respiratory',
  'Drugs used in respiratory conditions and asthma',
  3
FROM public.blocks b WHERE LOWER(b.title) = 'pharmacology'
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'Cardiovascular',
  'Antihypertensives, antianginals, antiarrhythmics, and cardiac drugs',
  4
FROM public.blocks b WHERE LOWER(b.title) = 'pharmacology'
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'Antibiotics',
  'Antibacterial, antiviral, antifungal, and antiparasitic drugs',
  5
FROM public.blocks b WHERE LOWER(b.title) = 'pharmacology'
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'Endocrine & Reproductive',
  'Hormonal drugs and reproductive system medications',
  6
FROM public.blocks b WHERE LOWER(b.title) = 'pharmacology'
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'Renal Pharmacology',
  'Diuretics and drugs affecting renal function',
  7
FROM public.blocks b WHERE LOWER(b.title) = 'pharmacology'
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_subjects (block_id, name, description, order_index)
SELECT
  b.id,
  'GIT (Gastrointestinal Tract)',
  'Drugs affecting the gastrointestinal system',
  8
FROM public.blocks b WHERE LOWER(b.title) = 'pharmacology'
ON CONFLICT DO NOTHING;
