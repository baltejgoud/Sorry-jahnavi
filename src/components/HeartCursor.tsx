import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
  angle: number;
}

export const HeartCursor: React.FC = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let heartId = 0;
    const emojis = ["❤️", "💖", "💝", "💕", "💗", "🌸", "😘", "✨"];

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });

      // Only spawn hearts occasionally to prevent lag (throttle by distance/time)
      if (Math.random() < 0.06) {
        const id = heartId++;
        const size = Math.floor(Math.random() * 8) + 10; // 10px to 18px
        const emojiIndex = Math.floor(Math.random() * emojis.length);
        
        // Random drift angle
        const angle = (Math.random() * 40 - 20); // -20deg to 20deg

        const newHeart: HeartParticle = {
          id,
          x: e.clientX,
          y: e.clientY,
          size,
          emoji: emojis[emojiIndex],
          angle,
        };

        setHearts((prev) => [...prev.slice(-10), newHeart]); // Keep max 10 active hearts

        // Auto remove after 0.6s
        setTimeout(() => {
          setHearts((prev) => prev.filter((h) => h.id !== id));
        }, 600);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    // Hide standard cursor on desktop
    document.body.classList.add("custom-cursor-hidden");

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.classList.remove("custom-cursor-hidden");
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Sparkly mouse cursor bulb */}
      <motion.div
        className="w-5 h-5 rounded-full border-2 border-white pointer-events-none fixed flex items-center justify-center bg-romantic-500/20"
        style={{
          left: coords.x,
          top: coords.y,
          x: "-50%",
          y: "-50%",
          boxShadow: "0 0 15px 4px rgba(244, 91, 115, 0.4)",
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </motion.div>

      {/* Floating particles */}
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ 
              opacity: 0.8, 
              scale: 0.5, 
              x: heart.x - heart.size / 2, 
              y: heart.y - heart.size / 2 
            }}
            animate={{ 
              opacity: 0, 
              scale: [0.5, 1.0, 0.3],
              y: heart.y - 50, // Float up by 50px
              x: heart.x - heart.size / 2 + heart.angle * 1.5, // Drift slightly
              rotate: heart.angle * 2
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute leading-none font-normal filter drop-shadow(0 2px 4px rgba(244, 91, 115, 0.2)) select-none pointer-events-none"
            style={{ 
              fontSize: `${heart.size}px`,
            }}
          >
            {heart.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
