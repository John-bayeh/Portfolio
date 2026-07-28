import { useState } from "react";
import { m } from "framer-motion";
import { Link } from "react-scroll";
import { ArrowUpRight, Award, ExternalLink } from "lucide-react";
import Marquee from "./Marquee";
import skills from "../data/skills";
import { useLanguage } from "../context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const containerStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const experiences = [
  {
    period: "2024 — Present",
    role: "Lead Frontend Developer",
    company: "AskualaLink",
    desc: "Built and led the frontend architecture of AskualaLink HR — a full-scale enterprise HR management platform serving attendance tracking, payroll automation, AI-powered recruitment, and multi-role portals.",
    stack: ["Next.js", "Tailwind CSS", "Node.js"],
  },
  {
    period: "2023 — Present",
    role: "Freelance Frontend Developer",
    company: "Self-employed",
    desc: "Delivered custom web solutions for businesses across Ethiopia — hotel management systems, university clearance platforms, community voting platforms, and AI-powered tools.",
    stack: ["React", "Vite", "Tailwind CSS"],
  },
  {
    period: "2022 — 2023",
    role: "Self-taught Developer",
    company: "Personal Projects",
    desc: "Built 6+ real-world projects while mastering React, Next.js, Node.js, and modern frontend development. Completed intensive self-study covering data structures, algorithms, and system design.",
    stack: ["React", "JavaScript", "CSS3"],
  },
];

const certificates = [
  {
    name: "Full-Stack Web Development",
    issuer: "AskualaLink",
    date: "2026",
    link: "/screenshots/certificate1.webp",
  },
  {
    name: "Software Engineering & AI Integration",
    issuer: "Professional Certification",
    date: "2026",
    link: "/screenshots/certificate2.webp",
  },
];

