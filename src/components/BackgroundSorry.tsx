import React, { useEffect, useState, useMemo } from "react";

interface SorryWord {
  id: number;
  text: string;
  x: number; // percentage left
  y: number; // percentage top
  size: string; // Tailwind font size
  opacity: number;
  rotation: number;
  animationClass: string;
  delay: string;
  duration: string;
}

export const BackgroundSorry: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Listen to mouse movement for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize coordinate: -0.5 to 0.5
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Generate 500 sorry words with random values
  const sorryWords = useMemo(() => {
    const words: SorryWord[] = [];
    const sizes = [
      "text-xs", "text-sm", "text-base", "text-lg", "text-xl", 
      "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl"
    ];
    const animations = [
      "animate-float-gentle", 
      "animate-drift", 
      "animate-pulse-soft",
      "animate-twinkle"
    ];

    // Total 500 apologies
    for (let i = 0; i < 500; i++) {
      // Deterministic layout but looks completely random
      const randomVal = Math.sin(i * 12345.67) * 0.5 + 0.5;
      const sizeIndex = Math.floor(randomVal * sizes.length);
      
      // Determine layers based on index to distribute opacities and sizes
      let size = sizes[sizeIndex];
      let opacity = 0.03 + (randomVal * 0.12);
      
      // Distribute sizes more realistically (fewer large words, many small ones)
      if (i < 250) {
        // Deep background layer (small, faint)
        size = sizes[Math.floor(randomVal * 3)]; // text-xs to text-base
        opacity = 0.02 + (randomVal * 0.04); // 0.02 to 0.06
      } else if (i < 430) {
        // Midground layer
        size = sizes[2 + Math.floor(randomVal * 5)]; // text-base to text-3xl
        opacity = 0.06 + (randomVal * 0.06); // 0.06 to 0.12
      } else {
        // Foreground layer (large, more visible)
        size = sizes[5 + Math.floor(randomVal * 5)]; // text-2xl to text-6xl
        opacity = 0.12 + (randomVal * 0.06); // 0.12 to 0.18
      }

      const animIndex = Math.floor((randomVal * 97) % animations.length);
      const rotation = Math.floor((randomVal * 360) - 180) * 0.4; // rotation between -72deg and 72deg

      // Spread evenly across the coordinate space
      // Using prime-based offsets to prevent clustering
      const x = ((i * 17.3) + (randomVal * 10)) % 100;
      const y = ((i * 31.7) + (randomVal * 15)) % 100;

      words.push({
        id: i,
        text: i % 25 === 0 ? "SORRY JAHNAVI" : "SORRY", // Sprinkle her name
        x,
        y,
        size,
        opacity,
        rotation,
        animationClass: animations[animIndex],
        delay: `${-(randomVal * 10).toFixed(1)}s`,
        duration: `${(8 + randomVal * 15).toFixed(1)}s`
      });
    }
    return words;
  }, []);

  // Split words into three layers for performance-friendly parallax
  const bgLayer = useMemo(() => sorryWords.slice(0, 250), [sorryWords]);
  const midLayer = useMemo(() => sorryWords.slice(250, 430), [sorryWords]);
  const fgLayer = useMemo(() => sorryWords.slice(430, 500), [sorryWords]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Background Deep Layer (Moves slowest) */}
      <div
        className="absolute inset-[-10%] transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * -15}px, ${mousePos.y * -15}px, 0)`,
        }}
      >
        {bgLayer.map((word) => (
          <div
            key={word.id}
            className={`absolute font-sans font-extrabold ${word.size} ${word.animationClass}`}
            style={{
              left: `${word.x}%`,
              top: `${word.y}%`,
              opacity: word.opacity,
              transform: `rotate(${word.rotation}deg)`,
              animationDelay: word.delay,
              animationDuration: word.duration,
              color: "var(--color-romantic-400)",
              textShadow: "0 0 10px rgba(244, 91, 115, 0.05)",
            }}
          >
            {word.text}
          </div>
        ))}
      </div>

      {/* Midground Layer (Moves medium speed) */}
      <div
        className="absolute inset-[-15%] transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * -35}px, ${mousePos.y * -35}px, 0)`,
        }}
      >
        {midLayer.map((word) => (
          <div
            key={word.id}
            className={`absolute font-sans font-extrabold ${word.size} ${word.animationClass}`}
            style={{
              left: `${word.x}%`,
              top: `${word.y}%`,
              opacity: word.opacity,
              transform: `rotate(${word.rotation}deg)`,
              animationDelay: word.delay,
              animationDuration: word.duration,
              color: "var(--color-romantic-500)",
              textShadow: "0 0 12px rgba(244, 91, 115, 0.08)",
            }}
          >
            {word.text}
          </div>
        ))}
      </div>

      {/* Foreground Layer (Moves fastest) */}
      <div
        className="absolute inset-[-20%] transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * -60}px, ${mousePos.y * -60}px, 0)`,
        }}
      >
        {fgLayer.map((word) => (
          <div
            key={word.id}
            className={`absolute font-sans font-black ${word.size} ${word.animationClass}`}
            style={{
              left: `${word.x}%`,
              top: `${word.y}%`,
              opacity: word.opacity,
              transform: `rotate(${word.rotation}deg)`,
              animationDelay: word.delay,
              animationDuration: word.duration,
              color: "var(--color-romantic-600)",
              textShadow: "0 0 15px rgba(244, 91, 115, 0.15)",
            }}
          >
            {word.text}
          </div>
        ))}
      </div>
    </div>
  );
};
