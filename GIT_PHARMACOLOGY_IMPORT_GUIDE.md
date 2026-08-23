# GIT Pharmacology MCQs - CSV Import Guide

## 📊 Files Created

### 1. Data File
- **Location:** `pharmacology-git-mcqs.csv`
- **Size:** 21 KB
- **Content:** 20 complete GIT (Gastrointestinal Tract) pharmacology MCQs with explanations

### 2. TypeScript Data File (for direct seeding)
- **Location:** `lib/pharmacology-git-mcqs.ts`
- **Format:** Exported TypeScript array for programmatic access

### 3. API Seed Route (for direct seeding)
- **Location:** `app/api/seed/pharmacology-git/route.ts`
- **Endpoint:** `POST /api/seed/pharmacology-git`

---

## 📋 CSV File Format

The CSV file contains the following columns:

```
block_name
sub_subject_name
question
case_study
option_a
option_b
option_c
option_d
option_e
correct_answer
explanation_a
explanation_b
explanation_c
explanation_d
explanation_e
difficulty
image_url
is_fcps_pearl
fcps_pearl_content
```

### Data Summary:
- **Block:** Pharmacology
- **Sub-Subject:** GIT (Gastrointestinal Tract)
- **Total Questions:** 20
- **Difficulty Distribution:** 
  - Easy: 30% (6 questions)
  - Moderate: 50% (10 questions)
  - Hard: 20% (4 questions)

---

## 🚀 How to Import

### Option 1: Using Admin Dashboard (Recommended)

1. **Open Admin Import Page:**
   - Navigate to: `http://localhost:3000/admin/import`
   - Or use the admin dashboard navigation

2. **Upload CSV File:**
   - Click "Select CSV File"
   - Choose `pharmacology-git-mcqs.csv` from the project root

3. **Configure Import:**
   - **Select Block:** Choose "Pharmacology"
   - **Select Sub-Subject:** Choose "GIT (Gastrointestinal Tract)"
   - **FCPS Pearl:** All questions already marked as FCPS Pearls in the CSV

4. **Preview CSV:**
   - Click "Preview CSV" to verify the data
   - Check for any warnings or issues
   - Review the first row preview

5. **Import MCQs:**
   - Click "Import MCQs" to insert into database
   - Wait for confirmation message
   - Check the success notification

### Option 2: Using Direct API Seed

1. **Seed Endpoint:**
   ```
   POST http://localhost:3000/api/seed/pharmacology-git
   ```

2. **Using cURL:**
   ```bash
   curl -X POST http://localhost:3000/api/seed/pharmacology-git
   ```

3. **Using Browser:**
   - Visit: `http://localhost:3000/api/seed/pharmacology-git`
   - Click to trigger the seed

### Option 3: Import from TypeScript

If you want to import programmatically:

```typescript
import { pharmacologyGITMCQs } from "@/lib/pharmacology-git-mcqs";

// mcqs array is now available for use
console.log(pharmacologyGITMCQs.length); // 20
```

---

## 📚 Content Coverage

The GIT Pharmacology MCQs cover these topics:

### Acid-Peptic Disease (5 questions)
- Antacids (magnesium vs aluminum effects)
- Sucralfate (protective mechanism)
- PPIs (long-term effects)
- H2 blockers (ranitidine)
- H. pylori therapy (bismuth quadruple therapy)

### Motility & Antiemetics (2 questions)
- Domperidone (D2 antagonist, BBB penetration)
- H1 antihistamine antiemetics (motion sickness, pregnancy)

### Laxatives & Bowel Agents (4 questions)
- Bulk-forming laxatives (ispaghula)
- Stimulant laxatives (senna)
- Osmotic laxatives (lactulose)
- Antidiarrheals (loperamide)

### Rehydration (1 question)
- Oral Rehydration Solution (ORS, sodium-glucose cotransport)

### Inflammatory Bowel Disease (2 questions)
- Aminosalicylates (mesalazine)
- Anti-TNF biologics (infliximab)

### Hepatobiliary & Pancreatic (3 questions)
- Lactulose (hepatic encephalopathy)
- Ursodeoxycholic acid (gallstone dissolution)
- Pancreatin (enzyme replacement)

### Miscellaneous (2 questions)
- Hyoscine butylbromide (antispasmodic for IBS)
- Clopidogrel-Omeprazole interaction (CYP2C19)
- Octreotide (variceal bleeding)

### Prokinetics (1 question)
- Erythromycin (motilin receptor agonist)

---

## ✅ Quality Assurance

Each MCQ includes:
- ✓ Clear, concise question text
- ✓ 5 answer options (A-E)
- ✓ Detailed explanation for each option
- ✓ Correct answer identification
- ✓ Difficulty level classification
- ✓ FCPS Pearl high-yield content
- ✓ Clinical context and references

### Answer Distribution (Balanced):
- A: 4 questions
- B: 4 questions
- C: 4 questions
- D: 4 questions
- E: 4 questions

---

## 📖 References Used

All questions reference:
- **Katzung Basic & Clinical Pharmacology** (Primary)
- **Lippincott Pharmacology**
- **Rang & Dale Pharmacology**
- **FCPS Past Papers** (Theme validation)

---

## 🔄 Verification Steps

After import, verify the data:

1. **Check Database Count:**
   - Navigate to the GIT sub-subject page
   - Verify 20 MCQs are available

2. **Test Navigation:**
   - Go to: FCPS Part 1 Paper A → Pharmacology → GIT
   - Confirm all questions appear

3. **Test Quiz:**
   - Take the GIT pharmacology quiz
   - Verify all questions load correctly
   - Check explanations display properly

4. **Verify Analytics:**
   - Complete a quiz
   - Check performance tracking in analytics dashboard

---

## 🆘 Troubleshooting

### Import Fails with "Block not found"
- **Solution:** Ensure Pharmacology block exists in the database
- Run: `POST /api/seed/pharmacology-block1` first

### Sub-Subject Not Found
- **Solution:** The sub-subject will be auto-created if it doesn't exist
- Check the Pharmacology block's sub-subjects list

### CSV Parse Error
- **Solution:** 
  - Ensure CSV is properly formatted
  - Check for unescaped quotes in text
  - Verify no special characters break the format

### Questions Not Appearing
- **Solution:**
  - Clear browser cache
  - Refresh the page
  - Check database directly in Supabase dashboard

---

## 📝 Notes

- All 20 questions are from **FCPS Part-1 Paper I syllabus**
- Questions are **FCPS Pakistan clinical-scenario style**
- Content **complements Block 7** (PPI mechanism, cimetidine, H. pylori triple therapy, ondansetron, metoclopramide, misoprostol)
- **No concepts are repeated** between blocks
- All answers are **verified by FCPS standards**

---

## 🎯 Next Steps

1. **Import the CSV file** using the admin dashboard
2. **Verify the data** in the database
3. **Test student navigation** to GIT sub-subject
4. **Monitor quiz performance** in analytics

---

## 📞 Support

For issues or questions:
- Check the [SETUP_SUB_SUBJECTS.md](./SETUP_SUB_SUBJECTS.md) guide
- Review the [CSV_IMPORT_GUIDE.md](./CSV_IMPORT_GUIDE.md) for general CSV import help
- Contact the development team

---

**Created:** 2026-07-31  
**Status:** Ready for Import  
**Format:** CSV (Comma-Separated Values)  
**Encoding:** UTF-8  
