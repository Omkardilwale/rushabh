"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cursorSpring } from "@/lib/motion";

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

const TRAIL_COUNT = 4;
const TRAIL_INTERVAL_MS = 48;

export function CursorGlow() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const idRef = useRef(0);
  const lastTrailAtRef = useRef(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const dotX = useSpring(mouseX, cursorSpring.dot);
  const dotY = useSpring(mouseY, cursorSpring.dot);
  const glowX = useSpring(mouseX, cursorSpring.glow);
  const glowY = useSpring(mouseY, cursorSpring.glow);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsDesktop(finePointer.matches);

    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    finePointer.addEventListener("change", onChange);
    return () => finePointer.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    document.documentElement.classList.add("custom-cursor");

    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);

      const now = performance.now();
      if (now - lastTrailAtRef.current < TRAIL_INTERVAL_MS) return;
      lastTrailAtRef.current = now;

      setTrail((prev) => {
        const next = [
          { x: e.clientX, y: e.clientY, id: idRef.current++ },
          ...prev,
        ];
        return next.slice(0, TRAIL_COUNT);
      });
    };

    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [isDesktop, mouseX, mouseY]);

  if (!isDesktop) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      {trail.map((point, i) => (
        <div
          key={point.id}
          className="absolute rounded-full bg-gold-light"
          style={{
            left: point.x,
            top: point.y,
            width: 3 - i * 0.3,
            height: 3 - i * 0.3,
            opacity: Math.max(0, 0.4 - i * 0.06),
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      <motion.div
        className="absolute"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 0.7 : 0,
        }}
      >
        <div className="h-20 w-20 rounded-full bg-gold/10 blur-xl" />
      </motion.div>

      <motion.div
        className="absolute"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div className="relative flex h-4 w-4 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-gold/70" />
          <div className="h-1 w-1 rounded-full gold-gradient shadow-[0_0_8px_rgba(201,169,98,0.9)]" />
        </div>
      </motion.div>
    </div>
  );
}
