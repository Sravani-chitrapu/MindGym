"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useGame } from "@/context/game-context"
import { GameEndScreen } from "@/components/game-end-screen"
import { Play } from "lucide-react"

interface TargetData {
  id: number
  x: number
  y: number
  size: number
  active: boolean
}

export default function PrecisionClickPage() {
  const { addScore, user } = useGame()
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle")
  const [targets, setTargets] = useState<TargetData[]>([])
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [targetsShown, setTargetsShown] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const totalTargets = 20
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const spawnTarget = useCallback((shown: number) => {
    if (shown >= totalTargets) return

    const size = Math.max(24, 48 - shown * 1.2)
    const newTarget: TargetData = {
      id: Date.now(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      size,
      active: true,
    }
    setTargets([newTarget])
    setTargetsShown(shown + 1)

    timeoutRef.current = setTimeout(() => {
      setTargets((prev) => prev.filter((t) => t.id !== newTarget.id))
      setMisses((m) => m + 1)
      if (shown + 1 < totalTargets) {
        spawnTarget(shown + 1)
      } else {
        finishGameInternal()
      }
    }, Math.max(800, 2000 - shown * 60))
  }, [])

  const startGame = useCallback(() => {
    setHits(0)
    setMisses(0)
    setTargetsShown(0)
    setTargets([])
    setStartTime(Date.now())
    setPhase("playing")
    spawnTarget(0)
  }, [spawnTarget])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const finishGameInternal = () => {
    setPhase("done")
  }

  const handleHit = (id: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setTargets((prev) => prev.filter((t) => t.id !== id))
    const newHits = hits + 1
    setHits(newHits)

    if (targetsShown < totalTargets) {
      spawnTarget(targetsShown)
    } else {
      finishGameInternal()
    }
  }

  const handleMiss = () => {
    setMisses((m) => m + 1)
  }

  useEffect(() => {
    if (phase === "done" && startTime > 0) {
      const time = (Date.now() - startTime) / 1000
      setEndTime(time)
      const acc = Math.round((hits / Math.max(1, hits + misses)) * 100)
      const score = hits * 50 - misses * 10
      const xp = addScore({
        game: "Precision Click",
        score: Math.max(0, score),
        accuracy: acc,
        speed: Math.round(time * 10) / 10,
        date: new Date().toISOString(),
      })
      setXpEarned(xp)
    }
  }, [phase])

  const bestScore = Math.max(0, ...user.scores.filter((s) => s.game === "Precision Click").map((s) => s.score))

  if (phase === "done") {
    const acc = Math.round((hits / Math.max(1, hits + misses)) * 100)
    const score = Math.max(0, hits * 50 - misses * 10)
    return (
      <GameEndScreen
        gameName="Precision Click"
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
        <h1 className="font-serif text-3xl font-bold text-[#E5E7EB]">Precision Click</h1>
        <p className="text-[#9CA3AF] text-center max-w-md">
          Click the targets as fast and precisely as you can. They get smaller and faster!
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
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-[#9CA3AF] text-xs">Hits</p>
          <p className="font-mono text-xl font-bold text-[#99F6E4]">{hits}</p>
        </div>
        <div className="text-center">
          <p className="text-[#9CA3AF] text-xs">Targets</p>
          <p className="font-mono text-xl font-bold text-[#93C5FD]">{targetsShown}/{totalTargets}</p>
        </div>
        <div className="text-center">
          <p className="text-[#9CA3AF] text-xs">Misses</p>
          <p className="font-mono text-xl font-bold text-[#F87171]">{misses}</p>
        </div>
      </div>

      <div
        ref={containerRef}
        onClick={handleMiss}
        className="relative w-full max-w-lg aspect-square rounded-2xl bg-[rgba(15,23,42,0.5)] border border-[rgba(196,181,253,0.08)] overflow-hidden cursor-crosshair"
      >
        {targets.map((target) => (
          <button
            key={target.id}
            onClick={(e) => {
              e.stopPropagation()
              handleHit(target.id)
            }}
            className="absolute rounded-full bg-gradient-to-br from-[#93C5FD] to-[#C4B5FD] transition-all duration-200 hover:scale-110 shadow-[0_0_15px_rgba(147,197,253,0.3)] animate-in zoom-in-50"
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              width: target.size,
              height: target.size,
              transform: "translate(-50%, -50%)",
            }}
            aria-label="Target"
          />
        ))}
      </div>
    </div>
  )
}
