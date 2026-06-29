import { useState } from "react";
import { Link } from "react-scroll";
import { motion } from "framer-motion";
import { Home, FolderGit2, User, Mail } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Dock() {
  const [active, setActive] = useState("home");
  const [hovered, setHovered] = useState(null);
  const { t } = useLanguage();
  const nav = t.nav;

  // macOS-style dock items. `to` matches each section's id.
  const items = [
    { id: "home", label: nav.home, Icon: Home },
    { id: "projects", label: nav.projects, Icon: FolderGit2 },
    { id: "about", label: nav.about, Icon: User },
    { id: "contact", label: nav.contact, Icon: Mail },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 z-[9000] -translate-x-1/2">
      <div className="flex items-end gap-2 rounded-2xl border border-line bg-card/80 px-3 py-2 backdrop-blur-md">
        {items.map(({ id, label, Icon }) => {
          const isActive = active === id;
          const isHovered = hovered === id;
          return (
            <Link
              key={id}
              to={id}
              spy={true}
              smooth={true}
              duration={600}
              offset={-20}
              onSetActive={() => setActive(id)}
              onClick={() => setActive(id)}
              className="relative"
            >
              <motion.button
                type="button"
                aria-label={label}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                whileHover={{ scale: 1.25, y: -6 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                  isActive
                    ? "bg-gold/15 text-gold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Icon size={20} strokeWidth={1.8} />

                {/* Active indicator dot */}
                {isActive && (
                  <motion.span
                    layoutId="dock-active-dot"
                    className="absolute -bottom-1 h-1 w-1 rounded-full bg-gold"
                  />
                )}
              </motion.button>

              {/* Tooltip label above the icon on hover */}
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-line bg-bg px-2 py-1 text-xs text-white"
                >
                  {label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
