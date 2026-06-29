-- Supabase Schema for MedCore

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  specialty TEXT,
  subscription_tier TEXT DEFAULT 'free', -- free, premium, pro
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blocks (MCQ Collections)
CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  specialty TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  total_mcqs INTEGER DEFAULT 5,
  difficulty_level TEXT DEFAULT 'medium', -- easy, medium, hard
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MCQs (Multiple Choice Questions)
CREATE TABLE IF NOT EXISTS public.mcqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_id UUID NOT NULL REFERENCES public.blocks(id) ON DELETE CASCADE,
  case_study TEXT NOT NULL,
  question TEXT NOT NULL,
  image_url TEXT,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL, -- a, b, c, d
  explanation TEXT,
  explanation_a TEXT,
  explanation_b TEXT,
  explanation_c TEXT,
  explanation_d TEXT,
  difficulty_level TEXT DEFAULT 'medium',
  keywords TEXT[], -- for search
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Sessions (Block attempts)
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  block_id UUID NOT NULL REFERENCES public.blocks(id) ON DELETE CASCADE,
  total_mcqs INTEGER NOT NULL,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  score DECIMAL(5,2) DEFAULT 0,
  time_taken_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Answers (Track each answer per session)
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  mcq_id UUID NOT NULL REFERENCES public.mcqs(id) ON DELETE CASCADE,
  user_answer TEXT, -- a, b, c, d
  is_correct BOOLEAN DEFAULT FALSE,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study Streaks
CREATE TABLE IF NOT EXISTS public.study_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress (Overall stats)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  total_mcqs_attempted INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  overall_accuracy DECIMAL(5,2) DEFAULT 0,
  blocks_completed INTEGER DEFAULT 0,
  study_hours DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Block Progress (Per specialty)
CREATE TABLE IF NOT EXISTS public.block_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  block_id UUID NOT NULL REFERENCES public.blocks(id) ON DELETE CASCADE,
  attempts INTEGER DEFAULT 0,
  best_score DECIMAL(5,2) DEFAULT 0,
  last_attempt_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, block_id)
);

-- Analytics/Daily Stats
CREATE TABLE IF NOT EXISTS public.daily_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  study_date DATE NOT NULL,
  mcqs_attempted INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  study_minutes INTEGER DEFAULT 0,
  streak_maintained BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, study_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mcqs_block_id ON public.mcqs(block_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_block_id ON public.sessions(block_id);
CREATE INDEX IF NOT EXISTS idx_answers_session_id ON public.answers(session_id);
CREATE INDEX IF NOT EXISTS idx_answers_mcq_id ON public.answers(mcq_id);
CREATE INDEX IF NOT EXISTS idx_study_streaks_user_id ON public.study_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_block_progress_user_id ON public.block_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_id ON public.daily_stats(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.block_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only see their own data
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own sessions" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own answers" ON public.answers
  FOR SELECT USING (
    session_id IN (
      SELECT id FROM public.sessions WHERE user_id = auth.uid()
    )
  );

-- Blocks are readable by all authenticated users
CREATE POLICY "Authenticated users can view blocks" ON public.blocks
  FOR SELECT USING (auth.role() = 'authenticated');

-- MCQs are readable by all authenticated users
CREATE POLICY "Authenticated users can view mcqs" ON public.mcqs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Auto-update updated_at timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);

CREATE TRIGGER update_blocks_updated_at BEFORE UPDATE ON public.blocks
  FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);

CREATE TRIGGER update_mcqs_updated_at BEFORE UPDATE ON public.mcqs
  FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);

CREATE TRIGGER update_study_streaks_updated_at BEFORE UPDATE ON public.study_streaks
  FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);

CREATE TRIGGER update_block_progress_updated_at BEFORE UPDATE ON public.block_progress
  FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);
