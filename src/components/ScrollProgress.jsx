import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress
 * Thin gold line fixed to the LEFT edge of the page that grows from the top
 * to the bottom as the user scrolls. Driven by Framer Motion's useScroll
 * progress (0 → 1) mapped onto scaleY, with a spring for smoothness.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[9998] h-screen w-[3px] origin-top bg-gold"
      style={{ scaleY }}
      aria-hidden="true"
    />
  );
}
