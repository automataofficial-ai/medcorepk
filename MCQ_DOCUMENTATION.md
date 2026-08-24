# MCQ Import & Management - Complete Documentation

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [CSV Format Specification](#csv-format-specification)
3. [Template Files](#template-files)
4. [Step-by-Step Import Process](#step-by-step-import-process)
5. [Import via Admin Panel](#import-via-admin-panel)
6. [Common Errors & Solutions](#common-errors--solutions)
7. [Best Practices](#best-practices)
8. [Block IDs Reference](#block-ids-reference)

---

## 🚀 Quick Start

### For Immediate Import:
1. Use **`MCQ_IMPORT_TEMPLATE_FINAL.csv`** from `formatted_files/` folder
2. Fill in your MCQ data (keep column order exactly)
3. Go to: `http://localhost:3000/admin/import`
4. Upload and click "Import MCQs"

### To Start Fresh:
1. Copy **`MCQ_TEMPLATE_BLANK.csv`** from `formatted_files/` folder
2. Add your MCQs
3. Follow same upload process

---

## 📋 CSV Format Specification

### Exact Column Order (CRITICAL):
```
block_name,sub_subject_name,question,case_study,option_a,option_b,option_c,option_d,option_e,correct_answer,explanation_a,explanation_b,explanation_c,explanation_d,explanation_e,difficulty,image_url,references,is_fcps_pearl,fcps_pearl_content
```

### Column Details:

| Column | Type | Required | Rules |
|--------|------|----------|-------|
| `block_name` | Text | ✅ YES | Exact block name: Physiology, Anatomy, Pharmacology, Pathology, Biochemistry, Microbiology, etc. |
| `sub_subject_name` | Text | ❌ NO | Optional sub-classification |
| `question` | Text | ✅ YES | Main MCQ question |
| `case_study` | Text | ❌ NO | Clinical scenario (wrap in quotes if contains comma) |
| `option_a` | Text | ✅ YES | First option (wrap in quotes if contains comma) |
| `option_b` | Text | ✅ YES | Second option (wrap in quotes if contains comma) |
| `option_c` | Text | ✅ YES | Third option (wrap in quotes if contains comma) |
| `option_d` | Text | ✅ YES | Fourth option (wrap in quotes if contains comma) |
| `option_e` | Text | ✅ YES | Fifth option (wrap in quotes if contains comma) |
| `correct_answer` | Letter | ✅ YES | **Must be: a, b, c, d, or e** (lowercase only) |
| `explanation_a` | Text | ❌ NO | Why option A is correct/incorrect |
| `explanation_b` | Text | ❌ NO | Why option B is correct/incorrect |
| `explanation_c` | Text | ❌ NO | Why option C is correct/incorrect |
| `explanation_d` | Text | ❌ NO | Why option D is correct/incorrect |
| `explanation_e` | Text | ❌ NO | Why option E is correct/incorrect |
| `difficulty` | Text | ✅ YES | One of: **Easy**, **Medium**, **Hard** (case-sensitive) |
| `image_url` | Text | ❌ NO | Image URL (leave empty for now) |
| `references` | Text | ❌ NO | Citation/reference source |
| `is_fcps_pearl` | Boolean | ❌ NO | **true** or **false** (default: false) |
| `fcps_pearl_content` | Text | ❌ NO | FCPS Pearl note (use if is_fcps_pearl=true) |

---

## 📁 Template Files

Located in `formatted_files/` folder:

### 1. **MCQ_IMPORT_TEMPLATE_FINAL.csv** (RECOMMENDED)
- Pre-filled with 4 working examples
- Different subjects (Physiology, Anatomy, Pharmacology, Pathology)
- All formatting rules correctly applied
- **Copy this and replace examples with your data**

### 2. **MCQ_TEMPLATE_BLANK.csv**
- Blank template with 3 rows
- Placeholders for all fields
- For starting completely from scratch

### 3. **MCQ_TEMPLATE_GUIDE.md**
- Quick reference guide
- Column descriptions
- Common errors & fixes

---

## 🔧 Step-by-Step Import Process

### Step 1: Get Your Block IDs

Run this in browser console:
```javascript
fetch('http://localhost:3000/api/blocks')
  .then(r => r.json())
  .then(d => {
    console.log('Your Blocks:');
    d.blocks.forEach(b => {
      console.log(`${b.title}: ${b.id}`);
    });
  });
```

Copy the output - you'll need these IDs or block names.

### Step 2: Prepare Your CSV File

1. Download **`MCQ_IMPORT_TEMPLATE_FINAL.csv`** from `formatted_files/`
2. Open in text editor (NOT Excel)
3. Replace example MCQs with your data
4. Keep exact column order
5. Quote any field containing commas: `"Microcytic, hypochromic"`
6. Save as UTF-8

### Step 3: Verify Format

Checklist before upload:
- [ ] CSV saved as `.csv` file
- [ ] Encoding is UTF-8
- [ ] Column order matches template exactly
- [ ] All `correct_answer` values are single lowercase letters (a-e)
- [ ] Block names match exactly (check spelling)
- [ ] Difficulty is one of: Easy, Medium, Hard
- [ ] Fields with commas are quoted
- [ ] No smart quotes or dashes
- [ ] No blank rows at end

### Step 4: Import via Admin Panel

1. Start your dev server: `npm run dev`
2. Go to: `http://localhost:3000/admin/import`
3. Select your CSV file
4. Choose block from dropdown (or auto-detected)
5. Optionally select sub-subject
6. Click "Preview CSV" (recommended first time)
7. Click "Import MCQs"

### Step 5: Verify Success

```javascript
fetch('http://localhost:3000/api/blocks')
  .then(r => r.json())
  .then(d => {
    console.log('Block MCQ Counts:');
    d.blocks.forEach(b => {
      console.log(`${b.title}: ${b.mcqs?.length || 0} MCQs`);
    });
  });
```

You should see non-zero MCQ counts for your block!

---

## 📊 Import via Admin Panel

### User Interface

The admin import page (`/admin/import`) provides:

1. **File Upload**
   - Drag & drop or click to select CSV
   - Shows selected file name

2. **Block Selection**
   - Dropdown with all available blocks
   - Auto-detects if block_name in CSV matches

3. **Sub-Subject Selection** (Optional)
   - Only shows if block has sub-subjects
   - Leave blank to auto-assign

4. **FCPS Pearl Option**
   - Checkbox to mark all imported MCQs as FCPS Pearls

5. **Preview & Import Buttons**
   - Preview CSV before importing
   - Shows header fields and first row preview
   - Displays any validation issues
   - Import button triggers the actual import

### Expected Format in Admin Panel

The CSV format shown on the import page:
```
block_name,sub_subject_name,question,case_study,option_a,option_b,option_c,option_d,option_e,correct_answer,explanation_a,explanation_b,explanation_c,explanation_d,explanation_e,difficulty,image_url,references,is_fcps_pearl,fcps_pearl_content
```

**Note:** Optional fields that can be left empty:
- sub_subject_name
- option_e
- explanation_e
- image_url
- references
- is_fcps_pearl
- fcps_pearl_content

---

## ❌ Common Errors & Solutions

### Error: `Invalid correct_answer: Macrocytic hypochromic`

**Cause:** Comma in option text not quoted

**Fix:**
```csv
# WRONG:
option_a,option_b,option_c,option_d,option_e,correct_answer
Microcytic, hypochromic,...

# CORRECT:
option_a,option_b,option_c,option_d,option_e,correct_answer
"Microcytic, hypochromic",...
```

---

### Error: `Invalid correct_answer: A`

**Cause:** Uppercase instead of lowercase

**Fix:** Change `A` to `a` (lowercase only)

---

### Error: `Block not found: "Physiology "`

**Cause:** Extra space or typo in block name

**Fix:** Check exact spelling:
- `Physiology` ✅
- `Physiology ` ❌ (extra space)
- `physiology` ❌ (lowercase)

---

### Error: `Missing required field: question`

**Cause:** Question column is empty or column header misspelled

**Fix:**
- Verify column header is `question` (not `Question` or `questions`)
- Ensure at least one question value exists
- Check column order matches template exactly

---

### Error: `400 Bad Request`

**Cause:** Malformed CSV format

**Fix:**
1. Re-save CSV in UTF-8 (no BOM)
2. Check all fields with commas are quoted
3. Verify no unescaped quotes in fields
4. Test with MCQ_IMPORT_TEMPLATE_FINAL.csv first
5. Remove any blank rows at end of file

---

### Error: `Column not found`

**Cause:** CSV header columns don't match expected format

**Fix:** Copy header from template file:
```
block_name,sub_subject_name,question,case_study,option_a,option_b,option_c,option_d,option_e,correct_answer,explanation_a,explanation_b,explanation_c,explanation_d,explanation_e,difficulty,image_url,references,is_fcps_pearl,fcps_pearl_content
```

---

## ✅ Best Practices

### 1. **Start Small**
Import 5-10 MCQs first to test format before bulk import

### 2. **Use Templates**
Always start from `MCQ_IMPORT_TEMPLATE_FINAL.csv`, don't create your own

### 3. **Use Text Editor**
Edit CSV in VS Code, Notepad++, or Sublime Text
- NOT Excel (adds unwanted formatting)
- NOT Google Sheets (encoding issues)

### 4. **Backup Original Data**
Keep original MCQ spreadsheet in case of import failure

### 5. **Check Block Names**
Verify block names match exactly using the console script in Step 1

### 6. **Batch Size**
Import 50-100 MCQs at a time for reliability
- Smaller batches = easier to debug if errors
- Larger batches = fewer requests

### 7. **Difficulty Distribution**
Vary difficulty levels in your data:
- 40% Easy
- 40% Medium
- 20% Hard

### 8. **Explanations**
Always provide detailed explanations
- Helps students learn
- Makes review effective
- Start with "CORRECT:" or "Wrong:" prefix

### 9. **Test Functionality**
After import, test in quiz:
1. Take a practice quiz
2. Verify options display correctly
3. Verify correct answer is marked
4. Check explanations appear properly

### 10. **Document Your Data**
Keep notes on:
- Source of MCQs (textbook, exam bank, etc.)
- Date imported
- Any modifications made
- Known errors or issues

---

## 📚 Block IDs Reference

Run this command to get current block IDs:

```javascript
fetch('http://localhost:3000/api/blocks')
  .then(r => r.json())
  .then(d => {
    const csv = d.blocks.map(b => `${b.title},${b.id}`).join('\n');
    console.log('Block Name,Block ID');
    console.log(csv);
  });
```

### Common Block Names:

| Block Name | Purpose |
|------------|---------|
| Physiology | General physiology & blood physiology |
| Anatomy | General anatomy & regional anatomy |
| Pharmacology | Pharmacology & drugs |
| Pathology | Pathology & disease processes |
| Biochemistry | Biochemistry & metabolism |
| Microbiology | Microbiology & infections |

---

## 🎯 Complete Example

### Example CSV Row (Properly Formatted):

```csv
Physiology,,"A 30-year-old woman has a haemoglobin of 8 g/dL with an MCV of 70 fL and low serum ferritin. Which red-cell index pattern best fits her anaemia?","30-year-old woman; Hb 8 g/dL, MCV 70 fL, low serum ferritin.","Microcytic, hypochromic","Macrocytic, normochromic","Normocytic, normochromic","Macrocytic, hypochromic","Microcytic, hyperchromic",a,"CORRECT: Low ferritin indicates iron deficiency; reduced haemoglobin synthesis yields small cells (low MCV) that are pale (low MCHC) - microcytic, hypochromic anaemia.","Macrocytic, normochromic - fits B12/folate deficiency where MCV is high not low.","Normocytic, normochromic - fits acute blood loss or anaemia of chronic disease with a normal MCV.","Macrocytic, hypochromic - not a recognised pattern; macrocytes are not hypochromic.","Microcytic, hyperchromic - hyperchromia does not occur; small cells hold less not more Hb.",Easy,,,false,
```

---

## 📞 Troubleshooting

### Import shows "0 inserted"
- Check if block_id is valid
- Verify RLS policies allow inserts
- Check Supabase connection

### MCQs import but don't appear in quiz
- Verify block assignment
- Check sub_subject assignment
- Refresh browser cache (Ctrl+F5)

### Special characters not displaying correctly
- Ensure CSV is saved as UTF-8 (no BOM)
- Avoid smart quotes and smart dashes
- Use standard ASCII punctuation

---

## 🔄 Supabase Direct Import (Alternative)

If admin panel doesn't work:

1. Go to: `https://app.supabase.com` → Your Project
2. Click: `mcqs` table
3. Click: "Insert" → "Insert from CSV"
4. Upload your CSV file
5. Map columns to table schema
6. Click Import

**Note:** Admin panel is preferred for validation and error checking.

---

## ✨ Tips & Tricks

### CSV Validation Script
Test your CSV before uploading:
```bash
# Using Node.js
node -e "
const csv = require('csv-parse/sync');
const fs = require('fs');
const data = fs.readFileSync('your-file.csv', 'utf-8');
const records = csv.parse(data, { columns: true });
console.log('Rows:', records.length);
console.log('Columns:', Object.keys(records[0]));
records.forEach((r, i) => {
  if (!['a','b','c','d','e'].includes(r.correct_answer)) {
    console.warn(`Row ${i+1}: Invalid correct_answer: ${r.correct_answer}`);
  }
});
"
```

### Generate CSV from JSON
```javascript
const mcqs = [...]; // Your data
const csv = [
  ['block_name','question','case_study','option_a','option_b','option_c','option_d','option_e','correct_answer',...].join(','),
  ...mcqs.map(q => [
    'Physiology',
    `"${q.question}"`,
    `"${q.caseStudy}"`,
    `"${q.optionA}"`,
    // etc.
  ].join(','))
].join('\n');
```

---

## 📝 Version History

- **v2.0** (Aug 24, 2026): Consolidated all MCQ documentation, added `formatted_files/` folder structure
- **v1.5** (Aug 24, 2026): Fixed CSV format issues, created working templates
- **v1.0** (Jul 2, 2026): Initial CSV import guide

---

**Last Updated:** August 24, 2026

For questions or issues, refer to the specific error in "Common Errors & Solutions" section above.
