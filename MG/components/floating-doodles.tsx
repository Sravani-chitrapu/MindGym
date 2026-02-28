"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
  pulse: number
  pulseSpeed: number
}

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", handler)
    return () => window.removeEventListener("mousemove", handler)
  }, [])
  return pos
}

export function FloatingDoodles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useMousePosition()
  const mouseRef = useRef(mouse)
  const particlesRef = useRef<Particle[]>([])
  const frameRef = useRef<number>(0)

  useEffect(() => {
    mouseRef.current = mouse
  }, [mouse])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const colors = [
      "153,246,228", // mint
      "196,181,253", // lavender
      "253,186,116", // peach
      "147,197,253", // sky
      "249,168,212", // pink
    ]

    // Create particles
    const particles: Particle[] = []
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.15 + 0.03,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      })
    }
    particlesRef.current = particles

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (const p of particles) {
        p.x += p.speedX
        p.y += p.speedY
        p.pulse += p.pulseSpeed

        // Wrap around
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10

        // Mouse repulsion
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150
          p.x += (dx / dist) * force * 2
          p.y += (dy / dist) * force * 2
        }

        const pulseFactor = 0.5 + Math.sin(p.pulse) * 0.5
        const currentOpacity = p.opacity * (0.6 + pulseFactor * 0.4)
        const currentSize = p.size * (0.8 + pulseFactor * 0.4)

        // Glow
        ctx.beginPath()
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 4)
        grad.addColorStop(0, `rgba(${p.color},${currentOpacity})`)
        grad.addColorStop(1, `rgba(${p.color},0)`)
        ctx.fillStyle = grad
        ctx.arc(p.x, p.y, currentSize * 4, 0, Math.PI * 2)
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.fillStyle = `rgba(${p.color},${currentOpacity * 2})`
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${particles[i].color},${0.04 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}
