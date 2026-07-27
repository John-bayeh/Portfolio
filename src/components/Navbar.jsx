import { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { m, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar({ isDark, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();
  const nav = t.nav;

  // Track scroll position to change background styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: nav.home },
    { id: "projects", label: nav.projects },
    { id: "about", label: nav.about },
    { id: "contact", label: nav.contact },
  ];

  return (
    <>
      <m.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-[9500] transition-all duration-350 ${
          scrolled
            ? "border-b border-[var(--th-line)] bg-[var(--nav-bg)] shadow-md py-3"
            : "bg-transparent py-5"
        }`}
        style={{
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-10">
          {/* Logo */}
          <Link
            to="home"
            href="#home"
            spy={true}
            smooth={true}
            duration={600}
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <span
              style={{ color: "var(--nav-logo, #C9A84C)" }}
              className="font-display text-2xl font-bold tracking-tight transition-colors duration-200"
            >
              YB
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(({ id, label }) => (
              <Link
                key={id}
                to={id}
                href={`#${id}`}
                spy={true}
                smooth={true}
                duration={600}
                offset={-70}
                activeClass="text-[var(--nav-logo)] font-medium"
                className="cursor-pointer text-sm text-[var(--th-text-60)] transition-colors hover:text-[var(--th-text)]"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Controls (Theme + Hamburger) */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="rounded-full p-1.5 sm:p-2 border border-[var(--th-line)] bg-[var(--th-card)]/50 hover:bg-[var(--th-card)] transition-colors"
            >
              {isDark ? (
                <Sun size={14} color="var(--nav-icon, #C9A84C)" strokeWidth={2} />
              ) : (
                <Moon size={14} color="var(--nav-icon, #B8860B)" strokeWidth={2} />
              )}
            </button>

            {/* Hamburger Button for mobile */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-[var(--th-text)] transition-opacity hover:opacity-75 focus:outline-none md:hidden ml-1"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </m.header>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-[58px] left-0 right-0 z-[9400] overflow-hidden border-b border-[var(--th-line)] bg-[var(--nav-bg)] shadow-xl md:hidden"
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <div className="flex flex-col gap-5 px-6 py-6 font-display text-lg">
              {navItems.map(({ id, label }) => (
                <Link
                  key={id}
                  to={id}
                  href={`#${id}`}
                  spy={true}
                  smooth={true}
                  duration={600}
                  offset={-60}
                  onClick={() => setIsOpen(false)}
                  activeClass="text-[var(--nav-logo)] font-bold pl-2 border-l-2 border-[var(--nav-logo)]"
                  className="cursor-pointer py-1 text-[var(--th-text-60)] transition-all hover:text-[var(--th-text)]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
