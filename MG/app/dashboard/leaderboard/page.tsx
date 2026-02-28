"use client"

import { useGame } from "@/context/game-context"
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react"

const rankIcons = [Crown, Medal, Medal]
const rankColors = ["#FDE68A", "#D1D5DB", "#FDBA74"]
const rankLabels = ["Gold", "Silver", "Bronze"]

export default function LeaderboardPage() {
  const { leaderboard, user, getUserRank } = useGame()
  const userRank = getUserRank()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#E5E7EB] tracking-tight">
          Leaderboard
        </h1>
        <p className="text-[#9CA3AF] mt-1">See how you rank against other players</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto w-full">
        {leaderboard.slice(0, 3).map((entry, i) => {
          const Icon = rankIcons[i]
          const color = rankColors[i]
          const isUser = entry.name === user.name

          return (
            <div
              key={entry.id}
              className={`glass-card p-4 flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-1 ${
                i === 0 ? "order-2 -mt-4" : i === 1 ? "order-1 mt-2" : "order-3 mt-2"
              } ${isUser ? "ring-1 ring-[#99F6E4]/30" : ""}`}
              style={{
                boxShadow: `0 0 20px ${color}10`,
                borderColor: `${color}20`,
              }}
            >
              <Icon className="w-6 h-6" style={{ color }} />
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2"
                style={{
                  backgroundColor: `${color}15`,
                  borderColor: `${color}30`,
                  color,
                }}
              >
                {entry.avatar}
              </div>
              <p className="text-[#E5E7EB] text-sm font-medium text-center truncate w-full">
                {entry.name}
              </p>
              <p className="font-mono text-xs font-semibold" style={{ color }}>
                {entry.xp.toLocaleString()} XP
              </p>
              <p className="text-[#9CA3AF] text-[10px]">Level {entry.level}</p>
            </div>
          )
        })}
      </div>

      {/* Full Leaderboard */}
      <div className="glass-card p-6">
        <div className="flex flex-col gap-2">
          {leaderboard.map((entry) => {
            const isUser = entry.name === user.name
            const isTop3 = entry.rank <= 3

            return (
              <div
                key={entry.id}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                  isUser
                    ? "bg-[rgba(153,246,228,0.06)] border border-[rgba(153,246,228,0.15)]"
                    : "bg-[rgba(15,23,42,0.3)] border border-[rgba(255,255,255,0.04)] hover:bg-[rgba(15,23,42,0.5)]"
                }`}
              >
                {/* Rank */}
                <div className="w-8 text-center">
                  {isTop3 ? (
                    <span
                      className="font-mono text-lg font-bold"
                      style={{ color: rankColors[entry.rank - 1] }}
                    >
                      {entry.rank}
                    </span>
                  ) : (
                    <span className="font-mono text-sm text-[#9CA3AF]">{entry.rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                    isUser
                      ? "bg-gradient-to-br from-[#99F6E4]/20 to-[#C4B5FD]/20 text-[#99F6E4] border border-[rgba(153,246,228,0.2)]"
                      : "bg-[rgba(30,27,75,0.4)] text-[#C4B5FD] border border-[rgba(196,181,253,0.1)]"
                  }`}
                >
                  {entry.avatar}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isUser ? "text-[#99F6E4]" : "text-[#E5E7EB]"}`}>
                    {entry.name}
                    {isUser && (
                      <span className="ml-2 text-[10px] text-[#9CA3AF] font-normal">(you)</span>
                    )}
                  </p>
                  <p className="text-[#9CA3AF] text-xs">Level {entry.level}</p>
                </div>

                {/* XP */}
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-[#99F6E4]" />
                  <span className="font-mono text-sm font-semibold text-[#E5E7EB]">
                    {entry.xp.toLocaleString()}
                  </span>
                  <span className="text-[#9CA3AF] text-xs">XP</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* User Rank Card (if not in top 10) */}
      {userRank > 10 && (
        <div className="glass-card p-4 flex items-center justify-between glow-mint">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-[#99F6E4]" />
            <div>
              <p className="text-[#E5E7EB] font-medium">Your Rank</p>
              <p className="text-[#9CA3AF] text-xs">Keep playing to climb higher!</p>
            </div>
          </div>
          <p className="font-mono text-2xl font-bold text-[#99F6E4]">#{userRank}</p>
        </div>
      )}
    </div>
  )
}
