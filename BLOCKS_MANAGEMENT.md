# Managing Blocks & MCQs Guide

## 📊 Current Data Architecture

### Where Data Comes From:

```
Dashboard (/app/dashboard/page.tsx)
    ↓
Imports BLOCKS from lib/blocks.ts
    ↓
Hardcoded MCQ blocks with questions
```

Currently, all blocks are hardcoded in `lib/blocks.ts`.

---

## 🎯 How to Add & Update Blocks

### **Method 1: Edit Hardcoded File (Quick)**

**File:** `lib/blocks.ts`

**Advantages:**
- ✅ Instant updates
- ✅ No database required
- ✅ Offline editing

**How to add a block:**

```typescript
// Add this to BLOCKS array in lib/blocks.ts

{
  id: "block-7",
  title: "Your Block Title",
  specialty: "Your Specialty",
  description: "Block description",
  difficulty: "Medium",
  color: "from-purple-600 to-purple-800",
  icon: "🧠",
  mcqs: [
    {
      id: "b7q1",
      caseStudy: "Patient case here...",
      image: {
        type: "chest-xray", // or ecg, brain-ct, etc.
        caption: "Image caption",
        finding: "What to look for"
      },
      options: [
        { label: "A", text: "Option A text" },
        { label: "B", text: "Option B text" },
        { label: "C", text: "Option C text" },
        { label: "D", text: "Option D text" }
      ],
      correctIndex: 1, // Index of correct option (0-3)
      explanation: {
        correct: "Why this is correct...",
        incorrect: [
          "Why A is wrong...",
          "Why C is wrong...",
          "Why D is wrong..."
        ]
      }
    }
  ]
}
```

---

### **Method 2: Database Admin Panel (Professional)**

**Access:** `/admin/blocks`

**Advantages:**
- ✅ Web-based interface
- ✅ No coding required
- ✅ Scalable for many blocks
- ✅ Real-time updates

**How to use:**

1. Go to `http://localhost:3000/admin/blocks`
2. Click "+ Add New Block"
3. Fill in:
   - Block Title
   - Specialty
   - Description
   - Icon (emoji)
   - Difficulty (Easy/Medium/Hard)
4. Click "Create Block"

**Database Tables:**

```sql
-- blocks table
- id (UUID)
- title (text)
- specialty (text)
- description (text)
- icon (text)
- color (text)
- difficulty (text)
- total_mcqs (number)
- created_at (timestamp)

-- mcqs table
- id (UUID)
- block_id (UUID) → references blocks.id
- case_study (text)
- question (text)
- image_url (text)
- option_a, option_b, option_c, option_d (text)
- correct_answer (text) → a, b, c, or d
- explanation (text)
- explanation_a, explanation_b, explanation_c, explanation_d (text)
- created_at (timestamp)
```

---

## 📝 Block Structure

### Block Properties:

```typescript
interface Block {
  id: string;              // Unique identifier (e.g., "block-1")
  title: string;           // "Cardiovascular System"
  specialty: string;       // "Cardiology"
  description: string;     // "ECG interpretation, heart failure..."
  difficulty: "Easy" | "Medium" | "Hard";
  color: string;          // Tailwind gradient "from-red-600 to-rose-800"
  icon: string;           // Emoji "❤️"
  mcqs: MCQ[];            // Array of questions
}
```

### MCQ Properties:

```typescript
interface MCQ {
  id: string;
  caseStudy: string;           // Patient scenario
  image: {
    type: "chest-xray" | "ecg" | "brain-ct" | "hand-xray" | ...;
    caption: string;           // "12-lead ECG"
    finding?: string;          // What to look for
  };
  options: {                    // Always 4 options
    label: string;             // "A", "B", "C", "D"
    text: string;              // Option text
  }[];
  correctIndex: number;        // 0-3 (which option is correct)
  explanation: {
    correct: string;           // Why correct answer is right
    incorrect: string[];       // [A explanation, C explanation, D explanation]
                               // (skip correct index)
  };
}
```

---

## 🎨 Color Gradients for Blocks

Use these Tailwind gradients:

```
Cardiology:     "from-red-600 to-rose-800"
Dermatology:    "from-pink-600 to-rose-800"
Neurology:      "from-purple-600 to-indigo-800"
Pediatrics:     "from-yellow-600 to-amber-800"
Surgery:        "from-orange-600 to-red-800"
Internal:       "from-blue-600 to-cyan-800"
Psychiatry:     "from-indigo-600 to-purple-800"
Orthopedics:    "from-green-600 to-emerald-800"
Ophthalmology:  "from-cyan-600 to-blue-800"
```

---

## 📱 Image Types Available

```
"chest-xray"      - Chest X-rays
"ecg"             - ECG tracings
"brain-ct"        - CT brain scans
"hand-xray"       - Hand X-rays
"knee-xray"       - Knee X-rays
"abdominal-xray"  - Abdominal X-rays
"thyroid-scan"    - Thyroid scans
"histology"       - Histology slides
"fundoscopy"      - Fundus images
"urine-dipstick"  - Urinalysis
"mri-knee"        - MRI knee
"peripheral-smear" - Blood smears
```

---

## 🔄 API Endpoints

### GET /api/blocks
Fetch all blocks with MCQs

**Response:**
```json
{
  "blocks": [
    {
      "id": "block-1",
      "title": "Cardiovascular System",
      "specialty": "Cardiology",
      "description": "...",
      "total_mcqs": 5,
      "mcqs": [...]
    }
  ]
}
```

### POST /api/blocks
Create new block

**Request:**
```json
{
  "title": "New Block",
  "specialty": "Cardiology",
  "description": "...",
  "icon": "❤️",
  "color": "from-red-600 to-rose-800",
  "difficulty": "Medium",
  "mcqs": []
}
```

---

## 🎯 Dashboard Data Flow (Current)

```
Dashboard (/app/dashboard/page.tsx)
    ↓
Imports: import { BLOCKS } from "@/lib/blocks"
    ↓
Maps BLOCKS array
    ↓
Displays block grid with stats
```

**To switch to database-driven:**

```typescript
// In dashboard/page.tsx, replace the import with:

useEffect(() => {
  fetch('/api/blocks')
    .then(res => res.json())
    .then(data => setBlocks(data.blocks))
}, [])
```

---

## ✅ Next Steps

1. **Quick:** Add blocks to `lib/blocks.ts`
2. **Professional:** Use `/admin/blocks` panel
3. **Advanced:** Fetch from API in dashboard

---

## 📞 Need Help?

- Add new MCQs → Edit block in `lib/blocks.ts`
- Change block colors → Update `color` property
- Add block images → Use image `type` from list above
- Update explanations → Edit `explanation` object

All changes are instant and appear immediately on the dashboard! 🚀
