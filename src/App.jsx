import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import { LanguageProvider } from "./context/LanguageContext";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Testimonials from "./components/Testimonials";
import About from "./components/About";
import Contact from "./components/Contact";
import CaseStudyPage from "./pages/CaseStudyPage";


// Theme palettes — applied as CSS custom properties on the root element
// so every component that reads var(--th-*) responds instantly.
const DARK = {
  "--th-bg":      "#080808",
  "--th-card":    "#111111",
  "--th-line":    "#222222",
  "--th-muted":   "#888888",
  "--th-text":    "#ffffff",
  "--th-text-60": "rgba(255,255,255,0.60)",
  "--th-text-40": "#888888",
  "--th-card-90": "rgba(17,17,17,0.90)",
  "--color-gold": "#C9A84C",
  "--photo-border": "2px solid #C9A84C",
  "--photo-shadow": "0 0 40px rgba(201, 168, 76, 0.25)",
  "--stat-bg": "#111111",
  "--stat-border": "1px solid #222222",
  "--stat-shadow": "none",
  "--stat-number": "#C9A84C",
  "--stat-label": "#888888",
  "--color-bg": "#080808",
  "--color-text": "#ffffff",
  "--color-things": "#C9A84C",
  "--color-role": "#C9A84C",
  "--color-subtext": "#888888",
  "--blob-opacity": "0.15",
  "--color-btn-primary-bg": "#C9A84C",
  "--color-btn-primary-text": "#080808",
  "--color-btn-secondary-border": "#ffffff",
  "--color-btn-secondary-text": "#ffffff",
  "--nav-bg": "rgba(8, 8, 8, 0.85)",
  "--nav-logo": "#C9A84C",
  "--nav-link": "#888888",
  "--nav-link-hover": "#ffffff",
  "--nav-dot": "#22C55E",
  "--nav-toggle-active": "#C9A84C",
  "--nav-toggle-inactive": "#555555",
  "--nav-icon": "#C9A84C",
};

const LIGHT = {
  "--th-bg":      "#F8F5F0",
  "--th-card":    "#ffffff",
  "--th-line":    "#E0DDD8",
  "--th-muted":   "#595959",
  "--th-text":    "#0A0A0A",
  "--th-text-60": "rgba(10,10,10,0.60)",
  "--th-text-40": "#595959",
  "--th-card-90": "rgba(255,255,255,0.90)",
  "--color-gold": "#B8860B",
  "--photo-border": "2px solid #B8860B",
  "--photo-shadow": "0 0 40px rgba(184, 134, 11, 0.20)",
  "--stat-bg": "#111111",
  "--stat-border": "1px solid #222222",
  "--stat-shadow": "0 8px 32px rgba(0,0,0,0.18)",
  "--stat-number": "#B8860B",
  "--stat-label": "#595959",
  "--color-bg": "#F8F5F0",
  "--color-text": "#0A0A0A",
  "--color-things": "#B8860B",
  "--color-role": "#B8860B",
  "--color-subtext": "#595959",
  "--blob-opacity": "0.05",
  "--color-btn-primary-bg": "#B8860B",
  "--color-btn-primary-text": "#ffffff",
  "--color-btn-secondary-border": "#0A0A0A",
  "--color-btn-secondary-text": "#0A0A0A",
  "--nav-bg": "rgba(248, 245, 240, 0.85)",
  "--nav-logo": "#B8860B",
  "--nav-link": "#595959",
  "--nav-link-hover": "#0A0A0A",
  "--nav-dot": "#16A34A",
  "--nav-toggle-active": "#B8860B",
  "--nav-toggle-inactive": "#888888",
  "--nav-icon": "#B8860B",
};

function HomePage({ isDark, onToggleTheme }) {
  return (
    <main>
      <Hero isDark={isDark} onToggleTheme={onToggleTheme} />
      <Projects />
      <Testimonials />
      <About />
      <Contact />
    </main>
  );
}

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("portfolio_theme");
    return saved ? saved === "dark" : true;
  });
  const theme = isDark ? DARK : LIGHT;

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("portfolio_theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <LazyMotion features={domAnimation}>
      <BrowserRouter>
        <LanguageProvider>
          <div
            style={{
              ...theme,
              backgroundColor: theme["--th-bg"],
              color: theme["--th-text"],
              transition: "background-color 0.35s ease, color 0.35s ease",
            }}
            className="min-h-screen"
          >
            <CustomCursor />
            <ScrollProgress />
            <Navbar isDark={isDark} onToggleTheme={toggleTheme} />

            <Routes>
              <Route path="/" element={<HomePage isDark={isDark} onToggleTheme={toggleTheme} />} />
              <Route path="/projects/:id" element={<CaseStudyPage />} />
            </Routes>
          </div>
        </LanguageProvider>
      </BrowserRouter>
    </LazyMotion>
  );
}

export default App;
