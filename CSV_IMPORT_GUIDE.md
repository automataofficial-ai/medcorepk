# MCQ CSV Import Guide

## 📋 CSV Format Specification

Your CSV file should have these columns (in this exact order):

```
block_id,question,case_study,option_a,option_b,option_c,option_d,correct_answer,explanation_a,explanation_b,explanation_c,explanation_d,explanation_summary,difficulty,subject,citation,notes
```

## 📝 Example CSV Format

Create a file called `mcqs.csv`:

```csv
block_id,question,case_study,option_a,option_b,option_c,option_d,correct_answer,explanation_a,explanation_b,explanation_c,explanation_d,explanation_summary,difficulty,subject,citation,notes
550e8400-e29b-41d4-a716-446655440000,"What is the normal blood pressure?","A 30-year-old healthy male presents for routine checkup","Less than 90/60 mmHg","120/80 mmHg","140/90 mmHg","160/100 mmHg","b","Hypotensive","CORRECT: Normal BP is <120/80","Prehypertension","Hypertension Stage 1","Normal blood pressure is below 120/80 mmHg","Easy","Physiology","Guyton Textbook","Cardiovascular basics"
550e8400-e29b-41d4-a716-446655440000,"What causes left ventricular hypertrophy?","A patient with 20 years of hypertension","Aortic stenosis","Chronic hypertension","Mitral regurgitation","Aortic regurgitation","b","Wrong - aortic stenosis causes concentric LVH but not primary cause","CORRECT: Chronic HTN leads to LVH from increased afterload","Wrong - mitral regurgitation is compensatory","Wrong - aortic regurgitation causes eccentric LVH","Chronic hypertension is the most common cause of LVH","Medium","Pathology","Harrison's Principles","Cardiac pathology"
```

**Key Rules:**
- Use `block_id`: Get this from Supabase (see Step 1)
- `correct_answer`: Should be `a`, `b`, `c`, or `d` (lowercase)
- `difficulty`: Use `Easy`, `Medium`, or `Hard`
- Text fields: Wrap in quotes if they contain commas
- Empty fields: Leave blank (don't remove the comma)

---

## 🔧 Step-by-Step Import Process

### Step 1: Get Your Block IDs

Run this in browser console to see your blocks:

```javascript
fetch('http://localhost:3000/api/blocks')
  .then(r => r.json())
  .then(d => {
    console.log('Your Blocks:');
    d.blocks.forEach(b => {
      console.log(`${b.title}: ${b.id}`);
    });
    // Save this output for your CSV
  });
```

**Copy the output** - you'll need the block IDs for your CSV.

### Step 2: Prepare Your CSV File

1. **Get your MCQ data** (from exam provider, textbook, existing database)
2. **Create `mcqs.csv`** with the format above
3. **Replace block_id** with actual IDs from Step 1
4. **Save in project root** (`e:\medcorepk\mcqs.csv`)

### Step 3: Use Import Script

Create this file: `e:\medcorepk\import-mcqs.js`

```javascript
const fs = require('fs');
const csv = require('csv-parse/sync');
const fetch = require('node-fetch');

async function importMCQs() {
  try {
    // Read CSV file
    const fileContent = fs.readFileSync('./mcqs.csv', 'utf-8');
    const records = csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    console.log(`📚 Found ${records.length} MCQs to import\n`);

    // Import in batches
    const batchSize = 50;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      // Convert correct_answer to letter if needed
      const mcqs = batch.map(r => ({
        block_id: r.block_id.trim(),
        question: r.question.trim(),
        case_study: r.case_study?.trim() || null,
        option_a: r.option_a.trim(),
        option_b: r.option_b.trim(),
        option_c: r.option_c.trim(),
        option_d: r.option_d.trim(),
        correct_answer: r.correct_answer.toLowerCase().trim(),
        explanation_a: r.explanation_a?.trim() || '',
        explanation_b: r.explanation_b?.trim() || '',
        explanation_c: r.explanation_c?.trim() || '',
        explanation_d: r.explanation_d?.trim() || '',
        explanation_summary: r.explanation_summary?.trim() || null,
        difficulty: r.difficulty.trim(),
        subject: r.subject?.trim() || null,
        citation: r.citation?.trim() || null,
        notes: r.notes?.trim() || null,
      }));

      // Send to API
      const response = await fetch('http://localhost:3000/api/import/mcqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mcqs })
      });

      const result = await response.json();
      console.log(`✅ Batch ${Math.floor(i / batchSize) + 1}: ${result.inserted || 0} MCQs inserted`);
    }

    console.log(`\n✅ Import complete!`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

importMCQs();
```

Then run:
```bash
npm install csv-parse node-fetch
node import-mcqs.js
```

### Step 4: Create Import API Endpoint

I'll create this for you. Let me make the endpoint that accepts CSV data:

---

## 🗄️ Supabase Direct Import (Alternative)

If you prefer using Supabase directly:

1. **Go to**: https://app.supabase.com → Your Project
2. **Click**: `mcqs` table
3. **Click**: "Insert" → "Insert from CSV"
4. **Upload** your `mcqs.csv` file
5. **Map columns** to match your table schema
6. **Click Import**

---

## ✅ Verify Import Success

After importing, run this:

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

You should see MCQ counts > 0 for each block!

---

## 📊 CSV Generator (If You Need Test Data)

Want to generate sample MCQs in CSV format? Run this:

```javascript
const fs = require('fs');

// Get block IDs first
const blocks = {
  'anatomy': 'your-block-id-1',
  'physiology': 'your-block-id-2',
  // etc...
};

let csv = 'block_id,question,case_study,option_a,option_b,option_c,option_d,correct_answer,explanation_a,explanation_b,explanation_c,explanation_d,explanation_summary,difficulty,subject,citation,notes\n';

for (let i = 1; i <= 10; i++) {
  csv += `${blocks.anatomy},"Question ${i}","Case study ${i}","Wrong A","Correct B","Wrong C","Wrong D","b","Incorrect","Correct","Incorrect","Incorrect","Explanation for Q${i}","Easy","Anatomy","Citation","Notes"\n`;
}

fs.writeFileSync('mcqs.csv', csv);
console.log('✅ Generated mcqs.csv with 10 sample questions');
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid block_id" | Verify block IDs are correct UUIDs from Step 1 |
| "Column not found" | Ensure CSV headers match exactly (lowercase, correct spelling) |
| "Duplicate entries" | Add unique identifiers or check for duplicates in your data |
| "Only 0 inserted" | Check Supabase RLS policies allow inserts |
| "CSV parse error" | Ensure quotes around fields with commas |

---

## 📋 Your Next Steps

1. ✅ Get block IDs (run console script in Step 1)
2. ✅ Prepare your MCQs in CSV format
3. ✅ Choose import method (Script or Supabase UI)
4. ✅ Import the CSV
5. ✅ Verify with the check script
6. ✅ Test quiz functionality!

---

## 💡 Tips

- **Start small**: Import 10-20 MCQs first to test
- **Test format**: Verify your CSV with a sample batch
- **Batch size**: Import 50 at a time for reliability
- **Backup**: Keep original CSV file
- **Headers matter**: Exact column names required

Ready to import? Let me know when you have your CSV ready! 🚀
