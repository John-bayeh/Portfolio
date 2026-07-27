/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

// ─── Translation dictionary (English only) ─────────────────────────────────────
export const translations = {
  en: {
    // Dock / nav labels
    nav: {
      home: "Home",
      projects: "Projects",
      about: "About",
      contact: "Contact",
    },
    // Hero
    hero: {
      available: "Available for work",
      tagline: "Frontend Developer · ETH · 2026",
      heading1: "I BUILD",
      heading2: "THINGS",
      heading3: "FOR THE WEB.",
      bio1: "a frontend developer based in Bahir Dar, Ethiopia — crafting fast, polished interfaces that feel as good as they look.",
      viewWork: "View Work",
      getInTouch: "Get In Touch",
      scroll: "Scroll",
      projectsShipped: "Projects Shipped",
    },
    // Projects
    projects: {
      sectionLabel: "Selected Work",
      heading1: "MY ",
      heading2: "WORK",
      subtitle: "Six shipped products.",
    },
    // About
    about: {
      sectionLabel: "About Me",
      heading: "Designing & building for the",
      headingAccent: "web",
      bio: "I'm Yohannes Bayeh, a frontend developer from Bahir Dar, Ethiopia. I turn ideas into fast, accessible, and polished web experiences — pairing solid engineering with an eye for detail. I love shipping products that people actually enjoy using.",
      cta: "Let's work together",
      processLabel: "My Process",
      yearsExp: "Years Experience",
      projectsShipped: "Projects Shipped",
      steps: [
        { n: "01", label: "SCOPE", desc: "Understand the problem & define the goal." },
        { n: "02", label: "DESIGN", desc: "Wireframe the flow and the interface." },
        { n: "03", label: "BUILD", desc: "Write clean, component-driven code." },
        { n: "04", label: "TEST", desc: "Verify behaviour across devices." },
        { n: "05", label: "SHIP", desc: "Deploy and iterate on feedback." },
      ],
    },
    // Contact
    contact: {
      available: "Currently available",
      heading1: "LET'S BUILD",
      heading2: "SOMETHING.",
      fieldName: "Name",
      fieldEmail: "Email",
      fieldMessage: "Message",
      send: "Send Message",
      sending: "Sending…",
      sent: "Message sent ✓",
      tryAgain: "Try again",
      successToast: "Message sent — I'll get back to you soon.",
      errorMsg: "Something went wrong. Please email me directly at",
      footer: "Designed & Built by",
      footerName: "Yohannes Bayeh",
    },
    tabs: {
      scope: "SCOPE",
      design: "DESIGN",
      build: "BUILD",
      test: "TEST",
      ship: "SHIP",
    },
    labels: {
      scopeReqs: "Scope Requirements",
      userStories: "User Stories",
      colorPalette: "Color Palette",
      uiComponents: "Modular UI Components",
      interfacePreview: "Interface Preview",
      archDiagram: "Architecture Diagram",
      implSnippet: "Implementation Snippet",
      techDecisions: "Key Technical Decisions",
      devicesTested: "Devices Tested",
      lighthouseMetrics: "Lighthouse Audit Metrics",
      deployEnv: "Deployment Environment",
      deployPipeline: "Deployment Pipeline Configuration",
      reqDoc: "Requirements Doc",
      fullCaseStudy: "View Full Case Study →",
      repository: "Repository",
      liveDemo: "Live Demo",
      backToProjects: "Back to Projects",
      projectNotFound: "Project Not Found",
      testScripts: "Embedded Test Scripts",
      expected: "Expected:",
      rootCause: "Root Cause & Resolution:",
      loadMetrics: "Load Test Metrics:",
      desktop: "Desktop",
      tablet: "Tablet",
      mobile: "Mobile",
      version: "Version:",
      date: "Date:",
      frontend: "Frontend",
      backend: "Backend",
      database: "Database",
      infraHost: "Infrastructure Host",
    },
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
