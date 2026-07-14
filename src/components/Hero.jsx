import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { ArrowUpRight, MoveDown } from "lucide-react";
import Marquee from "./Marquee";
import { useLanguage } from "../context/LanguageContext";

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
          {char === " " ? "\u00a0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Photo with no frame/background — just the face.
function PhotoBlob() {
  const [errored, setErrored] = useState(false);
  return (
    <div className="relative mx-auto w-[320px] max-w-full">
      {!errored ? (
        <img
          src="/profile.jpg"
          alt="Yohannes Bayeh"
          onError={() => setErrored(true)}
          style={{
            width: '100%',
            height: '420px',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            borderRadius: '12px',
            border: 'var(--photo-border, 2px solid #C9A84C)',
            boxShadow: 'var(--photo-shadow, 0 0 40px rgba(201, 168, 76, 0.25))',
          }}
        />
      ) : (
        <div
          className="flex h-[420px] w-full items-center justify-center"
          style={{
            background: '#0D0D0D',
            borderRadius: '12px',
            border: 'var(--photo-border, 2px solid #C9A84C)',
            boxShadow: 'var(--photo-shadow, 0 0 40px rgba(201, 168, 76, 0.25))',
          }}
        >
          <span className="font-display text-7xl font-semibold text-gold">
            YB
          </span>
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const { t } = useLanguage();
  const h = t.hero;

  return (
    <section
      id="home"
      style={{
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        transition: 'background-color 0.35s ease, color 0.35s ease'
      }}
      className="relative min-h-screen overflow-hidden px-6 pb-16 pt-24 sm:px-10 sm:pt-28"
    >
      {/* Background Blobs */}
      <div 
        style={{ 
          opacity: 'var(--blob-opacity, 0.15)',
          backgroundColor: '#C9A84C'
        }}
        className="pointer-events-none absolute -left-48 -top-48 h-96 w-96 rounded-full blur-3xl transition-opacity duration-300" 
      />
      <div 
        style={{ 
          opacity: 'var(--blob-opacity, 0.15)',
          backgroundColor: '#C9A84C'
        }}
        className="pointer-events-none absolute -right-48 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-300" 
      />


      {/* Rotated YOHANNES on the left edge */}
      <span className="pointer-events-none absolute left-2 top-1/2 hidden -translate-y-1/2 -rotate-90 select-none text-[11px] font-medium uppercase tracking-[0.5em] text-muted lg:block">
        Yohannes
      </span>

      {/* Main two-column content */}
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-12 pt-10 lg:flex-row lg:pt-16">
        {/* Left: copy (55%) */}
        <div className="w-full lg:w-[55%] flex flex-col items-start text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ color: 'var(--color-role, #C9A84C)' }}
            className="mb-6 text-xs font-medium uppercase tracking-[0.25em]"
          >
            {h.tagline}
          </motion.p>

          <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block">{h.heading1}</span>
            <span style={{ color: 'var(--color-things, #C9A84C)' }} className="block">{h.heading2}</span>
            <span className="block">{h.heading3}</span>
          </h1>

          <p 
            style={{ color: 'var(--color-subtext, #888888)' }}
            className="mt-6 max-w-md text-base leading-relaxed"
          >
            I'm{" "}
            <span style={{ color: 'var(--color-text, #ffffff)' }}>
              <AnimatedName text="Yohannes Bayeh" />
            </span>
            , {h.bio1}
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="projects" smooth duration={600} offset={-20}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  backgroundColor: 'var(--color-btn-primary-bg, #C9A84C)',
                  color: 'var(--color-btn-primary-text, #080808)'
                }}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200"
              >
                {h.viewWork} <ArrowUpRight size={16} />
              </motion.button>
            </Link>
            <Link to="contact" smooth duration={600} offset={-20}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  borderColor: 'var(--color-btn-secondary-border, #ffffff)',
                  color: 'var(--color-btn-secondary-text, #ffffff)'
                }}
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors duration-200"
              >
                {h.getInTouch}
              </motion.button>
            </Link>
          </div>

          {/* Floating badge: tech stack */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 inline-block rounded-xl border px-4 py-2 text-xs backdrop-blur-sm"
            style={{ borderColor: 'var(--th-line)', background: 'var(--th-card)', color: 'var(--th-text-60)' }}
          >
            React · Next.js · Node.js
          </motion.div>
        </div>

        {/* Right: photo + stat card (40%) */}
        <div className="w-full lg:w-[40%] flex justify-center lg:justify-end">
          {/* Inner wrapper sized to photo so stat card anchors to it */}
          <div className="relative w-[320px]" style={{ overflow: 'visible' }}>
            <PhotoBlob />

            {/* Floating stat: projects shipped */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              style={{
                background: 'var(--stat-bg, #111111)',
                border: 'var(--stat-border, 1px solid #222222)',
                boxShadow: 'var(--stat-shadow, none)',
              }}
              className="absolute -right-6 bottom-6 rounded-xl px-4 py-3 text-right backdrop-blur-sm"
            >
              <div 
                style={{ color: 'var(--stat-number, #C9A84C)' }}
                className="font-display text-2xl font-semibold"
              >
                6
              </div>
              <div 
                style={{ color: 'var(--stat-label, #555555)' }}
                className="text-[10px] uppercase tracking-widest"
              >
                {h.projectsShipped}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted lg:mt-16">
        <MoveDown size={14} className="animate-bounce" /> {h.scroll}
      </div>

      {/* Bottom marquee ticker */}
      <div className="absolute bottom-0 left-0 w-full border-t py-3" style={{ borderColor: 'var(--th-line)', background: 'var(--th-card)' }}>
        <div style={{ color: 'var(--th-text-40)' }}>
          <Marquee
            items={[
              "FRONTEND DEVELOPER",
              "REACT",
              "NEXT.JS",
              "UI ENGINEERING",
              "BAHIR DAR",
              "AVAILABLE FOR WORK",
            ]}
            className="text-sm font-medium uppercase tracking-[0.2em]"
          />
        </div>
      </div>
    </section>
  );
}
