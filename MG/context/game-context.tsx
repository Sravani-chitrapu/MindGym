"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

export interface GameScore {
  game: string
  score: number
  accuracy: number
  speed: number
  date: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

export interface LeaderboardEntry {
  id: string
  name: string
  avatar: string
  xp: number
  level: number
  rank: number
}

export interface UserData {
  name: string
  avatar: string
  xp: number
  level: number
  streak: number
  gamesPlayed: number
  totalAccuracy: number
  totalSpeed: number
  rewardPoints: number
  scores: GameScore[]
  badges: Badge[]
  lastPlayedDate: string
}

const DEFAULT_BADGES: Badge[] = [
  { id: "first-game", name: "First Steps", description: "Play your first game", icon: "footprints", unlocked: false },
  { id: "streak-3", name: "On Fire", description: "3-day streak", icon: "flame", unlocked: false },
  { id: "streak-7", name: "Unstoppable", description: "7-day streak", icon: "zap", unlocked: false },
  { id: "accuracy-90", name: "Sharpshooter", description: "90%+ accuracy in any game", icon: "target", unlocked: false },
  { id: "games-10", name: "Dedicated", description: "Play 10 games", icon: "trophy", unlocked: false },
  { id: "games-50", name: "Brain Athlete", description: "Play 50 games", icon: "brain", unlocked: false },
  { id: "level-5", name: "Rising Star", description: "Reach level 5", icon: "star", unlocked: false },
  { id: "level-10", name: "Mind Master", description: "Reach level 10", icon: "crown", unlocked: false },
  { id: "perfect", name: "Perfectionist", description: "Get 100% accuracy", icon: "sparkles", unlocked: false },
  { id: "speed-demon", name: "Speed Demon", description: "Complete a game in under 10s", icon: "timer", unlocked: false },
]

const FAKE_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", name: "NeuralNinja", avatar: "NN", xp: 12500, level: 15, rank: 1 },
  { id: "2", name: "BrainWave", avatar: "BW", xp: 11200, level: 14, rank: 2 },
  { id: "3", name: "MindMeld", avatar: "MM", xp: 9800, level: 12, rank: 3 },
  { id: "4", name: "ThinkTank", avatar: "TT", xp: 8500, level: 11, rank: 4 },
  { id: "5", name: "CogniPro", avatar: "CP", xp: 7200, level: 9, rank: 5 },
  { id: "6", name: "SynapStar", avatar: "SS", xp: 6100, level: 8, rank: 6 },
  { id: "7", name: "LogicLion", avatar: "LL", xp: 5400, level: 7, rank: 7 },
  { id: "8", name: "QuickMind", avatar: "QM", xp: 4200, level: 6, rank: 8 },
  { id: "9", name: "FocusFox", avatar: "FF", xp: 3100, level: 4, rank: 9 },
  { id: "10", name: "ZenBrain", avatar: "ZB", xp: 2000, level: 3, rank: 10 },
]

const DEFAULT_USER: UserData = {
  name: "Player",
  avatar: "PL",
  xp: 0,
  level: 1,
  streak: 0,
  gamesPlayed: 0,
  totalAccuracy: 0,
  totalSpeed: 0,
  rewardPoints: 0,
  scores: [],
  badges: DEFAULT_BADGES,
  lastPlayedDate: "",
}

function calculateLevel(xp: number): number {
  return Math.floor(xp / 500) + 1
}

function xpForNextLevel(level: number): number {
  return level * 500
}

