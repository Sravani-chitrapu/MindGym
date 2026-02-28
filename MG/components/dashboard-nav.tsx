"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useGame } from "@/context/game-context"
import { Brain, BarChart3, Trophy, Gift, LogOut, Gamepad2 } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Games", icon: Gamepad2 },
  { href: "/dashboard/stats", label: "Stats", icon: BarChart3 },
  { href: "/dashboard/leaderboard", label: "Ranks", icon: Trophy },
  { href: "/dashboard/rewards", label: "Rewards", icon: Gift },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { user, logout, xpProgress, xpForNext } = useGame()

  return (
    <header className="sticky top-0 z-50 glass border-b border-[rgba(196,181,253,0.08)]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#99F6E4] to-[#C4B5FD] flex items-center justify-center">
            <Brain className="w-5 h-5 text-[#0F172A]" />
          </div>
          <span className="font-serif font-bold text-[#E5E7EB] text-lg hidden sm:block">
            MindGym
          </span>
        </Link>

        {/* Center: Motivational text (hidden on mobile) */}
        <p className="text-[#9CA3AF] text-sm hidden md:block">
          Train your mind, calmly
        </p>

        {/* Nav Items */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-[rgba(153,246,228,0.1)] text-[#99F6E4]"
                    : "text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[rgba(255,255,255,0.04)]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right: User Info */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Reward Points */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgba(253,186,116,0.08)] border border-[rgba(253,186,116,0.15)]">
            <Gift className="w-3.5 h-3.5 text-[#FDBA74]" />
            <span className="text-[#FDBA74] text-xs font-mono font-semibold">
              {user.rewardPoints}
            </span>
          </div>

          {/* User Avatar with XP Ring */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1E1B4B] to-[#2E1065] text-[#C4B5FD] text-xs font-bold border border-[rgba(196,181,253,0.2)]">
              {user.avatar}
            </div>
            {/* XP Ring */}
            <svg className="absolute -inset-0.5 w-10 h-10" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="rgba(153,246,228,0.1)"
                strokeWidth="2"
              />
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="#99F6E4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${(xpProgress / xpForNext) * 113} 113`}
                transform="rotate(-90 20 20)"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute -bottom-1 -right-1 bg-[#1E1B4B] text-[#99F6E4] text-[9px] font-bold font-mono px-1 rounded-full border border-[rgba(153,246,228,0.3)]">
              {user.level}
            </div>
          </div>

          {/* Logout */}
          <Link href="/" onClick={logout}>
            <button
              className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#F87171] hover:bg-[rgba(248,113,113,0.08)] transition-all duration-300"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </header>
  )
}
