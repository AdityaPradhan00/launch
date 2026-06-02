'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Confetti({
  fadeOut,
}: {
  fadeOut?: boolean
}) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const colors = [
      'rgba(20, 184, 166, 0.8)',
      'rgba(45, 212, 191, 0.8)',
      'rgba(217, 119, 6, 0.8)',
      'rgba(251, 191, 36, 0.8)',
      'rgba(96, 165, 250, 0.6)',
    ]
  
    const generateParticles = () => {
      const newParticles = Array.from({ length: 40 }, (_, i) => ({
        id: `${Date.now()}-${Math.random()}-${i}`,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 4 + Math.random() * 2, // SAME SPEED
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
  
      setParticles((prev) => [...prev, ...newParticles])
  
      // remove old particles after animation ends
      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.some((np) => np.id === p.id))
        )
      }, 6000)
    }
  
    generateParticles()
  
    const interval = setInterval(() => {
      generateParticles()
    }, 1200) // spawn more every 1.2 sec
  
    return () => clearInterval(interval)
  }, [])
  return (
    <><motion.div
    animate={{
      opacity: fadeOut ? 0 : 1,
    }}
    transition={{
      duration: 2,
      ease: 'easeOut',
    }}
  >
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
      ))}</motion.div>
    </>
  )
}