interface GameContextType {
  user: UserData
  leaderboard: LeaderboardEntry[]
  isLoggedIn: boolean
  login: (name: string) => void
  logout: () => void
  addScore: (score: GameScore) => number
  getUserRank: () => number
  xpProgress: number
  xpForNext: number
  levelUpTriggered: boolean
  clearLevelUp: () => void
  newBadges: Badge[]
  clearNewBadges: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData>(DEFAULT_USER)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(FAKE_LEADERBOARD)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [levelUpTriggered, setLevelUpTriggered] = useState(false)
  const [newBadges, setNewBadges] = useState<Badge[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("mindgym-user")
      const loggedIn = sessionStorage.getItem("mindgym-logged-in")
      if (saved) {
        setUser(JSON.parse(saved))
      }
      if (loggedIn === "true") {
        setIsLoggedIn(true)
      }
      setIsInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      sessionStorage.setItem("mindgym-user", JSON.stringify(user))
    }
  }, [user, isInitialized])

  const login = useCallback((name: string) => {
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    setUser(prev => ({ ...prev, name, avatar: initials || "PL" }))
    setIsLoggedIn(true)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("mindgym-logged-in", "true")
    }
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
    setUser(DEFAULT_USER)
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("mindgym-logged-in")
      sessionStorage.removeItem("mindgym-user")
    }
  }, [])

  const checkBadges = useCallback((updatedUser: UserData): Badge[] => {
    const newly: Badge[] = []
    const badges = [...updatedUser.badges]

    const checks: [string, boolean][] = [
      ["first-game", updatedUser.gamesPlayed >= 1],
      ["streak-3", updatedUser.streak >= 3],
      ["streak-7", updatedUser.streak >= 7],
      ["accuracy-90", updatedUser.scores.some(s => s.accuracy >= 90)],
      ["games-10", updatedUser.gamesPlayed >= 10],
      ["games-50", updatedUser.gamesPlayed >= 50],
      ["level-5", updatedUser.level >= 5],
      ["level-10", updatedUser.level >= 10],
      ["perfect", updatedUser.scores.some(s => s.accuracy === 100)],
      ["speed-demon", updatedUser.scores.some(s => s.speed < 10)],
    ]

    for (const [id, condition] of checks) {
      const badge = badges.find(b => b.id === id)
      if (badge && !badge.unlocked && condition) {
        badge.unlocked = true
        badge.unlockedAt = new Date().toISOString()
        newly.push(badge)
      }
    }

    return newly
  }, [])

  const addScore = useCallback((score: GameScore): number => {
    const xpEarned = Math.round(score.score * (score.accuracy / 100) * 2) + 25
    let earnedXp = 0

    setUser(prev => {
      const today = new Date().toDateString()
      const lastPlayed = prev.lastPlayedDate
      let newStreak = prev.streak

      if (lastPlayed !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        if (lastPlayed === yesterday.toDateString()) {
          newStreak = prev.streak + 1
        } else if (lastPlayed === "") {
          newStreak = 1
        } else {
          newStreak = 1
        }
      }

      const newXp = prev.xp + xpEarned
      const newLevel = calculateLevel(newXp)
      const newGamesPlayed = prev.gamesPlayed + 1
      const totalAcc = ((prev.totalAccuracy * prev.gamesPlayed) + score.accuracy) / newGamesPlayed
      const totalSpd = ((prev.totalSpeed * prev.gamesPlayed) + score.speed) / newGamesPlayed

      const updated: UserData = {
        ...prev,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        gamesPlayed: newGamesPlayed,
        totalAccuracy: Math.round(totalAcc * 10) / 10,
        totalSpeed: Math.round(totalSpd * 10) / 10,
        rewardPoints: prev.rewardPoints + Math.round(xpEarned * 0.5),
        scores: [...prev.scores, score],
        lastPlayedDate: today,
      }

      if (newLevel > prev.level) {
        setLevelUpTriggered(true)
      }

      const newlyUnlocked = checkBadges(updated)
      if (newlyUnlocked.length > 0) {
        setNewBadges(newlyUnlocked)
        updated.badges = updated.badges.map(b => {
          const found = newlyUnlocked.find(n => n.id === b.id)
          return found || b
        })
      }

      earnedXp = xpEarned
      return updated
    })

    setLeaderboard(prev => {
      const existing = prev.find(e => e.name === user.name)
      let newBoard: LeaderboardEntry[]
      if (existing) {
        newBoard = prev.map(e =>
          e.name === user.name
            ? { ...e, xp: user.xp + xpEarned, level: calculateLevel(user.xp + xpEarned) }
            : e
        )
      } else {
        newBoard = [...prev, {
          id: "user",
          name: user.name,
          avatar: user.avatar,
          xp: user.xp + xpEarned,
          level: calculateLevel(user.xp + xpEarned),
          rank: 0,
        }]
      }
      return newBoard
        .sort((a, b) => b.xp - a.xp)
        .map((e, i) => ({ ...e, rank: i + 1 }))
    })

    return earnedXp
  }, [user, checkBadges])

  const getUserRank = useCallback(() => {
    const entry = leaderboard.find(e => e.name === user.name)
    return entry?.rank ?? leaderboard.length + 1
  }, [leaderboard, user.name])

  const xpProgress = user.xp % 500
  const xpForNext = xpForNextLevel(user.level)

  const clearLevelUp = useCallback(() => setLevelUpTriggered(false), [])
  const clearNewBadges = useCallback(() => setNewBadges([]), [])

  return (
    <GameContext.Provider
      value={{
        user,
        leaderboard,
        isLoggedIn,
        login,
        logout,
        addScore,
        getUserRank,
        xpProgress,
        xpForNext,
        levelUpTriggered,
        clearLevelUp,
        newBadges,
        clearNewBadges,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
