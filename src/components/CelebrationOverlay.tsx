import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Send, Gift } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  char: string;
  size: number;
  vx: number;
  vy: number;
  angle: number;
  vAngle: number;
  opacity: number;
  vOpacity: number;
  wiggle: number;
  wiggleSpeed: number;
}

export const CelebrationOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const particlesRef = useRef<Particle[]>([]);

  // Trigger confetti burst on load
  useEffect(() => {
    // 1. Massive initial confetti burst
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Pink and red color theme confetti
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#f45b73", "#ffb3bd", "#ffffff", "#be2842"]
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#f45b73", "#ffb3bd", "#ffffff", "#be2842"]
      });
    }, 250);

    // Heart explosion in the center
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#f45b73", "#ffb3bd", "#be2842"],
    });

    // Stagger modal entrance
    const timer = setTimeout(() => setShowModal(true), 400);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  // Custom canvas animation for roses, love letters, kisses, sparkles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particles setup
    const particlePool = ["🌹", "❤️", "💌", "😘", "✨", "💕", "💋"];
    const particles: Particle[] = [];

    // Spawn initial particles
    const spawnCount = 80;
    for (let i = 0; i < spawnCount; i++) {
      particles.push(createParticle(true));
    }

    function createParticle(randomY = false): Particle {
      const size = Math.floor(Math.random() * 20) + 16; // 16px to 36px
      const char = particlePool[Math.floor(Math.random() * particlePool.length)];

      return {
        x: Math.random() * canvas!.width,
        y: randomY ? Math.random() * canvas!.height : -50,
        char,
        size,
        vx: (Math.random() * 2 - 1) * 1.2, // horizontal drift
        vy: char === "✨" ? (Math.random() * 0.5 + 0.3) : (Math.random() * 1.5 + 1.2), // fall speed
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() * 0.02 - 0.01) * 2,
        opacity: Math.random() * 0.8 + 0.2,
        vOpacity: char === "✨" ? -0.005 : 0, // sparkles fade
        wiggle: Math.random() * 100,
        wiggleSpeed: Math.random() * 0.02 + 0.01,
      };
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.y += p.vy;
        // Apply wiggle to horizontal movement (swaying rose/heart effect)
        p.x += p.vx + Math.sin(p.wiggle) * 0.5;
        p.wiggle += p.wiggleSpeed;
        p.angle += p.vAngle;
        p.opacity += p.vOpacity;

        // Sparkle fade reset
        if (p.char === "✨" && p.opacity <= 0) {
          p.opacity = 1;
          p.y = -20;
          p.x = Math.random() * canvas!.width;
        }

        // Offscreen check -> reset to top
        if (p.y > canvas!.height + 50) {
          Object.assign(p, createParticle(false));
        }

        // Draw particle
        ctx!.save();
        ctx!.globalAlpha = p.opacity;
        ctx!.font = `${p.size}px Arial`;
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.angle);
        ctx!.fillText(p.char, -p.size / 2, p.size / 2);
        ctx!.restore();
      }

      particlesRef.current = particles;
      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-[10000] flex items-center justify-center p-4">
      {/* Dark blur backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-romantic-900/40 backdrop-blur-md"
      />

      {/* Falling particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full" />

      {/* Apology Accepted Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 0.9
              }
            }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-2xl glass-card rounded-3xl p-8 md:p-12 text-center shadow-2xl border border-white/60 z-[10001] glow-pink-md max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {/* Crown / Trophy Floating Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{
                scale: [0, 1.2, 1],
                rotate: 0,
                transition: { delay: 0.3, type: "spring" }
              }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-tr from-romantic-500 to-rose-400 border-4 border-white shadow-xl flex items-center justify-center glow-pink-sm"
            >
              <Heart className="w-12 h-12 text-white fill-white animate-pulse" />
            </motion.div>

            {/* Sparkly corner badges */}
            <div className="absolute top-4 left-4 text-romantic-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="absolute top-4 right-4 text-romantic-400">
              <Sparkles className="w-6 h-6 animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>

            <div className="mt-8">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="thank-you-step"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Popup Title */}
                    <h2 className="font-sans font-extrabold tracking-widest text-3xl md:text-4xl text-romantic-600 drop-shadow-sm">
                      ❤️ THANK YOU ❤️
                    </h2>

                    {/* Decorative dividing line */}
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-romantic-400 to-transparent mx-auto" />

                    {/* Main message */}
                    <div className="space-y-4 font-sans text-slate-700 leading-relaxed text-base md:text-lg max-w-lg mx-auto">
                      <p className="font-semibold text-romantic-700 text-lg">
                        Thank you for forgiving me.
                      </p>
                      <p>
                        I am truly sorry for not answering your call. It was entirely my mistake, and I promise to be way more attentive.
                      </p>
                      <p className="text-slate-600 text-sm">
                        This entire page is my way of saying sorry 500 times:
                      </p>

                      {/* Scrolling/Staggered sorry list */}
                      <div className="bg-white/50 backdrop-blur-sm rounded-xl py-3 px-4 border border-rose-100 flex flex-wrap gap-2 justify-center max-w-sm mx-auto shadow-inner text-xs font-bold text-romantic-500">
                        <span className="bg-romantic-100/60 px-2.5 py-1 rounded-full border border-romantic-200">Sorry</span>
                        <span className="bg-romantic-100/60 px-2.5 py-1 rounded-full border border-romantic-200">Sorry</span>
                        <span className="bg-romantic-100/60 px-2.5 py-1 rounded-full border border-romantic-200">Sorry</span>
                        <span className="bg-romantic-100/60 px-2.5 py-1 rounded-full border border-romantic-200">Sorry</span>
                        <span className="bg-romantic-100/60 px-2.5 py-1 rounded-full border border-romantic-200">Sorry</span>
                        <span className="bg-rose-50 text-rose-gold-dark/80 px-2.5 py-1 rounded-full border border-rose-200">
                          ...and 495 more times ❤️
                        </span>
                      </div>
                    </div>

                    {/* Final Love Letter Accent */}
                    <div className="bg-gradient-to-r from-romantic-50 to-pink-50 border border-romantic-100/80 p-5 rounded-2xl max-w-md mx-auto shadow-sm">
                      <p className="font-display text-3xl text-romantic-600 font-bold leading-tight">
                        You are the best girlfriend in the world, Jahnavi!
                      </p>
                      <p className="text-xs text-rose-gold font-sans font-semibold tracking-widest uppercase mt-2">
                        🥺❤️ muahhhh muahhh ❤️🥺
                      </p>
                    </div>

                    {/* Next Button */}
                    <div className="pt-4">
                      <button
                        onClick={() => setStep(2)}
                        className="px-8 py-3.5 bg-gradient-to-r from-romantic-500 to-rose-400 hover:from-romantic-600 hover:to-rose-500 text-white font-sans font-bold rounded-full shadow-lg hover:shadow-romantic-500/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 mx-auto cursor-pointer"
                      >
                        <Send className="w-4 h-4 fill-white" />
                        <span>We are good now! ❤️</span>
                      </button>
                    </div>
                  </motion.div>
                ) : step === 2 ? (
                  <motion.div
                    key="reassurance-step"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Reassurance Header */}
                    <h2 className="font-sans font-extrabold tracking-widest text-2xl md:text-3xl text-romantic-600 drop-shadow-sm">
                      ✨ A LITTLE REMINDER ✨
                    </h2>

                    {/* Decorative dividing line */}
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-romantic-400 to-transparent mx-auto" />

                    {/* Quote Box */}
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-rose-100/50 shadow-inner max-w-lg mx-auto">
                      <p className="font-serif italic text-slate-800 text-lg md:text-xl leading-relaxed text-center">
                        "If you only see the worst in things, you'll miss the best part. <br />
                        and these worst things make you the best"
                      </p>
                    </div>

                    {/* Reassuring Message (Telugu Text) */}
                    <div className="bg-gradient-to-r from-romantic-50 to-pink-50 border border-romantic-100/80 p-5 rounded-2xl max-w-md mx-auto shadow-sm space-y-3">
                      <p className="font-display text-2xl md:text-3xl text-romantic-700 font-bold leading-tight">
                        neku edhi kakapotey inoka job jahnavi,
                      </p>
                      <p className="text-sm md:text-base text-rose-gold-dark font-sans font-bold tracking-wide uppercase">
                        tension teskoku kastapadudham techukundham ❤️
                      </p>
                    </div>

                    {/* Playful/Cheeky Kisses Note */}
                    <div className="bg-rose-50/60 border border-pink-100/60 p-4 rounded-xl max-w-md mx-auto shadow-sm">
                      <p className="font-display text-xl md:text-2xl text-romantic-600 font-semibold leading-relaxed">
                        ni lips na kisses ni miss ituney annukunta jahnavi andukey aa black ga ituney HAHAHAHA 😉💋
                      </p>
                    </div>

                    {/* Surprise Button */}
                    <div className="pt-4">
                      <button
                        onClick={() => setStep(3)}
                        className="px-8 py-3.5 bg-gradient-to-r from-romantic-600 to-rose-500 hover:from-romantic-700 hover:to-rose-600 text-white font-sans font-bold rounded-full shadow-lg hover:shadow-romantic-600/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 mx-auto cursor-pointer"
                      >
                        <Gift className="w-4 h-4 fill-white" />
                        <span>Surprise for you! 🎁</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="surprise-step"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Surprise Header */}
                    <h2 className="font-sans font-extrabold tracking-widest text-2xl md:text-3xl text-romantic-600 drop-shadow-sm uppercase">
                      💝 SURPRISE FOR YOU! 💝
                    </h2>

                    {/* Decorative dividing line */}
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-romantic-400 to-transparent mx-auto" />

                    {/* Image Container with romantic Polaroid-style frame */}
                    <div className="relative mx-auto max-w-sm bg-white p-4 pb-6 rounded-2xl shadow-2xl border border-rose-100 rotate-1 transform hover:rotate-0 transition-transform duration-300">
                      <div className="overflow-hidden rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <img
                          src={`${import.meta.env.BASE_URL}my_photo.jpg`}
                          alt="Jahnavi's Surprise"
                          className="max-w-full h-auto object-contain max-h-[320px] md:max-h-[380px]"
                        />
                      </div>
                      <p className="font-display text-3xl text-romantic-600 text-center mt-4">
                        Always yours! 🥺❤️
                      </p>
                    </div>

                    {/* Final Close Button */}
                    <div className="pt-4">
                      <button
                        onClick={onClose}
                        className="px-8 py-3.5 bg-gradient-to-r from-romantic-600 to-rose-500 hover:from-romantic-700 hover:to-rose-600 text-white font-sans font-bold rounded-full shadow-lg hover:shadow-romantic-600/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 mx-auto cursor-pointer"
                      >
                        <Heart className="w-4 h-4 fill-white" />
                        <span>Always with you! ❤️</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
