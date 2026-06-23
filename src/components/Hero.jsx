import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { ArrowUpRight, MoveDown } from "lucide-react";
import Marquee from "./Marquee";

// Spring letter-by-letter animation config for the name.
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
};
const letter = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 18 },
  },
};

function AnimatedName({ text }) {
  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="show"
      className="inline-flex flex-wrap"
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={letter}
          className="inline-block"
          aria-hidden="true"
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Photo blob with fallback to YB initials if the image fails to load.
function PhotoBlob() {
  const [errored, setErrored] = useState(false);
  return (
    <div className="relative mx-auto aspect-[4/5] w-[260px] sm:w-[300px] lg:w-[340px]">
      {/* Gold glow behind the blob */}
      <div className="absolute inset-0 -z-10 scale-110 rounded-[42%_58%_60%_40%/45%_45%_55%_55%] bg-gold/10 blur-2xl" />
      <div className="h-full w-full overflow-hidden rounded-[42%_58%_60%_40%/45%_45%_55%_55%] border border-line bg-card">
        {!errored ? (
          <img
            src="/yohannes.png"
            alt="Yohannes Bayeh"
            onError={() => setErrored(true)}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-card">
            <span className="font-display text-7xl font-semibold text-gold">
              YB
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden px-6 pb-16 pt-6 sm:px-10"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <span className="font-display text-xl font-semibold tracking-tight text-white">
          YB
        </span>
        <div className="flex items-center gap-2 text-xs text-white/70">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Available for work
        </div>
      </div>

      {/* Rotated YOHANNES on the left edge */}
      <span className="pointer-events-none absolute left-2 top-1/2 hidden -translate-y-1/2 -rotate-90 select-none text-[11px] font-medium uppercase tracking-[0.5em] text-muted lg:block">
        Yohannes
      </span>

      {/* Main two-column content */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 pt-10 lg:grid-cols-2 lg:pt-16">
        {/* Left: copy */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-gold"
          >
            Frontend Developer · ETH · 2026
          </motion.p>

          <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block">I BUILD</span>
            <span className="block text-gold">THINGS</span>
            <span className="block">FOR THE WEB.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
            I'm{" "}
            <span className="text-white">
              <AnimatedName text="Yohannes Bayeh" />
            </span>
            , a frontend developer based in Bahir Dar, Ethiopia — crafting fast,
            polished interfaces that feel as good as they look.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="projects" smooth duration={600} offset={-20}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-bg"
              >
                View Work <ArrowUpRight size={16} />
              </motion.button>
            </Link>
            <Link to="contact" smooth duration={600} offset={-20}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-white hover:border-gold"
              >
                Get In Touch
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Right: photo blob + floating cards */}
        <div className="relative flex justify-center">
          <PhotoBlob />

          {/* Floating badge: tech stack */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -left-2 top-6 rounded-xl border border-line bg-card/90 px-4 py-2 text-xs text-white/80 backdrop-blur-sm sm:-left-6"
          >
            React · Next.js · Node.js
          </motion.div>

          {/* Floating stat: projects shipped */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="absolute -right-2 bottom-8 rounded-xl border border-line bg-card/90 px-4 py-3 text-right backdrop-blur-sm sm:-right-4"
          >
            <div className="font-display text-2xl font-semibold text-gold">
              8
            </div>
            <div className="text-[10px] uppercase tracking-widest text-white/60">
              Projects Shipped
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted lg:mt-16">
        <MoveDown size={14} className="animate-bounce" /> Scroll
      </div>

      {/* Bottom marquee ticker */}
      <div className="absolute bottom-0 left-0 w-full border-t border-line bg-bg/60 py-3">
        <Marquee
          items={[
            "FRONTEND DEVELOPER",
            "REACT",
            "NEXT.JS",
            "UI ENGINEERING",
            "BAHIR DAR",
            "AVAILABLE FOR WORK",
          ]}
          className="text-sm font-medium uppercase tracking-[0.2em] text-white/50"
        />
      </div>
    </section>
  );
}
