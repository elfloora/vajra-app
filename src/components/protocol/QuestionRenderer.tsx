'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { ProtocolNode, ResponseValue } from '@/types'
import { useTypewriter } from '@/lib/hooks/useTypewriter'
import { useCtrlEnter } from '@/lib/hooks/useKeyPress'

interface QuestionRendererProps {
  node: ProtocolNode
  onSubmit: (value: ResponseValue, choiceId?: string) => void
  disabled?: boolean
}

// ─── Open Text Question ───────────────────────────────────────────────────────

function OpenQuestion({
  node,
  onSubmit,
  disabled,
  subtextComplete,
}: QuestionRendererProps & { subtextComplete: boolean }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (subtextComplete && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [subtextComplete])

  // Auto-resize
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  const handleSubmit = () => {
    if (!value.trim() || disabled) return
    onSubmit(value.trim())
  }

  useCtrlEnter(handleSubmit, [value, disabled])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="Respond here..."
        rows={3}
        className="response-input"
        style={{ minHeight: '80px' }}
      />
      <div className="flex items-center justify-between mt-4">
        <span className="font-mono text-[10px] text-ghost-text/30 tracking-widest">
          {value.length > 0 ? `${value.length} chars` : 'Ctrl+Enter to submit'}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          className={`btn-neon py-2 px-6 text-[11px] transition-all duration-300 ${
            !value.trim() ? 'opacity-30 cursor-not-allowed' : ''
          }`}
        >
          Continue ⟶
        </button>
      </div>
    </motion.div>
  )
}

// ─── Choice Question ──────────────────────────────────────────────────────────

