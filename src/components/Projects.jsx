import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { GithubIcon } from "./BrandIcons";
import projects from "../data/projects";

function ProjectCard({ project }) {
  const { number, name, description, tech, year, github, live } = project;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="group relative flex h-[420px] w-[300px] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-2xl border border-line bg-card p-7 transition-colors duration-300 hover:border-gold/60 sm:w-[360px]"
    >
      {/* Clip-path gold reveal on hover */}
      <div className="card-reveal pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/[0.10] to-transparent" />

      {/* Top row: number + year */}
      <div className="relative flex items-start justify-between">
        <span className="font-display text-5xl font-semibold text-white/10 transition-colors duration-300 group-hover:text-gold/30">
          {number}
        </span>
        <span className="text-xs font-medium uppercase tracking-widest text-muted">
          {year}
        </span>
      </div>

      {/* Middle: name + description */}
      <div className="relative">
        <h3 className="font-display text-2xl font-semibold text-white">
          {name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          {description}
        </p>

        {/* Tech badge pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line bg-bg/60 px-3 py-1 text-[11px] font-medium text-white/70"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom: links */}
      <div className="relative flex items-center gap-3">
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-medium text-white transition-colors hover:border-gold hover:text-gold"
        >
          <GithubIcon size={14} /> Code
        </a>
        {live && (
          <a
            href={live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-bg transition-transform hover:scale-105"
          >
            Live <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const scrollerRef = useRef(null);

  const scrollBy = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 380, behavior: "smooth" });
  };

  return (
    <section id="projects" className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">
              Selected Work
            </p>
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="text-white">MY </span>
              <span className="text-gold">WORK</span>
            </h2>
          </div>

          {/* Scroll arrows */}
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollBy(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-white transition-colors hover:border-gold hover:text-gold"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollBy(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-white transition-colors hover:border-gold hover:text-gold"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal scroll-snap container */}
      <div
        ref={scrollerRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 sm:px-10"
      >
        {projects.map((p) => (
          <ProjectCard key={p.number} project={p} />
        ))}
        {/* trailing spacer so the last card can center-snap */}
        <div className="w-2 shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
}
