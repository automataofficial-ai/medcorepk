# ✅ Image Management System - Setup Checklist

## **Phase 1: Supabase Configuration** (5 minutes)

### Storage Setup
- [ ] Open Supabase Dashboard
- [ ] Go to **Storage** → **Buckets**
- [ ] Create new bucket named: `mcq-images`
- [ ] **Make it PUBLIC** (toggle the switch)
- [ ] Click **Create Bucket**

### Database Setup
- [ ] Go to **SQL Editor**
- [ ] Copy the SQL from `IMAGE_MANAGEMENT_GUIDE.md` (Section: "Create Images Table")
- [ ] Paste and run the query
- [ ] Wait for execution to complete ✓

---

## **Phase 2: System Ready**

Once Supabase is set up, you can:

### 📸 **Upload Images**
- URL: `http://localhost:3000/admin/images`
- Upload medical images directly
- Organize by category
- Add descriptions
- Get public URLs

### 📋 **Use Images**
```
Copy URL → Paste in MCQ image_url field
```

---

## **Three Ways to Add Images to MCQs**

### **Method 1: Manual URL (Easiest)**
1. Upload image in `/admin/images`
2. Click "Copy URL" button
3. In MCQs table: Set `image_url` = copied URL
4. Done! ✅

### **Method 2: Database Direct**
```sql
UPDATE mcqs 
SET image_url = 'https://your-supabase-url/...' 
WHERE id = 'mcq-id';
```

### **Method 3: API Integration (Advanced)**
Use the `/api/images` endpoints programmatically

---

## **File Structure**

```
New Files Created:
├── app/api/images/
│   ├── route.ts (List & Delete images)
│   └── upload/
│       └── route.ts (Upload images)
├── app/admin/images/
│   └── page.tsx (Image management UI)
├── IMAGE_MANAGEMENT_GUIDE.md (Full guide)
└── SETUP_CHECKLIST.md (This file)
```

---

## **Quick Test**

After setup:
1. Login to your MedCore app
2. Go to `http://localhost:3000/admin/images`
3. Try uploading a test image
4. Copy the URL
5. Verify it works ✓

---

## **Database Schema**

```
images table:
- id (UUID)
- user_id (FK to auth.users)
- title (text)
- description (text)
- category (text)
- file_path (path in storage)
- public_url (URL to image)
- file_size (bytes)
- file_type (mime type)
- created_at (timestamp)
- updated_at (timestamp)
```

---

## **Categories Available**

- ✅ Radiology
- ✅ Histology
- ✅ ECG
- ✅ Ultrasound
- ✅ CT Scan
- ✅ MRI
- ✅ Pathology
- ✅ Clinical
- ✅ Anatomy
- ✅ Other

---

## **Important Notes**

⚠️ **Storage Bucket MUST be PUBLIC**
- Without this, images won't display

⚠️ **Run SQL query BEFORE uploading**
- Images table must exist first

⚠️ **File size limit: 10MB**
- Recommended: 1-5MB for best performance

⚠️ **Format support: JPG, PNG, GIF, WebP**
- JPG recommended for medical images

---

## **Troubleshooting**

| Problem | Solution |
|---------|----------|
| Upload fails | Check bucket is public |
| Image not showing | Verify bucket name is `mcq-images` |
| "Table not found" error | Run the SQL query from Phase 1 |
| URL not working | Clear cache, try different image |

---

## **Support Resources**

📖 Full guide: `IMAGE_MANAGEMENT_GUIDE.md`
🎯 API docs: In the guide
💻 Example code: In the guide
❓ Issues: Check browser console

---

**Status: READY FOR SETUP** ✅

Next step: Run the Supabase setup instructions in Phase 1
