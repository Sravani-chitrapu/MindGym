"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useGame } from "@/context/game-context"
import {
  Brain, Zap, Target, Grid3X3, Infinity, Timer,
  MousePointerClick, Eye, Flame, BarChart3, Trophy, Gift,
  ArrowRight, Sparkles, TrendingUp, Activity
} from "lucide-react"

/* ---------- Animated counter hook ---------- */
function useAnimatedCounter(end: number, duration = 1200) {
  const [count, setCount] = useState(0)
  const ref = useRef(false)
  useEffect(() => {
    if (ref.current) return
    ref.current = true
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setCount(Math.round(eased * end))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [end, duration])
  return count
}

/* ---------- Interactive tilt card ---------- */
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.01)`
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)"
  }

  return (
    <div
      ref={ref}
      className={`transition-transform duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

/* ---------- Mouse spotlight ---------- */
function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty("--spotlight-x", `${x}px`)
    el.style.setProperty("--spotlight-y", `${y}px`)
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(300px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(153,246,228,0.06), transparent 60%)",
        }}
      />
      {children}
    </div>
  )
}

/* ---------- Data ---------- */
const categories = [
  {
    title: "Brain Power",
    tagline: "Challenge your neurons",
    image: "/images/brain-power.jpg",
    gradient: "from-[#99F6E4]/20 via-[#14B8A6]/10 to-transparent",
    borderColor: "border-[rgba(153,246,228,0.15)]",
    accentColor: "#99F6E4",
    glowClass: "glow-mint",
    icon: Brain,
    games: [
      { name: "Memory Matrix", href: "/dashboard/games/memory-matrix", icon: Grid3X3, desc: "Remember the pattern" },
      { name: "Logic Loop", href: "/dashboard/games/logic-loop", icon: Infinity, desc: "Solve the sequence" },
    ],
  },
  {
    title: "Fastness",
    tagline: "Test your reflexes",
    image: "/images/fastness.jpg",
    gradient: "from-[#FDBA74]/20 via-[#F97316]/10 to-transparent",
    borderColor: "border-[rgba(253,186,116,0.15)]",
    accentColor: "#FDBA74",
    glowClass: "glow-peach",
    icon: Zap,
    games: [
      { name: "Reaction Rush", href: "/dashboard/games/reaction-rush", icon: Timer, desc: "React as fast as you can" },
      { name: "Tap Frenzy", href: "/dashboard/games/tap-frenzy", icon: Flame, desc: "Tap as many as possible" },
    ],
  },
  {
    title: "Focus & Accuracy",
    tagline: "Sharpen your precision",
    image: "/images/focus-accuracy.jpg",
    gradient: "from-[#93C5FD]/20 via-[#C4B5FD]/10 to-transparent",
    borderColor: "border-[rgba(147,197,253,0.15)]",
    accentColor: "#93C5FD",
    glowClass: "glow-sky",
    icon: Target,
    games: [
      { name: "Precision Click", href: "/dashboard/games/precision-click", icon: MousePointerClick, desc: "Hit the targets precisely" },
      { name: "Focus Flow", href: "/dashboard/games/focus-flow", icon: Eye, desc: "Track and respond" },
    ],
  },
]

const quickNav = [
  {
    label: "Statistics",
    desc: "Track performance trends and insights",
    href: "/dashboard/stats",
    icon: BarChart3,
    color: "#C4B5FD",
    glowClass: "glow-lavender",
    gradientText: "gradient-text-cool",
    bg: "from-[#C4B5FD]/10 via-[#C4B5FD]/5 to-transparent",
    border: "border-[rgba(196,181,253,0.12)]",
  },
  {
    label: "Leaderboard",
    desc: "Compete and climb the global ranks",
    href: "/dashboard/leaderboard",
    icon: Trophy,
    color: "#FDE68A",
    glowClass: "glow-peach",
    gradientText: "gradient-text-warm",
    bg: "from-[#FDE68A]/10 via-[#FDE68A]/5 to-transparent",
    border: "border-[rgba(253,230,138,0.12)]",
  },
  {
    label: "Rewards",
    desc: "Earn XP, unlock badges, level up",
    href: "/dashboard/rewards",
    icon: Gift,
    color: "#FDBA74",
    glowClass: "glow-peach",
    gradientText: "gradient-text-warm",
    bg: "from-[#FDBA74]/10 via-[#FDBA74]/5 to-transparent",
    border: "border-[rgba(253,186,116,0.12)]",
  },
]

