# 📸 Image Management System - Setup & Usage Guide

## Overview
This guide explains how to set up and use the image management system in MedCore. You can now upload your own medical images and manage them through an admin dashboard.

---

## 🚀 **QUICK START**

### **1. Supabase Setup (REQUIRED)**

Before uploading images, you need to set up Supabase Storage and Database:

#### **A. Create Storage Bucket**
1. Go to your Supabase Dashboard
2. Navigate to **Storage** → **Buckets**
3. Click **New Bucket**
4. Name it: `mcq-images`
5. Make it **Public** (toggle the public switch)
6. Click **Create Bucket**

#### **B. Create Images Table**
1. Go to **SQL Editor**
2. Run this SQL query:

```sql
-- Create images table
CREATE TABLE IF NOT EXISTS public.images (
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

-- Create RLS policies
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own images"
  ON public.images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own images"
  ON public.images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
  ON public.images FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_images_user_id ON public.images(user_id);
CREATE INDEX idx_images_category ON public.images(category);
```

---

## 🎯 **HOW TO USE**

### **Step 1: Access Image Management**
- After logging in, go to: `/admin/images`
- Or add a link to Dashboard → Admin Panel → Image Library

### **Step 2: Upload Images**

**Method 1: Through Admin Dashboard**
1. Click "Upload New Image" button
2. Fill in the details:
   - **Title**: Name of the image (e.g., "Chest X-ray - Pneumonia")
   - **Category**: Select from predefined categories
   - **Description**: Details about what the image shows
   - **File**: Upload JPG, PNG, GIF, or WebP (max 10MB)
3. Click "Upload Image"
4. Image will be stored and ready to use

**Method 2: Bulk Upload (Optional)**
You can also programmatically upload images using the API:

```javascript
const uploadImage = async (file, title, description, category) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("description", description);
  formData.append("category", category);

  const response = await fetch("/api/images/upload", {
    method: "POST",
    headers: {
      "x-user-id": userId, // Your Supabase user ID
    },
    body: formData,
  });

  const data = await response.json();
  return data.url; // Public URL of uploaded image
};
```

### **Step 3: Use Images in MCQs**

When creating or editing an MCQ, you can now:

1. **Option A: Use Image URL Directly**
   - Copy the image URL from the Image Library
   - Use it in the `image_url` field in your MCQs table

2. **Option B: Add Image Selector to MCQ Form (Coming Soon)**
   - We can add a UI component to pick images directly from your library

---

## 📁 **Supported Image Categories**

- Radiology (X-rays, CT, MRI, Ultrasound)
- Histology (Microscopy slides)
- ECG (Cardiac traces)
- Pathology (Lab findings)
- Clinical (Photos, diagrams)
- Anatomy (Anatomical illustrations)
- Other (Miscellaneous)

---

## 🔑 **API Endpoints**

### **Upload Image**
```
POST /api/images/upload
Headers: x-user-id: <your-user-id>
Body: FormData with file, title, description, category
```

### **List Images**
```
GET /api/images?category=Radiology
Headers: x-user-id: <your-user-id>
Returns: Array of image objects
```

### **Delete Image**
```
DELETE /api/images?id=<image-id>
Headers: x-user-id: <your-user-id>
```

---

## 🎨 **Image Specifications**

**Recommended:**
- Format: JPG or PNG
- Size: 800x600px or larger
- Quality: High resolution for medical images
- File size: 1-5MB

**File Upload Limits:**
- Max file size: 10MB per image
- Supported formats: JPG, PNG, GIF, WebP
- Storage: Unlimited (Supabase free tier: 1GB)

---

## 💡 **Usage Examples**

### **Example 1: Medical Radiology Image**
```
Title: Chest X-ray - Community Acquired Pneumonia
Category: Radiology
Description: Shows bilateral infiltrates in the lower lobes consistent with CAP. 
Patient presenting with fever and productive cough.
```

### **Example 2: Histology Slide**
```
Title: Histopathology - Acute Myocardial Infarction
Category: Histology
Description: High power view showing myocardial necrosis with contraction band necrosis
and early inflammatory infiltrate, typical of acute MI.
```

### **Example 3: ECG Trace**
```
Title: ECG - Atrial Fibrillation with RVR
Category: ECG
Description: Shows irregular rhythm with absence of P waves and rapid ventricular rate (120 bpm).
Regular QRS complex, normal duration.
```

---

## 🔐 **Security & Privacy**

- **Private to You**: Only you can see and access your uploaded images
- **Secure URLs**: Images are stored in Supabase's secure storage
- **Row Level Security (RLS)**: Database level protection ensures data isolation
- **HTTPS**: All transfers are encrypted

---

## 🛠️ **Troubleshooting**

### **Issue: "Upload failed" error**
**Solution:**
1. Check that Supabase bucket `mcq-images` is public
2. Verify your user is logged in
3. Ensure file size < 10MB
4. Try a different image format (JPG instead of PNG)

### **Issue: "Images table not found"**
**Solution:**
1. Run the SQL query from Step 1B again
2. Verify the table was created in your Supabase dashboard
3. Check your Supabase project ID is correct

### **Issue: Image URL not working**
**Solution:**
1. Verify the image URL is copied correctly
2. Check that the `mcq-images` bucket is public
3. Clear browser cache and reload

---

## 📊 **Image Library Features**

✅ Upload multiple images  
✅ Organize by category  
✅ Search images by title/description  
✅ View upload date  
✅ Copy image URL with one click  
✅ Delete images  
✅ Preview thumbnails  
✅ Bulk operations (coming soon)

---

## 🔄 **Next Steps**

1. **Set up Supabase** (follow instructions above)
2. **Access** `/admin/images`
3. **Upload** your medical images
4. **Copy** image URLs
5. **Use** in your MCQs

---

## 📞 **Support**

If you encounter issues:
1. Check Supabase Dashboard → Logs
2. Verify all setup steps are completed
3. Check browser console for error messages
4. Ensure your Supabase project is active

---

## 🚀 **Future Enhancements**

Coming soon:
- Image crop & edit tools
- Batch upload multiple images
- Image annotation tools
- AI-powered image tagging
- Integration with MCQ creation form

---

Last Updated: 2026-07-06
