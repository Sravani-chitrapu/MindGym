"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useGame } from "@/context/game-context"
import { GameEndScreen } from "@/components/game-end-screen"
import { Play } from "lucide-react"

const GRID_SIZES = [3, 4, 4, 5, 5]
const TILE_COUNTS = [3, 4, 5, 6, 7]

export default function MemoryMatrixPage() {
  const { addScore, user } = useGame()
  const [phase, setPhase] = useState<"idle" | "showing" | "playing" | "done">("idle")
  const [round, setRound] = useState(0)
  const [grid, setGrid] = useState<boolean[]>([])
  const [revealed, setRevealed] = useState<boolean[]>([])
  const [selected, setSelected] = useState<boolean[]>([])
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [totalTiles, setTotalTiles] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const gridSize = GRID_SIZES[Math.min(round, GRID_SIZES.length - 1)]
  const tileCount = TILE_COUNTS[Math.min(round, TILE_COUNTS.length - 1)]
  const totalCells = gridSize * gridSize

  const startGame = useCallback(() => {
    setRound(0)
    setCorrect(0)
    setWrong(0)
    setTotalTiles(0)
    setTotalCorrect(0)
    setStartTime(Date.now())
    setPhase("showing")
    generateRound(0)
  }, [])

  const generateRound = (r: number) => {
    const size = GRID_SIZES[Math.min(r, GRID_SIZES.length - 1)]
    const count = TILE_COUNTS[Math.min(r, TILE_COUNTS.length - 1)]
    const total = size * size
    const newGrid = new Array(total).fill(false)
    const indices = Array.from({ length: total }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
    indices.forEach((i) => (newGrid[i] = true))
    setGrid(newGrid)
    setRevealed(new Array(total).fill(true))
    setSelected(new Array(total).fill(false))
    setCorrect(0)
    setWrong(0)

    timerRef.current = setTimeout(() => {
      setRevealed(new Array(total).fill(false))
      setPhase("playing")
    }, 1500 + r * 200)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleCellClick = (index: number) => {
    if (phase !== "playing" || selected[index]) return

    const newSelected = [...selected]
    newSelected[index] = true
    setSelected(newSelected)

    if (grid[index]) {
      const newCorrect = correct + 1
      setCorrect(newCorrect)
      setTotalCorrect((prev) => prev + 1)

      const needed = TILE_COUNTS[Math.min(round, TILE_COUNTS.length - 1)]
      if (newCorrect >= needed) {
        setTotalTiles((prev) => prev + needed)
        if (round < 4) {
          const nextRound = round + 1
          setRound(nextRound)
          setPhase("showing")
          setTimeout(() => generateRound(nextRound), 500)
        } else {
          finishGame(totalCorrect + 1, totalTiles + needed, wrong)
        }
      }
    } else {
      const newWrong = wrong + 1
      setWrong(newWrong)
      if (newWrong >= 3) {
        const needed = TILE_COUNTS[Math.min(round, TILE_COUNTS.length - 1)]
        setTotalTiles((prev) => prev + needed)
        finishGame(totalCorrect, totalTiles + needed, newWrong)
      }
    }
  }

  const finishGame = (tc: number, tt: number, w: number) => {
    const time = (Date.now() - startTime) / 1000
    setEndTime(time)
    const acc = tt > 0 ? Math.round((tc / (tc + w)) * 100) : 0
    const score = Math.round(tc * 20 + (round + 1) * 50 - w * 10)
    const xp = addScore({
      game: "Memory Matrix",
      score: Math.max(score, 0),
      accuracy: acc,
      speed: Math.round(time * 10) / 10,
      date: new Date().toISOString(),
    })
    setXpEarned(xp)
    setPhase("done")
  }

  const bestScore = Math.max(0, ...user.scores.filter((s) => s.game === "Memory Matrix").map((s) => s.score))

  if (phase === "done") {
    const acc = totalTiles > 0 ? Math.round((totalCorrect / (totalCorrect + wrong)) * 100) : 0
    const score = Math.max(Math.round(totalCorrect * 20 + (round + 1) * 50 - wrong * 10), 0)
    return (
      <GameEndScreen
        gameName="Memory Matrix"
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
        <h1 className="font-serif text-3xl font-bold text-[#E5E7EB]">Memory Matrix</h1>
        <p className="text-[#9CA3AF] text-center max-w-md">
          Remember the highlighted tiles, then click them from memory. The grid gets larger each round.
        </p>
        <button
          onClick={startGame}
          className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#99F6E4] to-[#C4B5FD] text-[#0F172A] font-semibold text-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(153,246,228,0.3)]"
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
          <p className="font-mono text-xl font-bold text-[#C4B5FD]">{round + 1}/5</p>
        </div>
        <div className="text-center">
          <p className="text-[#9CA3AF] text-xs">Mistakes</p>
          <p className="font-mono text-xl font-bold text-[#F87171]">{wrong}/3</p>
        </div>
      </div>

      {phase === "showing" && (
        <p className="text-[#99F6E4] text-sm animate-pulse">Memorize the pattern...</p>
      )}
      {phase === "playing" && (
        <p className="text-[#FDBA74] text-sm">Tap the tiles from memory</p>
      )}

      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: Math.min(gridSize * 64, 320),
        }}
      >
        {Array.from({ length: totalCells }).map((_, i) => {
          const isRevealed = revealed[i] && grid[i]
          const isSelected = selected[i]
          const isCorrect = isSelected && grid[i]
          const isWrong = isSelected && !grid[i]

          return (
            <button
              key={`${round}-${i}`}
              onClick={() => handleCellClick(i)}
              disabled={phase !== "playing" || isSelected}
              className={`aspect-square rounded-xl transition-all duration-300 border ${
                isRevealed
                  ? "bg-[#99F6E4]/30 border-[#99F6E4]/40 shadow-[0_0_10px_rgba(153,246,228,0.2)]"
                  : isCorrect
                  ? "bg-[#99F6E4]/25 border-[#99F6E4]/30"
                  : isWrong
                  ? "bg-[#F87171]/20 border-[#F87171]/30"
                  : "bg-[rgba(30,27,75,0.4)] border-[rgba(196,181,253,0.08)] hover:border-[rgba(196,181,253,0.2)] hover:bg-[rgba(30,27,75,0.6)] cursor-pointer"
              }`}
              aria-label={`Grid cell ${i + 1}`}
            />
          )
        })}
      </div>
    </div>
  )
}
