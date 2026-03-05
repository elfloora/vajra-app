import { NextRequest, NextResponse } from 'next/server'
import { generateAdaptiveQuestion, generateSessionSummaryInsight } from '@/lib/engine/ai-integration'
import type { AISessionContext } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, context } = body as {
      action: 'generate_question' | 'generate_insight'
      context: AISessionContext
    }

    if (!action || !context) {
      return NextResponse.json(
        { error: 'Missing required fields: action, context' },
        { status: 400 }
      )
    }

    // Rate limiting check (basic)
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0] ?? 'unknown'
    console.log(`[Lucy API] ${action} request from ${ip}`)

    switch (action) {
      case 'generate_question': {
        const result = await generateAdaptiveQuestion(context)
        if (!result) {
          return NextResponse.json(
            { error: 'AI not configured — set ANTHROPIC_API_KEY or OPENAI_API_KEY' },
            { status: 503 }
          )
        }
        return NextResponse.json({ success: true, data: result })
      }

      case 'generate_insight': {
        const insight = await generateSessionSummaryInsight(context)
        if (!insight) {
          return NextResponse.json(
            { error: 'AI not configured' },
            { status: 503 }
          )
        }
        return NextResponse.json({ success: true, data: { content: insight } })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (err) {
    console.error('[Lucy API] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Lucy Protocol API',
    version: '1.0.0',
    endpoints: {
      POST: {
        'generate_question': 'Generate adaptive follow-up question from session context',
        'generate_insight': 'Generate session completion insight',
      },
    },
    ai: {
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
    },
  })
}
