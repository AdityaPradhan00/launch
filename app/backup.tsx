"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "@/components/confetti";

// The GO button in bg1.png sits roughly at 50% x, 44% y of the image.
// The shockwave originates from there.
const GO_X_PCT = 50; // percent from left
const GO_Y_PCT = 44; // percent from top

type Phase = "idle" | "shockwave" | "transition" | "content";

export default function Page() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Compute shockwave origin in px once we know viewport size
  const originX =
    typeof window !== "undefined" ? (GO_X_PCT / 100) * window.innerWidth : 760;
  const originY =
    typeof window !== "undefined" ? (GO_Y_PCT / 100) * window.innerHeight : 400;

  // Diagonal from origin to farthest corner
  const maxRadius =
    typeof window !== "undefined"
      ? Math.max(
          Math.hypot(originX, originY),
          Math.hypot(window.innerWidth - originX, originY),
          Math.hypot(originX, window.innerHeight - originY),
          Math.hypot(window.innerWidth - originX, window.innerHeight - originY),
        ) * 1.15
      : 1400;

  const handleLaunch = () => {
    if (phase !== "idle") return;

    // Start music
    audioRef.current?.play().catch(() => {});

    // Immediately kick off shockwave
    setPhase("shockwave");

    // Crossfade backgrounds
    setTimeout(() => setPhase("transition"), 700);

    // Show content + confetti
    setTimeout(() => {
      setPhase("content");
      setShowConfetti(true);
    }, 2000);
  };

  return (
    <>
      <audio ref={audioRef} preload="auto">
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      {showConfetti && <Confetti fadeOut={false} />}

      {/* ── IDLE: bg1 image IS the button ───────────────── */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.main
            key="idle"
            className="fixed inset-0 cursor-pointer select-none"
            style={{
              backgroundImage: "url(/bg1.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            onClick={handleLaunch}
          >
            {/* Subtle breathing pulse over the GO circle area */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${GO_X_PCT}%`,
                top: `${GO_Y_PCT}%`,
                x: "-50%",
                y: "-50%",
                width: 160,
                height: 160,
                background:
                  "radial-gradient(circle, #00e5cc18 0%, transparent 70%)",
                border: "1.5px solid #00e5cc33",
              }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* "Tap" hint */}
            <motion.p
              className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-[0.25em] uppercase pointer-events-none"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              Tap to Launch
            </motion.p>
          </motion.main>
        )}
      </AnimatePresence>

      {/* ── SHOCKWAVE + CROSSFADE LAYER ─────────────────── */}
      {(phase === "shockwave" ||
        phase === "transition" ||
        phase === "content") && (
        <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 30 }}>
          {/* bg1 fading out */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/bg1.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            initial={{ opacity: 1 }}
            animate={
              phase === "transition" || phase === "content"
                ? { opacity: 0 }
                : { opacity: 1 }
            }
            transition={{ duration: 1.0, ease: "easeInOut" }}
          />

          {/* ercs-background fading in */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/ercs-background.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            initial={{ opacity: 0 }}
            animate={
              phase === "transition" || phase === "content"
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            transition={{ duration: 1.0, ease: "easeInOut" }}
          />

          {/* Primary teal shockwave ring */}
          {phase === "shockwave" && (
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                left: originX,
                top: originY,
                x: "-50%",
                y: "-50%",
                background:
                  "radial-gradient(circle, #00e5cc44 0%, #00e5cc22 50%, transparent 75%)",
                border: "2px solid #00e5cccc",
                boxShadow:
                  "0 0 40px 12px #00e5cc55, inset 0 0 40px 8px #00e5cc22",
              }}
              initial={{ width: 150, height: 150, opacity: 1 }}
              animate={{
                width: maxRadius * 2,
                height: maxRadius * 2,
                opacity: 0,
              }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            />
          )}

          {/* Gold trailing ring */}
          {phase === "shockwave" && (
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                left: originX,
                top: originY,
                x: "-50%",
                y: "-50%",
                border: "1px solid #c9a84c99",
              }}
              initial={{ width: 150, height: 150, opacity: 0.8 }}
              animate={{
                width: maxRadius * 1.7,
                height: maxRadius * 1.7,
                opacity: 0,
              }}
              transition={{
                duration: 1.05,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.07,
              }}
            />
          )}

          {/* Inner bright flash */}
          {phase === "shockwave" && (
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                left: originX,
                top: originY,
                x: "-50%",
                y: "-50%",
                background:
                  "radial-gradient(circle, #ffffff55 0%, transparent 60%)",
              }}
              initial={{ width: 80, height: 80, opacity: 1 }}
              animate={{ width: 500, height: 500, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          )}
        </div>
      )}

      {/* ── CONTENT ─────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "content" && (
          <motion.main
            key="content"
            className="fixed inset-0 flex items-center justify-center px-6 overflow-hidden"
            style={{
              backgroundImage: "url(/ercs-background.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 40,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 60%, #00e5cc08 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
              <motion.h1
                className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 text-balance"
                initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.3, delay: 0.2, ease: "easeOut" }}
              >
                e-RCS is Now{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #f5d78e, #c9a84c, #f5d78e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Live
                </span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl font-light text-gray-200 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
              >
                Secure, modern, and trustworthy cooperative society registration
              </motion.p>

              <motion.p
                className="text-base md:text-lg text-gray-400 mb-10 max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1.55, ease: "easeOut" }}
              >
                The electronic Registrar of Cooperative Societies (e-RCS) is now
                available. Experience seamless, accessible, and transparent
                registration for cooperative societies — powered by cutting-edge
                technology and democratic principles.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 2.2, ease: "easeOut" }}
              >
                <a
                  href="https://cooperative.sikkim.gov.in"
                  className="inline-flex items-center gap-2 px-8 py-3 font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background:
                      "linear-gradient(135deg, #c9a84c, #f5d78e, #c9a84c)",
                    color: "#0d1f1c",
                    boxShadow: "0 4px 24px #c9a84c44",
                  }}
                >
                  Enter Portal
                  <svg
                    width="18"
                    height="18"
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

              <motion.div
                className="mt-12 h-px w-24"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #c9a84c, transparent)",
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1, delay: 2.8, ease: "easeOut" }}
              />
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
