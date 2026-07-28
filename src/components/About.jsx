import { useState } from "react";
import { m } from "framer-motion";
import { Link } from "react-scroll";
import { ArrowUpRight } from "lucide-react";
import Marquee from "./Marquee";
import skills from "../data/skills";
import { useLanguage } from "../context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

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
  const [activeCert, setActiveCert] = useState(null);

  return (
    <section id="about" className="px-6 py-24 sm:px-10">
      {/* Certificate Lightbox Modal */}
      {activeCert && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveCert(null)}
        >
          <button
            className="fixed top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white text-lg transition-colors z-[10000]"
            onClick={() => setActiveCert(null)}
            aria-label="Close Certificate Preview"
          >
            ✕
          </button>
          <div
            className="relative max-w-3xl w-full flex flex-col items-center gap-3 my-auto p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeCert.image}
              alt={activeCert.title}
              className="max-w-full max-h-[85vh] rounded-xl shadow-2xl border border-white/20 object-contain"
            />
            <span className="text-xs font-mono font-semibold text-gold bg-black/80 px-3 py-1 rounded-md border border-gold/30">
              {activeCert.title}
            </span>
          </div>
        </div>
      )}

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
          {/* Left column: bio + CTA + timeline */}
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

            {/* Work Experience */}
            {a.experiences && (
              <div className="mt-12">
                <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-muted">
                  {a.experienceLabel || "Work Experience"}
                </p>
                <div className="space-y-6">
                  {a.experiences.map((exp, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl border p-4 sm:p-5 transition-colors"
                      style={{
                        backgroundColor: 'var(--th-card)',
                        borderColor: 'var(--th-line)',
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <h3 className="font-display text-base font-bold" style={{ color: 'var(--th-text)' }}>
                          {exp.role}
                        </h3>
                        <span className="text-[11px] font-mono font-medium text-gold bg-gold/10 px-2.5 py-0.5 rounded-md border border-gold/20">
                          {exp.period}
                        </span>
                      </div>
                      <div className="text-xs font-semibold mb-2" style={{ color: 'var(--th-text-60)' }}>
                        {exp.url ? (
                          <a
                            href={exp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-gold hover:underline"
                          >
                            {exp.company} <ArrowUpRight size={13} />
                          </a>
                        ) : (
                          <span>{exp.company}</span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--th-text-40)' }}>
                        {exp.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Process timeline */}
            <div className="mt-12">
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

          {/* Right column: photo blob + floating stat cards + certifications */}
          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex flex-col items-center lg:items-end justify-start gap-10"
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

            {/* Certifications Block */}
            {a.certifications && (
              <div className="w-full max-w-[360px] mt-4">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-muted text-left lg:text-right">
                  {a.certificationsLabel || "Certifications"}
                </p>
                <div className="space-y-3">
                  {a.certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      onClick={() => cert.image && setActiveCert(cert)}
                      className={`rounded-xl border p-4 transition-all flex items-center justify-between gap-3 ${
                        cert.image ? 'cursor-pointer hover:border-gold/60 group hover:-translate-y-0.5' : ''
                      }`}
                      style={{
                        backgroundColor: 'var(--th-card)',
                        borderColor: 'var(--th-line)',
                      }}
                    >
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-xs font-bold transition-colors group-hover:text-gold" style={{ color: 'var(--th-text)' }}>
                          {cert.title}
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--th-text-40)' }}>
                          {cert.issuer}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-semibold px-2.5 py-1 rounded border border-gold/30 text-gold bg-gold/10 group-hover:bg-gold group-hover:text-black transition-all shrink-0 flex items-center gap-1">
                        📜 {cert.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
