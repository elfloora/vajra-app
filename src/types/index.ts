// ─── Core Protocol Types ──────────────────────────────────────────────────────

export type QuestionType =
  | 'open'
  | 'choice'
  | 'scale'
  | 'binary'
  | 'reflection'
  | 'breath'

export type NodeType =
  | 'question'
  | 'transition'
  | 'insight'
  | 'terminus'

export interface Choice {
  id: string
  label: string
  weight?: number
  nextNodeId: string
  tags?: string[]
}

export interface ProtocolNode {
  id: string
  type: NodeType
  questionType?: QuestionType
  content: string
  subtext?: string
  choices?: Choice[]
  nextNodeId?: string
  scaleMin?: number
  scaleMax?: number
  scaleLabels?: [string, string]
  breathDuration?: number
  metadata?: Record<string, unknown>
  tags?: string[]
  depthLevel?: number
}

export interface ProtocolFlow {
  id: string
  name: string
  description: string
  version: string
  entryNodeId: string
  nodes: Record<string, ProtocolNode>
  metadata?: {
    estimatedMinutes: number
    theme: string
    tags: string[]
  }
}

// ─── Session Types ────────────────────────────────────────────────────────────

export type ResponseValue = string | number | boolean | string[]

export interface SessionResponse {
  nodeId: string
  questionType: QuestionType
  value: ResponseValue
  timestamp: number
  durationMs: number
  tags?: string[]
}

export interface PatternEntry {
  key: string
  frequency: number
  lastSeen: number
  contexts: string[]
}

export interface SessionInsight {
  id: string
  type: 'pattern' | 'contrast' | 'emergence' | 'recursion'
  content: string
  generatedAt: number
  relatedNodes: string[]
}

export interface ProtocolSession {
  id: string
  flowId: string
  startedAt: number
  lastActiveAt: number
  completedAt?: number
  currentNodeId: string
  responses: SessionResponse[]
  patterns: PatternEntry[]
  insights: SessionInsight[]
  depthReached: number
  status: 'active' | 'paused' | 'complete' | 'abandoned'
}

// ─── UI State Types ───────────────────────────────────────────────────────────

export type UIPhase =
  | 'idle'
  | 'loading'
  | 'question'
  | 'responding'
  | 'transitioning'
  | 'insight'
  | 'complete'

export interface UIState {
  phase: UIPhase
  glitchActive: boolean
  scanlineActive: boolean
  ambientMode: 'default' | 'deep' | 'emergence'
}

// ─── AI Integration Types ─────────────────────────────────────────────────────

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AISessionContext {
  sessionId: string
  flowName: string
  responses: SessionResponse[]
  patterns: PatternEntry[]
  currentDepth: number
}

export interface AIGeneratedNode {
  content: string
  subtext?: string
  questionType: QuestionType
  followUpPrompt?: string
}
