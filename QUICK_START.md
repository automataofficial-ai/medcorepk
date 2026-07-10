# MedCore - Quick Start Guide

## 🚀 Getting Started

### **Server Status**
```bash
# Dev server running at http://localhost:3000
npm run dev
```

---

## 📋 User Journey

### **1. New User Signup**
**Path**: `http://localhost:3000/signup`

```
→ Enter full name (2+ characters)
→ Enter email (valid format)
→ Enter password (8+ characters)
→ Confirm password
→ Agree to terms
→ Click "Sign Up"
→ Auto-redirects to onboarding
```

**Toast Messages**:
- ✅ Account Created! - Shows on success
- ❌ Validation Error - Shows validation issues
- ❌ Signup Failed - Shows server errors

---

### **2. Onboarding (4 Steps)**
**Path**: `http://localhost:3000/onboarding` (Auto-redirect after signup)

**Step 1: Choose Specialty**
- 8 specialties available with icons
- Select one to continue
- Shows progress bar (1/4)

**Step 2: Set Exam Date**
- Date picker
- Shows days until exam
- Press Next to continue

**Step 3: Study Goals**
- Pass the exam
- Excel with high score
- Master all topics
- Each has different study plan

**Step 4: Dashboard Tour**
- Overview of dashboard features
- "Start Learning" button launches dashboard

---

### **3. Take a Quiz**
**Path**: `http://localhost:3000/quiz-builder` (Custom) or `http://localhost:3000/block/[id]` (Direct)

#### **Option A: Custom Quiz Builder**
```
1. Select Subject/Block
2. Choose Difficulty Levels (Easy/Medium/Hard)
3. Set Number of Questions (1-100)
4. Choose Mode (Tutor/Exam)
5. Click "Start Quiz"
```

**Quiz Page Features**:
- 📊 Progress dots show answered questions
- ⏱️ Timer tracks time per question
- 📖 Case study display
- 📝 Notes sidebar (if available)
- 4️⃣ All options with individual explanations
- ✅ Instant feedback (correct/incorrect toast)

#### **After Each Question**:
- Submit answer
- See if correct/incorrect
- Read detailed explanation
- Click "Next Question" or "Finish Block"

---

### **4. Review Session**
**Path**: `http://localhost:3000/block/[id]/review` (Auto after quiz completion)

- 📊 Score circle with percentage
- 📋 Session summary
- 🎯 Each MCQ with:
  - Correct answer highlighted (green)
  - Why other options are wrong (red)
  - Full explanation for each

---

### **5. Dashboard**
**Path**: `http://localhost:3000/dashboard`

#### **Stats Cards** (Top)
- 📚 MCQs Attempted
- ✅ Correct Answers
- 📊 Accuracy Percentage
- 🔥 Current Streak

#### **Session History** (Middle)
- All completed sessions
- Block name, date, score
- Sorted by date

#### **Performance Analytics** (Bottom)
- 📊 Score by subject (bar chart)
- 📈 Score progression (area chart)
- 📉 Performance metrics

---

### **6. Settings**
**Path**: `http://localhost:3000/settings`

