"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useGame } from "@/context/game-context"
import { GameEndScreen } from "@/components/game-end-screen"
import { Play } from "lucide-react"

export default function TapFrenzyPage() {
  const { addScore, user } = useGame()
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle")
  const [taps, setTaps] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [xpEarned, setXpEarned] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startGame = useCallback(() => {
    setTaps(0)
    setTimeLeft(10)
    setStartTime(Date.now())
    setPhase("playing")
  }, [])

  useEffect(() => {
    if (phase === "playing") {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 0.1) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            finishGame()
            return 0
          }
          return Math.round((t - 0.1) * 10) / 10
        })
      }, 100)
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }
  }, [phase])

  const finishGame = () => {
    const time = (Date.now() - startTime) / 1000
    const score = taps * 10
    const acc = Math.min(100, Math.round((taps / 80) * 100))
    const xp = addScore({
      game: "Tap Frenzy",
      score,
      accuracy: acc,
      speed: Math.round(time * 10) / 10,
      date: new Date().toISOString(),
    })
    setXpEarned(xp)
    setPhase("done")
  }

  const handleTap = () => {
    if (phase !== "playing") return
    setTaps((t) => t + 1)
  }

  const bestScore = Math.max(0, ...user.scores.filter((s) => s.game === "Tap Frenzy").map((s) => s.score))

  if (phase === "done") {
    const score = taps * 10
    const acc = Math.min(100, Math.round((taps / 80) * 100))
    return (
      <GameEndScreen
        gameName="Tap Frenzy"
        score={score}
        accuracy={acc}
        speed={10}
        bestScore={bestScore || undefined}
        xpEarned={xpEarned}
        onPlayAgain={startGame}
      />
    )
  }

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20">
        <h1 className="font-serif text-3xl font-bold text-[#E5E7EB]">Tap Frenzy</h1>
        <p className="text-[#9CA3AF] text-center max-w-md">
          Tap the button as many times as you can in 10 seconds!
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

  const timerProgress = timeLeft / 10

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      {/* Timer Ring */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(253,186,116,0.1)" strokeWidth="6" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#FDBA74"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${timerProgress * 339} 339`}
            className="transition-all duration-100"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-mono text-3xl font-bold text-[#FDBA74]">{timeLeft.toFixed(1)}</p>
          <p className="text-[#9CA3AF] text-[10px]">seconds</p>
        </div>
      </div>

      {/* Tap Count */}
      <div className="text-center">
        <p className="font-mono text-6xl font-bold text-[#99F6E4]">{taps}</p>
        <p className="text-[#9CA3AF] text-sm">taps</p>
      </div>

      {/* Tap Button */}
      <button
        onClick={handleTap}
        className="w-48 h-48 rounded-full bg-gradient-to-br from-[#FDBA74]/20 to-[#F97316]/10 border-2 border-[rgba(253,186,116,0.3)] transition-all duration-75 active:scale-95 active:bg-[rgba(253,186,116,0.3)] hover:shadow-[0_0_30px_rgba(253,186,116,0.15)] select-none"
        aria-label="Tap button"
      >
        <span className="text-[#FDBA74] text-2xl font-bold font-serif">TAP!</span>
      </button>
    </div>
  )
}
