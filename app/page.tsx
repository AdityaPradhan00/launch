"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "@/components/confetti";
import govLogo from "@/public/gov_sikkim.png";
import Image from "next/image";

import { useRouter } from "next/navigation";
export default function Page() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fadeConfetti, setFadeConfetti] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [curtainFinished, setCurtainFinished] = useState(false);
  const [stage, setStage] = useState<"launch" | "live">("launch");
  const [fadeLaunch, setFadeLaunch] = useState(false);
  const [fadeLive, setFadeLive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      playCurtain();
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (stage !== "live") return;

    // Start fade 1 second before redirect
    const fadeTimer = setTimeout(() => {
      setFadeLive(true);

      // Fade confetti too
      setFadeConfetti(true);

      // Fade music over 1 second
      const audio = audioRef.current;

      if (audio) {
        const startVolume = audio.volume;
        const duration = 1000;
        const interval = 50;
        const step = startVolume / (duration / interval);

        const fade = setInterval(() => {
          audio.volume = Math.max(0, audio.volume - step);

          if (audio.volume <= 0.01) {
            audio.volume = 0;
            clearInterval(fade);
          }
        }, interval);
      }
    }, 4000);

    // Redirect
    const redirectTimer = setTimeout(() => {
      router.replace("https://cooperative.sikkim.gov.in");
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [stage, router]);
  const playCurtain = async () => {
    try {
      const video = videoRef.current;

      if (video) {
        video.currentTime = 0;
        await video.play();
      }

      await audioRef.current?.play();

      setShowConfetti(true);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!ctx) return;

    let animationId: number;
    let lastTime = 0;

    const render = (time: number) => {
      if (curtainFinished) return;
      if (time - lastTime < 33) {
        animationId = requestAnimationFrame(render);
        return;
      }

      lastTime = time;
      if (video.readyState >= 2) {
        if (
          canvas.width !== video.videoWidth ||
          canvas.height !== video.videoHeight
        ) {
          const scale = 0.5;

          canvas.width = video.videoWidth * scale;
          canvas.height = video.videoHeight * scale;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const data = frame.data;
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          const maxRB = Math.max(r, b);
          const diff = g - maxRB;

          if (diff > 15) {
            // Feather the alpha instead of removing instantly
            const alpha = Math.max(0, Math.min(255, 255 - (diff - 15) * 5));

            data[i + 3] = alpha;

            // Remove green spill
            const spill = Math.min(diff * 0.8, 80);

            data[i + 1] = Math.max((r + b) * 0.5, g - spill);

            // Warm the edge slightly
            data[i] = Math.min(255, r + spill * 0.08);
            data[i + 2] = Math.min(255, b + spill * 0.04);
          }
        }

        ctx.putImageData(frame, 0, 0);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.35,
      },
    },
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: 35,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: "easeOut",
      },
    },
  };
  return (
    <>
      {!curtainFinished && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: curtainFinished ? 0 : 1 }}
          transition={{ duration: 1 }}
        >
          {/* Hidden video used as source */}
          <video
            ref={videoRef}
            src="/curtains.mp4"
            muted
            playsInline
            preload="auto"
            className="hidden"
            onEnded={() => {
              setCurtainFinished(true);

              setTimeout(() => {
                setFadeLaunch(true);
              }, 2200);

              setTimeout(() => {
                setStage("live");
              }, 3200);
            }}
          />

          {/* Visible canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
      )}
      {/* <audio ref={audioRef} preload="auto">
        <source src="/music.mp3" type="audio/mpeg" />
      </audio> */}
      {showConfetti && <Confetti fadeOut={fadeConfetti} />}

      <>
        {stage === "launch" && (
          <motion.main
            initial={{ opacity: 1 }}
            animate={{
              opacity: fadeLaunch ? 0 : 1,
              filter: fadeLaunch ? "blur(8px)" : "blur(0px)",
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
            className="relative min-h-screen overflow-hidden flex items-center justify-center"
          >
            {/* Background */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 8,
                ease: "easeOut",
              }}
              style={{
                backgroundImage: "url(/ercs-background.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/35" />

            {/* Glow */}
            <div className="glow-effect glow-1" />
            <div className="glow-effect glow-2" />
            <div className="glow-effect glow-3" />

            {/* Content */}
            <motion.div
              className="relative z-20 flex flex-col items-center justify-center text-center px-8 py-6 max-w-5xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Government Logo */}
              <motion.div variants={titleVariants}>
                <Image
                  src={govLogo}
                  alt="Government of Sikkim"
                  width={170}
                  priority
                  className="drop-shadow-2xl mb-5"
                />
              </motion.div>

              {/* Government */}
              <motion.p
                variants={itemVariants}
                className="uppercase tracking-[0.35em] text-amber-300 text-sm font-semibold"
              >
                Government of Sikkim
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="text-gray-300 text-lg mt-1"
              >
                Department of Cooperation
              </motion.p>

              {/* Divider */}
              <motion.div
                variants={itemVariants}
                className="mt-5 mb-6 h-[2px] w-64 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
              />

              {/* Title */}
              <motion.h2
                variants={itemVariants}
                className="text-2xl md:text-3xl text-amber-300 font-light"
              >
                Launching of
              </motion.h2>

              <motion.h1
                variants={titleVariants}
                className="mt-2 text-5xl md:text-7xl font-black tracking-tight text-white"
              >
                COMPUTERIZATION
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-2 text-2xl md:text-3xl text-amber-300"
              >
                of
              </motion.p>

              <motion.h1
                variants={titleVariants}
                className="mt-1 text-4xl md:text-5xl font-bold tracking-wide text-white"
              >
                RCS OFFICE PORTAL
              </motion.h1>

              {/* Divider */}
              <motion.div
                variants={itemVariants}
                className="mt-6 mb-6 h-[2px] w-64 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
              />

              {/* By */}
              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-300"
              >
                By
              </motion.p>

              <motion.h3
                variants={itemVariants}
                className="mt-2 text-2xl md:text-3xl font-medium text-amber-300"
              >
                Hon'ble Chief Minister
              </motion.h3>

              <motion.h2
                variants={titleVariants}
                className="mt-3 text-3xl md:text-4xl font-bold text-white"
              >
                Prem Singh Tamang (Golay)
              </motion.h2>

              {/* Date & Venue */}
              <motion.div variants={itemVariants} className="mt-8 space-y-2">
                <p className="text-lg text-gray-200">
                  <span className="font-semibold text-amber-300">Date :</span>{" "}
                  1st July, 2026
                </p>

                <p className="text-lg text-gray-200">
                  <span className="font-semibold text-amber-300">Venue :</span>{" "}
                  Town Hall, Namchi
                </p>
              </motion.div>
            </motion.div>

            {/* Bottom vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          </motion.main>
        )}

        {stage === "live" && (
          <motion.main
            initial={{
              opacity: 0,
              filter: "blur(0px)",
            }}
            animate={{
              opacity: fadeLive ? 0 : 1,
              filter: fadeLive ? "blur(8px)" : "blur(0px)",
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
            className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-6"
            style={{
              backgroundImage: "url(/ercs-background.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
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
                  e-RCS is Now{" "}
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
                The electronic Registrar of Cooperative Societies (e-RCS) is now
                available. Experience seamless, accessible, and transparent
                registration for cooperative societies powered by cutting-edge
                technology and democratic principles.
              </motion.p>

              {/* CTA Button */}
              {/* <motion.div variants={itemVariants}>
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
              </motion.div> */}

              {/* Decorative line */}
              <motion.div
                className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                variants={itemVariants}
              />
            </motion.div>
          </motion.main>
        )}
      </>
    </>
  );
}
