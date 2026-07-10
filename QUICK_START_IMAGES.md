# 🚀 Image Management - Quick Start (5 Minutes)

## **Step 1: Supabase Setup** (3 minutes)

### **Create Storage Bucket**
1. Open [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Go to **Storage** → **Buckets**
4. Click **"New Bucket"**
5. Enter name: `mcq-images`
6. Toggle **"Make it public"** ✅
7. Click **"Create bucket"**

### **Create Database Table**
1. Still in Supabase dashboard
2. Go to **SQL Editor**
3. Click **"New Query"**
4. Paste this code:

```sql
CREATE TABLE public.images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR,
  file_path VARCHAR NOT NULL,
  public_url VARCHAR NOT NULL,
  file_size BIGINT,
  file_type VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own images" ON public.images
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users add images" ON public.images
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own images" ON public.images
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_images_user_id ON public.images(user_id);
CREATE INDEX idx_images_category ON public.images(category);
```

5. Click **"Run"**
6. Wait for success ✅

**Done!** Your Supabase is ready.

---

## **Step 2: Test the System** (2 minutes)

### **Start your app**
```bash
npm run dev
# Already running? Go to localhost:3000
```

### **Login**
1. Go to http://localhost:3000
2. Sign in or create account

### **Upload Image**
1. Go to http://localhost:3000/admin/images
2. Fill form:
   - **Title:** "My First Image"
   - **Category:** "Radiology"
   - **Description:** "Test image"
   - **File:** Select any image
3. Click **"Upload Image"**
4. Image appears! ✅

### **Copy URL**
1. Find your image
2. Click **"Copy URL"**
3. Paste anywhere to verify it works ✅

---

## **Step 3: Use in MCQs** (Ongoing)

### **Option A: Database Direct** (Easiest)
```sql
UPDATE mcqs 
SET image_url = '[PASTE_URL_HERE]'
WHERE id = 'your-mcq-id';
```

### **Option B: Supabase Table UI**
1. Open Supabase → Table Editor
2. Click **"mcqs"** table
3. Find your MCQ
4. Paste URL in **image_url** column
5. Save

### **Option C: Admin Form** (If you build it)
Add image selector to MCQ form

---

## **📸 Image Categories**

Upload images with these categories:

- ✅ Radiology (X-rays, CT, MRI)
- ✅ Histology (Microscopy)
- ✅ ECG (Heart traces)
- ✅ Ultrasound
- ✅ CT Scan
- ✅ MRI
- ✅ Pathology (Lab)
- ✅ Clinical (Photos)
- ✅ Anatomy (Diagrams)
- ✅ Other

---

## **✅ Verification Checklist**

- [ ] Bucket `mcq-images` created
- [ ] Bucket is PUBLIC
- [ ] SQL query ran successfully
- [ ] Can login to MedCore
- [ ] Can access /admin/images
- [ ] Can upload image
- [ ] Image appears in grid
- [ ] Can copy URL
- [ ] URL works in browser
- [ ] Image shows in MCQ quiz

---

## **⚠️ Common Issues & Fixes**

### **"Upload failed"**
- ✓ Check bucket is PUBLIC
- ✓ Check file size < 10MB
- ✓ Try JPG format

### **"Image not showing"**
- ✓ Refresh page
- ✓ Check URL is correct
- ✓ Verify bucket visibility

### **"Table not found"**
- ✓ Run the SQL query again
- ✓ Check you're in right project
- ✓ Look in Tables list

---

## **💡 Pro Tips**

1. **Use JPG for photos** (smaller files)
2. **Use PNG for diagrams** (crisp, clear)
3. **Good titles** → Easy to find later
4. **Add descriptions** → Know what they show
5. **Organize by category** → Stay organized

---

## **🎯 You're Ready!**

**What you can do now:**
- ✅ Upload medical images
- ✅ Organize by category
- ✅ Copy URLs
- ✅ Use in MCQs
- ✅ View in quizzes

**Try it now:**
1. Go to `/admin/images`
2. Upload your first image
3. Copy the URL
4. Add to an MCQ
5. Take the quiz - see your image! 🎉

---

## **📚 Need More Help?**

See detailed guides:
- `IMAGE_MANAGEMENT_GUIDE.md` - Full documentation
- `SETUP_CHECKLIST.md` - Step-by-step checklist
- `IMAGE_WORKFLOW.md` - Advanced usage

---

**Status: Ready to use! 🚀**

Have fun managing your medical images! 📸
