# MedCore Supabase Database Schema

## Overview
This document outlines the complete Supabase schema needed for the MedCore FCPS exam preparation platform.

---

## 1. AUTH (Supabase Built-in)
Use Supabase's built-in authentication system. No custom table needed.

---

## 2. TABLES

### Table: `users`
Extends Supabase auth with additional profile data

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  specialization TEXT,
  avatar_url TEXT,
  bio TEXT,
  status TEXT DEFAULT 'active', -- active, inactive, suspended
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);
```

---

### Table: `blocks`
FCPS exam blocks/subjects

```sql
CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  specialty TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL DEFAULT 'Medium', -- Easy, Medium, Hard
  icon TEXT, -- emoji icon
  color TEXT, -- gradient class or hex: bg-gradient-to-r from-blue-500 to-purple-500
  total_mcqs INTEGER NOT NULL,
  estimated_time_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

---

### Table: `mcqs`
Multiple choice questions

```sql
CREATE TABLE mcqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  explanation TEXT,
  detailed_explanation TEXT,
  difficulty TEXT NOT NULL, -- Easy, Medium, Hard
  topic TEXT,
  correct_option INTEGER NOT NULL, -- 1, 2, 3, or 4
  correct_answer_letter TEXT, -- A, B, C, D (for reference)
  medical_image_url TEXT, -- reference to storage bucket
  year INTEGER, -- which year's exam this is from
  previous_frequency INTEGER DEFAULT 0, -- how many times appeared
  created_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

---

### Table: `mcq_options`
Options for each MCQ (A, B, C, D)

```sql
CREATE TABLE mcq_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcq_id UUID NOT NULL REFERENCES mcqs(id) ON DELETE CASCADE,
  option_letter TEXT NOT NULL, -- A, B, C, D
  option_number INTEGER NOT NULL, -- 1, 2, 3, 4
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
```

---

### Table: `block_sessions`
User's exam attempts/sessions

```sql
CREATE TABLE block_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  total_mcqs INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  incorrect_count INTEGER NOT NULL,
  unanswered_count INTEGER,
  score FLOAT NOT NULL, -- percentage (0-100)
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP NOT NULL,
  duration_seconds INTEGER,
  review_status TEXT DEFAULT 'not_reviewed', -- not_reviewed, reviewing, reviewed
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

---

### Table: `session_answers`
User's specific answers for each MCQ in a session

```sql
CREATE TABLE session_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES block_sessions(id) ON DELETE CASCADE,
  mcq_id UUID NOT NULL REFERENCES mcqs(id) ON DELETE CASCADE,
  selected_option_number INTEGER, -- 1, 2, 3, 4, or NULL if not answered
  selected_option_letter TEXT, -- A, B, C, D, or NULL
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INTEGER,
  marked_for_review BOOLEAN DEFAULT false,
  user_notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

---

### Table: `user_progress`
Overall user progress and statistics

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  total_attempts INTEGER DEFAULT 0,
  total_questions_attempted INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  total_incorrect INTEGER DEFAULT 0,
  best_score FLOAT,
  average_score FLOAT,
  worst_score FLOAT,
  last_attempted_at TIMESTAMP,
  last_session_id UUID REFERENCES block_sessions(id),
  total_study_time_seconds INTEGER DEFAULT 0,
  accuracy_by_difficulty JSONB, -- {Easy: 95, Medium: 75, Hard: 60}
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, block_id)
);
```

---

### Table: `topic_performance`
Performance tracking by individual topics within blocks

```sql
CREATE TABLE topic_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  total_attempted INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  accuracy FLOAT,
  last_attempted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, block_id, topic)
);
```

---

### Table: `saved_questions`
Bookmarked/saved questions for later review

```sql
CREATE TABLE saved_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mcq_id UUID NOT NULL REFERENCES mcqs(id) ON DELETE CASCADE,
  reason TEXT, -- 'difficult', 'missed', 'review_later', 'important'
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, mcq_id)
);
```

---

### Table: `study_sessions`
Detailed study session logs

