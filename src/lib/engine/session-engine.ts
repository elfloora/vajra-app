import type {
  ProtocolSession,
  SessionResponse,
  ResponseValue,
  PatternEntry,
  SessionInsight,
  ProtocolNode,
  ProtocolFlow,
} from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { ALL_FLOWS } from './protocol-flows'

// ─── Session Factory ──────────────────────────────────────────────────────────

export function createSession(flowId: string): ProtocolSession {
  const flow = ALL_FLOWS[flowId]
  if (!flow) throw new Error(`Flow not found: ${flowId}`)

  return {
    id: uuidv4(),
    flowId,
    startedAt: Date.now(),
    lastActiveAt: Date.now(),
    currentNodeId: flow.entryNodeId,
    responses: [],
    patterns: [],
    insights: [],
    depthReached: 0,
    status: 'active',
  }
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export function getCurrentNode(
  session: ProtocolSession,
  flow: ProtocolFlow
): ProtocolNode | null {
  return flow.nodes[session.currentNodeId] ?? null
}

export function advanceSession(
  session: ProtocolSession,
  flow: ProtocolFlow,
  response: ResponseValue,
  choiceId?: string
): ProtocolSession {
  const currentNode = getCurrentNode(session, flow)
  if (!currentNode) return session

  const responseEntry: SessionResponse = {
    nodeId: currentNode.id,
    questionType: currentNode.questionType ?? 'open',
    value: response,
    timestamp: Date.now(),
    durationMs: Date.now() - session.lastActiveAt,
    tags: currentNode.tags,
  }

  // Determine next node
  let nextNodeId: string | undefined

  if (currentNode.choices && choiceId) {
    const chosen = currentNode.choices.find((c) => c.id === choiceId)
    nextNodeId = chosen?.nextNodeId
  } else {
    nextNodeId = currentNode.nextNodeId
  }

  const updatedResponses = [...session.responses, responseEntry]
  const updatedPatterns = detectPatterns(updatedResponses, session.patterns)
  const updatedInsights = generateInsights(updatedPatterns, session.insights)

  return {
    ...session,
    currentNodeId: nextNodeId ?? session.currentNodeId,
    responses: updatedResponses,
    patterns: updatedPatterns,
    insights: updatedInsights,
    lastActiveAt: Date.now(),
    depthReached: Math.max(session.depthReached, currentNode.depthLevel ?? 0),
    status: !nextNodeId || flow.nodes[nextNodeId ?? '']?.type === 'terminus'
      ? 'complete'
      : 'active',
    completedAt: !nextNodeId ? Date.now() : undefined,
  }
}

// ─── Pattern Detection ────────────────────────────────────────────────────────

const PATTERN_KEYWORDS: Record<string, string[]> = {
  avoidance: ['avoid', 'escape', 'run', 'hide', 'away', 'around', 'instead'],
  control: ['control', 'manage', 'order', 'plan', 'structure', 'predictable'],
  connection: ['alone', 'together', 'belong', 'close', 'others', 'them', 'us'],
  fear: ['afraid', 'scared', 'fear', 'worry', 'anxious', 'what if', 'might'],
  perfectionism: ['perfect', 'enough', 'fail', 'wrong', 'mistake', 'should'],
  approval: ['judge', 'think', 'disappoint', 'please', 'expect', 'allow'],
  loss: ['lose', 'lost', 'gone', 'leave', 'left', 'taken', 'miss'],
  power: ['power', 'weak', 'strong', 'capable', 'able', 'can', 'cannot'],
}

function detectPatterns(
  responses: SessionResponse[],
  existing: PatternEntry[]
): PatternEntry[] {
  const patterns = new Map<string, PatternEntry>(
    existing.map((p) => [p.key, { ...p }])
  )

  const latestResponse = responses[responses.length - 1]
  if (!latestResponse || typeof latestResponse.value !== 'string') {
    return existing
  }

  const text = latestResponse.value.toLowerCase()

  for (const [patternKey, keywords] of Object.entries(PATTERN_KEYWORDS)) {
    const matched = keywords.some((kw) => text.includes(kw))
    if (matched) {
      const existing_entry = patterns.get(patternKey)
      if (existing_entry) {
        patterns.set(patternKey, {
          ...existing_entry,
          frequency: existing_entry.frequency + 1,
          lastSeen: Date.now(),
          contexts: [...existing_entry.contexts, latestResponse.nodeId],
        })
      } else {
        patterns.set(patternKey, {
          key: patternKey,
          frequency: 1,
          lastSeen: Date.now(),
          contexts: [latestResponse.nodeId],
        })
      }
    }
  }

  return Array.from(patterns.values())
}

// ─── Insight Generation ───────────────────────────────────────────────────────

const INSIGHT_TEMPLATES: Record<string, string[]> = {
  avoidance: [
    'A pattern of avoidance appears. This is not weakness — it is a learned strategy. The question is: what cost does it carry now?',
    'Moving around difficulty is intelligent. But it means the difficulty remains intact, waiting.',
  ],
  control: [
    'Control appears frequently in your responses. What would it mean to be safe without it?',
    'The need to control often speaks to a time when things were uncontrollable.',
  ],
  fear: [
    'Fear surfaces in your language. Fear is often accurate information, poorly timed.',
    'You have carried something frightening for a long time. It has shaped the architecture of your choices.',
  ],
  approval: [
    'Your responses show a recurring orientation toward others\' perception. Whose voice is that, originally?',
    'The need for permission often outlasts the person who could give it.',
  ],
  perfectionism: [
    'Perfectionism appears in your pattern. It is often love for something — a refusal to let it be less than it could be.',
    '"Enough" is a word that does not appear naturally in your responses.',
  ],
}

function generateInsights(
  patterns: PatternEntry[],
  existing: SessionInsight[]
): SessionInsight[] {
  const highFrequency = patterns.filter((p) => p.frequency >= 2)
  if (highFrequency.length === 0) return existing

  const newInsights: SessionInsight[] = []

  for (const pattern of highFrequency) {
    const alreadyGenerated = existing.some(
      (i) => i.relatedNodes.includes(pattern.key)
    )
    if (alreadyGenerated) continue

    const templates = INSIGHT_TEMPLATES[pattern.key]
    if (!templates) continue

    const template = templates[Math.floor(Math.random() * templates.length)]
    newInsights.push({
      id: uuidv4(),
      type: 'pattern',
      content: template,
      generatedAt: Date.now(),
      relatedNodes: [pattern.key],
    })
  }

  return [...existing, ...newInsights]
}

// ─── Session Summary ──────────────────────────────────────────────────────────

export interface SessionSummary {
  totalResponses: number
  depthReached: number
  dominantPatterns: PatternEntry[]
  insights: SessionInsight[]
  durationMinutes: number
  completionRate: number
  flowName: string
}

export function buildSessionSummary(
  session: ProtocolSession,
  flow: ProtocolFlow
): SessionSummary {
  const totalNodes = Object.keys(flow.nodes).length
  const durationMs = (session.completedAt ?? Date.now()) - session.startedAt

  return {
    totalResponses: session.responses.length,
    depthReached: session.depthReached,
    dominantPatterns: session.patterns
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 3),
    insights: session.insights,
    durationMinutes: Math.round(durationMs / 60000),
    completionRate: Math.round((session.responses.length / totalNodes) * 100),
    flowName: flow.name,
  }
}