function PhotoBlob() {
  const [errored, setErrored] = useState(false);
  return (
    <div className="relative mx-auto w-[320px] max-w-full">
      {!errored ? (
        <img
          src="/profile.webp"
          alt="Yohannes Bayeh"
          width={320}
          height={420}
          loading="lazy"
          onError={() => setErrored(true)}
          style={{
            width: '100%',
            height: '420px',
            objectFit: 'cover',
            objectPosition: 'center top',
            borderRadius: '12px',
            border: 'var(--photo-border, 2px solid #C9A84C)',
            boxShadow: 'var(--photo-shadow, 0 0 40px rgba(201, 168, 76, 0.25))',
            display: 'block'
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
          <span className="font-display text-6xl font-semibold text-gold">
            YB
          </span>
        </div>
      )}
    </div>
  );
}

export default function About() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <section id="about" className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <m.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold"
        >
          {a.sectionLabel}
        </m.p>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
          {/* Left column: bio + CTA + experience + certificates + timeline */}
          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {a.heading}{" "}
              <span className="text-gold">{a.headingAccent}</span>.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed" style={{ color: 'var(--th-text-60)' }}>
              {a.bio}
            </p>

            <Link to="contact" href="#contact" smooth duration={600} offset={-20}>
              <m.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold transition-colors hover:border-gold hover:text-gold"
                style={{ color: 'var(--th-text)', borderColor: 'var(--th-line)' }}
              >
                {a.cta} <ArrowUpRight size={16} />
              </m.button>
            </Link>

            {/* TASK 1: EXPERIENCE SECTION */}
            <div className="mt-14">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono font-bold tracking-[0.2em] text-gold uppercase">
                  EXPERIENCE
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
              </div>

              <m.div
                variants={containerStagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="relative border-l border-gold/40 pl-6 space-y-8"
              >
                {experiences.map((exp, idx) => (
                  <m.div key={idx} variants={fadeUp} className="relative group">
                    {/* Gold dot on the timeline */}
                    <span className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-gold bg-gold/20 group-hover:bg-gold transition-colors duration-300" />

                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-mono font-semibold text-gold">
                        {exp.period}
                      </span>
                      <span className="text-xs font-semibold text-gold">
                        {exp.company}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold" style={{ color: 'var(--th-text)' }}>
                      {exp.role}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--th-text-60)' }}>
                      {exp.desc}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {exp.stack.map((tech, ti) => (
                        <span
                          key={ti}
                          className="bg-gold/10 text-gold border border-gold/20 text-[10px] font-mono px-2 py-0.5 rounded font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </m.div>
                ))}
              </m.div>
            </div>

            {/* TASK 2: CERTIFICATES SECTION */}
            <div className="mt-14">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono font-bold tracking-[0.2em] text-gold uppercase">
                  CERTIFICATES
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
              </div>

              <m.div
                variants={containerStagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {certificates.map((cert, idx) => (
                  <m.a
                    key={idx}
                    variants={fadeUp}
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4 }}
                    className="group relative rounded-xl border p-4 transition-all duration-300 flex flex-col justify-between"
                    style={{
                      backgroundColor: 'var(--th-card)',
                      borderColor: 'var(--th-line)',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                          <Award size={18} />
                        </div>
                        <span className="text-[10px] font-mono" style={{ color: 'var(--th-text-40)' }}>
                          {cert.date}
                        </span>
                      </div>

                      <h4 className="font-display text-sm font-bold leading-snug transition-colors group-hover:text-gold" style={{ color: 'var(--th-text)' }}>
                        {cert.name}
                      </h4>

                      <p className="mt-1 text-xs font-medium text-gold">
                        {cert.issuer}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-line/40 flex items-center justify-between text-xs font-semibold text-gold group-hover:underline">
                      <span>View Certificate</span>
                      <ExternalLink size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </m.a>
                ))}
              </m.div>
            </div>

            {/* Process timeline */}
            <div className="mt-14">
              <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-muted">
                {a.processLabel}
              </p>
              <ol className="relative border-l border-line">
                {a.steps.map((s) => (
                  <li key={s.n} className="mb-7 ml-6 last:mb-0">
                    <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border border-gold" style={{ backgroundColor: 'var(--th-bg)' }} />
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-sm font-semibold text-gold">
                        {s.n}
                      </span>
                      <span className="font-display text-lg font-semibold" style={{ color: 'var(--th-text)' }}>
                        {s.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm" style={{ color: 'var(--th-text-40)' }}>{s.desc}</p>
                  </li>
                ))}
              </ol>
            </div>
          </m.div>

          {/* Right column: photo blob + floating stat cards */}
          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Inner wrapper sized to photo so absolute cards anchor to it */}
            <div className="relative w-[320px]" style={{ overflow: 'visible' }}>
              <PhotoBlob />

              <div
                className="absolute -left-6 top-6 rounded-xl px-4 py-3 backdrop-blur-sm"
                style={{ background: 'var(--stat-bg)', border: 'var(--stat-border)', boxShadow: 'var(--stat-shadow)' }}
              >
                <div className="font-display text-2xl font-semibold" style={{ color: 'var(--stat-number)' }}>
                  2+
                </div>
                <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--stat-label)' }}>
                  {a.yearsExp}
                </div>
              </div>

              <div
                className="absolute -right-6 bottom-6 rounded-xl px-4 py-3 text-right backdrop-blur-sm"
                style={{ background: 'var(--stat-bg)', border: 'var(--stat-border)', boxShadow: 'var(--stat-shadow)' }}
              >
                <div className="font-display text-2xl font-semibold" style={{ color: 'var(--stat-number)' }}>
                  6
                </div>
                <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--stat-label)' }}>
                  {a.projectsShipped}
                </div>
              </div>
            </div>
          </m.div>
        </div>

        {/* Skills infinite marquee */}
        <div className="mt-20 border-y py-6" style={{ borderColor: 'var(--th-line)' }}>
          <div style={{ color: 'var(--th-text-40)' }}>
            <Marquee items={skills} className="text-lg font-medium" />
          </div>
        </div>
      </div>
    </section>
  );
}
