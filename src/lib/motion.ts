/** Shared fast motion presets — snappy by default */
export const motionFast = {
  spring: { type: "spring" as const, stiffness: 500, damping: 32, mass: 0.4 },
  springSnappy: { type: "spring" as const, stiffness: 700, damping: 38, mass: 0.25 },
  tween: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  tweenQuick: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
};

export const cursorSpring = {
  dot: { stiffness: 900, damping: 45, mass: 0.15 },
  glow: { stiffness: 400, damping: 35, mass: 0.2 },
};
