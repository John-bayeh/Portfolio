import { m } from "framer-motion";
import { Quote } from "lucide-react";
import testimonials from "../data/testimonials";

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

export default function Testimonials() {
  return (
    <section id="testimonials" className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center sm:text-left"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            RECOMMENDATIONS & FEEDBACK
          </p>
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            WHAT PEOPLE <span className="text-gold">SAY</span>.
          </h2>
        </m.div>

        {/* 3 Testimonial Cards Grid */}
        <m.div
          variants={containerStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {testimonials.map((item) => (
            <m.div
              key={item.id}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="group relative flex flex-col justify-between rounded-2xl border p-6 sm:p-7 transition-all duration-300 shadow-sm hover:shadow-md hover:border-gold/50 select-none"
              style={{
                backgroundColor: "var(--th-card)",
                borderColor: "var(--th-line)",
              }}
            >
              <div>
                {/* Top row: Quote Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors duration-300">
                    <Quote size={18} />
                  </div>
                </div>

                {/* Quote text */}
                <p
                  className="text-xs sm:text-sm leading-relaxed italic"
                  style={{ color: "var(--th-text-60)" }}
                >
                  "{item.quote}"
                </p>
              </div>

              {/* Author footer */}
              <div className="mt-8 pt-4 border-t flex items-center gap-3.5" style={{ borderColor: "var(--th-line)" }}>
                {/* Avatar with Initials */}
                <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center font-display font-bold text-xs text-gold shrink-0">
                  {item.initials}
                </div>
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="font-display text-sm font-bold truncate" style={{ color: "var(--th-text)" }}>
                    {item.name}
                  </span>
                  <span className="text-[11px] font-medium leading-snug line-clamp-2 text-gold">
                    {item.role}
                  </span>
                  <span className="text-[10px] font-mono mt-0.5 truncate" style={{ color: "var(--th-text-40)" }}>
                    {item.company}
                  </span>
                </div>
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
