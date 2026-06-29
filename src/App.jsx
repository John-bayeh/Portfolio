import { useState } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import Dock from "./components/Dock";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";

// Theme palettes — applied as CSS custom properties on the root element
// so every component that reads var(--th-*) responds instantly.
const DARK = {
  "--th-bg":      "#080808",
  "--th-card":    "#111111",
  "--th-line":    "#222222",
  "--th-muted":   "#555555",
  "--th-text":    "#ffffff",
  "--th-text-60": "rgba(255,255,255,0.60)",
  "--th-text-40": "rgba(255,255,255,0.40)",
  "--th-card-90": "rgba(17,17,17,0.90)",
  "--photo-border": "2px solid #C9A84C",
  "--photo-shadow": "0 0 40px rgba(201, 168, 76, 0.25)",
  "--stat-bg": "#111111",
  "--stat-border": "1px solid #222222",
  "--stat-shadow": "none",
  "--stat-number": "#C9A84C",
  "--stat-label": "#555555",
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
  "--th-muted":   "#888888",
  "--th-text":    "#0A0A0A",
  "--th-text-60": "rgba(10,10,10,0.60)",
  "--th-text-40": "rgba(10,10,10,0.40)",
  "--th-card-90": "rgba(255,255,255,0.90)",
  "--photo-border": "2px solid #B8860B",
  "--photo-shadow": "0 0 40px rgba(184, 134, 11, 0.2)",
  "--stat-bg": "#ffffff",
  "--stat-border": "1px solid #E0DDD8",
  "--stat-shadow": "0 4px 20px rgba(0,0,0,0.08)",
  "--stat-number": "#B8860B",
  "--stat-label": "#888888",
  "--color-bg": "#F8F5F0",
  "--color-text": "#0A0A0A",
  "--color-things": "#B8860B",
  "--color-role": "#B8860B",
  "--color-subtext": "#666666",
  "--blob-opacity": "0.05",
  "--color-btn-primary-bg": "#B8860B",
  "--color-btn-primary-text": "#ffffff",
  "--color-btn-secondary-border": "#0A0A0A",
  "--color-btn-secondary-text": "#0A0A0A",
  "--nav-bg": "rgba(248, 245, 240, 0.85)",
  "--nav-logo": "#B8860B",
  "--nav-link": "#666666",
  "--nav-link-hover": "#0A0A0A",
  "--nav-dot": "#16A34A",
  "--nav-toggle-active": "#B8860B",
  "--nav-toggle-inactive": "#888888",
  "--nav-icon": "#B8860B",
};

function App() {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? DARK : LIGHT;

  return (
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
        <Dock />

        <Hero isDark={isDark} onToggleTheme={() => setIsDark((v) => !v)} />

        <Projects />

        <About />

        <Contact />
      </div>
    </LanguageProvider>
  );
}

export default App;
