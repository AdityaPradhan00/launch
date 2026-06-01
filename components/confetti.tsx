'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Confetti() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const colors = [
      'rgba(20, 184, 166, 0.8)', // Teal
      'rgba(45, 212, 191, 0.8)', // Light teal
      'rgba(217, 119, 6, 0.8)', // Gold
      'rgba(251, 191, 36, 0.8)', // Amber
      'rgba(96, 165, 250, 0.6)', // Light blue accent
    ]

    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2.5 + Math.random() * 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    setParticles(newParticles)
  }, [])

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none"
          style={{
            left: `${particle.left}%`,
            top: '-10px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: particle.color,
            zIndex: 50,
          }}
          initial={{ opacity: 1, y: 0, rotate: 0 }}
          animate={{
            opacity: 0,
            y: window.innerHeight + 20,
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
            x: (Math.random() - 0.5) * 100,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </>
  )
}
