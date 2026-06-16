# MedCore — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** June 6, 2026  
**Platform Type:** FCPS Exam Preparation Web Application  
**Inspiration:** eMedici (https://emedici.com)

---

## 1. Executive Summary

MedCore is a web-based FCPS (Fellowship of the College of Physicians and Surgeons) exam preparation platform designed for Pakistani medical graduates seeking specialist certification through CPSP (College of Physicians and Surgeons Pakistan). The platform delivers a structured, data-driven MCQ practice environment with real-time analytics, spaced repetition, and comprehensive progress tracking.

The demo MVP focuses on the core loop: practice MCQs → receive instant detailed explanations → track performance analytics → identify weak areas → revise. Every feature decision serves this loop.

---

## 2. Target Users

### Primary User: FCPS Part 1 Candidate
- MBBS graduate with completed house job
- Preparing for the 200-MCQ CBT (Computer Based Test) across Basic Sciences and their chosen specialty
- Studies 3–6 hours/day, needs flexible mobile-friendly access
- Overwhelmed by volume of content; needs prioritization signals

### Secondary User: FCPS Part 2 Candidate
- Already cleared Part 1; now preparing for written theory, viva, and clinical OSCE components
- Needs case-based scenarios, short-answer practice, and long-case simulations

### Tertiary User: Institution / Coaching Center
- Wants to assign question sets, monitor student progress, and generate reports

---

## 3. FCPS Exam Context

Understanding the exam is foundational to product decisions.

### Part 1 Structure
| Component | Details |
|---|---|
| Format | Computer-Based Test (CBT) |
| Papers | 2 papers × 100 MCQs = 200 total |
| Duration | 2 hours 30 minutes per paper |
| Negative Marking | None |
| Passing Score | 75% aggregate |

**Paper I (Common for ALL specialties):**
- Anatomy (Gross, Embryology, Histology, CNS, Head & Neck, Viscera)
- Physiology
- Biochemistry & Pharmacology
- Pathology (including Microbiology)
- Research Methodology & Biostatistics
- Behavioral Science & Medical Ethics

**Paper II (Specialty-specific):** Varies by specialty — clinical sciences, system-specific pharmacology, applied anatomy.

### FCPS Specialties Supported (MVP scope: Part 1 common subjects + 4 key specialties)
1. Medicine (Internal Medicine)
2. Surgery
3. Obstetrics & Gynaecology
4. Paediatrics
5. Ophthalmology *(Phase 2)*
6. Pathology *(Phase 2)*
7. Anaesthesiology *(Phase 2)*
8. Radiology *(Phase 2)*

### Part 2 Structure (Phase 2 of product)
- Written theory papers
- Oral viva examination
- Clinical OSCE stations
- Extended TOACS (Trainer-Observed Assessment of Clinical Skills)

---

## 4. Product Goals

1. **Demo-ready in 8 weeks** — full working prototype showcasing core value proposition
2. **MCQ-first** — the question solving interface must be best-in-class; everything else supports it
3. **Analytics as a differentiator** — actionable data that tells students exactly what to study next
4. **FCPS-specific content structure** — mapped 1:1 to CPSP syllabus, not generic medical content
5. **Mobile-responsive** — usable on phone during commute or on tablet at a coaching center

---

## 5. Core Features — MVP

---

### 5.1 Authentication & Onboarding

#### Registration & Login
- Email/password registration
- Social login (Google)
- Email verification
- Password reset via email

#### Onboarding Flow (First-time users)
1. **Step 1 — Specialty Selection:** Choose FCPS specialty (Medicine, Surgery, OBG, Paediatrics, etc.)
2. **Step 2 — Exam Timeline:** Select target exam date (used to generate study schedule)
3. **Step 3 — Self-Assessment:** 10-question diagnostic quiz per subject to baseline performance
4. **Step 4 — Dashboard Introduction:** Tooltip-driven tour of the dashboard

---

### 5.2 Question Bank

This is the core of the product. Everything else is built around it.

#### Question Data Model
```
Question {
  id
  subject          // Anatomy, Physiology, Pharmacology, etc.
  topic            // e.g., "Brachial Plexus", "Renin-Angiotensin System"
  subtopic         // e.g., "Erb's Palsy", "ACE Inhibitors"
  specialty        // Medicine / Surgery / OBG / Paediatrics / Common
  paper            // Paper I / Paper II
  difficulty       // Easy / Medium / Hard
  question_text    // The MCQ stem
  options[]        // Array of 4–5 option strings (A–E)
  correct_option   // Index of correct answer
  explanation      // Detailed referenced explanation (2–5 paragraphs)
  explanation_tags // High-yield, Commonly Missed, Exam Favorite
  image_url        // Optional — X-ray, histology slide, ECG, etc.
  year_appeared    // Past paper year (if applicable)
  reference        // Source textbook/guideline
  created_at
  updated_at
}
```

#### Question Content Plan (Demo)
- **500 seeded MCQs** for demo (representative across all Paper I subjects)
- 100 Anatomy, 80 Physiology, 70 Pharmacology, 80 Pathology, 50 Biochemistry, 50 Microbiology, 40 Biostatistics, 30 Behavioral Science
- All questions carry full explanations, correct answer highlight, and difficulty tag

---

### 5.3 Practice Modes

#### Mode 1 — Tutor Mode (Default)
- Answer a question → immediately see if correct/incorrect
- Explanation shown right after answering
- Can flag, highlight, and take notes before moving on
- No time pressure — ideal for learning

#### Mode 2 — Timed Exam Mode
- Simulates real CBT experience
- Timer counts down (2 hrs 30 min for 100 questions, or custom duration)
- No explanations shown during the exam
- Review session opens automatically after submission
- Shows time spent per question

#### Mode 3 — Custom Quiz Builder
User selects:
- Subject(s) / Topic(s) / Subtopic(s)
- Difficulty level (Easy / Medium / Hard / Mixed)
- Question count (10 / 25 / 50 / 100 / Custom)
- Question source (Unused / Incorrect / Flagged / All)
- Time limit (On/Off)

#### Mode 4 — Spaced Repetition (Smart Revision)
- Algorithm schedules questions based on prior performance
- Questions answered correctly pushed to longer intervals
- Questions answered incorrectly resurface in 1–3 days
- Daily revision deck generated automatically each morning
- Based on SM-2 algorithm (same as Anki)

#### Mode 5 — Mock Exam
- Full 200-question simulated exam (Paper I + Paper II)
- Strict exam conditions: timed, no explanations mid-exam
- Generates a detailed score report after completion
- Percentile ranking vs. other MedCore users
- Specialty-wise and subject-wise breakdown

---

### 5.4 Question Solving Interface (UI)

This screen gets the most design attention.

#### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│  [MedCore Logo]    [Subject: Anatomy]    [Timer: 01:47:23]  [⚑] │
├─────────────────────────────────────────────────────────────────┤
│  Question 23 of 50                            [Prev] [Next]     │
│  ● ● ● ● ● ○ ○ ○ ○ ... (progress dots, color-coded)            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  A 34-year-old man presents with weakness of the right hand.   │
│  On examination, wrist drop is noted. The lesion is most        │
│  likely at which nerve?                                         │
│                                                                 │
│  [Image / Diagram if applicable]                                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  A.  Median nerve                                               │
│  B.  Ulnar nerve                                                │
│  C.  Radial nerve                               ← Selected ✓    │
│  D.  Musculocutaneous nerve                                     │
│  E.  Axillary nerve                                             │
├─────────────────────────────────────────────────────────────────┤
│  [📝 Note]  [⚑ Flag]  [↩ Skip]              [Submit Answer]    │
└─────────────────────────────────────────────────────────────────┘
```

#### Post-Answer State (Tutor Mode)
- Correct option highlighted in green
- Selected option (if wrong) highlighted in red
- Explanation panel slides in below:
  - Correct answer explanation (full paragraph)
  - Why wrong options are wrong (brief)
  - Key learning point callout box (highlighted)
  - Reference: e.g., "Gray's Anatomy, 41st Edition"
  - Tags: `#High-Yield` `#Commonly-Missed`
- Action buttons: `[Add to Flashcard]` `[Flag for Review]` `[Next Question →]`

#### Question Progress Bar
- Color-coded dots: Gray (unanswered), Green (correct), Red (incorrect), Yellow (flagged), Orange (skipped)
- Clickable — jump to any question

#### Notes Feature
- Per-question sticky notes (rich text, saved to user account)
- Accessible from the notes panel in the dashboard

#### Highlight Feature
- Users can highlight text within the question stem or explanation
- Highlights persist across sessions
- Color options: Yellow, Blue, Pink

---

### 5.5 Student Analytics Dashboard

The analytics dashboard is the second most important screen after the question interface.

#### Dashboard Homepage — Summary Cards
```
┌──────────────────────────────────────────────────────────────────┐
│  Welcome back, Ahmed.          Target Exam: March 2027           │
│  Streak: 🔥 7 days                                               │
├──────────┬───────────┬───────────┬──────────────────────────────┤
│ Questions │ Accuracy  │  Study    │   Exam Readiness             │
│ Attempted │           │  Time     │   Score                      │
│  1,247    │  68.3%    │  42 hrs   │   ████████░░  72%            │
└──────────┴───────────┴───────────┴──────────────────────────────┘
```

#### Performance by Subject
Horizontal bar chart showing accuracy % per subject:

| Subject | Accuracy | Questions Done |
|---|---|---|
| Anatomy | 74% | ████████░░ | 312 |
| Physiology | 61% | ██████░░░░ | 198 |
| Pharmacology | 82% | █████████░ | 145 |
| Pathology | 55% | █████░░░░░ | 220 |
| Biochemistry | 70% | ███████░░░ | 89 |
| Biostatistics | 45% | ████░░░░░░ | 67 |

- Color coding: Red (<60%), Yellow (60–75%), Green (>75%)
- Click any subject → drill into topic-level performance

#### Performance by Topic (Drill-down)
- Within Anatomy: Brachial Plexus 88%, Upper Limb 71%, Lower Limb 55%, Head & Neck 62%...
- Subtopic drill-down available one more level deep

#### Progress Over Time
- Line chart: Accuracy % over last 30 / 60 / 90 days
- Bar chart: Questions attempted per day
- Toggle between weekly and monthly views

#### Weak Areas Panel
Automatically generated:
> **Your 5 Weakest Topics:**
> 1. Biostatistics → Study Now
> 2. Renal Physiology → Study Now
> 3. Embryology → Study Now
> 4. Microbiology — Viruses → Study Now
> 5. Inflammatory Pathology → Study Now

Each "Study Now" button launches a custom 25-question quiz on that topic.

#### Question Bank Coverage Heatmap
Visual grid showing which subjects/topics have been attempted vs. not, like a GitHub contribution graph:
- Dark = many questions attempted
- Light = few questions attempted
- White = not yet attempted

#### Mock Exam History
Table of all mock exams taken:
| Date | Score | Paper I | Paper II | Time Taken | Percentile |
|---|---|---|---|---|---|
| 28 May 2026 | 71% | 68% | 74% | 4h 32m | 63rd |
| 14 May 2026 | 65% | 62% | 68% | 4h 55m | 48th |

#### Study Streak & Gamification
- Daily streak counter (fire emoji, resets at midnight if no questions answered)
- Weekly goal: set target questions per week (default: 100)
- Progress ring showing weekly goal completion
- Milestones: "First 100 Questions", "7-Day Streak", "Mastered Anatomy", etc.
- Leaderboard (optional, opt-in): rank among all MedCore users or your cohort

---

### 5.6 Flashcard System

- Auto-generated from questions: "Add to Flashcard" button on any explanation
- Manual card creation from the notes panel
- Front: question stem or concept
- Back: answer + key explanation points
- Spaced repetition schedule drives the daily flashcard deck
- Flashcard sessions: Quick 10-card session or full deck review

---

### 5.7 Subject & Topic Browser

Content library browsable independently from practice mode:

```
Subjects
  └── Anatomy
        ├── Upper Limb
        │     ├── Brachial Plexus (47 questions)
        │     ├── Rotator Cuff (23 questions)
        │     └── Dermatomes (18 questions)
        ├── Lower Limb
        │     ├── Femoral Triangle (31 questions)
        │     └── ...
        └── Head & Neck
```

- Each leaf node shows: total questions, your accuracy, last attempted date
- Filter: All / Weak / Strong / Not Attempted
- Quick Start button: launches a 25-question quiz on that topic instantly

---

### 5.8 Past Papers Section

- Organized by year (e.g., CPSP March 2024, September 2023, etc.)
- Can practice as a timed mock or tutor mode
- Questions tagged `#Past Paper` in the regular question bank
- Year filter in custom quiz builder

---

### 5.9 Notes & Bookmarks

#### My Notes
- All per-question notes collected in one place
- Searchable full-text
- Organized by subject/topic
- Export as PDF

#### Bookmarked Questions
- Flagged questions list
- Filter: by subject, by difficulty, by date flagged
- Launch a quiz from bookmarks: "Practice Flagged Questions"

---

### 5.10 Notifications & Study Reminders

- Daily study reminder (email and in-app, configurable time)
- "Your streak is at risk!" notification if no activity by 8 PM
- Weekly progress report email (every Sunday)
- New content notification when questions are added

---

### 5.11 Settings & Profile

- Name, email, profile photo
- Specialty and exam date (editable)
- Notification preferences
- Daily question target (default 50)
- Display preferences: dark mode / light mode
- Account management: change password, delete account

---

## 6. Admin Panel (Content Management)

A separate admin interface for MedCore staff:

### Question Management
- Create / Edit / Delete questions (rich text editor with image upload)
- Tag questions by subject, topic, difficulty, specialty
- Bulk import via CSV or Excel
- Question review workflow: Draft → Review → Published
- Flag questions reported by users as inaccurate

### Content Analytics
- Most attempted questions
- Questions with highest incorrect rate (candidates for review)
- Subject coverage gaps

### User Management
- List all registered users
- View individual user performance
- Disable/enable accounts
- Subscription management

### Announcements
- Push announcements to all users or specific cohorts

---

## 7. Technical Architecture

### Frontend
- **Framework:** Next.js 14+ (React, App Router)
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui
- **State Management:** Zustand or React Context (lightweight, no Redux for MVP)
- **Charts:** Recharts or Chart.js
- **Animations:** Framer Motion (subtle transitions for question cards)

### Backend
- **Runtime:** Node.js with Express or Next.js API Routes
- **Language:** TypeScript throughout
- **ORM:** Prisma
- **Database:** PostgreSQL (primary data store)
- **Cache:** Redis (session management, leaderboard, frequently accessed questions)
- **Auth:** NextAuth.js (supports email/password + Google OAuth)
- **File Storage:** Cloudinary or AWS S3 (question images)

### Infrastructure (Demo)
- **Hosting:** Vercel (frontend + serverless functions)
- **Database:** Neon or Supabase (managed PostgreSQL)
- **Email:** Resend or SendGrid
- **Monitoring:** Vercel Analytics + Sentry

### Key Database Tables (simplified)
```sql
users               -- profile, specialty, subscription
questions           -- full question bank
question_attempts   -- every answer submitted by a user
quiz_sessions       -- grouped attempts (one practice session)
mock_exams          -- mock exam records
user_notes          -- per-question notes
bookmarks           -- flagged questions
flashcards          -- user flashcard deck
spaced_rep_schedule -- SRS intervals per question per user
```

---

## 8. Design System & UI Principles

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| Primary | `#1E40AF` | Buttons, links, active states |
| Primary Light | `#DBEAFE` | Backgrounds, badges |
| Success | `#16A34A` | Correct answers, pass indicators |
| Danger | `#DC2626` | Incorrect answers, fail indicators |
| Warning | `#D97706` | Flagged questions, at-risk streaks |
| Neutral 900 | `#111827` | Body text |
| Neutral 100 | `#F3F4F6` | Card backgrounds |
| Background | `#FFFFFF` | Page background |

### Typography
- **Font:** Inter (Google Fonts)
- **Heading sizes:** 2xl for page titles, xl for section headers, lg for card titles
- **Body:** 16px base, 1.6 line height for readability in long explanations

### Design Principles
1. **Clarity over decoration** — medical exam prep is serious; the UI should be calm and focused
2. **Information density without overwhelm** — show the most actionable data upfront, drill-down for details
3. **Instant feedback** — every interaction gets a response within 100ms (optimistic UI)
4. **Accessibility** — WCAG 2.1 AA compliance (contrast ratios, keyboard navigation, screen reader labels)
5. **Mobile-first** — question solving must work on a 375px wide phone screen

---

## 9. User Flows

### Flow 1: New User First Session
```
Landing Page
  → Sign Up (email or Google)
  → Email Verification
  → Onboarding: Select Specialty
  → Onboarding: Set Exam Date
  → Onboarding: 10-question Diagnostic Quiz
  → Dashboard (with tour tooltip)
  → Start First Practice Session
```

### Flow 2: Returning User Daily Study
```
Login
  → Dashboard (see streak, weak areas, daily goal progress)
  → "Resume" or "Quick Practice" CTA
  → Question Solving Interface
  → Session Summary (score, time, new weak areas flagged)
  → Back to Dashboard (updated stats)
```

### Flow 3: Mock Exam
```
Dashboard → Mock Exams
  → Select specialty and paper configuration
  → Pre-exam checklist (timer warning, no-pause notice)
  → 200-question timed exam (4 hr 30 min total)
  → Submission
  → Detailed Score Report
  → "Review Incorrect Answers" → launches Tutor Mode on wrong answers only
```

### Flow 4: Targeted Weak-Area Revision
```
Dashboard → Weak Areas Panel
  → Click "Study Now" on Biostatistics
  → Custom quiz launches: 25 questions, Biostatistics, Tutor Mode
  → Complete session
  → Session Summary shows improvement vs. last attempt
  → Biostatistics accuracy updated in dashboard
```

---

## 10. Page Inventory

| Page | Route | Description |
|---|---|---|
| Landing Page | `/` | Marketing page with CTA, features, testimonials |
| Login | `/login` | Email/password + Google |
| Register | `/register` | Sign up |
| Onboarding | `/onboarding` | 4-step first-time flow |
| Dashboard | `/dashboard` | Main analytics hub |
| Practice | `/practice` | Custom quiz builder + quick start |
| Question Session | `/session/[id]` | Active MCQ solving interface |
| Session Review | `/session/[id]/review` | Post-session summary and answer review |
| Mock Exam | `/mock` | Mock exam list + launch |
| Mock Exam Active | `/mock/[id]` | Live exam interface |
| Mock Report | `/mock/[id]/report` | Detailed score report |
| Subject Browser | `/subjects` | Browse all subjects/topics |
| Topic Detail | `/subjects/[subject]/[topic]` | Topic stats + launch quiz |
| Past Papers | `/past-papers` | Past paper archive |
| Bookmarks | `/bookmarks` | Flagged questions |
| Flashcards | `/flashcards` | Flashcard deck + session |
| Notes | `/notes` | All user notes |
| Leaderboard | `/leaderboard` | Opt-in ranking |
| Profile | `/profile` | User settings |
| Admin: Dashboard | `/admin` | Admin overview |
| Admin: Questions | `/admin/questions` | CRUD for question bank |
| Admin: Users | `/admin/users` | User management |

---

## 11. Subscription & Access Model

### Free Tier
- 20 free questions per day
- Access to all subjects (limited question count)
- Basic dashboard (accuracy %, questions attempted)
- No mock exams
- No spaced repetition

### Pro Tier — PKR 1,999/month (or PKR 14,999/year)
- Unlimited question access
- Full analytics dashboard
- All practice modes including mock exams
- Spaced repetition and flashcards
- Past papers
- PDF export of notes
- Priority support

### Institution Tier — Custom Pricing
- Seat-based licensing for coaching centers
- Instructor dashboard: assign quizzes, view student reports
- Cohort analytics
- Branded experience (optional)

---

## 12. Content Strategy

### Question Quality Standards
- Every question written or reviewed by a doctor with FCPS qualification
- Explanation must cite a standard reference (Gray's Anatomy, Ganong's Physiology, Katzung Pharmacology, Robbins Pathology, etc.)
- Questions reviewed for outdated clinical information every 6 months
- User-reported inaccuracy flag → editorial review within 48 hours

### Content Roadmap
| Phase | Questions | Scope |
|---|---|---|
| Demo (MVP) | 500 | Paper I common subjects only |
| Phase 1 Launch | 3,000 | Paper I + Medicine Part II |
| Phase 2 | 8,000 | All 4 primary specialties |
| Phase 3 | 20,000+ | All 8 specialties + OSCE cases |

---

## 13. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Page Load Time | < 2s on 4G mobile |
| Question Submit Latency | < 200ms (optimistic UI, sync in background) |
| Uptime | 99.5% monthly |
| Database Backup | Daily automated backups |
| Session Timeout | 7 days (remember me enabled by default) |
| Mobile Support | iOS Safari, Android Chrome, responsive ≥ 375px |
| Browser Support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| Data Retention | User performance data retained indefinitely |
| Security | HTTPS everywhere, bcrypt password hashing, JWT tokens, CSRF protection |

---

## 14. Analytics & Metrics (Platform KPIs)

### Engagement Metrics
- DAU / MAU ratio (target: >40%)
- Average questions answered per session
- Session frequency per week per user
- Streak distribution

### Performance Metrics
- Average accuracy improvement from first week to week 4
- Mock exam score progression
- Conversion: Free → Pro

### Content Metrics
- Questions per subject (coverage completeness)
- Average time spent per question
- Questions with >70% incorrect rate (quality flag)

---

## 15. Milestones & Build Phases

### Phase 0 — Foundation (Week 1–2)
- Next.js project setup, Tailwind, shadcn/ui
- Database schema (Prisma + PostgreSQL)
- Auth (NextAuth.js — email + Google)
- Seed 500 questions into database
- Basic routing and layout

### Phase 1 — Core Loop (Week 3–4)
- Question solving interface (Tutor Mode)
- Custom quiz builder
- Question attempt recording
- Basic dashboard (accuracy cards)

### Phase 2 — Analytics (Week 5–6)
- Full analytics dashboard (subject breakdown, progress charts, weak areas)
- Timed Exam Mode
- Mock Exam (100-question)
- Session Review screen

### Phase 3 — Retention & Polish (Week 7–8)
- Spaced repetition algorithm
- Flashcard system
- Bookmarks and notes
- Streaks and gamification
- Mobile responsiveness pass
- Admin panel (question management)
- Landing page with pricing

### Post-Demo — Phase 4
- OSCE practice stations
- Past paper archive (real CPSP past papers)
- Institution tier and instructor dashboard
- iOS/Android native app (React Native or Expo)
- AI-powered explanations (Claude API integration)
- Peer discussion threads per question

---

## 16. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Question content quality | High | High | All questions reviewed by FCPS-qualified doctors before publish |
| CPSP copyright on past papers | Medium | High | Paraphrase past paper content; do not reproduce verbatim |
| Low user retention | Medium | High | Gamification (streaks, leaderboard), weekly email reports |
| Incorrect answers in question bank | Medium | High | User-report flag, editorial SLA, expert reviewer loop |
| Performance at scale | Low | Medium | CDN for static assets, Redis cache for question delivery, DB indexing |
| Mobile UX issues | Medium | Medium | Mobile-first design pass in Phase 3, real device testing |

---

## 17. Out of Scope (Demo)

The following are explicitly NOT part of the demo build:

- Live video lectures or streaming
- Discussion forums or community features
- AI-generated question explanations (post-demo roadmap)
- Native mobile app (web-responsive only for demo)
- OSCE simulation (Phase 2+)
- Real payment gateway (Stripe/JazzCash integration is post-demo)
- Multi-language support (Urdu interface is Phase 2)
- Offline mode

---

## 18. Appendix: Competitive Landscape

| Platform | Geography | MCQ Count | FCPS-Specific | Analytics | Mobile App |
|---|---|---|---|---|---|
| **MedCore** (this product) | Pakistan | 500 → 20K | Yes — CPSP syllabus | Deep | Web-responsive |
| eMedici | Australia | 5,000+ | No | Good | iOS + Android |
| MedMasters | Pakistan | 30,000 (JCAT) | Partial | Basic | Limited |
| FcpsWorld | Pakistan | 30,000 | Yes | Minimal | Web |
| UWorld | USA/Global | 4,000+ | No | Excellent | iOS + Android |
| Part1PK | Pakistan | Unknown | Yes | Basic | App-first |

**MedCore's differentiator:** The only platform combining deep FCPS-specific content, eMedici-quality UX, and UWorld-level analytics, built specifically for Pakistani postgraduate medical candidates.

---

*Document prepared for MedCore demo build. All features in Section 5 are in scope for the MVP demo. Sections marked Phase 2+ are post-demo roadmap items.*
