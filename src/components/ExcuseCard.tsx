import React from "react";
import { motion } from "framer-motion";

interface ExcuseCardProps {
  id: number;
  emoji: string;
  title: string;
  subtitle?: string;
  delay?: number;
  floatY?: number; // Y float distance
  floatDuration?: number;
  className?: string;
}

export const ExcuseCard: React.FC<ExcuseCardProps> = ({
  emoji,
  title,
  subtitle,
  delay = 0,
  floatY = 12,
  floatDuration = 6,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -floatY, 0],
      }}
      transition={{
        // Entrance transition
        opacity: { duration: 0.8, delay },
        scale: { type: "spring", stiffness: 100, damping: 15, delay },
        // Continuous float transition (infinite repeat)
        y: {
          repeat: Infinity,
          duration: floatDuration,
          ease: "easeInOut",
          delay: delay * 0.5,
        },
      }}
      whileHover={{
        scale: 1.05,
        y: -15,
        boxShadow: "0 20px 40px rgba(244, 91, 115, 0.15), 0 0 25px rgba(244, 91, 115, 0.25)",
        borderColor: "rgba(244, 91, 115, 0.4)",
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className={`glass-card glass-reflection p-5 rounded-2xl border border-white/60 cursor-pointer select-none max-w-xs transition-all duration-300 ${className}`}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <div className="flex flex-col items-center text-center space-y-3 z-10 relative">
        {/* Glow behind Emoji */}
        <div className="relative">
          <div className="absolute inset-0 bg-romantic-200/40 rounded-full blur-md glow-pink-sm" />
          <span className="relative text-4xl block filter drop-shadow-md transform hover:scale-125 transition-transform duration-300">
            {emoji}
          </span>
        </div>

        {/* Card Title */}
        <p className="font-sans font-medium text-slate-800 text-sm leading-relaxed tracking-wide">
          {title}
        </p>

        {/* Narrative / Subtitle details */}
        {subtitle && (
          <div className="mt-1 w-full border-t border-romantic-200/30 pt-2">
            <p className="font-serif italic text-xs text-rose-gold-dark/90 font-semibold tracking-wider">
              {subtitle}
            </p>
          </div>
        )}
      </div>
      
      {/* Decorative card shine corner */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-white/30 to-transparent pointer-events-none rounded-tr-2xl" />
    </motion.div>
  );
};
