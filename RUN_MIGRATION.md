# How to Run the Sub-Subjects Migration

## Option 1: Using Supabase CLI (Recommended)

```bash
cd e:\medcorepk

# Push all migrations to Supabase
supabase db push
```

## Option 2: Manually in Supabase Console

1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor**
3. Click **New Query**
4. Copy & paste the contents of: `supabase/migrations/20260713000001_add_sub_subjects.sql`
5. Click **Run**

## Option 3: Using psql (if you have direct database access)

```bash
psql -U your_user -d your_database -f supabase/migrations/20260713000001_add_sub_subjects.sql
```

## What This Migration Does

✅ Creates `sub_subjects` table
✅ Adds `sub_subject_id` column to `mcqs` table
✅ Adds `is_fcps_pearl` column to `mcqs` table
✅ Adds `sub_subject_id` column to `sessions` table
✅ Creates `sub_subject_progress` table for analytics
✅ Creates necessary indexes
✅ Seeds Pharmacology sub-subjects (9 topics)

## Verify Migration Success

After running, check in Supabase console:

1. **Tables created:**
   - `sub_subjects` ✓
   - `sub_subject_progress` ✓

2. **Columns added:**
   - `mcqs.sub_subject_id` ✓
   - `mcqs.is_fcps_pearl` ✓
   - `sessions.sub_subject_id` ✓

3. **Pharmacology sub-subjects seeded:**
   - General Pharmacology
   - CNS
   - ANS
   - Respiratory
   - Cardiovascular
   - Antibiotics
   - Endocrine & Reproductive
   - Renal Pharmacology
   - GIT

## Next Steps After Migration

1. ✅ Restart the dev server: `npm run dev`
2. ✅ Go to `/admin/sub-subjects` to verify sub-subjects appear
3. ✅ Test navigation: FCPS Paper A → Pharmacology → CNS → Quiz
4. ✅ Upload MCQs with sub-subject assignments

## Troubleshooting

### If migration fails with permission error
- Make sure you're using a Supabase role with migration permissions
- Try running individual SQL statements instead

### If tables already exist
- The `IF NOT EXISTS` clauses prevent errors
- Safe to run multiple times

### If Pharmacology sub-subjects don't appear
- Verify the block exists with title containing "Pharmacology"
- Check that block name matches exactly in the blocks table
- Manually add via `/admin/sub-subjects` if needed
