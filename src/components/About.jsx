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
