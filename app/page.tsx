'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Confetti from '@/components/confetti'

export default function Page() {
  const [isLaunched, setIsLaunched] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleLaunch = () => {
    setIsLaunched(true)
    setShowConfetti(true)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.8,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: 'easeOut',
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.4,
        ease: 'easeOut',
      },
    },
  }

  const curtainVariants = {
    left: {
      initial: { scaleX: 1 },
      exit: { scaleX: 0, transition: { duration: 1.2, ease: 'easeInOut' } },
    },
    right: {
      initial: { scaleX: 1 },
      exit: { scaleX: 0, transition: { duration: 1.2, ease: 'easeInOut', delay: 0.1 } },
    },
  }

  return (
    <>
      {showConfetti && <Confetti />}
      
      {/* GO Button Screen */}
      {!isLaunched && (
        <main
          className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-6 bg-gradient-to-b from-slate-900 via-teal-900 to-slate-900"
        >
          <div className="relative z-10 flex flex-col items-center justify-center text-center h-screen">
            <button
              onClick={handleLaunch}
              className="px-12 py-4 cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-bold text-2xl rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-xl hover:shadow-amber-500/50"
            >
              GO
            </button>
          </div>
        </main>
      )}

      {/* Launch Screen with Curtain Animation */}
      {isLaunched && (
        <>
          {/* Curtain Left */}
          <motion.div
            className="fixed left-0 top-0 h-screen w-1/2 bg-slate-900 origin-left z-40"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            pointerEvents="none"
          />

          {/* Curtain Right */}
          <motion.div
            className="fixed right-0 top-0 h-screen w-1/2 bg-slate-900 origin-right z-40"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.15 }}
            pointerEvents="none"
          />

          <motion.main
            initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            transition={{ duration: 0 }}
            className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-6"
            style={{
              backgroundImage: 'url(/ercs-background.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }}
          >
            {/* Animated glow effects */}
            <div className="glow-effect glow-1" />
            <div className="glow-effect glow-2" />
            <div className="glow-effect glow-3" />
          <motion.div
            className="relative z-10 flex max-w-3xl flex-col items-center text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ originY: 0.5 }}
          >
          {/* Main title */}
          <motion.div variants={titleVariants}>
            <h1 className="text-balance text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
              e-RCS is Now{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                Live
              </span>
            </h1>
          </motion.div>

          {/* Hook line */}
          <motion.p
            className="text-xl md:text-2xl font-light text-gray-200 mb-6 leading-relaxed"
            variants={itemVariants}
          >
            Secure, modern, and trustworthy cooperative society registration
          </motion.p>

          {/* Supporting text */}
          <motion.p
            className="text-base md:text-lg text-gray-400 mb-8 max-w-2xl leading-relaxed"
            variants={itemVariants}
          >
            The electronic Registrar of Cooperative Societies (e-RCS) is now available. Experience seamless, accessible, and transparent registration for cooperative societies powered by cutting-edge technology and democratic principles.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={itemVariants}>
            <a
              href="https://cooperative.sikkim.gov.in"
              className="inline-flex items-center px-8 py-3 cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-amber-500/50"
            >
              Enter Portal
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </motion.div>

              {/* Decorative line */}
              <motion.div
                className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                variants={itemVariants}
              />
            </motion.div>
          </motion.main>
        </>
      )}
    </>
  )
}
