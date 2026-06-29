import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export function getSupabase() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    supabaseInstance = createClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      }
    )
  }
  return supabaseInstance
}

// Lazy proxy for backward compatibility
export const supabase = new Proxy(
  {},
  {
    get: (target, prop) => {
      const instance = getSupabase()
      return (instance as any)[prop]
    },
  }
) as ReturnType<typeof createClient<Database>>

// Helper functions for common operations

// Auth Functions
export async function signUpWithEmail(email: string, password: string, fullName: string) {
  try {
    const supabaseClient = getSupabase()

    // Create auth account without email verification to avoid rate limits
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard`,
      },
    })

    if (error || !data.user) {
      return { data, error }
    }

    // Create user profile in users table
    const { error: profileError } = await supabaseClient
      .from('users')
      .insert({
        id: data.user.id,
        email,
        full_name: fullName,
      } as any)

    // Create empty user progress
    if (!profileError) {
      await supabaseClient
        .from('user_progress')
        .insert({
          user_id: data.user.id,
        } as any)

      // Create study streak entry
      await supabaseClient
        .from('study_streaks')
        .insert({
          user_id: data.user.id,
        } as any)
    }

    return { data, error: profileError || error }
  } catch (err: any) {
    return { data: null, error: err }
  }
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// User Functions
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function updateUserProfile(userId: string, updates: Partial<Database['public']['Tables']['users']['Update']>) {
  // @ts-ignore
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

// Block Functions
export async function getBlocks() {
  const { data, error } = await supabase
    .from('blocks')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function getBlock(blockId: string) {
  const { data, error } = await supabase
    .from('blocks')
    .select('*')
    .eq('id', blockId)
    .single()
  return { data, error }
}

// MCQ Functions
export async function getMCQsByBlock(blockId: string) {
  const { data, error } = await supabase
    .from('mcqs')
    .select('*')
    .eq('block_id', blockId)
  return { data, error }
}

export async function getMCQ(mcqId: string) {
  const { data, error } = await supabase
    .from('mcqs')
    .select('*')
    .eq('id', mcqId)
    .single()
  return { data, error }
}

// Session Functions
export async function createSession(userId: string, blockId: string, totalMcqs: number) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      block_id: blockId,
      total_mcqs: totalMcqs,
    })
    .select()
    .single() as Promise<{ data: Database['public']['Tables']['sessions']['Row'] | null; error: any }>
  return { data, error }
}

export async function updateSession(
  sessionId: string,
  updates: Partial<Database['public']['Tables']['sessions']['Update']>
) {
  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single()
  return { data, error }
}

export async function getUserSessions(userId: string) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

// Answer Functions
export async function saveAnswer(
  sessionId: string,
  mcqId: string,
  userAnswer: string,
  isCorrect: boolean,
  timeSpent: number
) {
  const { data, error } = await supabase
    .from('answers')
    .insert({
      session_id: sessionId,
      mcq_id: mcqId,
      user_answer: userAnswer,
      is_correct: isCorrect,
      time_spent_seconds: timeSpent,
    })
    .select()
    .single()
  return { data, error }
}

export async function getSessionAnswers(sessionId: string) {
  const { data, error } = await supabase
    .from('answers')
    .select('*')
    .eq('session_id', sessionId)
  return { data, error }
}

// User Progress Functions
export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

export async function updateUserProgress(
  userId: string,
  updates: Partial<Database['public']['Tables']['user_progress']['Update']>
) {
  const { data, error } = await supabase
    .from('user_progress')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()
  return { data, error }
}

// Study Streak Functions
export async function getStudyStreak(userId: string) {
  const { data, error } = await supabase
    .from('study_streaks')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

export async function updateStudyStreak(
  userId: string,
  updates: Partial<Database['public']['Tables']['study_streaks']['Update']>
) {
  const { data, error } = await supabase
    .from('study_streaks')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()
  return { data, error }
}

// Daily Stats Functions
export async function saveDailyStats(
  userId: string,
  studyDate: string,
  stats: Database['public']['Tables']['daily_stats']['Insert']
) {
  const { data, error } = await supabase
    .from('daily_stats')
    .upsert({
      user_id: userId,
      study_date: studyDate,
      ...stats,
    })
    .select()
    .single()
  return { data, error }
}

export async function getDailyStats(userId: string, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('user_id', userId)
    .gte('study_date', startDate)
    .lte('study_date', endDate)
  return { data, error }
}

// Block Progress Functions
export async function getBlockProgress(userId: string, blockId: string) {
  const { data, error } = await supabase
    .from('block_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('block_id', blockId)
    .single()
  return { data, error }
}

export async function updateBlockProgress(
  userId: string,
  blockId: string,
  updates: Partial<Database['public']['Tables']['block_progress']['Update']>
) {
  const { data, error } = await supabase
    .from('block_progress')
    .upsert({
      user_id: userId,
      block_id: blockId,
      ...updates,
    })
    .select()
    .single()
  return { data, error }
}

// Real-time Subscriptions
export function subscribeToUserProgress(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`user_progress:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_progress',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()
}

export function subscribeToStudyStreaks(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`study_streaks:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'study_streaks',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()
}
