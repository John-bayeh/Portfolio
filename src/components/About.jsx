import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { ArrowUpRight } from "lucide-react";
import Marquee from "./Marquee";
import skills from "../data/skills";

const steps = [
  { n: "01", label: "SCOPE", desc: "Understand the problem & define the goal." },
  { n: "02", label: "DESIGN", desc: "Wireframe the flow and the interface." },
  { n: "03", label: "BUILD", desc: "Write clean, component-driven code." },
  { n: "04", label: "TEST", desc: "Verify behaviour across devices." },
  { n: "05", label: "SHIP", desc: "Deploy and iterate on feedback." },
];

function PhotoBlob() {
  const [errored, setErrored] = useState(false);
  return (
    <div className="relative mx-auto aspect-[4/5] w-[240px] sm:w-[280px]">
      <div className="absolute inset-0 -z-10 scale-110 rounded-[58%_42%_40%_60%/55%_45%_55%_45%] bg-gold/10 blur-2xl" />
      <div className="h-full w-full overflow-hidden rounded-[58%_42%_40%_60%/55%_45%_55%_45%] border border-line bg-card">
        {!errored ? (
          <img
            src="/yohannes.png"
            alt="Yohannes Bayeh"
            onError={() => setErrored(true)}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-card">
            <span className="font-display text-6xl font-semibold text-gold">
              YB
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <section id="about" className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold"
        >
          About Me
        </motion.p>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
          {/* Left column: bio + CTA + timeline */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Designing & building for the{" "}
              <span className="text-gold">web</span>.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
              I'm Yohannes Bayeh, a frontend developer from Addis Ababa,
              Ethiopia. I turn ideas into fast, accessible, and polished web
              experiences — pairing solid engineering with an eye for detail. I
              love shipping products that people actually enjoy using.
            </p>

            <Link to="contact" smooth duration={600} offset={-20}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold"
              >
                Let's work together <ArrowUpRight size={16} />
              </motion.button>
            </Link>

            {/* Process timeline */}
            <div className="mt-12">
              <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-muted">
                My Process
              </p>
              <ol className="relative border-l border-line">
                {steps.map((s) => (
                  <li key={s.n} className="mb-7 ml-6 last:mb-0">
                    <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border border-gold bg-bg" />
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-sm font-semibold text-gold">
                        {s.n}
                      </span>
                      <span className="font-display text-lg font-semibold text-white">
                        {s.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-white/50">{s.desc}</p>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>

          {/* Right column: photo blob + floating stat cards */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <PhotoBlob />

            <div className="absolute -left-2 top-10 rounded-xl border border-line bg-card/90 px-4 py-3 backdrop-blur-sm sm:left-2">
              <div className="font-display text-2xl font-semibold text-gold">
                2+
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/60">
                Years Experience
              </div>
            </div>

            <div className="absolute -right-2 bottom-10 rounded-xl border border-line bg-card/90 px-4 py-3 text-right backdrop-blur-sm sm:right-2">
              <div className="font-display text-2xl font-semibold text-gold">
                8
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/60">
                Projects Shipped
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skills infinite marquee */}
        <div className="mt-20 border-y border-line py-6">
          <Marquee
            items={skills}
            className="text-lg font-medium text-white/40"
          />
        </div>
      </div>
    </section>
  );
}
