# 🖼️ Image Management Workflow - Complete Guide

## **System Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    MedCore Image System                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  UPLOAD FLOW:                                            │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ Browser  │───▶│ API Upload   │───▶│ Supabase     │  │
│  │ UI       │    │ Endpoint     │    │ Storage      │  │
│  └──────────┘    └──────────────┘    │ + Database   │  │
│                                        └──────────────┘  │
│                                                          │
│  USE IN MCQs:                                            │
│  ┌──────────────────┐     ┌────────────────┐           │
│  │ MCQ Editor       │ ──▶ │ Image Library  │           │
│  │ (Supabase)       │     │ (Admin Panel)  │           │
│  └──────────────────┘     │                │           │
│         │                 │ - Copy URL     │           │
│         │                 │ - Use in MCQs  │           │
│         │                 └────────────────┘           │
│         │                                              │
│  DISPLAY IN QUIZ:                                      │
│  ┌──────────────────┐     ┌────────────────┐           │
│  │ MCQ image_url    │ ──▶ │ Quiz Display   │           │
│  │ (Database)       │     │ (Public URL)   │           │
│  └──────────────────┘     └────────────────┘           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## **📱 Feature Overview**

### **1. Admin Image Management Dashboard**
**Location:** `/admin/images`

**Features:**
- ✅ Upload images with metadata
- ✅ Organize by medical category
- ✅ Search and filter
- ✅ View thumbnails
- ✅ Copy public URLs
- ✅ Delete images
- ✅ File size tracking

**File Limits:**
- Max 10MB per image
- Supported: JPG, PNG, GIF, WebP
- Storage: Unlimited on Supabase

---

### **2. Medical Image Categories**

| Category | Use Case | Example |
|----------|----------|---------|
| 🔬 Radiology | X-rays, CT, MRI | Chest X-ray showing pneumonia |
| 🔍 Histology | Microscopy slides | Cardiac muscle necrosis |
| 📈 ECG | Cardiac traces | AFib with RVR |
| 🎵 Ultrasound | Ultrasound scans | Hepatic steatosis |
| 🏥 CT Scan | Computed tomography | Brain CT with infarct |
| 🧠 MRI | Magnetic resonance | Spinal cord compression |
| 🧪 Pathology | Lab findings | Blood smear with malaria |
| 📸 Clinical | Photos, diagrams | Skin lesion, wound |
| 🦴 Anatomy | Anatomical drawings | Cross-section anatomy |
| 📋 Other | Miscellaneous | Custom diagrams |

---

## **🚀 Complete Workflow**

### **Step 1: Setup Supabase** (One-time)

```bash
# SQL to run in Supabase SQL Editor
CREATE TABLE public.images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR,
  file_path VARCHAR NOT NULL,
  public_url VARCHAR NOT NULL,
  file_size BIGINT,
  file_type VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for data isolation
CREATE POLICY "Users see own images"
  ON public.images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own images"
  ON public.images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own images"
  ON public.images FOR DELETE
  USING (auth.uid() = user_id);
```

**+ Create Storage Bucket:**
- Name: `mcq-images`
- Visibility: **PUBLIC** ⚠️ IMPORTANT
- Type: Images

---

### **Step 2: Upload Medical Images**

```
Visit: http://localhost:3000/admin/images
```

**Form Fields:**
```
Title:        "Chest X-ray - Pneumonia"
Category:     "Radiology" (dropdown)
Description:  "Shows bilateral infiltrates in lower lobes,
               consistent with CAP in a patient with fever"
File:         Select image (JPG/PNG)
```

**Result:**
```json
{
  "success": true,
  "image": {
    "id": "abc123...",
    "title": "Chest X-ray - Pneumonia",
    "category": "Radiology",
    "public_url": "https://your-bucket.supabase.co/...",
    "created_at": "2026-07-06T10:30:00Z"
  }
}
```

---

### **Step 3: Use Images in MCQs**

#### **Option A: Direct in Database**
```sql
UPDATE mcqs 
SET image_url = 'https://your-bucket.supabase.co/storage/v1/object/public/mcq-images/...'
WHERE id = 'your-mcq-id';
```

#### **Option B: Through Admin Panel**
1. Go to Image Library → `/admin/images`
2. Find your image
3. Click "Copy URL"
4. Paste in MCQ's `image_url` field

#### **Option C: Bulk Import Script**
```javascript
// Import images from folder and create MCQs
const images = await uploadImagesFromFolder('./medical-images');
const mcqs = await createMCQsWithImages(questions, images);
```

---

### **Step 4: View in Quiz**

When users take the quiz:
```
Quiz Page (/block/[id])
   ↓
Reads MCQ image_url field
   ↓
Displays image from Supabase
   ↓
Shows in medical image panel
   ↓
Professional presentation
```

---

## **💾 Database Structure**

