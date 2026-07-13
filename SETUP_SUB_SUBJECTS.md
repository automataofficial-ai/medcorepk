# Sub-Subjects Feature Setup Guide

## Overview
This guide explains the new hierarchical structure for MCQ organization in MedCore with sub-subjects support.

## Architecture

### New Navigation Flow
```
FCPS Part 1 Paper A
  ↓
Subject (Pharmacology, Anatomy, etc.)
  ↓
Sub-Subject (General Pharmacology, CNS, etc.)
  ↓
Quiz Page (MCQs for selected sub-subject)
  ↓
Results & Analytics
```

## Database Changes

### New Tables
1. **sub_subjects** - Subdivisions within blocks
   - `id` (UUID)
   - `block_id` (UUID) - References blocks table
   - `name` (TEXT) - Sub-subject name
   - `description` (TEXT) - Optional description
   - `order_index` (INTEGER) - Display order
   - Timestamps

2. **sub_subject_progress** - Analytics per sub-subject
   - `user_id` (UUID)
   - `sub_subject_id` (UUID)
   - `attempts`, `best_score`, `total_correct`, `total_attempted`
   - Timestamps

### Modified Tables
1. **mcqs**
   - Added `sub_subject_id` (UUID) - Link MCQs to sub-subjects
   - Added `is_fcps_pearl` (BOOLEAN) - Mark important high-yield concepts

2. **sessions**
   - Added `sub_subject_id` (UUID) - Track which sub-subject was attempted

## Setup Instructions

### 1. Apply Database Schema
Run the migration:
```bash
supabase migration up
```

Or manually run `supabase/schema.sql` to create new tables.

### 2. Seed Pharmacology Sub-Subjects
```bash
# Using Supabase CLI
supabase db push

# Or run the SQL file manually:
psql -d your_db < supabase/seed-sub-subjects.sql
```

This creates 9 sub-subjects for Pharmacology:
- General Pharmacology
- CNS (Central Nervous System)
- ANS (Autonomic Nervous System)
- Respiratory
- Cardiovascular
- Antibiotics
- Endocrine & Reproductive
- Renal Pharmacology
- GIT (Gastrointestinal Tract)

### 3. Add Sub-Subjects via Admin Dashboard
1. Go to `/admin/sub-subjects`
2. Select a block (e.g., Pharmacology)
3. Click "Add Sub-Subject"
4. Fill in name and optional description
5. Submit

## Features

### For Students

#### Navigation
1. Click "FCPS Part 1 Paper A"
2. Select a subject (e.g., Pharmacology)
3. Select a sub-subject (e.g., CNS)
4. Complete the quiz for that sub-subject

#### FCPS Pearl Widget
- Shows in quiz when selected sub-subject has important high-yield concepts
- Marked questions appear with special formatting
- Helps identify critical exam concepts

#### Analytics
- Track performance per sub-subject
- View best scores per sub-topic
- Monitor progress across multiple attempts

### For Admins

#### Sub-Subject Management
- Add, edit, delete sub-subjects per block
- Reorder sub-subjects using `order_index`
- Add descriptions for each sub-topic

#### MCQ Assignment
When importing MCQs:
1. Upload CSV with MCQ data
2. Select the target block
3. Select the sub-subject within that block
4. (Optional) Mark as "FCPS Pearl" if high-yield

#### CSV Import Format
```
block_name,sub_subject_name,question,case_study,option_a,option_b,option_c,option_d,correct_answer,explanation_a,explanation_b,explanation_c,explanation_d,difficulty,image_url,is_fcps_pearl
Pharmacology,CNS,Question text here,Case study here,Option A,Option B,Option C,Option D,a,Explanation A,Explanation B,Explanation C,Explanation D,medium,,true
```

## API Endpoints

### Sub-Subjects
- `GET /api/sub-subjects` - Get all sub-subjects
- `POST /api/sub-subjects` - Create sub-subject
- `GET /api/sub-subjects/:id` - Get sub-subject with MCQs
- `PUT /api/sub-subjects/:id` - Update sub-subject
- `DELETE /api/sub-subjects/:id` - Delete sub-subject

### Block Sub-Subjects
- `GET /api/blocks/:id/sub-subjects` - Get sub-subjects for a block
- `POST /api/blocks/:id/sub-subjects` - Create sub-subject for block

## Page Routes

### New Pages
- `/subject/[id]/[paper]` - Sub-subject selection page
- `/sub-subject/[id]/[paper]` - Quiz page for sub-subject
- `/admin/sub-subjects` - Admin management page

### Modified Pages
- `/exam/fcps-part1-paper-a` - Now links to subject page instead of block

## Analytics

### Per-Sub-Subject Tracking
Sessions now include `sub_subject_id` to track:
- Which sub-subject was studied
- Performance per topic
- Progression through sub-topics
- Time spent per sub-topic

### Dashboard Updates
- Display sub-subject progress
- Show performance breakdown by sub-topic
- Calculate weighted scores per specialty

## Future Enhancements

1. **Spaced Repetition** - Based on sub-subject performance
2. **Weak Topic Identification** - Highlight struggling sub-subjects
3. **Adaptive Learning** - Recommend sub-topics to study
4. **Progress Milestones** - Achievements per sub-subject
5. **Practice Tests** - Multi-sub-subject tests

## Troubleshooting

### Sub-subjects not appearing
- Check that they're created in the database
- Verify `block_id` matches the selected block
- Ensure `order_index` is sequential

### MCQs not linking to sub-subjects
- When importing, ensure sub-subject names match exactly
- Check that block_id is correct in MCQ records

### Analytics not updating
- Ensure `sub_subject_id` is included in session creation
- Check that `/api/sessions` endpoint updates `sub_subject_progress` table

## Next Steps

1. Set up sub-subjects in admin dashboard
2. Update MCQ import process to assign sub-subjects
3. Test navigation flow end-to-end
4. Monitor analytics accuracy
5. Gather student feedback for improvements
