"use client"

import { useState, useCallback } from "react"
import { useGame } from "@/context/game-context"
import { GameEndScreen } from "@/components/game-end-screen"
import { Play } from "lucide-react"

function generateSequence(length: number): number[] {
  const ops = ["+", "-", "*"]
  const seq: number[] = []
  let current = Math.floor(Math.random() * 10) + 1
  seq.push(current)

  for (let i = 1; i < length; i++) {
    const op = ops[Math.floor(Math.random() * ops.length)]
    const n = Math.floor(Math.random() * 5) + 1
    switch (op) {
      case "+": current = current + n; break
      case "-": current = current - n; break
      case "*": current = current * 2; break
    }
    seq.push(current)
  }
  return seq
}

export default function LogicLoopPage() {
  const { addScore, user } = useGame()
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle")
  const [sequence, setSequence] = useState<number[]>([])
  const [answer, setAnswer] = useState("")
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalRounds] = useState(8)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [xpEarned, setXpEarned] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)

  const startGame = useCallback(() => {
    const seq = generateSequence(4)
    setSequence(seq)
    setAnswer("")
    setRound(1)
    setScore(0)
    setCorrectCount(0)
    setFeedback(null)
    setStartTime(Date.now())
    setPhase("playing")
  }, [])

  const nextRound = useCallback(() => {
    if (round >= totalRounds) {
      finishGame()
      return
    }
    const length = Math.min(4 + Math.floor(round / 2), 7)
    const seq = generateSequence(length)
    setSequence(seq)
    setAnswer("")
    setFeedback(null)
    setRound((r) => r + 1)
  }, [round, totalRounds])

  const submitAnswer = () => {
    const correctAnswer = sequence[sequence.length - 1]
    const hiddenIndex = sequence.length - 1
    const userAnswer = parseInt(answer)
    const isCorrect = userAnswer === correctAnswer

    if (isCorrect) {
      setScore((s) => s + 100 + round * 10)
      setCorrectCount((c) => c + 1)
      setFeedback("correct")
    } else {
      setFeedback("wrong")
    }

    setTimeout(() => {
      if (round >= totalRounds) {
        finishGame(isCorrect)
      } else {
        nextRound()
      }
    }, 800)
  }

  const finishGame = (lastCorrect?: boolean) => {
    const time = (Date.now() - startTime) / 1000
    setEndTime(time)
    const finalCorrect = lastCorrect ? correctCount + 1 : correctCount
    const acc = Math.round((finalCorrect / totalRounds) * 100)
    const finalScore = score + (lastCorrect ? 100 + round * 10 : 0)
    const xp = addScore({
      game: "Logic Loop",
      score: finalScore,
      accuracy: acc,
      speed: Math.round(time * 10) / 10,
      date: new Date().toISOString(),
    })
    setXpEarned(xp)
    setPhase("done")
  }

  const bestScore = Math.max(0, ...user.scores.filter((s) => s.game === "Logic Loop").map((s) => s.score))

  if (phase === "done") {
    const acc = Math.round((correctCount / totalRounds) * 100)
    return (
      <GameEndScreen
        gameName="Logic Loop"
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
        <h1 className="font-serif text-3xl font-bold text-[#E5E7EB]">Logic Loop</h1>
        <p className="text-[#9CA3AF] text-center max-w-md">
          Find the pattern in the number sequence and predict the missing value.
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

  const hiddenIndex = sequence.length - 1

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

      <p className="text-[#9CA3AF] text-sm">What comes next in the sequence?</p>

      {/* Sequence Display */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {sequence.map((num, i) => (
          <div
            key={i}
            className={`w-16 h-16 rounded-xl flex items-center justify-center font-mono text-xl font-bold transition-all duration-300 ${
              i === hiddenIndex
                ? "bg-gradient-to-br from-[#99F6E4]/10 to-[#C4B5FD]/10 border-2 border-dashed border-[#99F6E4]/40 text-[#99F6E4]"
                : "glass-card text-[#E5E7EB]"
            }`}
          >
            {i === hiddenIndex ? "?" : num}
          </div>
        ))}
      </div>

      {/* Answer Input */}
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && answer && submitAnswer()}
          className={`w-32 text-center bg-[rgba(30,27,75,0.4)] text-[#E5E7EB] rounded-xl px-4 py-3 outline-none font-mono text-xl border transition-all duration-300 ${
            feedback === "correct"
              ? "border-[#99F6E4]/60 shadow-[0_0_15px_rgba(153,246,228,0.2)]"
              : feedback === "wrong"
              ? "border-[#F87171]/60 shadow-[0_0_15px_rgba(248,113,113,0.2)]"
              : "border-[rgba(196,181,253,0.1)] focus:border-[#99F6E4]/40"
          }`}
          placeholder="?"
          autoFocus
        />
        <button
          onClick={submitAnswer}
          disabled={!answer}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#99F6E4] to-[#C4B5FD] text-[#0F172A] font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-40"
        >
          Submit
        </button>
      </div>

      {feedback && (
        <p className={`text-sm font-medium ${feedback === "correct" ? "text-[#99F6E4]" : "text-[#F87171]"}`}>
          {feedback === "correct" ? "Correct!" : `Wrong! The answer was ${sequence[hiddenIndex]}`}
        </p>
      )}
    </div>
  )
}