#### **Profile Tab**
- Edit full name
- View email (can't change)
- Set specialty
- Set target exam date

#### **Preferences Tab**
- Toggle push notifications
- Toggle email reminders
- Dark mode (info only)

#### **Account Tab**
- Change password link
- Sign out button
- Account creation date

---

### **7. Password Reset**
**Path**: `http://localhost:3000/forgot-password`

```
1. Enter email address
2. Receive reset email
3. Click link in email
4. Set new password (8+ chars)
5. Confirm password
6. Auto-redirect to login
```

---

## 🛠️ Admin Features

### **Question Management**
**Path**: `http://localhost:3000/admin/questions`

**Requirements**: Must be logged in as admin

#### **View Questions**
- See all questions (limited to 50)
- Shows case study preview
- Shows difficulty level
- Edit and delete buttons

#### **Add Question**
```
1. Click "+ Add New Question"
2. Fill case study (required)
3. Fill all 4 options (required)
4. Select correct answer (A/B/C/D)
5. Set difficulty (Easy/Medium/Hard)
6. Write explanation
7. Click "Add Question"
```

#### **Edit Question**
```
1. Click "Edit" on any question
2. Modify fields
3. Click "Update Question"
```

#### **Delete Question**
```
1. Click "Delete" on question
2. Confirm deletion
3. Question removed
```

---

## 🎨 UI/UX Features

### **Toast Notifications**
Appear top-right, auto-dismiss:

```
✅ Success (Green) - 5 seconds
❌ Error (Red) - 6 seconds
⚠️ Warning (Amber) - 5 seconds
ℹ️ Info (Blue) - 4 seconds
```

All have close button (X)

### **Dark Theme**
- Default: Dark mode enabled
- Background: #050B18 (very dark blue)
- Accents: Cyan/Teal (#00CED1)
- Text: White with slate shades

### **Animations**
- Page enter: Fade-in 500ms
- Toast: Slide-in from right 300ms
- Buttons: Scale on hover
- Charts: Smooth transitions

---

## 📱 Mobile Friendly

All pages are responsive:
- Mobile: Single column, full width
- Tablet: 2-column where appropriate  
- Desktop: Multi-column layouts

**Test on**:
- iPhone (375px)
- iPad (768px)
- Desktop (1024px+)

---

## 🔄 Real-Time Features

### **Dashboard Updates**
- Polls every 3 seconds
- Real-time subscription attempts
- Falls back to polling if subscription fails

### **Session Auto-Save**
- Session saves after completion
- 1 second delay before redirect
- Allows data to persist

---

## 🧪 Testing Checklist

### **Authentication**
- [ ] Signup with all fields
- [ ] Login with email/password
- [ ] Forgot password flow
- [ ] Settings page saves
- [ ] Logout works

### **Quiz Experience**
- [ ] Quiz builder creates session
- [ ] Questions display properly
- [ ] Options show explanations
- [ ] Submit answer works
- [ ] Feedback appears
- [ ] Review shows all explanations

### **Dashboard**
- [ ] Stats cards update after quiz
- [ ] Session appears in history
- [ ] Charts display data
- [ ] Real-time updates (3 second refresh)

### **Toasts**
- [ ] Success toasts appear
- [ ] Error toasts appear
- [ ] Warning toasts appear
- [ ] Info toasts appear
- [ ] Auto-dismiss works
- [ ] Close button works

### **UI/UX**
- [ ] Dark theme applied everywhere
- [ ] Animations smooth
- [ ] Responsive on mobile
- [ ] Professional styling
- [ ] Colors match theme

---

## 🐛 Troubleshooting

### **Quiz won't load**
- Check block ID in URL
- Verify block exists in database
- Check browser console for errors
- Reload page

### **Toasts not showing**
- Check ToastProvider in layout.tsx
- Verify ToastContainer component
- Check browser console
- Clear cache and reload

### **Dashboard not updating**
- Check network tab for API calls
- Verify user is logged in
- Check localStorage for user data
- Reload dashboard

### **Settings not saving**
- Check Supabase connection
- Verify user has permission
- Check browser console errors
- Try again in a few seconds

---

## 📊 Database Queries

### **View Users**
```sql
SELECT id, email, full_name, specialty FROM users;
```

### **View Sessions**
```sql
SELECT * FROM sessions WHERE user_id = '[USER_ID]';
```

### **View User Progress**
```sql
SELECT * FROM user_progress WHERE user_id = '[USER_ID]';
```

### **View Questions**
```sql
SELECT * FROM mcqs LIMIT 10;
```

---

## 🔐 Security Notes

- ✅ All passwords hashed with Supabase
- ✅ RLS policies protect user data
- ✅ Session tokens validated
- ✅ Email validation required
- ✅ Admin access controlled

---

## 📈 Next Features to Implement

1. **Google OAuth** - OAuth signup/login
2. **Email Verification** - Confirm email address
3. **Flashcard System** - Study cards from MCQs
4. **Mock Exams** - 200-question simulations
5. **Spaced Repetition** - SM-2 algorithm
6. **Landing Page** - Marketing homepage
7. **Email Notifications** - Daily reminders
8. **Bulk Import** - CSV question import

---

## 🚀 Production Deployment

Before going live:
1. Load 500 MCQs into database
2. Set up email service (Resend/SendGrid)
3. Enable Google OAuth
4. Configure domain
5. Set up monitoring (Sentry)
6. Enable analytics (Vercel)
7. Test on production database
8. Create backup strategy

---

**Version**: 1.0.0 (Beta)  
**Last Updated**: July 2, 2026  
**Status**: Ready for Testing ✅