export default function DashboardPage() {
  const { user, xpProgress, xpForNext } = useGame()
  const animatedXP = useAnimatedCounter(user.xp)
  const animatedGames = useAnimatedCounter(user.gamesPlayed)
  const animatedStreak = useAnimatedCounter(user.streak)
  const animatedAccuracy = useAnimatedCounter(Math.round(user.totalAccuracy))
  const xpPercent = Math.round((xpProgress / xpForNext) * 100)

  return (
    <div className="flex flex-col gap-14">

      {/* -------- HERO SECTION -------- */}
      <section className="flex flex-col gap-8">
        {/* Welcome */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#FDBA74] animate-pulse" />
            <span className="text-sm font-medium text-[#FDBA74] tracking-wider uppercase">
              Welcome back
            </span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold gradient-text-mint tracking-tight text-balance leading-tight">
            {user.name}
          </h1>
          <p className="text-[#9CA3AF] text-lg max-w-2xl leading-relaxed">
            Your brain workout awaits. Pick a category below and push your limits &mdash; 
            every game earns XP and brings you closer to your next level.
          </p>
        </div>

        {/* XP Bar */}
        <div className="glass-card p-5 flex flex-col gap-3 breathe-glow max-w-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#99F6E4] to-[#C4B5FD] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#0F172A]" />
              </div>
              <span className="text-[#E5E7EB] font-semibold text-sm">Level {user.level} Progress</span>
            </div>
            <span className="text-[#99F6E4] font-mono text-sm font-bold">{xpProgress} / {xpForNext} XP</span>
          </div>
          <div className="h-3 rounded-full bg-[rgba(15,23,42,0.6)] overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{
                width: `${xpPercent}%`,
                background: "linear-gradient(90deg, #99F6E4, #C4B5FD, #93C5FD)",
              }}
            >
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-children">
          {[
            { label: "Total XP", value: animatedXP.toLocaleString(), icon: Sparkles, color: "#99F6E4", suffix: "" },
            { label: "Games Played", value: animatedGames, icon: Activity, color: "#C4B5FD", suffix: "" },
            { label: "Day Streak", value: animatedStreak, icon: Flame, color: "#FDBA74", suffix: "d" },
            { label: "Accuracy", value: animatedAccuracy, icon: Target, color: "#93C5FD", suffix: "%" },
          ].map((stat) => (
            <TiltCard key={stat.label}>
              <SpotlightCard className="glass-card p-5 flex flex-col gap-3 h-full group cursor-default">
                <div className="flex items-center justify-between">
                  <stat.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" style={{ color: stat.color }} />
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: stat.color }} />
                </div>
                <div>
                  <p className="font-mono text-2xl font-bold text-[#E5E7EB]">
                    {stat.value}{stat.suffix}
                  </p>
                  <p className="text-[#9CA3AF] text-xs mt-1 uppercase tracking-wider">{stat.label}</p>
                </div>
              </SpotlightCard>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* -------- QUICK NAV: STATS / LEADERBOARD / REWARDS -------- */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(196,181,253,0.15)] to-transparent" />
          <h2 className="font-serif text-xl font-semibold text-[#E5E7EB] shrink-0 px-2">
            Your Progress
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(196,181,253,0.15)] to-transparent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 stagger-children">
          {quickNav.map((item) => (
            <Link key={item.label} href={item.href}>
              <TiltCard>
                <SpotlightCard
                  className={`glass-card bg-gradient-to-br ${item.bg} ${item.border} p-7 flex flex-col gap-5 group transition-all duration-300 hover:shadow-xl animated-border rounded-[1.25rem]`}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${item.color}12` }}
                  >
                    <item.icon
                      className="w-7 h-7 transition-all duration-300 group-hover:drop-shadow-lg"
                      style={{ color: item.color }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className={`font-serif font-bold text-xl ${item.gradientText}`}>
                      {item.label}
                    </p>
                    <p className="text-[#9CA3AF] text-sm mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[#9CA3AF] group-hover:text-[#E5E7EB] transition-colors duration-300">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </SpotlightCard>
              </TiltCard>
            </Link>
          ))}
        </div>
      </section>

      {/* -------- GAME CATEGORIES -------- */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(153,246,228,0.15)] to-transparent" />
          <h2 className="font-serif text-xl font-semibold text-[#E5E7EB] shrink-0 px-2">
            Game Categories
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(153,246,228,0.15)] to-transparent" />
        </div>

        <div className="flex flex-col gap-8 stagger-children">
          {categories.map((cat) => (
            <TiltCard key={cat.title}>
              <SpotlightCard
                className={`glass-card bg-gradient-to-br ${cat.gradient} ${cat.borderColor} overflow-hidden animated-border rounded-[1.25rem]`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image Side */}
                  <div className="relative w-full md:w-80 h-52 md:h-auto shrink-0 group overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={`${cat.title} category illustration`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[rgba(30,27,75,0.95)] hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(30,27,75,0.95)] via-[rgba(30,27,75,0.3)] to-transparent md:hidden" />
                    {/* Floating category icon on image */}
                    <div className="absolute top-4 left-4 md:bottom-4 md:top-auto">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md border border-[rgba(255,255,255,0.1)]"
                        style={{ backgroundColor: `${cat.accentColor}18` }}
                      >
                        <cat.icon className="w-6 h-6" style={{ color: cat.accentColor }} />
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="flex-1 p-7 md:p-9 flex flex-col gap-6">
                    {/* Category Header */}
                    <div>
                      <h3
                        className="font-serif font-bold text-2xl mb-1"
                        style={{ color: cat.accentColor }}
                      >
                        {cat.title}
                      </h3>
                      <p className="text-[#9CA3AF] text-sm">{cat.tagline}</p>
                    </div>

                    {/* Games */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {cat.games.map((game) => (
                        <Link key={game.name} href={game.href}>
                          <div className="group/game flex items-center gap-4 p-4 rounded-2xl bg-[rgba(15,23,42,0.4)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(15,23,42,0.6)] transition-all duration-300 cursor-pointer">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover/game:scale-110 group-hover/game:shadow-lg"
                              style={{
                                backgroundColor: `${cat.accentColor}10`,
                                boxShadow: `0 0 0px ${cat.accentColor}00`,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = `0 0 20px ${cat.accentColor}30`
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = `0 0 0px ${cat.accentColor}00`
                              }}
                            >
                              <game.icon
                                className="w-5 h-5 transition-all duration-300 group-hover/game:rotate-6"
                                style={{ color: cat.accentColor }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[#E5E7EB] text-sm font-semibold group-hover/game:text-[#ffffff] transition-colors">
                                {game.name}
                              </p>
                              <p className="text-[#9CA3AF] text-xs mt-0.5">{game.desc}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover/game:text-[#E5E7EB] group-hover/game:translate-x-1 transition-all duration-300 shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* -------- DAILY TIP / MOTIVATIONAL FOOTER -------- */}
      <section className="glass-card p-8 breathe-glow flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#99F6E4]/20 to-[#C4B5FD]/20 flex items-center justify-center shrink-0">
          <Brain className="w-8 h-8 text-[#99F6E4]" />
        </div>
        <div className="flex-1">
          <p className="text-[#E5E7EB] font-serif font-semibold text-lg">Daily Brain Tip</p>
          <p className="text-[#9CA3AF] text-sm mt-1 leading-relaxed">
            Consistency beats intensity. Just 10 minutes of daily brain training can improve your 
            cognitive flexibility by up to 20%. Keep your streak alive!
          </p>
        </div>
        <div className="flex items-center gap-2 text-[#99F6E4]">
          <Flame className="w-5 h-5" />
          <span className="font-mono font-bold text-lg">{user.streak}d streak</span>
        </div>
      </section>
    </div>
  )
}
