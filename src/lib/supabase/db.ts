import { createClient } from './client'

export interface VajraSession {
  id?: string
  user_id: string
  started_at: string
  completed_at: string
  duration_minutes: number
  depth_reached: number
  response_count: number
  patterns: Record<string, number>
  insight_text: string
  closing_text: string
}

export interface VajraResponse {
  id?: string
  session_id: string
  node_id: string
  question_text: string
  answer: string
  answered_at: string
}

// Save full session + responses to Supabase
export async function saveSession(
  session: Omit<VajraSession, 'id'>,
  responses: VajraResponse[]
): Promise<{ sessionId: string | null; error: string | null }> {
  const supabase = createClient()

  // 1. Insert session
  const { data: sessionData, error: sessionError } = await supabase
    .from('sessions')
    .insert(session)
    .select('id')
    .single()

  if (sessionError) return { sessionId: null, error: sessionError.message }

  const sessionId = sessionData.id

  // 2. Insert responses with session_id
  const responsesWithId = responses.map(r => ({ ...r, session_id: sessionId }))
  const { error: responsesError } = await supabase
    .from('responses')
    .insert(responsesWithId)

  if (responsesError) return { sessionId, error: responsesError.message }

  return { sessionId, error: null }
}

// Get all sessions for current user
export async function getUserSessions(): Promise<VajraSession[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('started_at', { ascending: false })

  if (error) return []
  return data || []
}

// Get single session with responses
export async function getSessionWithResponses(sessionId: string) {
  const supabase = createClient()

  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single()

  const { data: responses } = await supabase
    .from('responses')
    .select('*')
    .eq('session_id', sessionId)
    .order('answered_at', { ascending: true })

  return { session, responses: responses || [] }
}

// Get previous sessions summary for AI memory
export async function getPreviousSessionsSummary(userId: string): Promise<string> {
  const supabase = createClient()

  const { data } = await supabase
    .from('sessions')
    .select('started_at, patterns, insight_text, closing_text')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(3)

  if (!data || data.length === 0) return ''

  const summaries = data.map((s, i) => {
    const date = new Date(s.started_at).toLocaleDateString('tr-TR')
    const patterns = Object.entries(s.patterns || {})
      .sort((a: any, b: any) => b[1] - a[1])
      .map(([k, v]) => `${k}(${v}x)`)
      .join(', ')
    return `Seans ${i + 1} (${date}): Desenler: ${patterns || 'belirsiz'}. Insight: "${s.insight_text?.slice(0, 100)}..."`
  }).join('\n')

  return `Kullanıcının önceki ${data.length} seansı:\n${summaries}`
}
