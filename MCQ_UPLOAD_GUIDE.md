# MCQ CSV Upload Guide

## Overview
This guide explains how to upload MCQs (Multiple Choice Questions) to MedCore using CSV format.

## Template File
- **Location:** `MCQ_UPLOAD_TEMPLATE.csv`
- **Contains:** 10 example medical MCQs across different subjects and difficulty levels

## CSV Column Specifications

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| **block_id** | UUID (string) | ✅ | Must match an existing Block ID in the system. Example: `550e8400-e29b-41d4-a716-446655440000` |
| **question** | Text | ✅ | The main question text. Keep concise but complete |
| **case_study** | Text | ✅ | Clinical scenario/patient presentation. Provides context for the question |
| **option_a** | Text | ✅ | First multiple choice option |
| **option_b** | Text | ✅ | Second multiple choice option |
| **option_c** | Text | ✅ | Third multiple choice option |
| **option_d** | Text | ✅ | Fourth multiple choice option |
| **correct_answer** | Single letter (a/b/c/d) | ✅ | Which option is the correct answer (lowercase) |
| **explanation_a** | Text | ✅ | Explanation for why option A is correct or incorrect |
| **explanation_b** | Text | ✅ | Explanation for why option B is correct or incorrect |
| **explanation_c** | Text | ✅ | Explanation for why option C is correct or incorrect |
| **explanation_d** | Text | ✅ | Explanation for why option D is correct or incorrect |
| **explanation_summary** | Text | ✅ | Overall summary explaining the correct answer and key concept |
| **difficulty** | Enum: Easy/Medium/Hard | ✅ | Question difficulty level |
| **subject** | Text | ✅ | Subject name (e.g., Physiology, Pharmacology, Biochemistry) |
| **citation** | Text | ✅ | Reference/textbook source for the information |
| **notes** | Text | ✅ | Additional clinical notes or context |

## CSV Format Rules

### 1. **Commas in Text**
- Wrap text containing commas in double quotes:
  ```
  "Patient with 15 years of uncontrolled hypertension, BP 160/100"
  ```

### 2. **Double Quotes in Text**
- Escape with double quotes:
  ```
  "This is a ""quoted phrase"" within the text"
  ```

### 3. **Line Breaks**
- Avoid line breaks within cells
- If needed, replace with space or use `\n` notation

### 4. **Block IDs**
- Must be valid UUIDs that already exist in your Blocks table
- Example IDs in template:
  - `550e8400-e29b-41d4-a716-446655440000` (Physiology block)
  - `550e8400-e29b-41d4-a716-446655440001` (Biochemistry block)
  - `550e8400-e29b-41d4-a716-446655440002` (Microbiology block)
  - `550e8400-e29b-41d4-a716-446655440003` (Biostatistics block)
  - `550e8400-e29b-41d4-a716-446655440004` (Behavioral Science block)

## Steps to Upload

### 1. Prepare Your CSV File
- Copy `MCQ_UPLOAD_TEMPLATE.csv` and modify as needed
- Ensure all required columns are present
- Verify Block IDs exist in the system

### 2. Access Admin Panel
- Navigate to: `http://localhost:3000/admin/import`
- Log in with admin credentials

### 3. Upload CSV
- Click file upload button
- Select your prepared CSV file
- Click "Import MCQs"

### 4. Verify Import
- Check for success/error messages
- Verify questions appear in the correct blocks
- Review a few MCQs to ensure formatting is correct

## Example MCQ Structure

```csv
550e8400-e29b-41d4-a716-446655440000,"What is the normal adult resting heart rate?","A 25-year-old healthy male at rest","40-60 bpm","60-100 bpm","100-120 bpm","120-140 bpm","b","Bradycardia - abnormally slow","CORRECT: Normal resting heart rate in adults is 60-100 bpm in sinus rhythm","Tachycardia - abnormally fast","Marked tachycardia - severe elevation","Normal resting heart rate in healthy adults ranges from 60-100 beats per minute","Easy","Physiology","Guyton & Hall Textbook of Medical Physiology","Basic cardiovascular physiology concept"
```

## Best Practices

### Question Writing
✅ **Do:**
- Write clear, concise questions
- Provide sufficient clinical context in case_study
- Make distractors plausible but incorrect
- Include evidence-based answers

❌ **Don't:**
- Use ambiguous language
- Create questions with multiple correct answers
- Include trick questions
- Use outdated medical information

### Explanations
✅ **Do:**
- Explain why the correct answer is right
- Explain why each distractor is wrong
- Reference clinical significance
- Keep explanations educational but concise

### Difficulty Levels
- **Easy:** Basic recall questions, fundamental concepts
- **Medium:** Application of concepts, clinical scenarios
- **Hard:** Analysis, complex differential diagnosis, rare presentations

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Invalid block_id" | Block doesn't exist | Verify Block IDs in admin/blocks |
| "Missing required field" | Empty required column | Ensure all columns have values |
| "Invalid correct_answer" | Not a/b/c/d or uppercase | Use lowercase single letter (a, b, c, or d) |
| "Parsing error" | Unescaped quotes or commas | Wrap text with commas in quotes |
| "Duplicate question" | Question already exists | Check if importing to same block twice |

## Getting Block IDs

To find existing Block IDs:
1. Navigate to: `http://localhost:3000/admin/blocks`
2. View the list of blocks
3. Note the ID for each block you want to upload MCQs to

## Contact & Support

For issues with CSV import:
1. Check this guide for common errors
2. Verify CSV formatting in text editor (not Excel if possible)
3. Try importing a single test MCQ first
4. Check admin panel error messages

## File Size Limits

- **Recommended:** Keep CSV under 5,000 MCQs per file for optimal performance
- **Max:** System can handle larger files but may take longer to process

## Tips for Bulk Imports

1. **Test first:** Import 5-10 MCQs to verify format
2. **Organize by block:** Group MCQs by Block ID for easier management
3. **Use consistent formatting:** Follow the template exactly
4. **Backup original:** Keep backup of your MCQ data
5. **Stagger uploads:** If importing thousands, split into multiple files

---

**Template Version:** 1.0  
**Last Updated:** 2026-08-24  
**Format:** CSV (UTF-8)
