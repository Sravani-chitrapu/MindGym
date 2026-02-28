"use client"

import { useGame } from "@/context/game-context"
import { Target, Timer, Gamepad2, Flame, TrendingUp, Trophy } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export default function StatsPage() {
  const { user, getUserRank } = useGame()

  const statCards = [
    { label: "Accuracy", value: `${user.totalAccuracy}%`, icon: Target, color: "#93C5FD", bgColor: "rgba(147,197,253,0.08)" },
    { label: "Avg Speed", value: `${user.totalSpeed}s`, icon: Timer, color: "#FDBA74", bgColor: "rgba(253,186,116,0.08)" },
    { label: "Games Played", value: user.gamesPlayed, icon: Gamepad2, color: "#C4B5FD", bgColor: "rgba(196,181,253,0.08)" },
    { label: "Streak", value: `${user.streak} days`, icon: Flame, color: "#F87171", bgColor: "rgba(248,113,113,0.08)" },
    { label: "Total XP", value: user.xp, icon: TrendingUp, color: "#99F6E4", bgColor: "rgba(153,246,228,0.08)" },
    { label: "Rank", value: `#${getUserRank()}`, icon: Trophy, color: "#FDE68A", bgColor: "rgba(253,230,138,0.08)" },
  ]

  // Score history for line chart
  const scoreHistory = user.scores.slice(-20).map((s, i) => ({
    name: `G${i + 1}`,
    score: s.score,
    accuracy: s.accuracy,
  }))

  // Radar chart data per game
  const gameNames = ["Memory Matrix", "Logic Loop", "Reaction Rush", "Tap Frenzy", "Precision Click", "Focus Flow"]
  const radarData = gameNames.map((name) => {
    const gameScores = user.scores.filter((s) => s.game === name)
    if (gameScores.length === 0) return { game: name.split(" ")[0], score: 0, accuracy: 0 }
    const avgScore = gameScores.reduce((a, b) => a + b.score, 0) / gameScores.length
    const avgAcc = gameScores.reduce((a, b) => a + b.accuracy, 0) / gameScores.length
    return {
      game: name.split(" ")[0],
      score: Math.round(avgScore / 10),
      accuracy: Math.round(avgAcc),
    }
  })

  const hasData = user.scores.length > 0

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#E5E7EB] tracking-tight">
          Statistics
        </h1>
        <p className="text-[#9CA3AF] mt-1">Track your brain training progress</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-4 flex flex-col gap-2 transition-all duration-300 hover:-translate-y-0.5"
            style={{ borderColor: `${stat.color}15` }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: stat.bgColor }}
            >
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <p className="text-[#9CA3AF] text-xs">{stat.label}</p>
            <p className="font-mono text-xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Trend */}
          <div className="glass-card p-6">
            <h3 className="font-serif font-semibold text-[#E5E7EB] mb-4">Score Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(196,181,253,0.06)" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(30,27,75,0.9)",
                    border: "1px solid rgba(196,181,253,0.15)",
                    borderRadius: "12px",
                    color: "#E5E7EB",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#99F6E4"
                  strokeWidth={2}
                  dot={{ fill: "#99F6E4", r: 3 }}
                  activeDot={{ r: 5, fill: "#99F6E4" }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#C4B5FD"
                  strokeWidth={2}
                  dot={{ fill: "#C4B5FD", r: 3 }}
                  activeDot={{ r: 5, fill: "#C4B5FD" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="glass-card p-6">
            <h3 className="font-serif font-semibold text-[#E5E7EB] mb-4">Skills Radar</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="rgba(196,181,253,0.1)" />
                <PolarAngleAxis dataKey="game" stroke="#9CA3AF" fontSize={10} />
                <PolarRadiusAxis stroke="rgba(196,181,253,0.1)" fontSize={9} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#99F6E4"
                  fill="#99F6E4"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Radar
                  name="Accuracy"
                  dataKey="accuracy"
                  stroke="#C4B5FD"
                  fill="#C4B5FD"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Gamepad2 className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3 opacity-30" />
          <p className="text-[#9CA3AF]">Play some games to see your statistics here!</p>
        </div>
      )}

      {/* Recent Games */}
      {user.scores.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-serif font-semibold text-[#E5E7EB] mb-4">Recent Games</h3>
          <div className="flex flex-col gap-2">
            {user.scores
              .slice(-10)
              .reverse()
              .map((score, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-[rgba(15,23,42,0.3)] border border-[rgba(255,255,255,0.04)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(153,246,228,0.08)] flex items-center justify-center">
                      <Gamepad2 className="w-4 h-4 text-[#99F6E4]" />
                    </div>
                    <div>
                      <p className="text-[#E5E7EB] text-sm font-medium">{score.game}</p>
                      <p className="text-[#9CA3AF] text-xs">
                        {new Date(score.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="font-mono text-sm font-semibold text-[#99F6E4]">{score.score}</p>
                      <p className="text-[#9CA3AF] text-[10px]">score</p>
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold text-[#93C5FD]">{score.accuracy}%</p>
                      <p className="text-[#9CA3AF] text-[10px]">acc</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
