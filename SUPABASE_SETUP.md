# Supabase Setup Guide for MedCore

## Prerequisites
- Supabase account (free tier available at https://supabase.com)
- Node.js and npm installed

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign in or create an account
3. Click "New Project"
4. Fill in project details:
   - **Name**: medcore
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users (e.g., US-East-1)
5. Click "Create new project" and wait for initialization

## Step 2: Get API Keys

1. Go to Project Settings → API
2. Copy the following:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **Anon Public Key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **Service Role Secret Key** (SUPABASE_SERVICE_ROLE_KEY) - Keep this secret!

## Step 3: Environment Variables

Create `.env.local` in project root:

```env
# Supabase API Keys
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Server-side only (never expose to client)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Also update `.env.example`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 4: Create Database Schema

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to **SQL Editor** in Supabase Dashboard
2. Click "New Query"
3. Copy entire content from `/supabase/schema.sql`
4. Paste into the editor
5. Click "Run"
6. Confirm all tables created successfully

### Option B: Using CLI (If you have Supabase CLI)

```bash
npm install -g supabase
supabase login
supabase db push
```

## Step 5: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## Step 6: Create Auth (Authentication)

1. Go to **Authentication** in Supabase Dashboard
2. Click **Providers** tab
3. Enable "Email" provider
4. Go to **URL Configuration**
5. Set:
   - **Site URL**: http://localhost:3000 (for dev)
   - **Redirect URLs**:
     ```
     http://localhost:3000/auth/callback
     https://your-domain.com/auth/callback
     ```

## Step 7: Sample Data

Run this in SQL Editor to add sample blocks:

```sql
-- Sample Blocks
INSERT INTO public.blocks (title, specialty, description, icon, color, total_mcqs, difficulty_level)
VALUES
  ('Cardiology Basics', 'Medicine', 'Essential cardiac concepts', '🫀', 'from-blue-600 to-blue-500', 5, 'medium'),
  ('Pediatric Cases', 'Pediatrics', 'Common pediatric conditions', '👶', 'from-pink-600 to-pink-500', 5, 'medium'),
  ('Surgical Procedures', 'Surgery', 'Common surgical techniques', '🔧', 'from-purple-600 to-purple-500', 5, 'medium'),
  ('OB/GYN Essentials', 'Obstetrics', 'Pregnancy and gynecology', '💝', 'from-red-600 to-red-500', 5, 'medium');

-- Sample MCQs (for first block - Cardiology)
INSERT INTO public.mcqs (block_id, case_study, question, option_a, option_b, option_c, option_d, correct_answer, explanation)
SELECT id, 
  'A 65-year-old male presents with chest pain and shortness of breath.',
  'What is the most likely diagnosis?',
  'Acute Myocardial Infarction',
  'Pneumonia',
  'Asthma',
  'Anxiety',
  'a',
  'Acute MI is most likely given the presentation of chest pain and dyspnea in an elderly patient.'
FROM public.blocks WHERE title = 'Cardiology Basics' LIMIT 1;
```

## Step 8: Authentication Setup in Next.js

Create `/app/auth/callback/route.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

## Step 9: Update Login Page

Replace your current login with Supabase auth:

```typescript
'use client'
import { supabase, signInWithEmail } from '@/lib/supabase'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await signInWithEmail(email, password)
    
    if (error) {
      setError(error.message)
    } else if (data.session) {
      window.location.href = '/dashboard'
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Sign In'}
      </button>
    </form>
  )
}
```

## Step 10: Update Dashboard

Replace static data with Supabase queries:

```typescript
'use client'
import { useEffect, useState } from 'react'
import { supabase, getUserSessions, getBlocks } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState([])
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }
        
        setUser(user)

        // Load user sessions
        const { data: sessionsData } = await getUserSessions(user.id)
        setSessions(sessionsData || [])

        // Load blocks
        const { data: blocksData } = await getBlocks()
        setBlocks(blocksData || [])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      {/* Add your dashboard content here */}
    </div>
  )
}
```

## Database Schema Overview

### Tables

1. **users** - User profiles (linked to Supabase Auth)
2. **blocks** - MCQ collections organized by specialty
3. **mcqs** - Individual multiple choice questions
4. **sessions** - User's exam attempts
5. **answers** - Individual answers within a session
6. **study_streaks** - Track daily study consistency
7. **user_progress** - Overall statistics
8. **block_progress** - Per-block performance
9. **daily_stats** - Daily study analytics

### Key Features

- ✅ Row Level Security (RLS) enabled - users only see their own data
- ✅ Real-time subscriptions for live updates
- ✅ Automatic timestamps with `moddatetime` trigger
- ✅ Proper foreign key constraints
- ✅ Optimized indexes for performance
- ✅ Support for arrays (keywords in MCQs)

## Testing Connection

Create `/app/test/page.tsx`:

```typescript
'use client'
import { useEffect, useState } from 'react'
import { supabase, getBlocks } from '@/lib/supabase'

export default function TestPage() {
  const [blocks, setBlocks] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function test() {
      try {
        const { data, error } = await getBlocks()
        if (error) throw error
        setBlocks(data)
      } catch (err) {
        setError(err.message)
      }
    }
    test()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      {error && <p className="text-red-500">Error: {error}</p>}
      {blocks && (
        <div>
          <p className="text-green-500">✅ Connected! Found {blocks.length} blocks</p>
          <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(blocks, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
```

## Useful Supabase Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)

## Common Issues & Solutions

### Issue: "Invalid API Key"
- Check `.env.local` has correct keys
- Keys are case-sensitive
- Restart dev server after adding env vars

### Issue: "Permission denied" errors
- Check RLS policies are enabled
- User must be authenticated
- Check the filter in RLS policy matches

### Issue: Realtime not working
- Ensure real-time is enabled in project settings
- Check subscription filters are correct
- Browser console should show subscription status

## Next Steps

1. Test connection using test page
2. Set up authentication pages (login/signup)
3. Migrate existing dashboard data to Supabase
4. Implement real-time features
5. Set up backup schedules
6. Configure monitoring and alerts

Good luck with MedCore! 🚀
