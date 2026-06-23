import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tooltips = [
  "Nice try 😏",
  "Nope 😂",
  "You know you want to forgive me ❤️",
  "Not today 😎",
  "Forgiveness is the only option 😭",
  "Error: Option locked 🔒",
  "Access Denied 🙅‍♀️",
  "Try again, detective 🔍",
  "I don't think so! 😜",
  "Clicking this is physically impossible! 🏃‍♂️",
  "Aha, too slow! ⚡"
];

export const RunawayButton: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [tooltip, setTooltip] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [wiggle, setWiggle] = useState(false);

  // Sound effects or voice prompts could go here, but we will use visual cues!
  
  const triggerRunaway = (mouseX: number, mouseY: number) => {
    if (!buttonRef.current) return;

    // Get current button coordinates
    const rect = buttonRef.current.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    // Calculate distance
    const dist = Math.hypot(mouseX - btnCenterX, mouseY - btnCenterY);
    
    // Trigger threshold (e.g. 100 pixels)
    if (dist < 120) {
      // Original static position of the button in viewport coordinates
      const staticLeft = rect.left - position.x;
      const staticTop = rect.top - position.y;
      
      const originX = staticLeft + rect.width / 2;
      const originY = staticTop + rect.height / 2;
      
      // Calculate relative mouse coordinates from the button's default center
      const relativeMouseX = mouseX - originX;
      const relativeMouseY = mouseY - originY;

      // Restrict wandering to a small local circle around the default position
      const maxRadius = 140; // Max distance from original position
      const minCursorDist = 90; // Min distance from cursor

      let offsetX = 0;
      let offsetY = 0;
      let attempts = 0;
      let found = false;

      while (attempts < 50) {
        // Pick a random angle and a random radius
        const angle = Math.random() * Math.PI * 2;
        const r = 40 + Math.random() * (maxRadius - 40);
        
        const testX = Math.cos(angle) * r;
        const testY = Math.sin(angle) * r;
        
        const distToMouse = Math.hypot(relativeMouseX - testX, relativeMouseY - testY);
        if (distToMouse >= minCursorDist) {
          offsetX = testX;
          offsetY = testY;
          found = true;
          break;
        }
        attempts++;
      }

      if (!found) {
        // Fallback: move opposite to mouse direction
        let oppositeAngle = Math.random() * Math.PI * 2;
        if (relativeMouseX !== 0 || relativeMouseY !== 0) {
          const angleToMouse = Math.atan2(relativeMouseY, relativeMouseX);
          oppositeAngle = angleToMouse + Math.PI;
        }
        offsetX = Math.cos(oppositeAngle) * maxRadius;
        offsetY = Math.sin(oppositeAngle) * maxRadius;
      }

      setPosition({ x: offsetX, y: offsetY });

      // Random rotational spin
      setRotation((prev) => prev + (Math.random() > 0.5 ? 360 : -360) + (Math.random() * 40 - 20));
      
      // Random scale squish/stretch
      setScale(0.8 + Math.random() * 0.4); // scale between 0.8 and 1.2
      
      // Wiggle effect
      setWiggle(true);
      setTimeout(() => setWiggle(false), 500);

      // Choose a random funny text
      const randomTooltip = tooltips[Math.floor(Math.random() * tooltips.length)];
      setTooltip(randomTooltip);
      setShowTooltip(true);
    }
  };

  // Track mouse coordinates window-wide
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      triggerRunaway(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [position]);

  // Hide tooltip after some delay
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip, tooltip]);

  // Trigger runaway on touch/pointer down for mobile
  const handleTouch = (e: React.TouchEvent | React.MouseEvent) => {
    // Get coordinate
    let clientX = 0;
    let clientY = 0;
    if ("touches" in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Force runaway
    triggerRunaway(clientX - 10, clientY - 10); // offset slightly to force distance check to trigger
  };

  return (
    <div className="relative inline-block">
      {/* Tooltip Popup */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: -45, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="absolute left-1/2 -translate-x-1/2 bg-slate-900/90 text-white font-sans text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg border border-slate-700/50 z-[100] flex items-center gap-1.5 pointer-events-none"
          >
            <span>{tooltip}</span>
            <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0.5 h-0.5 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900/90" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Runaway button */}
      <motion.button
        ref={buttonRef}
        onMouseEnter={(e) => triggerRunaway(e.clientX, e.clientY)}
        onPointerDown={handleTouch}
        onTouchStart={handleTouch}
        onClick={(e) => {
          e.preventDefault();
          // Fail-safe: if they somehow manage to click it (impossible under ordinary physics), relocate it again.
          triggerRunaway(0, 0);
        }}
        animate={{
          x: position.x,
          y: position.y,
          rotate: rotation,
          scale: scale,
          rotateZ: wiggle ? [0, -7, 7, -7, 7, 0] : rotation,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.8,
        }}
        className="px-8 py-3.5 rounded-full glass-card-dark text-slate-700 font-semibold shadow-md border border-slate-300 hover:text-slate-900 hover:bg-white/40 active:scale-95 transition-colors select-none text-base outline-none touch-none"
      >
        No 😒
      </motion.button>
    </div>
  );
};
