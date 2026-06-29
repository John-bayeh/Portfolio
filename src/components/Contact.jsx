import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowUpRight, CheckCircle2, X as XClose } from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon, WhatsAppIcon } from "./BrandIcons";
import { useLanguage } from "../context/LanguageContext";

const EMAIL = "yohannesbayeh41@gmail.com";
const GITHUB = "https://github.com/John-bayeh";
const LINKEDIN = "https://www.linkedin.com/in/yohannes-bayeh-b5bb47328";
const X = "https://x.com/Yohannes_Bayeh";
const WHATSAPP = "https://wa.me/251963293185";

// Formspree endpoint — submissions are delivered to the form's notification email.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mrewbjgq";

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
          placeholder={`${label}...`}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          required
          placeholder={`${label}...`}
          className={base}
        />
      )}
    </label>
  );
}

export default function Contact() {
  const { t } = useLanguage();
  const c = t.contact;

  // "idle" | "sending" | "sent" | "error"
  const [status, setStatus] = useState("idle");

  const cards = [
    {
      label: "WhatsApp",
      value: "+251 96 329 3185",
      href: WHATSAPP,
      Icon: WhatsAppIcon,
      external: true,
    },
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
    {
      label: "X",
      value: "@Yohannes_Bayeh",
      href: X,
      Icon: XIcon,
      external: true,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");

    const data = new FormData(form);
    const senderName = (data.get("name") || "Someone").toString().trim();

    const payload = new FormData();
    payload.append("Name", senderName);
    payload.append("Email", data.get("email") || "");
    payload.append("Message", data.get("message") || "");
    payload.append(
      "Submitted",
      new Date().toLocaleString("en-GB", {
        dateStyle: "long",
        timeStyle: "short",
      })
    );
    payload.append("_subject", `New portfolio message from ${senderName}`);
    payload.append("_replyto", data.get("email") || "");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const buttonLabel = {
    idle: c.send,
    sending: c.sending,
    sent: c.sent,
    error: c.tryAgain,
  }[status];

  // Auto-dismiss the success toast after a few seconds.
  useEffect(() => {
    if (status !== "sent") return;
    const timer = setTimeout(() => setStatus("idle"), 4000);
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <section id="contact" className="px-6 pb-10 pt-24 sm:px-10">
      {/* Top-center success toast — auto-dismisses */}
      <AnimatePresence>
        {status === "sent" && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed left-1/2 top-6 z-[9999] flex -translate-x-1/2 items-center gap-3 rounded-full border border-green-500/30 bg-card/95 px-5 py-3 shadow-lg backdrop-blur-md"
            role="status"
          >
            <CheckCircle2 size={18} className="shrink-0 text-green-400" />
            <span className="text-sm text-white">{c.successToast}</span>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              aria-label="Dismiss"
              className="ml-1 text-muted transition-colors hover:text-white"
            >
              <XClose size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
          {c.available}
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl"
        >
          <span className="block">{c.heading1}</span>
          <span className="block text-gold">{c.heading2}</span>
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
            <Field label={c.fieldName} name="name" />
            <Field label={c.fieldEmail} name="email" type="email" />
            <Field label={c.fieldMessage} name="message" textarea />

            <motion.button
              type="submit"
              disabled={status === "sending"}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-bg disabled:opacity-60"
            >
              {buttonLabel} <ArrowUpRight size={16} />
            </motion.button>

            {/* Error fallback */}
            {status === "error" && (
              <p className="text-sm text-red-400">
                {c.errorMsg}{" "}
                <a href={`mailto:${EMAIL}`} className="underline">
                  {EMAIL}
                </a>
                .
              </p>
            )}
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
          {c.footer}{" "}
          <span className="text-white/70">{c.footerName}</span> · 2026
        </footer>
      </div>
    </section>
  );
}