```sql
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL, -- 'practice', 'review', 'theory'
  block_id UUID REFERENCES blocks(id),
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP NOT NULL,
  duration_minutes INTEGER,
  mcqs_practiced INTEGER,
  topics_covered TEXT[], -- array of topics
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## 3. STORAGE BUCKETS

### Bucket: `medical-images`
Store medical images for MCQs (ECGs, X-rays, CT scans, etc.)

**Configuration:**
```
- Bucket Name: medical-images
- Public: true (for display)
- File size limit: 5MB per file
- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
```

**Folder Structure:**
```
medical-images/
├── ecgs/
│   ├── ecg-001.jpg
│   ├── ecg-002.jpg
│   └── ...
├── xrays/
│   ├── xray-001.jpg
│   └── ...
├── ct-scans/
│   ├── ct-001.jpg
│   └── ...
├── ultrasound/
├── mri/
└── other/
```

---

### Bucket: `user-avatars` (Optional)
Store user profile pictures

**Configuration:**
```
- Bucket Name: user-avatars
- Public: true
- File size limit: 2MB
- Allowed MIME types: image/jpeg, image/png, image/webp
```

---

## 4. INDEXES (For Performance)

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Blocks
CREATE INDEX idx_blocks_is_active ON blocks(is_active);
CREATE INDEX idx_blocks_specialty ON blocks(specialty);

-- MCQs
CREATE INDEX idx_mcqs_block_id ON mcqs(block_id);
CREATE INDEX idx_mcqs_difficulty ON mcqs(difficulty);
CREATE INDEX idx_mcqs_topic ON mcqs(topic);

-- Block Sessions
CREATE INDEX idx_block_sessions_user_id ON block_sessions(user_id);
CREATE INDEX idx_block_sessions_block_id ON block_sessions(block_id);
CREATE INDEX idx_block_sessions_completed_at ON block_sessions(completed_at);

-- Session Answers
CREATE INDEX idx_session_answers_session_id ON session_answers(session_id);
CREATE INDEX idx_session_answers_mcq_id ON session_answers(mcq_id);

-- User Progress
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_block_id ON user_progress(block_id);

-- Topic Performance
CREATE INDEX idx_topic_performance_user_id ON topic_performance(user_id);

-- Saved Questions
CREATE INDEX idx_saved_questions_user_id ON saved_questions(user_id);
```

---

## 5. ROW LEVEL SECURITY (RLS) POLICIES

```sql
-- Users can only see their own profile
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can only view blocks
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blocks are viewable by all authenticated users"
  ON blocks FOR SELECT
  TO authenticated USING (true);

-- Users can only view MCQs
ALTER TABLE mcqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "MCQs are viewable by all authenticated users"
  ON mcqs FOR SELECT
  TO authenticated USING (true);

-- Users can only see their own sessions
ALTER TABLE block_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sessions"
  ON block_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only see their own answers
ALTER TABLE session_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own answers"
  ON session_answers FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM block_sessions WHERE user_id = auth.uid()
    )
  );

-- Similar policies for other tables...
```

---

## 6. DATA RELATIONSHIPS DIAGRAM

```
users (1) ──→ (M) block_sessions
       │
       ├──→ (M) user_progress
       │
       ├──→ (M) topic_performance
       │
       ├──→ (M) saved_questions ──→ mcqs
       │
       └──→ (M) study_sessions

blocks (1) ──→ (M) mcqs ──→ (M) mcq_options
       │
       ├──→ (M) block_sessions ──→ (M) session_answers ──→ mcqs
       │
       └──→ (M) user_progress

mcqs (1) ──→ (M) session_answers
     │
     └──→ (1) medical-images (storage bucket)
```

---

## 7. SAMPLE QUERIES

### Get user's dashboard stats:
```sql
SELECT 
  COUNT(DISTINCT bs.id) as total_sessions,
  COUNT(DISTINCT bs.block_id) as blocks_completed,
  SUM(bs.correct_count) as total_correct,
  SUM(bs.total_mcqs) as total_attempted,
  AVG(bs.score) as average_score
FROM block_sessions bs
WHERE bs.user_id = $1;
```

### Get block-wise performance:
```sql
SELECT 
  b.title,
  b.specialty,
  COUNT(bs.id) as attempts,
  MAX(bs.score) as best_score,
  AVG(bs.score) as average_score,
  up.accuracy_by_difficulty
FROM block_sessions bs
JOIN blocks b ON bs.block_id = b.id
LEFT JOIN user_progress up ON up.user_id = bs.user_id AND up.block_id = b.id
WHERE bs.user_id = $1
GROUP BY b.id, b.title, b.specialty, up.accuracy_by_difficulty;
```

---

## 8. AUTHENTICATION FLOW

1. User registers/logs in via Supabase Auth
2. User data stored in `users` table
3. All subsequent queries filtered by `auth.uid()`
4. RLS policies enforce data isolation
5. JWT token manages session

---

This schema is production-ready and scalable for MedCore!
