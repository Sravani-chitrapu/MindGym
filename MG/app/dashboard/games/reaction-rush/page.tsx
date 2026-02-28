"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useGame } from "@/context/game-context"
import { GameEndScreen } from "@/components/game-end-screen"
import { Play } from "lucide-react"

export default function ReactionRushPage() {
  const { addScore, user } = useGame()
  const [phase, setPhase] = useState<"idle" | "waiting" | "ready" | "clicked" | "early" | "done">("idle")
  const [round, setRound] = useState(0)
  const [times, setTimes] = useState<number[]>([])
  const [readyAt, setReadyAt] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const totalRounds = 5
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startGame = useCallback(() => {
    setRound(0)
    setTimes([])
    startRound()
  }, [])

  const startRound = () => {
    setPhase("waiting")
    const delay = Math.random() * 3000 + 1500
    timeoutRef.current = setTimeout(() => {
      setReadyAt(Date.now())
      setPhase("ready")
    }, delay)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleClick = () => {
    if (phase === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setPhase("early")
      setTimeout(() => startRound(), 1200)
      return
    }

    if (phase === "ready") {
      const reaction = Date.now() - readyAt
      const newTimes = [...times, reaction]
      setTimes(newTimes)
      const newRound = round + 1
      setRound(newRound)
      setPhase("clicked")

      if (newRound >= totalRounds) {
        setTimeout(() => finishGame(newTimes), 800)
      } else {
        setTimeout(() => startRound(), 1000)
      }
    }
  }

  const finishGame = (finalTimes: number[]) => {
    const avg = finalTimes.reduce((a, b) => a + b, 0) / finalTimes.length
    const speedSec = avg / 1000
    const acc = Math.max(0, Math.round(100 - (avg - 150) / 5))
    const score = Math.round(Math.max(0, (1000 - avg) * 2))
    const xp = addScore({
      game: "Reaction Rush",
      score,
      accuracy: Math.min(100, acc),
      speed: Math.round(speedSec * 10) / 10,
      date: new Date().toISOString(),
    })
    setXpEarned(xp)
    setPhase("done")
  }

  const bestScore = Math.max(0, ...user.scores.filter((s) => s.game === "Reaction Rush").map((s) => s.score))

  if (phase === "done") {
    const avg = times.reduce((a, b) => a + b, 0) / times.length
    const acc = Math.min(100, Math.max(0, Math.round(100 - (avg - 150) / 5)))
    const score = Math.round(Math.max(0, (1000 - avg) * 2))
    return (
      <GameEndScreen
        gameName="Reaction Rush"
        score={score}
        accuracy={acc}
        speed={avg / 1000}
        bestScore={bestScore || undefined}
        xpEarned={xpEarned}
        onPlayAgain={startGame}
      />
    )
  }

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20">
        <h1 className="font-serif text-3xl font-bold text-[#E5E7EB]">Reaction Rush</h1>
        <p className="text-[#9CA3AF] text-center max-w-md">
          Wait for the screen to turn green, then click as fast as you can. 5 rounds.
        </p>
        <button
          onClick={startGame}
          className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#FDBA74] to-[#F97316] text-[#0F172A] font-semibold text-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(253,186,116,0.3)]"
        >
          <Play className="w-5 h-5" />
          Start Game
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-[#9CA3AF] text-xs">Round</p>
          <p className="font-mono text-xl font-bold text-[#C4B5FD]">{Math.min(round + 1, totalRounds)}/{totalRounds}</p>
        </div>
        {times.length > 0 && (
          <div className="text-center">
            <p className="text-[#9CA3AF] text-xs">Last</p>
            <p className="font-mono text-xl font-bold text-[#FDBA74]">{times[times.length - 1]}ms</p>
          </div>
        )}
      </div>

      <button
        onClick={handleClick}
        className={`w-72 h-72 rounded-3xl flex items-center justify-center transition-all duration-300 cursor-pointer select-none ${
          phase === "waiting"
            ? "bg-[rgba(248,113,113,0.15)] border-2 border-[rgba(248,113,113,0.3)]"
            : phase === "ready"
            ? "bg-[rgba(153,246,228,0.2)] border-2 border-[rgba(153,246,228,0.4)] shadow-[0_0_40px_rgba(153,246,228,0.2)]"
            : phase === "clicked"
            ? "bg-[rgba(196,181,253,0.15)] border-2 border-[rgba(196,181,253,0.3)]"
            : "bg-[rgba(248,113,113,0.3)] border-2 border-[rgba(248,113,113,0.5)]"
        }`}
        aria-label="Reaction area"
      >
        <div className="text-center">
          {phase === "waiting" && (
            <p className="text-[#F87171] text-xl font-semibold">Wait...</p>
          )}
          {phase === "ready" && (
            <p className="text-[#99F6E4] text-xl font-semibold">Click NOW!</p>
          )}
          {phase === "clicked" && (
            <div>
              <p className="font-mono text-4xl font-bold text-[#C4B5FD]">{times[times.length - 1]}ms</p>
              <p className="text-[#9CA3AF] text-sm mt-1">Nice!</p>
            </div>
          )}
          {phase === "early" && (
            <div>
              <p className="text-[#F87171] text-xl font-semibold">Too early!</p>
              <p className="text-[#9CA3AF] text-sm mt-1">Wait for green...</p>
            </div>
          )}
        </div>
      </button>
    </div>
  )
}
