"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGame } from "@/context/game-context"
import { DashboardNav } from "@/components/dashboard-nav"
import { LevelUpOverlay } from "@/components/level-up-overlay"
import { FloatingDoodles } from "@/components/floating-doodles"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoggedIn } = useGame()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = sessionStorage.getItem("mindgym-logged-in")
      if (!loggedIn) {
        router.push("/")
      }
    }
  }, [isLoggedIn, router])

  return (
    <div className="min-h-screen animated-gradient noise-overlay relative overflow-hidden">
      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[100px]"
          style={{
            background: "radial-gradient(circle, #99F6E4, transparent)",
            top: "10%",
            left: "-5%",
            animation: "float 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.035] blur-[100px]"
          style={{
            background: "radial-gradient(circle, #C4B5FD, transparent)",
            top: "50%",
            right: "-8%",
            animation: "float 25s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute w-[350px] h-[350px] rounded-full opacity-[0.03] blur-[100px]"
          style={{
            background: "radial-gradient(circle, #FDBA74, transparent)",
            bottom: "5%",
            left: "30%",
            animation: "float 18s ease-in-out infinite 3s",
          }}
        />
      </div>
      <FloatingDoodles />
      <DashboardNav />
      <LevelUpOverlay />
      <main className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 py-10">
        {children}
      </main>
    </div>
  )
}
