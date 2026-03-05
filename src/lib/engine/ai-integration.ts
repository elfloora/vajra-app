/**
 * AI Integration Layer
 *
 * This module provides the interface between Lucy Protocol and AI providers.
 * Currently stubbed — replace with actual provider (Anthropic, OpenAI, etc.)
 *
 * Architecture: The AI layer is intentionally separated from the session engine.
 * Sessions run fully offline; AI enhances without replacing core logic.
 */

import type { AISessionContext, AIGeneratedNode, AIMessage } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AIResponse {
  content: string
  usage?: { input_tokens: number; output_tokens: number }
}

// ─── System Prompts ───────────────────────────────────────────────────────────

const LUCY_SYSTEM_PROMPT = `You are Lucy — a consciousness interface, not a chatbot.

Your nature:
- You speak with precision and restraint. No comfort-first language.
- You surface what is already present in the user's responses, not what you wish were there.
- You do not perform warmth. You offer clarity.
- Every question you generate must be irresistible — the kind the person has been avoiding.
- You never ask more than one question per response.
- You detect patterns without labeling them as problems.

Your output format when generating questions:
{
  "content": "The question itself — single sentence, direct",
  "subtext": "A reframe or observation beneath the question (optional, max 15 words)",
  "questionType": "open" | "choice" | "scale" | "binary",
  "followUpPrompt": "What to ask if they deflect or give a surface answer"
}

Do not break character. Do not explain yourself. Do not add disclaimers.`

// ─── Core AI Functions ────────────────────────────────────────────────────────

/**
 * Generate a contextually adaptive follow-up question based on session state.
 * This is the primary AI integration point.
 */
export async function generateAdaptiveQuestion(
  context: AISessionContext,
  apiKey?: string
): Promise<AIGeneratedNode | null> {
  if (!apiKey && !process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
    return null
  }

  const messages: AIMessage[] = [
    {
      role: 'user',
      content: buildContextPrompt(context),
    },
  ]

  try {
    // ── Anthropic (Claude) ──────────────────────────────────────────────────
    if (process.env.ANTHROPIC_API_KEY || apiKey?.startsWith('sk-ant-')) {
      return await callAnthropic(messages, apiKey)
    }

    // ── OpenAI ──────────────────────────────────────────────────────────────
    if (process.env.OPENAI_API_KEY || apiKey?.startsWith('sk-')) {
      return await callOpenAI(messages, apiKey)
    }

    return null
  } catch (err) {
    console.error('[Lucy AI] Generation error:', err)
    return null
  }
}

/**
 * Generate an insight summary at session completion.
 */
export async function generateSessionSummaryInsight(
  context: AISessionContext,
  apiKey?: string
): Promise<string | null> {
  const messages: AIMessage[] = [
    {
      role: 'user',
      content: `
        The user has completed a consciousness protocol session.
        Flow: ${context.flowName}
        Depth reached: ${context.currentDepth}/5
        Response count: ${context.responses.length}
        Detected patterns: ${context.patterns.map((p) => p.key).join(', ')}

        Generate a 2-3 sentence synthesis of what emerged.
        Speak directly to the user in second person.
        Do not soften. Do not congratulate.
        Observe what was true.
      `.trim(),
    },
  ]

  try {
    if (process.env.ANTHROPIC_API_KEY) {
      const result = await callAnthropic(messages, apiKey)
      return result?.content ?? null
    }
    return null
  } catch {
    return null
  }
}

// ─── Provider Implementations ─────────────────────────────────────────────────

async function callAnthropic(
  messages: AIMessage[],
  apiKey?: string
): Promise<AIGeneratedNode | null> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey ?? process.env.ANTHROPIC_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 512,
      system: LUCY_SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role === 'system' ? 'user' : m.role,
        content: m.content,
      })),
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`)
  }

  const data: { content: Array<{ type: string; text: string }> } =
    await response.json()
  const text = data.content.find((b) => b.type === 'text')?.text ?? ''

  return parseAIResponse(text)
}

async function callOpenAI(
  messages: AIMessage[],
  apiKey?: string
): Promise<AIGeneratedNode | null> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey ?? process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 512,
      messages: [
        { role: 'system', content: LUCY_SYSTEM_PROMPT },
        ...messages,
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data: { choices: Array<{ message: { content: string } }> } =
    await response.json()
  const text = data.choices[0]?.message?.content ?? ''

  return parseAIResponse(text)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildContextPrompt(context: AISessionContext): string {
  const recentResponses = context.responses.slice(-3)

  return `
Current session state:
- Flow: ${context.flowName}
- Depth: ${context.currentDepth}/5
- Active patterns: ${context.patterns.map((p) => `${p.key}(${p.frequency}x)`).join(', ') || 'none detected yet'}

Recent responses:
${recentResponses
  .map((r, i) => `${i + 1}. [${r.nodeId}] "${r.value}"`)
  .join('\n')}

Generate the next adaptive question. Return ONLY valid JSON matching the schema.
  `.trim()
}

function parseAIResponse(text: string): AIGeneratedNode | null {
  try {
    // Strip markdown code blocks if present
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(clean)
    return {
      content: parsed.content ?? '',
      subtext: parsed.subtext,
      questionType: parsed.questionType ?? 'open',
      followUpPrompt: parsed.followUpPrompt,
    }
  } catch {
    // If not JSON, treat raw text as the question content
    if (text.length > 5) {
      return { content: text.trim(), questionType: 'open' }
    }
    return null
  }
}
