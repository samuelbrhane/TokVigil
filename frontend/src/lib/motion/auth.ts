import type { TargetAndTransition, Variants } from "framer-motion";

export const authMotion = {
  page: {
    initial: { opacity: 0, y: 14, filter: "blur(6px)" },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.45, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      filter: "blur(6px)",
      transition: { duration: 0.25, ease: "easeInOut" },
    },
  } satisfies Variants,

  panel: {
    initial: { opacity: 0, y: 10, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -8,
      scale: 0.985,
      transition: { duration: 0.22, ease: "easeInOut" },
    },
  } satisfies Variants,

  errorBox: {
    initial: { opacity: 0, y: -8, height: 0 },
    animate: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -8,
      height: 0,
      transition: { duration: 0.16, ease: "easeInOut" },
    },
  } satisfies Variants,

  shakeIf(shake: boolean): {
    animate?: TargetAndTransition;
    transition?: TargetAndTransition["transition"];
  } {
    if (!shake) return {};
    return {
      animate: { x: [0, -8, 8, -6, 6, -3, 3, 0] },
      transition: { duration: 0.45, ease: "easeInOut" },
    };
  },
} as const;
