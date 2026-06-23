import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Smartphone, HeartHandshake } from "lucide-react";
import { BackgroundSorry } from "./components/BackgroundSorry";
import { HeartCursor } from "./components/HeartCursor";
import { ExcuseCard } from "./components/ExcuseCard";
import { RunawayButton } from "./components/RunawayButton";
import { CelebrationOverlay } from "./components/CelebrationOverlay";

function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing apologies...");
  const [celebrate, setCelebrate] = useState(false);

  // Simulated Loading Progress (0 to 500 apologies generated)
  useEffect(() => {
    if (!loading) return;

    const totalDuration = 3800; // 3.8s total loading
    const intervalTime = 30;
    const steps = totalDuration / intervalTime;
    const increment = 500 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 500) {
          clearInterval(timer);
          setLoadingText("Done! 💖 Ready to apologize.");
          setTimeout(() => setLoading(false), 600); // smooth exit
          return 500;
        }

        // Update cute loading status text
        if (next < 100) {
          setLoadingText("Connecting phone to brain... 📱🧠");
        } else if (next < 250) {
          setLoadingText("Generating 500 custom apologies... 📝");
        } else if (next < 400) {
          setLoadingText("Adding double doses of love and regret... 🥺💖");
        } else {
          setLoadingText("Constructing high-end apologize-inator... 🚀");
        }

        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [loading]);

  return (
    <div className="relative min-h-screen animated-bg flex flex-col items-center justify-between py-12 px-4 select-none overflow-x-hidden">
      {/* Custom Romantic Heart Cursor */}
      <HeartCursor />

      {/* Dynamic 500 SORRY background */}
      {!loading && <BackgroundSorry />}

      {/* Loading Screen Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999] bg-rose-gold-light flex flex-col items-center justify-center p-6 text-center"
          >
            {/* Pulsing heart graphic */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="w-24 h-24 rounded-full bg-romantic-100 flex items-center justify-center mb-8 border border-romantic-200/50 shadow-inner glow-pink-sm"
            >
              <Heart className="w-12 h-12 text-romantic-500 fill-romantic-400" />
            </motion.div>

            {/* Counter percentage */}
            <div className="space-y-3 max-w-sm w-full">
              <h3 className="font-sans font-extrabold text-slate-800 text-3xl tracking-tight">
                {Math.round(progress)} / 500
              </h3>
              <p className="font-serif italic text-rose-gold text-sm tracking-wide h-6">
                {loadingText}
              </p>
              
              {/* Progress bar container */}
              <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden border border-white shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-romantic-400 to-romantic-600 rounded-full"
                  style={{ width: `${(progress / 500) * 100}%` }}
                />
              </div>
            </div>
            
            <p className="absolute bottom-6 font-sans text-xs text-rose-gold/60 uppercase tracking-widest font-semibold">
              Warning: Excessive technology used for apologize-inator
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Apology Content */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center flex-grow space-y-12 md:space-y-16 z-10 relative">
        
        {/* Header decoration */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center space-y-2 mt-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-romantic-100/60 border border-romantic-200/40 text-romantic-600 font-sans text-xs font-bold tracking-widest uppercase shadow-sm">
            <Smartphone className="w-3.5 h-3.5 animate-bounce" />
            <span>Case File: Missed Calls 📞</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-romantic-700 font-bold drop-shadow-sm">
            Forgiveness Portal
          </h1>
        </motion.div>

        {/* Desktop Layout: Cards placed relative to each other */}
        {/* Mobile Layout: Responsive Grid */}
        <div className="w-full relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 py-4">
          
          {/* Surround Left - Excuses 1 & 2 */}
          <div className="flex flex-col md:flex-row lg:flex-col gap-6 lg:w-1/4 items-center justify-center">
            <ExcuseCard
              id={1}
              emoji="📱"
              title="My phone and my brain disconnected simultaneously."
              delay={0.4}
              rotation={-3}
              floatY={10}
              floatDuration={5}
            />
            <ExcuseCard
              id={2}
              emoji="🤦"
              title='I told myself "I will call back in 2 minutes."'
              subtitle="Narrator: He did not."
              delay={0.6}
              rotation={4}
              floatY={14}
              floatDuration={6.5}
            />
          </div>

          {/* Center Main Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.1 }}
            className="w-full max-w-lg glass-card rounded-3xl p-8 md:p-10 text-center relative border border-white/70 shadow-2xl glow-pink-sm"
          >
            {/* Absolute floating decorations */}
            <div className="absolute -top-6 -left-6 text-romantic-400 animate-float-gentle" style={{ animationDelay: "0.2s" }}>
              <Heart className="w-8 h-8 fill-romantic-100" />
            </div>
            <div className="absolute -bottom-6 -right-6 text-romantic-400 animate-float-gentle" style={{ animationDelay: "1.4s" }}>
              <Heart className="w-10 h-10 fill-romantic-200" />
            </div>

            <div className="space-y-6">
              {/* Header Title */}
              <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-slate-800 tracking-tight flex items-center justify-center gap-2">
                <span className="animate-pulse">🥺</span>
                <span>I Am Deeply Sorry</span>
                <span className="animate-pulse" style={{ animationDelay: "0.3s" }}>🥺</span>
              </h2>

              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-romantic-400 to-transparent mx-auto" />

              {/* Message */}
              <div className="font-sans text-slate-700 leading-relaxed text-sm md:text-base space-y-4 text-justify md:text-center">
                <p>
                  I know I didn't answer your calls, and honestly, that was completely my fault.
                </p>
                <p className="italic text-rose-gold-dark font-medium">
                  I could give excuses. <br />
                  I could blame my phone. <br />
                  I could blame the universe.
                </p>
                <p className="font-semibold text-slate-800 text-lg">
                  But the truth is simple:
                </p>
                <p className="font-extrabold text-romantic-600 text-xl tracking-tight">
                  I should have answered.
                </p>
                <p>
                  I'm genuinely sorry, Jahnavi.
                </p>
                <p className="text-xs text-rose-gold bg-romantic-50/70 py-2.5 px-4 rounded-xl border border-romantic-100 font-semibold tracking-wide">
                  To prove how sorry I am, I literally filled this entire page with 500 apologies.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Surround Right - Excuses 3 & 4 */}
          <div className="flex flex-col md:flex-row lg:flex-col gap-6 lg:w-1/4 items-center justify-center">
            <ExcuseCard
              id={3}
              emoji="🧠"
              title="Brain loading..."
              subtitle="Please wait... Still loading..."
              delay={0.8}
              rotation={-2}
              floatY={12}
              floatDuration={5.8}
            />
            <ExcuseCard
              id={4}
              emoji="😭"
              title="Most people send a text."
              subtitle="I built an entire website."
              delay={1.0}
              rotation={3}
              floatY={11}
              floatDuration={6}
            />
          </div>

        </div>

        {/* Bottom Apology Acceptance Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="w-full max-w-md mx-auto text-center space-y-6 pt-4"
        >
          <div className="inline-flex items-center gap-2 text-romantic-600 font-sans font-bold text-lg md:text-xl">
            <HeartHandshake className="w-5 h-5 animate-pulse" />
            <span>Please Accept My Apology ❤️</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 min-h-[80px]">
            {/* Yes button */}
            <motion.button
              onClick={() => setCelebrate(true)}
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 10px 25px rgba(244, 91, 115, 0.4)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 bg-gradient-to-r from-romantic-500 to-rose-400 hover:from-romantic-600 hover:to-rose-500 text-white font-sans font-bold text-base rounded-full shadow-lg transition-colors cursor-pointer select-none"
            >
              Yes, I Forgive You ❤️
            </motion.button>

            {/* Runaway No button */}
            <RunawayButton />
          </div>
        </motion.div>

      </div>

      {/* Footer Branding */}
      <footer className="mt-8 font-sans text-xs text-rose-gold/60 uppercase tracking-widest text-center z-10">
        Apology page #500-1-J | Handcrafted with ❤️
      </footer>

      {/* Success Celebration Overlay */}
      <AnimatePresence>
        {celebrate && (
          <CelebrationOverlay onClose={() => setCelebrate(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
