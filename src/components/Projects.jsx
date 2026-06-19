import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "./BrandIcons";
import projects from "../data/projects";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function ProjectRow({ project }) {
  const { number, name, tech, year, github, live, screenshot } = project;
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      variants={rowVariants}
      className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-line bg-card p-4 sm:p-5 transition-all duration-300 border-l-4 border-l-transparent hover:border-l-gold hover:border-gold/30 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Left side: Thumbnail */}
        <div className="relative w-[80px] h-[60px] shrink-0 overflow-hidden rounded-lg border border-line bg-[#111111] flex items-center justify-center">
          {!imageError && screenshot ? (
            <img
              src={screenshot}
              alt={name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="font-mono text-lg font-semibold text-gold transition-transform duration-300 group-hover:scale-105">
              {number}
            </span>
          )}
        </div>

        {/* Middle: Number, Name, Tech stack */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-gold">{number}</span>
            <h3 className="font-display text-lg font-semibold text-white transition-colors duration-300 group-hover:text-gold">
              {name}
            </h3>
          </div>
          <p className="text-xs text-white/50">
            {tech.join(" • ")}
          </p>
        </div>
      </div>

      {/* Right side: Year, Github, Live demo */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-line/50 pt-3 sm:pt-0 sm:border-0">
        <span className="text-sm font-medium text-white/40">{year}</span>
        <div className="flex items-center gap-2">
          {/* GitHub icon button */}
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-white transition-colors hover:border-gold hover:text-gold"
            aria-label="View Source Code"
          >
            <GithubIcon size={16} />
          </a>
          
          {/* Live arrow button */}
          {live ? (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-white transition-colors hover:border-gold hover:text-gold"
              aria-label="View Live Site"
            >
              <ArrowUpRight size={16} />
            </a>
          ) : (
            <button
              disabled
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted cursor-not-allowed"
              aria-label="Live Site Not Available"
            >
              <ArrowUpRight size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            Selected Work
          </p>
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            <span className="text-white">MY </span>
            <span className="text-gold">WORK</span>
          </h2>
          <p className="mt-2 text-sm text-white/55">Seven shipped products.</p>
        </div>

        {/* Vertical list container with Framer Motion stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col gap-4"
        >
          {projects.map((p) => (
            <ProjectRow key={p.number} project={p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
