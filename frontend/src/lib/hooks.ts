"use client";

import { useState, useEffect, useRef, RefObject } from "react";

export function useInView(threshold = 0.15): [RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

export function useScrollY(): number {
  const [y, setY] = useState(0);
  useEffect(() => {
    const handler = () => setY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return y;
}

export function useTypingEffect(text: string, speed = 40, startImmediately = true) {
  const [typedIndex, setTypedIndex] = useState(0);
  const [started, setStarted] = useState(startImmediately);

  useEffect(() => {
    if (!started) return;
    if (typedIndex < text.length) {
      const t = setTimeout(() => setTypedIndex(typedIndex + 1), speed);
      return () => clearTimeout(t);
    }
  }, [started, typedIndex, text.length, speed]);

  return {
    displayed: text.substring(0, typedIndex),
    isComplete: typedIndex >= text.length,
    start: () => setStarted(true),
    reset: () => {
      setTypedIndex(0);
      setStarted(false);
    },
  };
}
