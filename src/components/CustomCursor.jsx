import { useEffect, useRef, useState } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";

/**
 * CustomCursor
 * - Solid gold dot that tracks the pointer 1:1.
 * - Lagging outer ring that springs toward the pointer.
 * - Velocity-based horizontal stretch: the ring scales on the X axis and
 *   rotates toward the direction of travel when the pointer moves fast.
 * - Auto-disabled on touch devices (no fine pointer).
 */
export default function CustomCursor() {
  // Decide once, at mount, whether this is a fine-pointer (mouse) device.
  // Client-only Vite app, so `window` is available during the first render.
  const [enabled] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  });

  // Raw pointer position (instant) — used for the small dot.
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Springed position — used for the lagging ring.
  const ringX = useSpring(dotX, { stiffness: 350, damping: 28, mass: 0.6 });
  const ringY = useSpring(dotY, { stiffness: 350, damping: 28, mass: 0.6 });

  // Velocity-driven stretch + rotation of the ring.
  const stretch = useSpring(1, { stiffness: 300, damping: 20 });
  const rotate = useSpring(0, { stiffness: 300, damping: 20 });

  const last = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("custom-cursor-active");

    const handleMove = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);

      const now = performance.now();
      const prev = last.current;
      const dt = now - prev.t || 16;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;

      // Pixels per millisecond → a simple speed measure.
      const speed = Math.hypot(dx, dy) / dt;

      // Map speed to a horizontal stretch factor (clamped).
      const factor = Math.min(1 + speed * 0.6, 2.2);
      stretch.set(factor);

      // Rotate the stretched ring toward the direction of movement.
      if (Math.hypot(dx, dy) > 2) {
        rotate.set((Math.atan2(dy, dx) * 180) / Math.PI);
      }

      last.current = { x: e.clientX, y: e.clientY, t: now };
    };

    // Relax the stretch back to a circle when the pointer rests.
    let idle;
    const handleIdleCheck = () => {
      clearTimeout(idle);
      idle = setTimeout(() => stretch.set(1), 90);
    };

    const onMove = (e) => {
      handleMove(e);
      handleIdleCheck();
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      clearTimeout(idle);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [enabled, dotX, dotY, stretch, rotate]);

  if (!enabled) return null;

  return (
    <>
      {/* Lagging outer ring with velocity stretch */}
      <m.div
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          rotate,
        }}
      >
        <m.div
          className="rounded-full border border-gold/70"
          style={{
            width: 36,
            height: 36,
            scaleX: stretch,
          }}
        />
      </m.div>

      {/* Instant gold dot */}
      <m.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-gold"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
