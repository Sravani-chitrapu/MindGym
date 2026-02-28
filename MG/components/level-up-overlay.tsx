"use client"

import { useEffect, useState } from "react"
import { useGame } from "@/context/game-context"
import { Sparkles, X } from "lucide-react"

export function LevelUpOverlay() {
  const { levelUpTriggered, clearLevelUp, user } = useGame()
  const [visible, setVisible] = useState(false)
  const [confettiPieces, setConfettiPieces] = useState<{ id: number; x: number; color: string; delay: number; size: number }[]>([])

  useEffect(() => {
    if (levelUpTriggered) {
      setVisible(true)
      const pieces = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: ["#99F6E4", "#C4B5FD", "#FDBA74", "#93C5FD", "#F9A8D4"][Math.floor(Math.random() * 5)],
        delay: Math.random() * 2,
        size: Math.random() * 8 + 4,
      }))
      setConfettiPieces(pieces)
      const timer = setTimeout(() => {
        setVisible(false)
        clearLevelUp()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [levelUpTriggered, clearLevelUp])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(15,23,42,0.8)] backdrop-blur-sm">
      {/* Confetti */}
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            animation: `confetti-fall ${2 + piece.delay}s ease-in forwards`,
            animationDelay: `${piece.delay * 0.3}s`,
          }}
        />
      ))}

      <div className="glass-card p-8 text-center relative z-10 max-w-sm mx-4 glow-mint">
        <button
          onClick={() => { setVisible(false); clearLevelUp() }}
          className="absolute top-3 right-3 text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#99F6E4] to-[#C4B5FD] flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-[#0F172A]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#E5E7EB] mb-1">
          Level Up!
        </h2>
        <p className="text-[#9CA3AF] text-sm mb-4">
          You reached level {user.level}
        </p>
        <div className="inline-block px-6 py-2 rounded-xl bg-gradient-to-r from-[#99F6E4] to-[#C4B5FD] text-[#0F172A] font-bold font-mono text-lg">
          LVL {user.level}
        </div>
      </div>
    </div>
  )
}
