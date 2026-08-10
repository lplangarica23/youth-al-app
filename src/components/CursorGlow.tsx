"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    function onMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      el.style.opacity = "1";
    }
    function onLeave() {
      if (ref.current) ref.current.style.opacity = "0";
    }

    const hero = document.getElementById("hero-section");
    hero?.addEventListener("mousemove", onMove);
    hero?.addEventListener("mouseleave", onLeave);
    return () => {
      hero?.removeEventListener("mousemove", onMove);
      hero?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[520px] w-[520px] rounded-full opacity-0 transition-opacity duration-300"
      style={{
        background:
          "radial-gradient(circle, rgba(212,255,61,0.18) 0%, rgba(255,46,147,0.08) 45%, transparent 70%)",
      }}
    />
  );
}