function ChoiceQuestion({ node, onSubmit, disabled }: QuestionRendererProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (choiceId: string, label: string) => {
    if (disabled) return
    setSelected(choiceId)
    setTimeout(() => onSubmit(label, choiceId), 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8 space-y-2"
    >
      {node.choices?.map((choice, i) => (
        <motion.button
          key={choice.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * i }}
          onClick={() => handleSelect(choice.id, choice.label)}
          disabled={disabled}
          className={`w-full text-left p-4 border transition-all duration-200 group ${
            selected === choice.id
              ? 'border-neon-cyan/60 bg-neon-cyan/5 text-white'
              : 'border-ghost-border hover:border-neon-cyan/30 hover:bg-white/[0.02]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`font-mono text-[10px] tracking-widest flex-shrink-0 transition-colors ${
                selected === choice.id ? 'text-neon-cyan' : 'text-ghost-text/30 group-hover:text-neon-cyan/40'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="font-body font-light text-sm text-ghost-text group-hover:text-white transition-colors">
              {choice.label}
            </span>
          </div>
        </motion.button>
      ))}
    </motion.div>
  )
}

// ─── Scale Question ───────────────────────────────────────────────────────────

function ScaleQuestion({ node, onSubmit, disabled }: QuestionRendererProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const min = node.scaleMin ?? 1
  const max = node.scaleMax ?? 10
  const labels = node.scaleLabels ?? ['Low', 'High']

  const pips = Array.from({ length: max - min + 1 }, (_, i) => i + min)

  const handleSelect = (value: number) => {
    if (disabled) return
    setSelected(value)
    setTimeout(() => onSubmit(value), 400)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-10"
    >
      <div className="flex items-center gap-3 mb-4">
        {pips.map((pip) => (
          <button
            key={pip}
            onClick={() => handleSelect(pip)}
            disabled={disabled}
            title={String(pip)}
            className={`scale-pip ${selected !== null && pip <= selected ? 'active' : ''}`}
          />
        ))}
      </div>
      <div className="flex justify-between">
        <span className="font-mono text-[10px] text-ghost-text/40">{labels[0]}</span>
        <span className="font-mono text-[10px] text-ghost-text/40">{labels[1]}</span>
      </div>
      {selected !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 font-mono text-xs text-neon-cyan/60"
        >
          Selected: {selected} / {max}
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Binary Question ──────────────────────────────────────────────────────────

function BinaryQuestion({ node, onSubmit, disabled }: QuestionRendererProps) {
  const choices = node.choices ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8 flex gap-3"
    >
      {choices.map((choice) => (
        <button
          key={choice.id}
          onClick={() => !disabled && onSubmit(choice.label, choice.id)}
          disabled={disabled}
          className="flex-1 btn-neon py-3 text-xs"
        >
          {choice.label}
        </button>
      ))}
    </motion.div>
  )
}

// ─── Breath Exercise ──────────────────────────────────────────────────────────

function BreathExercise({ node, onSubmit }: QuestionRendererProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'complete'>('inhale')
  const [count, setCount] = useState(4)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    const PHASES: Array<{ name: typeof phase; duration: number }> = [
      { name: 'inhale', duration: 4 },
      { name: 'hold', duration: 4 },
      { name: 'exhale', duration: 6 },
    ]

    let currentPhaseIndex = 0
    let currentCount = PHASES[0].duration

    const tick = setInterval(() => {
      currentCount--
      setCount(currentCount)

      if (currentCount <= 0) {
        currentPhaseIndex = (currentPhaseIndex + 1) % PHASES.length

        if (currentPhaseIndex === 0) {
          setCycle((c) => {
            if (c >= 1) {
              clearInterval(tick)
              setPhase('complete')
              setTimeout(() => onSubmit('breath-complete'), 1000)
              return c + 1
            }
            return c + 1
          })
        }

        currentCount = PHASES[currentPhaseIndex].duration
        setPhase(PHASES[currentPhaseIndex].name)
        setCount(currentCount)
      }
    }, 1000)

    return () => clearInterval(tick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const phaseLabels = {
    inhale: 'Breathe in',
    hold: 'Hold',
    exhale: 'Release',
    complete: 'Continue',
  }

  const phaseColors = {
    inhale: 'rgba(0,245,255,0.3)',
    hold: 'rgba(191,0,255,0.3)',
    exhale: 'rgba(255,0,128,0.3)',
    complete: 'rgba(0,245,255,0.5)',
  }

  return (
    <div className="mt-10 flex flex-col items-center">
      <motion.div
        animate={{
          scale: phase === 'inhale' ? [1, 1.4] : phase === 'exhale' ? [1.4, 1] : 1.4,
          opacity: phase === 'complete' ? 0 : 1,
        }}
        transition={{ duration: phase === 'hold' ? 0.1 : 1, ease: 'easeInOut' }}
        className="relative w-24 h-24 rounded-full flex items-center justify-center"
        style={{
          background: `radial-gradient(circle, ${phaseColors[phase]} 0%, transparent 70%)`,
          border: `1px solid ${phaseColors[phase]}`,
        }}
      >
        <span className="font-mono text-2xl text-white/80">
          {phase === 'complete' ? '✓' : count}
        </span>
      </motion.div>
      <p className="mt-6 font-mono text-xs tracking-widest text-ghost-text uppercase">
        {phaseLabels[phase]}
      </p>
    </div>
  )
}

// ─── Master Renderer ──────────────────────────────────────────────────────────

export function QuestionRenderer({
  node,
  onSubmit,
  disabled = false,
}: QuestionRendererProps) {
  const { displayText: questionText, isComplete: questionComplete } = useTypewriter(
    node.content,
    { speed: 22 }
  )

  const { displayText: subtextDisplay, isComplete: subtextComplete } = useTypewriter(
    node.subtext ?? '',
    { speed: 18, startDelay: questionComplete ? 300 : 99999 }
  )

  return (
    <div className="w-full">
      {/* Depth indicator */}
      {node.depthLevel !== undefined && node.depthLevel > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1 mb-6"
        >
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`h-0.5 w-6 transition-all duration-500 ${
                i < (node.depthLevel ?? 0) ? 'bg-neon-cyan/60' : 'bg-white/10'
              }`}
            />
          ))}
          <span className="ml-2 font-mono text-[9px] text-ghost-text/30 tracking-widest uppercase">
            Depth {node.depthLevel}
          </span>
        </motion.div>
      )}

      {/* Question content */}
      <div className="glitch-container">
        <h2
          className={`font-display text-2xl md:text-3xl lg:text-4xl text-white leading-relaxed animate-glitch ${
            node.depthLevel && node.depthLevel >= 4 ? 'text-glow-cyan' : ''
          }`}
        >
          {questionText}
          {!questionComplete && (
            <span className="animate-cursor-blink text-neon-cyan">|</span>
          )}
        </h2>
      </div>

      {/* Subtext */}
      {node.subtext && questionComplete && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 font-body font-light text-sm text-ghost-text/60 italic leading-relaxed"
        >
          {subtextDisplay}
          {!subtextComplete && (
            <span className="animate-cursor-blink text-ghost-text/40">|</span>
          )}
        </motion.p>
      )}

      {/* Input based on question type */}
      {questionComplete && (
        <>
          {node.questionType === 'open' && (
            <OpenQuestion
              node={node}
              onSubmit={onSubmit}
              disabled={disabled}
              subtextComplete={subtextComplete || !node.subtext}
            />
          )}
          {node.questionType === 'choice' && (
            <ChoiceQuestion node={node} onSubmit={onSubmit} disabled={disabled} />
          )}
          {node.questionType === 'scale' && (
            <ScaleQuestion node={node} onSubmit={onSubmit} disabled={disabled} />
          )}
          {node.questionType === 'binary' && (
            <BinaryQuestion node={node} onSubmit={onSubmit} disabled={disabled} />
          )}
          {node.questionType === 'breath' && (
            <BreathExercise node={node} onSubmit={onSubmit} disabled={disabled} />
          )}
          {node.questionType === 'reflection' && (
            <OpenQuestion
              node={node}
              onSubmit={onSubmit}
              disabled={disabled}
              subtextComplete={true}
            />
          )}
        </>
      )}
    </div>
  )
}