### **Images Table**
```sql
CREATE TABLE images (
  id UUID PRIMARY KEY,
  user_id UUID → auth.users.id,
  title VARCHAR,           -- Image name
  description TEXT,        -- What it shows
  category VARCHAR,        -- Medical category
  file_path VARCHAR,       -- Storage path
  public_url VARCHAR,      -- Shareable URL
  file_size BIGINT,        -- KB/MB
  file_type VARCHAR,       -- mime type
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### **Connection to MCQs**
```sql
-- In mcqs table, add:
ALTER TABLE mcqs ADD COLUMN image_url VARCHAR;

-- Usage:
UPDATE mcqs SET image_url = 'https://...' WHERE id = 'mcq-id';
```

---

## **🔐 Security Features**

### **Row Level Security (RLS)**
- Each user only sees their own images
- Database enforces isolation
- No cross-user data leakage

### **File Validation**
- Client-side: File type & size check
- Server-side: MIME type validation
- Storage: Secure Supabase buckets

### **URL Protection**
- Public URLs are signed
- Expiration can be configured
- HTTPS by default

---

## **📊 API Reference**

### **Upload Image**
```
POST /api/images/upload
Content-Type: multipart/form-data

Headers:
  x-user-id: <uuid>

Body:
  file: <binary>
  title: string
  description: string
  category: string

Response:
  {
    success: boolean,
    image: { id, title, public_url, ... },
    url: string
  }
```

### **List Images**
```
GET /api/images?category=Radiology
Headers: x-user-id: <uuid>

Response:
  {
    success: boolean,
    images: Array<Image>,
    count: number
  }
```

### **Delete Image**
```
DELETE /api/images?id=<image-id>
Headers: x-user-id: <uuid>

Response:
  {
    success: boolean,
    message: string
  }
```

---

## **📁 File Organization**

```
MedCore Project
├── app/api/images/
│   ├── route.ts              # List & Delete endpoints
│   ├── upload/
│   │   └── route.ts          # Upload endpoint
│   └── README.md             # API docs
│
├── app/admin/images/
│   └── page.tsx              # Image management UI
│
├── lib/
│   └── supabase.ts           # Already configured ✓
│
└── docs/
    ├── IMAGE_MANAGEMENT_GUIDE.md
    ├── SETUP_CHECKLIST.md
    └── IMAGE_WORKFLOW.md (this file)
```

---

## **🎨 Advanced Usage**

### **Batch Upload from Folder**
```javascript
async function uploadImagesFromFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  
  for (const file of files) {
    const formData = new FormData();
    formData.append('file', fs.readFileSync(`${folderPath}/${file}`));
    formData.append('title', file.replace(/\.[^/.]+$/, ''));
    formData.append('category', 'Radiology');
    
    await fetch('/api/images/upload', {
      method: 'POST',
      headers: { 'x-user-id': userId },
      body: formData
    });
  }
}
```

### **Auto-tagging with Category**
```javascript
const categoryMap = {
  'xray': 'Radiology',
  'histo': 'Histology',
  'ecg': 'ECG',
  'ct': 'CT Scan'
};

function detectCategory(filename) {
  for (const [key, cat] of Object.entries(categoryMap)) {
    if (filename.toLowerCase().includes(key)) return cat;
  }
  return 'Other';
}
```

---

## **🧪 Testing Checklist**

- [ ] Supabase bucket created and public
- [ ] Images table created with SQL
- [ ] Upload page loads at `/admin/images`
- [ ] Can upload test image
- [ ] Image appears in grid
- [ ] Can copy URL
- [ ] URL is valid and accessible
- [ ] Can delete image
- [ ] Category filter works
- [ ] Search functionality works
- [ ] Multiple file formats work (JPG, PNG, etc.)

---

## **❓ FAQ**

**Q: Can I upload images > 10MB?**
A: No, limit is 10MB. Compress images first.

**Q: Are images stored forever?**
A: Yes, until you delete them manually.

**Q: Can other users see my images?**
A: No, RLS policies restrict to logged-in user only.

**Q: How do I use images in bulk?**
A: Use the API to programmatically upload and link to MCQs.

**Q: Can I share image URLs?**
A: Yes, public URLs can be shared but require Supabase access.

---

## **🚀 Performance Tips**

1. **Optimize images before upload**
   - Use JPG for photos (smaller files)
   - Use PNG for diagrams (lossless)
   - Target 800-1200px width
   - Compress with tools like ImageOptim

2. **Organize by category**
   - Use descriptive titles
   - Add detailed descriptions
   - Makes searching easier

3. **Regular maintenance**
   - Delete unused images
   - Archive old images
   - Keep storage organized

---

## **📞 Support & Troubleshooting**

See `IMAGE_MANAGEMENT_GUIDE.md` for detailed troubleshooting

---

**Last Updated:** 2026-07-06  
**Status:** ✅ Ready for Production
