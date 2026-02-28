"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useGame } from "@/context/game-context"
import { GameEndScreen } from "@/components/game-end-screen"
import { Play } from "lucide-react"

const COLORS = [
  { name: "Mint", bg: "#99F6E4", text: "#0F172A" },
  { name: "Peach", bg: "#FDBA74", text: "#0F172A" },
  { name: "Sky", bg: "#93C5FD", text: "#0F172A" },
  { name: "Lavender", bg: "#C4B5FD", text: "#0F172A" },
]

interface Prompt {
  word: string
  color: string
  correctAnswer: "match" | "mismatch"
}

function generatePrompt(): Prompt {
  const wordColor = COLORS[Math.floor(Math.random() * COLORS.length)]
  const isMatch = Math.random() > 0.5
  const displayColor = isMatch
    ? wordColor
    : COLORS.filter((c) => c.name !== wordColor.name)[Math.floor(Math.random() * (COLORS.length - 1))]

  return {
    word: wordColor.name,
    color: displayColor.bg,
    correctAnswer: isMatch ? "match" : "mismatch",
  }
}

export default function FocusFlowPage() {
  const { addScore, user } = useGame()
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle")
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [totalRounds] = useState(15)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [xpEarned, setXpEarned] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startGame = useCallback(() => {
    setRound(1)
    setScore(0)
    setCorrect(0)
    setFeedback(null)
    setPrompt(generatePrompt())
    setStartTime(Date.now())
    setPhase("playing")
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleAnswer = (answer: "match" | "mismatch") => {
    if (!prompt || phase !== "playing") return

    const isCorrect = answer === prompt.correctAnswer
    if (isCorrect) {
      setScore((s) => s + 100)
      setCorrect((c) => c + 1)
      setFeedback("correct")
    } else {
      setFeedback("wrong")
    }

    timeoutRef.current = setTimeout(() => {
      if (round >= totalRounds) {
        const time = (Date.now() - startTime) / 1000
        setEndTime(time)
        const finalCorrect = isCorrect ? correct + 1 : correct
        const acc = Math.round((finalCorrect / totalRounds) * 100)
        const finalScore = isCorrect ? score + 100 : score
        const xp = addScore({
          game: "Focus Flow",
          score: finalScore,
          accuracy: acc,
          speed: Math.round(time * 10) / 10,
          date: new Date().toISOString(),
        })
        setXpEarned(xp)
        setPhase("done")
      } else {
        setRound((r) => r + 1)
        setPrompt(generatePrompt())
        setFeedback(null)
      }
    }, 500)
  }

  const bestScore = Math.max(0, ...user.scores.filter((s) => s.game === "Focus Flow").map((s) => s.score))

  if (phase === "done") {
    const acc = Math.round((correct / totalRounds) * 100)
    return (
      <GameEndScreen
        gameName="Focus Flow"
        score={score}
        accuracy={acc}
        speed={endTime}
        bestScore={bestScore || undefined}
        xpEarned={xpEarned}
        onPlayAgain={startGame}
      />
    )
  }

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20">
        <h1 className="font-serif text-3xl font-bold text-[#E5E7EB]">Focus Flow</h1>
        <p className="text-[#9CA3AF] text-center max-w-md">
          Does the word match the color it is displayed in? Test your focus and resist distractions.
        </p>
        <button
          onClick={startGame}
          className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#93C5FD] to-[#C4B5FD] text-[#0F172A] font-semibold text-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(147,197,253,0.3)]"
        >
          <Play className="w-5 h-5" />
          Start Game
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-[#9CA3AF] text-xs">Round</p>
          <p className="font-mono text-xl font-bold text-[#C4B5FD]">{round}/{totalRounds}</p>
        </div>
        <div className="text-center">
          <p className="text-[#9CA3AF] text-xs">Score</p>
          <p className="font-mono text-xl font-bold text-[#99F6E4]">{score}</p>
        </div>
      </div>

      <p className="text-[#9CA3AF] text-sm">Does the word match its display color?</p>

      {/* Color Word Display */}
      {prompt && (
        <div className="glass-card px-16 py-12 text-center">
          <p
            className="font-serif text-5xl font-bold transition-all duration-200"
            style={{ color: prompt.color }}
          >
            {prompt.word}
          </p>
        </div>
      )}

      {/* Answer Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleAnswer("match")}
          disabled={feedback !== null}
          className={`px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 ${
            feedback === "correct"
              ? "bg-[rgba(153,246,228,0.2)] border-2 border-[#99F6E4] text-[#99F6E4]"
              : "bg-[rgba(153,246,228,0.08)] border border-[rgba(153,246,228,0.2)] text-[#99F6E4] hover:bg-[rgba(153,246,228,0.15)]"
          }`}
        >
          Match
        </button>
        <button
          onClick={() => handleAnswer("mismatch")}
          disabled={feedback !== null}
          className={`px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 ${
            feedback === "wrong"
              ? "bg-[rgba(248,113,113,0.2)] border-2 border-[#F87171] text-[#F87171]"
              : "bg-[rgba(253,186,116,0.08)] border border-[rgba(253,186,116,0.2)] text-[#FDBA74] hover:bg-[rgba(253,186,116,0.15)]"
          }`}
        >
          Mismatch
        </button>
      </div>

      {feedback && (
        <p className={`text-sm font-medium ${feedback === "correct" ? "text-[#99F6E4]" : "text-[#F87171]"}`}>
          {feedback === "correct" ? "Correct!" : "Wrong!"}
        </p>
      )}
    </div>
  )
}
