import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

const EMAIL = "yohannesbayeh41@gmail.com";
const GITHUB = "https://github.com/John-bayeh";
const LINKEDIN = "https://www.linkedin.com/in/yohannes-bayeh-b5bb47328";

const cards = [
  {
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    Icon: Mail,
    external: false,
  },
  {
    label: "GitHub",
    value: "John-bayeh",
    href: GITHUB,
    Icon: GithubIcon,
    external: true,
  },
  {
    label: "LinkedIn",
    value: "Yohannes Bayeh",
    href: LINKEDIN,
    Icon: LinkedinIcon,
    external: true,
  },
];

function Field({ label, type = "text", name, textarea = false }) {
  const base =
    "w-full border-b border-line bg-transparent py-3 text-white placeholder-muted outline-none transition-colors focus:border-gold";
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-widest text-muted">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          required
          placeholder={`Your ${label.toLowerCase()}...`}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          required
          placeholder={`Your ${label.toLowerCase()}...`}
          className={base}
        />
      )}
    </label>
  );
}

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = encodeURIComponent(data.get("name") || "");
    const message = encodeURIComponent(data.get("message") || "");
    const from = data.get("email") || "";
    // Open the user's mail client pre-filled.
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      `Portfolio enquiry from ${decodeURIComponent(name)}`
    )}&body=${message}%0A%0AReply to: ${from}`;
    setSent(true);
  };

  return (
    <section id="contact" className="px-6 pb-10 pt-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Available badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-1.5 text-xs text-white/70"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Currently available
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl"
        >
          <span className="block">LET'S BUILD</span>
          <span className="block text-gold">SOMETHING.</span>
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-2">
          {/* Contact form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Field label="Name" name="name" />
            <Field label="Email" name="email" type="email" />
            <Field label="Message" name="message" textarea />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-bg"
            >
              {sent ? "Opening mail…" : "Send Message"} <ArrowUpRight size={16} />
            </motion.button>
          </motion.form>

          {/* Contact cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            {cards.map(({ label, value, href, Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex items-center justify-between rounded-2xl border border-line bg-card p-5 transition-colors hover:border-gold/60"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-gold transition-colors group-hover:border-gold/60">
                    <Icon size={18} />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted">
                      {label}
                    </div>
                    <div className="text-sm text-white">{value}</div>
                  </div>
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-muted transition-colors group-hover:text-gold"
                />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-24 border-t border-line pt-8 text-center text-xs text-muted">
          Designed &amp; Built by{" "}
          <span className="text-white/70">Yohannes Bayeh</span> · 2026
        </footer>
      </div>
    </section>
  );
}
