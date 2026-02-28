"use client"

import { useGame } from "@/context/game-context"
import {
  Footprints, Flame, Zap, Target, Trophy, Brain,
  Star, Crown, Sparkles, Timer, Gift, TrendingUp, Lock,
} from "lucide-react"

const badgeIcons: Record<string, React.ElementType> = {
  footprints: Footprints,
  flame: Flame,
  zap: Zap,
  target: Target,
  trophy: Trophy,
  brain: Brain,
  star: Star,
  crown: Crown,
  sparkles: Sparkles,
  timer: Timer,
}

export default function RewardsPage() {
  const { user, xpProgress, xpForNext } = useGame()

  const unlockedBadges = user.badges.filter((b) => b.unlocked)
  const lockedBadges = user.badges.filter((b) => !b.unlocked)
  const progressPercent = (xpProgress / xpForNext) * 100

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#E5E7EB] tracking-tight">
          Rewards
        </h1>
        <p className="text-[#9CA3AF] mt-1">Earn XP, level up, and collect badges</p>
      </div>

      {/* XP & Level Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Level Card */}
        <div className="glass-card p-6 flex flex-col items-center gap-4 glow-mint">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(153,246,228,0.1)" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#99F6E4"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(progressPercent / 100) * 327} 327`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-mono text-3xl font-bold text-[#99F6E4]">{user.level}</p>
              <p className="text-[#9CA3AF] text-[10px]">LEVEL</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-[#E5E7EB] font-medium">
              {xpProgress} / {xpForNext} XP
            </p>
            <p className="text-[#9CA3AF] text-xs mt-0.5">
              {xpForNext - xpProgress} XP to next level
            </p>
          </div>
          {/* XP Progress Bar */}
          <div className="w-full h-3 rounded-full bg-[rgba(15,23,42,0.5)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#99F6E4] to-[#C4B5FD] transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Points Card */}
        <div className="glass-card p-6 flex flex-col items-center gap-4 glow-peach">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FDBA74]/20 to-[#F97316]/10 flex items-center justify-center border border-[rgba(253,186,116,0.2)]">
            <Gift className="w-8 h-8 text-[#FDBA74]" />
          </div>
          <div className="text-center">
            <p className="font-mono text-4xl font-bold text-[#FDBA74]">{user.rewardPoints}</p>
            <p className="text-[#9CA3AF] text-xs mt-1">Reward Points</p>
          </div>
          <div className="flex items-center gap-4 text-center">
            <div>
              <p className="font-mono text-lg font-semibold text-[#99F6E4]">{user.xp}</p>
              <p className="text-[#9CA3AF] text-[10px]">Total XP</p>
            </div>
            <div className="w-px h-8 bg-[rgba(196,181,253,0.1)]" />
            <div>
              <p className="font-mono text-lg font-semibold text-[#C4B5FD]">{user.gamesPlayed}</p>
              <p className="text-[#9CA3AF] text-[10px]">Games</p>
            </div>
            <div className="w-px h-8 bg-[rgba(196,181,253,0.1)]" />
            <div>
              <p className="font-mono text-lg font-semibold text-[#93C5FD]">{unlockedBadges.length}</p>
              <p className="text-[#9CA3AF] text-[10px]">Badges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div>
        <h2 className="font-serif text-xl font-semibold text-[#E5E7EB] mb-4">
          Badges ({unlockedBadges.length}/{user.badges.length})
        </h2>

        {/* Unlocked */}
        {unlockedBadges.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
            {unlockedBadges.map((badge) => {
              const Icon = badgeIcons[badge.icon] || Star
              return (
                <div
                  key={badge.id}
                  className="glass-card p-4 flex flex-col items-center gap-2 text-center transition-all duration-300 hover:-translate-y-1 glow-lavender"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C4B5FD]/20 to-[#99F6E4]/10 flex items-center justify-center border border-[rgba(196,181,253,0.2)]">
                    <Icon className="w-6 h-6 text-[#C4B5FD]" />
                  </div>
                  <p className="text-[#E5E7EB] text-xs font-medium">{badge.name}</p>
                  <p className="text-[#9CA3AF] text-[10px] leading-tight">{badge.description}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* Locked */}
        {lockedBadges.length > 0 && (
          <>
            <h3 className="text-[#9CA3AF] text-sm font-medium mb-3">Locked</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {lockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="glass-card p-4 flex flex-col items-center gap-2 text-center opacity-40"
                >
                  <div className="w-12 h-12 rounded-xl bg-[rgba(15,23,42,0.5)] flex items-center justify-center border border-[rgba(255,255,255,0.05)]">
                    <Lock className="w-5 h-5 text-[#9CA3AF]" />
                  </div>
                  <p className="text-[#9CA3AF] text-xs font-medium">{badge.name}</p>
                  <p className="text-[#9CA3AF] text-[10px] leading-tight">{badge.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* XP Earning Guide */}
      <div className="glass-card p-6">
        <h3 className="font-serif font-semibold text-[#E5E7EB] mb-3">How to Earn XP</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Play Games", desc: "Earn base XP for every game completed", icon: TrendingUp, color: "#99F6E4" },
            { title: "High Accuracy", desc: "Better accuracy means more XP multiplier", icon: Target, color: "#93C5FD" },
            { title: "Keep Streaks", desc: "Daily streaks unlock special badges", icon: Flame, color: "#FDBA74" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-[rgba(15,23,42,0.3)]">
              <item.icon className="w-5 h-5 mt-0.5 shrink-0" style={{ color: item.color }} />
              <div>
                <p className="text-[#E5E7EB] text-sm font-medium">{item.title}</p>
                <p className="text-[#9CA3AF] text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
