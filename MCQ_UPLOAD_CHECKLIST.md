# MCQ CSV Upload Checklist

Use this checklist before uploading your MCQ CSV file to ensure everything is correct.

## Pre-Upload Checks

### CSV File Format
- [ ] File is saved as `.csv` (not `.xlsx` or `.xls`)
- [ ] Using UTF-8 encoding (not ANSI)
- [ ] All 17 required columns are present in header row
- [ ] No extra blank columns at the end
- [ ] No blank rows between MCQs

### Column Headers (in order)
- [ ] block_id
- [ ] question
- [ ] case_study
- [ ] option_a
- [ ] option_b
- [ ] option_c
- [ ] option_d
- [ ] correct_answer
- [ ] explanation_a
- [ ] explanation_b
- [ ] explanation_c
- [ ] explanation_d
- [ ] explanation_summary
- [ ] difficulty
- [ ] subject
- [ ] citation
- [ ] notes

### Data Validation

#### Block IDs
- [ ] All block_ids are valid UUIDs (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
- [ ] All block_ids exist in the system (verified via Admin > Blocks)
- [ ] No typos or extra spaces in block_ids
- [ ] Using consistent block_ids for MCQs in same subject

#### Questions & Case Studies
- [ ] question field is not empty
- [ ] case_study field is not empty
- [ ] Both provide clear clinical context
- [ ] No extremely long text (keep under 500 characters per field)
- [ ] Proper spelling and grammar checked
- [ ] Medical terminology is accurate

#### Options (A, B, C, D)
- [ ] All four options are present (option_a, option_b, option_c, option_d)
- [ ] No option is empty
- [ ] Options are distinct and plausible
- [ ] No obvious duplicates among the four options
- [ ] Options are concise (2-100 characters typically)

#### Correct Answer
- [ ] correct_answer is only `a`, `b`, `c`, or `d` (lowercase)
- [ ] Matches one of the four options
- [ ] No typos or uppercase letters
- [ ] Verified to be actually correct

#### Explanations
- [ ] explanation_a explains why option A is right/wrong
- [ ] explanation_b explains why option B is right/wrong
- [ ] explanation_c explains why option C is right/wrong
- [ ] explanation_d explains why option D is right/wrong
- [ ] explanation_summary provides key learning point
- [ ] Explanations are clear and educational
- [ ] Correct answer explanation starts with "CORRECT:" for clarity
- [ ] Incorrect answer explanations clearly state why they're wrong

#### Difficulty
- [ ] difficulty is one of: `Easy`, `Medium`, or `Hard` (capitalized)
- [ ] Difficulty assignment is appropriate for question level
- [ ] Consistent difficulty distribution (not all Hard)

#### Subject
- [ ] subject is filled for every row
- [ ] Subject names are consistent (e.g., "Pharmacology" not "pharmacology")
- [ ] Subject matches block content
- [ ] Common medical subjects used (Physiology, Pharmacology, Anatomy, etc.)

#### Citation
- [ ] citation is filled for every row
- [ ] References actual textbooks or resources
- [ ] Proper format (e.g., "Guyton & Hall", "Harrison's Principles")
- [ ] No placeholder text like "Unknown" or "TBD"

#### Notes
- [ ] notes field is filled (can be brief)
- [ ] Additional context provided where relevant
- [ ] Clinically useful information included

### CSV Formatting Issues

#### Text with Special Characters
- [ ] Commas in text are wrapped in quotes: `"text, with, commas"`
- [ ] Double quotes in text are escaped: `"text with ""quotes"""`
- [ ] No unescaped line breaks within cells
- [ ] Unicode characters display correctly (if any)

#### Empty Fields
- [ ] No completely empty required fields
- [ ] Consistent approach to optional fields
- [ ] Not accidentally deleting content due to formatting

### Pre-Upload System Checks

#### Admin Access
- [ ] Logged into admin panel (`http://localhost:3000/admin`)
- [ ] Have permission to import MCQs
- [ ] Can access import page (`http://localhost:3000/admin/import`)

#### Block Verification
- [ ] Navigated to Admin > Blocks
- [ ] Verified all block_ids exist in system
- [ ] Copied block_ids directly from admin panel (not from memory)
- [ ] Block titles match your CSV subject field

#### Test Upload (Recommended)
- [ ] Extracted single MCQ from CSV for testing
- [ ] Uploaded test MCQ successfully
- [ ] Verified MCQ appears in correct block
- [ ] Checked formatting and explanations display correctly
- [ ] Proceeded with full upload after test success

## Upload Process

### During Upload
- [ ] Navigate to: `http://localhost:3000/admin/import`
- [ ] Select CSV file
- [ ] Click "Upload" or "Import" button
- [ ] Wait for processing to complete (don't refresh page)
- [ ] Watch for success/error messages

### Post-Upload Verification

#### Check Success Messages
- [ ] Received confirmation of imported MCQs
- [ ] Number of imported MCQs matches expected count
- [ ] No error messages in upload response

#### Verify in Database
- [ ] Navigate to block in admin panel
- [ ] See MCQs appear in the list
- [ ] Click into a few MCQs to verify:
  - [ ] Question displays correctly
  - [ ] Case study shows
  - [ ] All 4 options present
  - [ ] Correct answer is marked
  - [ ] Explanations display properly

#### Test User Experience
- [ ] Log out of admin
- [ ] Access `/dashboard` as student
- [ ] Navigate to imported block/subject
- [ ] Start a quiz with imported MCQs
- [ ] Verify formatting and content display correctly
- [ ] Test all study modes (if applicable)

## Common Issues to Watch For

### Issue: "Invalid Block ID"
- [ ] Double-check block_id format (UUID)
- [ ] Verify block exists in Admin > Blocks
- [ ] Copy block_id directly from admin panel
- [ ] Remove any extra spaces

### Issue: "Missing Required Field"
- [ ] Check each column for empty values
- [ ] Ensure all 17 columns have data
- [ ] Look for accidental blank rows

### Issue: "Invalid Correct Answer"
- [ ] Verify correct_answer is `a`, `b`, `c`, or `d` (lowercase)
- [ ] Not uppercase (A, B, C, D)
- [ ] Not a full option text
- [ ] Matches one of the four options

### Issue: "Parsing Error"
- [ ] Check for unescaped quotes in text
- [ ] Verify proper comma escaping
- [ ] Ensure no line breaks within cells
- [ ] File encoding is UTF-8

### Issue: MCQs Appear in Wrong Block
- [ ] Verify block_id column for each row
- [ ] Check for typos in block_ids
- [ ] Ensure not mixing multiple block_ids unintentionally

## Final Sign-Off

Before considering upload complete:
- [ ] All checks passed above
- [ ] Spot-checked 3-5 MCQs in the system
- [ ] Explanations are clear and helpful
- [ ] No duplicate questions found
- [ ] Content is medically accurate
- [ ] Ready for student use

---

**Pro Tips:**
- ✅ Create a backup of your CSV before uploading
- ✅ Use a CSV editor (like LibreOffice Calc) for validation
- ✅ Test with a small batch first
- ✅ Keep detailed records of uploads
- ✅ Review MCQs quarterly for accuracy updates

**Last Updated:** 2026-08-24
