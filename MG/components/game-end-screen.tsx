"use client"

import Link from "next/link"
import { Trophy, RotateCcw, Home, TrendingUp, Timer, Target } from "lucide-react"

interface GameEndScreenProps {
  gameName: string
  score: number
  accuracy: number
  speed: number
  bestScore?: number
  xpEarned: number
  onPlayAgain: () => void
}

export function GameEndScreen({
  gameName,
  score,
  accuracy,
  speed,
  bestScore,
  xpEarned,
  onPlayAgain,
}: GameEndScreenProps) {
  const isBest = bestScore !== undefined && score >= bestScore

  return (
    <div className="flex flex-col items-center gap-6 py-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold text-[#E5E7EB] mb-1">
          Game Over
        </h2>
        <p className="text-[#9CA3AF] text-sm">{gameName}</p>
      </div>

      {/* Score */}
      <div className="glass-card px-10 py-6 text-center glow-mint">
        <p className="text-[#9CA3AF] text-xs mb-1 uppercase tracking-wider">Score</p>
        <p className="font-mono text-5xl font-bold text-[#99F6E4]">
          {score}
        </p>
        {isBest && (
          <div className="flex items-center justify-center gap-1 mt-2 text-[#FDE68A] text-xs">
            <Trophy className="w-3 h-3" />
            <span>New Best!</span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex gap-4">
        <div className="glass-card px-5 py-3 text-center">
          <Target className="w-4 h-4 text-[#93C5FD] mx-auto mb-1" />
          <p className="text-[#9CA3AF] text-[10px] uppercase tracking-wider">Accuracy</p>
          <p className="font-mono text-lg font-semibold text-[#93C5FD]">{accuracy}%</p>
        </div>
        <div className="glass-card px-5 py-3 text-center">
          <Timer className="w-4 h-4 text-[#FDBA74] mx-auto mb-1" />
          <p className="text-[#9CA3AF] text-[10px] uppercase tracking-wider">Speed</p>
          <p className="font-mono text-lg font-semibold text-[#FDBA74]">{speed.toFixed(1)}s</p>
        </div>
        <div className="glass-card px-5 py-3 text-center">
          <TrendingUp className="w-4 h-4 text-[#C4B5FD] mx-auto mb-1" />
          <p className="text-[#9CA3AF] text-[10px] uppercase tracking-wider">XP</p>
          <p className="font-mono text-lg font-semibold text-[#C4B5FD]">+{xpEarned}</p>
        </div>
      </div>

      {bestScore !== undefined && !isBest && (
        <p className="text-[#9CA3AF] text-xs">
          Best score: <span className="text-[#E5E7EB] font-mono">{bestScore}</span>
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onPlayAgain}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#99F6E4] to-[#C4B5FD] text-[#0F172A] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(153,246,228,0.3)]"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </button>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[rgba(196,181,253,0.15)] text-[#E5E7EB] font-semibold transition-all duration-300 hover:bg-[rgba(255,255,255,0.04)] hover:-translate-y-0.5"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
      </div>
    </div>
  )
}
