# Lucy Consciousness Protocol

> A structured journey through the architecture of self.

Lucy is not a chatbot. It is a consciousness-based interactive inquiry system — designed to surface patterns, dissolve assumptions, and redirect attention to what is already present.

---

## Project Folder Structure

```
lucy-consciousness-protocol/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, metadata)
│   │   ├── page.tsx                # Landing page with glyph rain + manifesto
│   │   ├── enter/
│   │   │   └── page.tsx            # Pre-protocol agreement screen
│   │   ├── session/
│   │   │   └── page.tsx            # Live session page
│   │   └── api/
│   │       └── session/
│   │           └── route.ts        # AI integration API endpoint
│   ├── components/
│   │   ├── protocol/
│   │   │   ├── QuestionRenderer.tsx  # All question type renderers
│   │   │   ├── TransitionNode.tsx    # Transition/pacing nodes
│   │   │   ├── InsightNode.tsx       # Pattern insight display
│   │   │   └── SessionComplete.tsx   # End-of-session summary
│   │   └── layout/
│   │       └── SessionHeader.tsx     # Progress bar + nav
│   ├── lib/
│   │   ├── engine/
│   │   │   ├── protocol-flows.ts   # All JSON-driven question flows
│   │   │   ├── session-engine.ts   # Core session + pattern logic
│   │   │   └── ai-integration.ts   # Anthropic / OpenAI bridge
│   │   ├── hooks/
│   │   │   ├── useTypewriter.ts    # Character-by-character type effect
│   │   │   └── useKeyPress.ts      # Keyboard shortcuts (Ctrl+Enter)
│   │   ├── store/
│   │   │   └── session-store.ts    # Zustand state + selectors
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts                # All TypeScript interfaces
│   └── styles/
│       └── globals.css             # Tailwind + custom CSS effects
├── public/
├── .env.local.example
├── tailwind.config.ts
├── next.config.mjs
├── vercel.json
└── package.json
```

---

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Clone or extract project
git clone <your-repo>
cd lucy-consciousness-protocol

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.local.example .env.local
# Edit .env.local — add API keys if using AI features

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Type checking

```bash
npm run type-check
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Optional | Claude API key for adaptive questions |
| `OPENAI_API_KEY` | Optional | OpenAI fallback |
| `NEXT_PUBLIC_APP_URL` | Optional | App URL for OG metadata |
| `NEXT_PUBLIC_AI_ENABLED` | Optional | Feature flag for AI mode |

The protocol runs **fully offline** without any API keys — AI integration is additive, not required.

---

## Deployment to Vercel

### Option A — One-Click via CLI

```bash
npm install -g vercel
vercel
# Follow prompts
```

### Option B — GitHub Integration

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import repository
4. Add environment variables in Vercel dashboard (if using AI)
5. Deploy

### Adding AI keys in Vercel

```
Dashboard → Project → Settings → Environment Variables

ANTHROPIC_API_KEY = sk-ant-...
```

---

## Adding New Protocol Flows

Flows are JSON-driven. To add a new flow:

```typescript
// src/lib/engine/protocol-flows.ts

export const SHADOW_PROTOCOL: ProtocolFlow = {
  id: 'shadow-v1',
  name: 'Shadow Protocol',
  entryNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      type: 'question',
      questionType: 'open',
      content: 'What do you never allow yourself to want?',
      nextNodeId: 'q2',
      depthLevel: 1,
    },
    // ... more nodes
  }
}

// Register it
export const ALL_FLOWS = {
  [CORE_PROTOCOL.id]: CORE_PROTOCOL,
  [SHADOW_PROTOCOL.id]: SHADOW_PROTOCOL,
}
```

### Node Types

| Type | Description |
|---|---|
| `question` | Active question node — renders input UI |
| `transition` | Pacing node — auto-advances after display |
| `insight` | Insight surfacing — shows detected patterns |
| `terminus` | Session end |

### Question Types

| Type | Description |
|---|---|
| `open` | Free-text textarea |
| `choice` | Multiple choice (branching) |
| `scale` | Numerical scale (pip-style) |
| `binary` | Two-option choice |
| `breath` | Guided breathing exercise |
| `reflection` | Same as open, different semantic |

---

## Scaling Into an AI Agent System

### Phase 2: Adaptive Question Generation

Replace static `nextNodeId` jumps with AI-generated follow-ups:

```typescript
// In session-engine.ts — after each response:
const aiNode = await generateAdaptiveQuestion(context)
if (aiNode) {
  // Inject into flow dynamically
  flow.nodes['ai-generated-' + uuid()] = {
    id: ...,
    type: 'question',
    questionType: aiNode.questionType,
    content: aiNode.content,
    subtext: aiNode.subtext,
    nextNodeId: currentNode.nextNodeId, // resume flow after AI node
  }
}
```

### Phase 3: Persistent Memory Layer

Add a database (Postgres via Supabase, or Redis) to persist sessions:

```typescript
// Replace sessionStorage with server-side persistence
// API: POST /api/sessions (create), PATCH /api/sessions/:id (update)
// Enable cross-session pattern tracking
// Build longitudinal insight engine
```

### Phase 4: Multi-Modal Input

- Voice input via Web Speech API
- Emotion detection via facial expression (camera optional)
- HRV / biofeedback integration via WebBluetooth

### Phase 5: Agent Architecture

```
User Input
    ↓
Pattern Classifier Agent
    ↓ (route to specialist)
    ├── Attachment Inquiry Agent
    ├── Shadow Work Agent
    ├── Identity Dissolution Agent
    └── Integration Agent
         ↓
    Synthesis Agent
         ↓
    Session Memory Store
```

Each agent has:
- A specialized system prompt
- A curated question bank
- Pattern weights tuned to its domain
- Handoff logic to route to other agents mid-session

### Phase 6: Practitioner Dashboard

For therapists, coaches, facilitators:
- View anonymized session patterns
- Annotate and respond to sessions
- Design custom protocol flows (no-code)
- Track client longitudinal data

---

## Design System

### Colors
- `--neon-cyan: #00f5ff` — Primary accent, shallow depth
- `--neon-violet: #bf00ff` — Secondary accent, mid depth
- `--neon-rose: #ff0080` — Tertiary, deep/terminus
- `--void: #020408` — Background base

### Depth Visual System

As sessions deepen (depth 0→5):
- Background ambiance shifts: cool → violet → warm
- Ambient orbs appear progressively
- Typography gains subtle glow
- Pattern detection becomes visible

### Typography

| Role | Font | Usage |
|---|---|---|
| Display | IM Fell English | Questions, headings |
| Mono | Space Mono | Labels, metadata, UI |
| Body | Space Grotesk | Instructions, subtext |

---

## Architecture Decisions

**Why JSON-driven flows?**
Flows can be authored, versioned, A/B tested, and handed to non-developers without touching component code.

**Why Zustand over Redux?**
Minimal boilerplate for client-only state. Sessions are transient — no need for complex derived state.

**Why sessionStorage for persistence?**
Zero backend setup for v1. Survives page refresh, clears on tab close. Intentional — sessions are meant to be present-moment artifacts.

**Why no chat interface?**
Lucy is not conversational. Linear, sequential questioning produces deeper inquiry than open dialogue. The constraint is the design.

---

## License

MIT — Build on it.
