import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, ExternalLink, ShieldCheck, Zap, Award, Sparkles } from "lucide-react";
import { GithubIcon } from "../BrandIcons";
import { Link } from "react-router-dom";

const PROJECT_IMPACT_BADGES = {
  "askuala-link-hr": [
    { label: "80% HR Time Saved", icon: Zap },
    { label: "Role Security", icon: ShieldCheck },
  ],
  "telegram-award": [
    { label: "10,000+ Req/Sec", icon: Zap },
    { label: "Anti-Sybil Filter", icon: ShieldCheck },
  ],
  "hr-assistant-ai": [
    { label: "Sub-Second AI", icon: Sparkles },
    { label: "Groq Engine", icon: Award },
  ],
  "formula-management": [
    { label: "Strict TypeScript", icon: ShieldCheck },
    { label: "Zustand State", icon: Zap },
  ],
  "hotel-master": [
    { label: "Multi-Industry", icon: Award },
    { label: "SQLite DB", icon: ShieldCheck },
  ],
  "todo-app": [
    { label: "100/100 Lighthouse", icon: Award },
    { label: "Zero CLS", icon: Zap },
  ],
};

export default function ProjectCard({ project, index, onOpenModal }) {
  const [hovered, setHovered] = useState(false);

  // 3D Tilt Spring Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  const impactBadges = PROJECT_IMPACT_BADGES[project.slug] || [
    { label: "High Performance", icon: Zap },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        rotateStyle: true,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col justify-between rounded-3xl border border-[var(--th-line)] bg-[var(--th-card)] p-6 sm:p-8 shadow-xl transition-all duration-300 hover:border-gold/60 hover:shadow-2xl hover:shadow-gold/10"
    >
      {/* Subtle Card Glow Effect */}
      <div
        className={`pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(201, 168, 76, 0.08), transparent 40%)",
        }}
      />

      <div>
        {/* Top Header Bar: Number + Impact Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-gold">
            {project.number}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {impactBadges.map(({ label, icon: Icon }, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-gold uppercase tracking-wider shadow-sm"
              >
                <Icon size={12} className="shrink-0" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Project Name & Description */}
        <div className="my-3">
          <h3 className="font-display text-2xl font-bold tracking-tight text-[var(--th-text)] transition-colors group-hover:text-gold sm:text-3xl">
            {project.name}
          </h3>
          <p className="mt-2 text-sm text-[var(--th-text-60)] line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="my-4 flex flex-wrap gap-2">
          {project.tech?.map((t) => (
            <span
              key={t}
              className="rounded-md border border-[var(--th-line)] bg-[var(--th-bg)] px-2.5 py-1 text-[11px] font-mono text-[var(--th-muted)]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action Buttons Footer */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--th-line)]/60">
        <Link
          to={`/projects/${project.slug}`}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gold uppercase tracking-wider hover:underline"
        >
          View Case Study <ArrowUpRight size={15} />
        </Link>

        <div className="flex items-center gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} GitHub Repository`}
              className="rounded-full border border-[var(--th-line)] p-2 text-[var(--th-text-60)] hover:border-gold hover:text-gold transition-colors"
            >
              <GithubIcon width={14} height={14} />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} Live Demo`}
              className="rounded-full border border-[var(--th-line)] p-2 text-[var(--th-text-60)] hover:border-gold hover:text-gold transition-colors"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
