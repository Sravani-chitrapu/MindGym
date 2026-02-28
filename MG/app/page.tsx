"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useGame } from "@/context/game-context"
import { FloatingDoodles } from "@/components/floating-doodles"
import { Eye, EyeOff, Brain } from "lucide-react"

export default function LoginPage() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [nameFocused, setNameFocused] = useState(false)
  const [passFocused, setPassFocused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { login } = useGame()
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setIsTransitioning(true)
    setTimeout(() => {
      login(name.trim())
      startTransition(() => {
        router.push("/dashboard")
      })
    }, 600)
  }

  return (
    <div
      className={`min-h-screen animated-gradient flex items-center justify-center p-4 relative overflow-hidden transition-all duration-700 ${
        isTransitioning ? "scale-105 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      <FloatingDoodles />

      <div className="glass relative z-10 w-full max-w-md rounded-3xl p-8 transition-all duration-500 hover:glow-lavender">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#99F6E4] to-[#C4B5FD] flex items-center justify-center">
              <Brain className="w-8 h-8 text-[#0F172A]" />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#99F6E4] to-[#C4B5FD] opacity-20 blur-lg" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#E5E7EB] tracking-tight">
            MindGym
          </h1>
          <p className="text-[#9CA3AF] text-sm">Train your brain, level up your mind</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Name Input */}
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              className={`w-full bg-[rgba(30,27,75,0.4)] text-[#E5E7EB] rounded-xl px-4 pt-6 pb-2 outline-none transition-all duration-300 border ${
                nameFocused
                  ? "border-[#99F6E4]/40 shadow-[0_0_15px_rgba(153,246,228,0.1)]"
                  : "border-[rgba(196,181,253,0.1)]"
              }`}
              placeholder=" "
              autoComplete="name"
            />
            <label
              className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                nameFocused || name
                  ? "top-2 text-xs text-[#99F6E4]"
                  : "top-4 text-sm text-[#9CA3AF]"
              }`}
            >
              Your Name
            </label>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
              className={`w-full bg-[rgba(30,27,75,0.4)] text-[#E5E7EB] rounded-xl px-4 pt-6 pb-2 pr-12 outline-none transition-all duration-300 border ${
                passFocused
                  ? "border-[#99F6E4]/40 shadow-[0_0_15px_rgba(153,246,228,0.1)]"
                  : "border-[rgba(196,181,253,0.1)]"
              }`}
              placeholder=" "
              autoComplete="current-password"
            />
            <label
              className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                passFocused || password
                  ? "top-2 text-xs text-[#99F6E4]"
                  : "top-4 text-sm text-[#9CA3AF]"
              }`}
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#C4B5FD] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={!name.trim() || isPending}
            className="relative w-full mt-2 py-3.5 rounded-xl font-semibold text-[#0F172A] bg-gradient-to-r from-[#99F6E4] to-[#C4B5FD] transition-all duration-300 hover:shadow-[0_0_25px_rgba(153,246,228,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_0_15px_rgba(153,246,228,0.2)] disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none overflow-hidden group"
          >
            <span className="relative z-10">
              {isPending ? "Entering..." : "Enter MindGym"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#C4B5FD] to-[#99F6E4] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </form>

        <p className="text-center text-[#9CA3AF] text-xs mt-6">
          Just enter your name to start training
        </p>
      </div>
    </div>
  )
}
