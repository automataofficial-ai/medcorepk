# MedCore - Medical Exam Preparation Platform

**Complete documentation for setup, management, and deployment.**

---

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Overview](#project-overview)
3. [Setup & Installation](#setup--installation)
4. [Admin Features](#admin-features)
5. [User Features](#user-features)
6. [Database & API](#database--api)
7. [MCQ/CSV Import](#mcqcsv-import)
8. [Image Management](#image-management)
9. [Pharmacology Import](#pharmacology-import)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### **Start Development Server**
```bash
npm run dev
# Server runs at http://localhost:3000
```

### **First Time Setup**
1. Install dependencies: `npm install`
2. Set up environment variables (see below)
3. Start Supabase: Check SUPABASE_SETUP section
4. Run migrations: `npm run db:migrate`
5. Start dev server: `npm run dev`

### **Key URLs**
- User App: `http://localhost:3000`
- Admin Panel: `http://localhost:3000/admin`
- Quiz Builder: `http://localhost:3000/quiz-builder`
- Settings: `http://localhost:3000/settings`

---

## 📋 Project Overview

### **What is MedCore?**
A comprehensive medical exam preparation platform with:
- ✅ 1000+ MCQ questions across multiple subjects
- ✅ Real-time quiz feedback
- ✅ Performance analytics & dashboards
- ✅ Adaptive learning paths
- ✅ FCPS exam preparation focus

### **Key Features**
- 📚 Multiple subjects (Physiology, Anatomy, Pharmacology, Pathology, etc.)
- 🎯 Difficulty levels (Easy, Medium, Hard)
- 📊 Performance analytics & graphs
- 🏆 Achievement tracking & streaks
- 📱 Mobile responsive design
- 🌙 Dark theme by default
- ⚡ Real-time session updates

### **Tech Stack**
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Charts**: Recharts
- **UI**: Lucide Icons

---

## 🛠️ Setup & Installation

### **Environment Variables**

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Supabase Setup**

**1. Create Tables:**
```sql
-- See SUPABASE_SCHEMA section for full schema
CREATE TABLE users (...)
CREATE TABLE mcqs (...)
CREATE TABLE sessions (...)
-- etc.
```

**2. Enable Authentication:**
- Go to Supabase Dashboard
- Enable Email/Password auth
- Set password requirements: min 8 characters

**3. Set RLS Policies:**
- Enable row-level security on all tables
- Set policies per table (see SUPABASE_SCHEMA)

### **Database Migrations**

```bash
# Run all pending migrations
npm run db:migrate

# Create new migration
npm run db:migration create my_migration_name

# Rollback last migration
npm run db:rollback
```

### **Run Migrations**

To run specific migrations:
```bash
# Run using Supabase CLI
supabase db push

# Or use migration script
npm run migrate:up
```

---

## 🔑 Admin Features

### **Admin Panel Access**
**URL**: `http://localhost:3000/admin`

**Authentication**: Admin account required (set in Supabase)

### **1. User Management**
- View all users
- Filter by specialty/exam date
- View user statistics
- Reset user password
- Disable accounts

### **2. Question Management**
**Path**: `/admin/questions`

**Add Question:**
```
1. Click "+ Add Question"
2. Fill case study (optional)
3. Enter all 5 options (a-e)
4. Select correct answer
5. Set difficulty (Easy/Medium/Hard)
6. Add explanations for each option
7. Mark as FCPS Pearl if applicable
8. Click "Add Question"
```

**Edit/Delete:**
- Click "Edit" to modify
- Click "Delete" to remove
- Confirm action

### **3. Block Management**
**Path**: `/admin/blocks`

**Blocks Available:**
- Physiology
- Anatomy
- Pharmacology
- Pathology
- Biochemistry
- Microbiology
- Surgery
- Pediatrics

**Manage:**
- View MCQ count per block
- Create new block
- Edit block details
- Delete block (careful - removes all MCQs)

### **4. Sub-Subject Management**
**Path**: `/admin/sub-subjects`

**Setup Sub-Subjects:**
```bash
npm run setup:sub-subjects
```

This script:
- Creates all sub-subjects for each block
- Links them to parent blocks
- Sets icon references
- Initializes counts

**Manual Setup:**
1. Go to Admin Panel
2. Navigate to Sub-Subjects
3. Add new sub-subject
4. Assign to block
5. Set icon & description

### **5. MCQ Import**
**Path**: `/admin/import`

See **MCQ/CSV Import** section below.

### **6. Settings**
- System configuration
- Email settings
- Notification preferences
- Database maintenance

---

## 👥 User Features

### **Authentication**

**Signup**: `/signup`
- Full name (2+ characters)
- Email (valid format)
- Password (8+ characters)
- Confirm password
- Agree to terms

**Login**: `/login`
- Email & password
- Forgot password link

**Password Reset**: `/forgot-password`
- Send reset email
- Click link in email
- Set new password

### **Onboarding** (Auto after signup)

**Step 1: Choose Specialty**
- 8 medical specialties
- Select one to continue

**Step 2: Set Exam Date**
- Date picker
- Shows countdown

**Step 3: Study Goals**
- Pass the exam
- Excel with high score
- Master all topics

**Step 4: Dashboard Tour**
- Feature overview
- "Start Learning" button

### **Quiz Experience**

**Quiz Builder**: `/quiz-builder`
```
1. Select Block/Subject
2. Choose difficulty levels
3. Set number of questions
4. Select mode (Tutor/Exam)
5. Click "Start Quiz"
```

**During Quiz:**
- 📊 Progress dots
- ⏱️ Timer per question
- 📖 Case study display
- 📝 Notes sidebar
- 4️⃣ All options visible
- ✅ Instant feedback after submit

**After Question:**
- See correct/incorrect
- Read detailed explanation
- Click "Next Question" or "Finish Quiz"

### **Review Session**: `/block/[id]/review`
- Score percentage
- Session summary
- Each MCQ with:
  - Correct answer (green)
  - Wrong answers (red)
  - Full explanations

### **Dashboard**: `/dashboard`

**Stats Cards:**
- 📚 MCQs Attempted
- ✅ Correct Answers
- 📊 Accuracy Percentage
- 🔥 Current Streak

**Session History:**
- All past sessions
- Date, block, score
- Sorted chronologically

**Analytics:**
- 📊 Score by subject (bar chart)
- 📈 Score progression (area chart)
- 📉 Performance trends

### **Settings**: `/settings`

**Profile Tab:**
- Edit full name
- View email
- Change specialty
- Update exam date

**Preferences Tab:**
- Push notifications toggle
- Email reminders toggle
- Dark mode (info)

**Account Tab:**
- Change password
- Sign out
- Account creation date

---

## 💾 Database & API

### **Core Tables**

**users**
- id (UUID, PK)
- email (unique)
- full_name
- password_hash
- specialty
- exam_date
- created_at
- updated_at

**mcqs**
- id (UUID, PK)
- block_id (FK)
- question
- case_study
- option_a, b, c, d, e
- correct_answer (a-e)
- explanation_a, b, c, d, e
- difficulty_level (Easy/Medium/Hard)
- is_fcps_pearl (boolean)
- created_at

**sessions**
- id (UUID, PK)
- user_id (FK)
- block_id (FK)
- questions (JSON array)
- score
- accuracy
- duration
- created_at

**blocks**
- id (UUID, PK)
- title (unique)
- description
- total_mcqs
- icon
- created_at

**sub_subjects**
- id (UUID, PK)
- block_id (FK)
- name
- icon
- order
- created_at

**user_progress**
- id (UUID, PK)
- user_id (FK)
- block_id (FK)
- correct
- total
- accuracy
- last_session

### **API Endpoints**

**Authentication:**
```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/reset-password
```

**Blocks:**
```
GET /api/blocks
GET /api/blocks/[id]
GET /api/blocks/[id]/sub-subjects
```

**MCQs:**
```
GET /api/mcqs?block_id=...&difficulty=...
GET /api/mcqs/[id]
POST /api/import/mcqs (admin only)
```

**Sessions:**
```
POST /api/sessions
GET /api/sessions/[userId]
POST /api/sessions/[id]/complete
```

**User:**
```
GET /api/user
PUT /api/user/profile
PUT /api/user/settings
```

---

## 📋 MCQ/CSV Import

### **Quick Links**
- **Main Guide**: See `MCQ_DOCUMENTATION.md` for complete guide
- **Templates**: In `formatted_files/` folder
  - `MCQ_IMPORT_TEMPLATE_FINAL.csv` ⭐ (recommended)
  - `MCQ_TEMPLATE_BLANK.csv` (blank template)

### **CSV Format**

**Required Columns (exact order):**
```
block_name,sub_subject_name,question,case_study,option_a,option_b,option_c,option_d,option_e,correct_answer,explanation_a,explanation_b,explanation_c,explanation_d,explanation_e,difficulty,image_url,references,is_fcps_pearl,fcps_pearl_content
```

**Important Rules:**
- `correct_answer`: Must be single lowercase letter (a, b, c, d, or e)
- `block_name`: Exact block name (e.g., "Physiology")
- `difficulty`: Easy, Medium, or Hard (case-sensitive)
- Fields with commas: Wrap in quotes: `"Microcytic, hypochromic"`
- Encoding: UTF-8

### **Import Steps**

1. **Prepare CSV:**
   - Copy `formatted_files/MCQ_IMPORT_TEMPLATE_FINAL.csv`
   - Fill with your MCQs
   - Verify format

2. **Upload:**
   - Go to `http://localhost:3000/admin/import`
   - Select CSV file
   - Choose block
   - Click "Import MCQs"

3. **Verify:**
   ```javascript
   fetch('http://localhost:3000/api/blocks')
     .then(r => r.json())
     .then(d => {
       d.blocks.forEach(b => {
         console.log(`${b.title}: ${b.mcqs?.length || 0} MCQs`);
       });
     });
   ```

### **Common Errors**

| Error | Fix |
|-------|-----|
| `Invalid correct_answer` | Use single lowercase letter (a-e); quote fields with commas |
| `Block not found` | Match exact block name; check spelling |
| `400 Bad Request` | Save as UTF-8; check CSV formatting; verify column order |
| `Column not found` | Use exact header from template |

See `MCQ_DOCUMENTATION.md` for complete troubleshooting guide.

---

## 🖼️ Image Management

### **Image Upload**

**Supported Formats:**
- JPG, PNG, GIF, WebP
- Max size: 5MB
- Recommended: 1200x800px

**Upload Path**: `/api/upload`

```javascript
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
```

### **Image Storage**

Images stored in:
- **Development**: Local filesystem or Supabase Storage
- **Production**: Supabase Storage with CDN

### **Using Images in MCQs**

Add `image_url` column in CSV:
```csv
block_name,question,...,image_url
Anatomy,"Where is the heart?",..."https://cdn.example.com/heart.jpg"
```

Or add via admin panel when creating MCQ.

### **Image Optimization**

Images are automatically optimized:
- Resized to responsive sizes
- Compressed for performance
- Served from CDN
- Lazy loaded in quiz

---

## 🔬 Pharmacology Import

### **Pharmacology Git Import**

Special import script for pharmacology MCQs from git repository.

```bash
npm run import:pharmacology
```

**Features:**
- Reads MCQs from git data files
- Validates format
- Imports to database
- Updates block counts

**Data Format:**
```javascript
{
  block_name: "Pharmacology",
  sub_subject_name: "NSAIDs",
  question: "...",
  option_a: "...",
  // etc.
}
```

### **Pharmacology Blocks**

Available:
- General Pharmacology
- Neuropharmacology
- Cardiovascular Drugs
- GI Drugs
- Antibiotics
- Endocrinology Drugs
- etc.

---

## 🚀 Deployment

### **Pre-Deployment Checklist**

- [ ] 500+ MCQs loaded in database
- [ ] All images optimized
- [ ] Environment variables configured
- [ ] Supabase RLS policies enabled
- [ ] Backup strategy in place
- [ ] Email service configured
- [ ] Domain & SSL setup
- [ ] Analytics enabled

### **Deploy to Vercel**

```bash
# Push to GitHub
git push origin main

# Auto-deploys to Vercel (if connected)
# Or manually:
vercel deploy --prod
```

**Environment Variables on Vercel:**
1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add all `.env.local` variables
4. Redeploy

### **Database Backup**

**Supabase Backup:**
```bash
# Automatic daily backups enabled
# Manual backup:
supabase db pull
```

**Local Backup:**
```bash
pg_dump -U postgres dbname > backup.sql
```

### **Monitoring**

**Sentry** (Error tracking):
```env
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

**Vercel Analytics** (Performance):
- Auto-enabled on Vercel
- View in Vercel Dashboard

### **Scale Database**

If exceeding Supabase limits:
1. Upgrade Supabase plan
2. Or migrate to self-hosted PostgreSQL
3. Update connection string

---

## 🔧 Credentials & Setup

### **Supabase Credentials**

Store in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxx...
```

Get from: Supabase Dashboard → Settings → API Keys

### **Gmail/Email Setup**

For password reset emails:
1. Enable Supabase Auth Email
2. Or configure SendGrid/Resend
3. Add sender email in settings

### **OAuth (Google)**

To enable Google Sign-In:
1. Google Cloud Console → Create Project
2. Create OAuth Credentials
3. Add redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`
4. Add credentials to Supabase Auth

---

## 🐛 Troubleshooting

### **Common Issues**

**Quiz won't load:**
- Check block ID exists
- Verify MCQs loaded for block
- Check browser console
- Reload page

**Toasts not showing:**
- Verify ToastProvider in layout
- Check ToastContainer component
- Clear cache & reload

**Dashboard not updating:**
- Check network requests
- Verify user logged in
- Check Supabase connection
- Reload page

**Settings not saving:**
- Verify Supabase RLS policies
- Check user has permission
- Review browser console errors
- Try again in a few seconds

**Images not displaying:**
- Check image URL is correct
- Verify file exists in storage
- Check CORS settings
- Verify image format supported

**Admin access denied:**
- Verify user is admin in database
- Check RLS policies
- Clear cache & re-login
- Check user ID in auth table

### **Debug Commands**

```javascript
// Check user
fetch('/api/user').then(r => r.json()).then(d => console.log(d));

// Check blocks
fetch('/api/blocks').then(r => r.json()).then(d => console.log(d));

// Check sessions
fetch('/api/sessions').then(r => r.json()).then(d => console.log(d));
```

### **Database Queries for Troubleshooting**

```sql
-- Check user count
SELECT COUNT(*) FROM users;

-- Check MCQ count by block
SELECT b.title, COUNT(m.id) FROM blocks b LEFT JOIN mcqs m ON b.id = m.block_id GROUP BY b.id;

-- Check session count
SELECT COUNT(*) FROM sessions;

-- Check failed signups
SELECT email, error FROM auth.sessions WHERE error IS NOT NULL;
```

---

## 📝 Implementation Checklist

### **Phase 1: Setup**
- [ ] Clone repository
- [ ] Install dependencies
- [ ] Configure environment variables
- [ ] Set up Supabase
- [ ] Run migrations
- [ ] Start dev server

### **Phase 2: Data Loading**
- [ ] Import MCQs (100+ per block)
- [ ] Verify data in database
- [ ] Set up images
- [ ] Configure blocks & sub-subjects
- [ ] Test quiz functionality

### **Phase 3: Testing**
- [ ] Test user signup/login
- [ ] Test quiz experience
- [ ] Test admin features
- [ ] Test dashboard
- [ ] Test responsive design
- [ ] Test on mobile

### **Phase 4: Optimization**
- [ ] Optimize images
- [ ] Cache strategies
- [ ] Database indexing
- [ ] API response times
- [ ] Bundle size

### **Phase 5: Deployment**
- [ ] Configure production domain
- [ ] Set up email service
- [ ] Enable monitoring
- [ ] Configure backups
- [ ] Deploy to Vercel
- [ ] Test production environment

---

## 📊 Features Implemented

### ✅ Core
- [x] User authentication (email/password)
- [x] Multiple subject blocks
- [x] 5-option MCQs
- [x] Quiz builder
- [x] Session tracking
- [x] Performance analytics
- [x] Dark theme UI

### ✅ Admin
- [x] Question management
- [x] Block management
- [x] CSV bulk import
- [x] User management
- [x] Analytics dashboard

### ✅ UI/UX
- [x] Toast notifications
- [x] Real-time updates
- [x] Mobile responsive
- [x] Animations
- [x] Accessibility

### 🔄 In Progress
- [ ] Email notifications
- [ ] Spaced repetition
- [ ] Flashcard system
- [ ] Mock exams

### 📋 Planned
- [ ] Google OAuth
- [ ] Social sharing
- [ ] Study groups
- [ ] AI-powered recommendations

---

## 🔐 Security

- ✅ Password hashing (Supabase)
- ✅ Row-level security (RLS)
- ✅ Email validation
- ✅ HTTPS only
- ✅ Admin access control
- ✅ Rate limiting
- ✅ Input validation
- ✅ CSRF protection

---

## 📈 Performance

- ⚡ Next.js optimizations
- 🖼️ Image optimization
- 📦 Code splitting
- 🗂️ Database indexing
- 🔄 Real-time subscriptions
- 📊 Analytics tracking

---

## 📞 Support & Documentation

- **GitHub Issues**: Report bugs
- **Discussions**: Ask questions
- **Email**: support@medcore.io

---

## 📝 Changelog

**v1.5** (Aug 24, 2026)
- Consolidated all documentation into single README
- Created MCQ_DOCUMENTATION.md for MCQ import guide
- Organized formatted_files folder for templates

**v1.0** (Jul 2, 2026)
- Initial release
- Core features complete
- Admin panel functional
- Database schema finalized

---

**Last Updated**: August 24, 2026  
**Status**: Production Ready ✅

For MCQ import specifics, see **MCQ_DOCUMENTATION.md**
