import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { m, AnimatePresence } from "framer-motion";
import { ArrowLeft, Github, ExternalLink, X, ChevronLeft, ChevronRight, FileText, Printer } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import projects from "../data/projects";
import extraProjectDetails from "../data/extraProjectDetails";
import { ARCH_ICONS_MAP } from "../assets/icons/ArchIcons";
import TestSection from "../components/TestSection";
import { useLanguage } from "../context/LanguageContext";
import SEOHead from "../components/SEOHead";

function ArchIcon({ iconKey, size = 22 }) {
  const Component = ARCH_ICONS_MAP[iconKey];
  if (!Component) return null;
  return <Component width={size} height={size} style={{ display: "block", flexShrink: 0 }} />;
}

// Custom simple syntax highlighter
function highlightCode(code) {
  if (!code) return "";
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Highlight comments
  escaped = escaped.replace(/(\/\/.*)/g, '<span class="text-green-500 font-normal">$1</span>');
  
  // Highlight strings
  escaped = escaped.replace(/(['"`].*?['"`])/g, '<span class="text-[#E6D080]">$1</span>');
  
  // Highlight keywords
  escaped = escaped.replace(
    /\b(const|let|var|function|return|if|else|async|await|new|import|export|from|class|extends|try|catch|throw|for|while|switch|case|default|break|continue|of|in|def|yield)\b/g,
    '<span class="text-[#7AA2F7]">$1</span>'
  );
  
  // Highlight primitives
  escaped = escaped.replace(
    /\b(true|false|null|undefined|None|True|False)\b/g,
    '<span class="text-[#FF9E64]">$1</span>'
  );
  
  return escaped;
}

function CaseStudyImage({ src, alt }) {
  const [error, setError] = useState(false);
  const filename = src.split("/").pop();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center bg-[#141414] border border-[#222222] rounded-lg aspect-video p-4 text-center">
        <span className="text-[10px] text-gold uppercase tracking-wider mb-2 font-mono">Image Not Found</span>
        <span className="text-[11px] text-[#555555] font-mono break-all">{filename}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={400}
      height={225}
      loading="lazy"
      onError={() => setError(true)}
      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
    />
  );
}

function DesignScreenshotGallery({ project, setLightboxSrc, getPortalLabel }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showAllModal, setShowAllModal] = useState(false);

  const rawScreenshots = project.screenshots?.design
    ? project.screenshots.design.map((src) => ({
        src,
        type: src.includes("mobile") || src.includes("photo") ? "mobile" : "desktop",
        caption: getPortalLabel(src),
      }))
    : project.screenshots || [];

  if (!rawScreenshots || rawScreenshots.length === 0) {
    return (
      <div className="border border-[#222222] rounded-xl overflow-hidden bg-[#0d0d0d] flex items-center justify-center p-8 text-center text-xs text-[#555555] aspect-video">
        No preview screenshots configured for this design.
      </div>
    );
  }

  return (
    <div>
      {/* Mobile: Swiper Carousel (< md) */}
      <div className="block md:hidden">
        <div className="relative rounded-xl overflow-hidden border border-[#222222] bg-[#0a0a0a] shadow-md">
          {/* Counter top right */}
          <span className="absolute top-2.5 right-2.5 z-20 text-[9px] font-mono font-bold text-white bg-black/75 px-2.5 py-0.5 rounded-full border border-white/10">
            {activeSlide + 1} / {rawScreenshots.length}
          </span>

          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            spaceBetween={12}
            onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
            className="w-full"
          >
            {rawScreenshots.map((item, idx) => {
              const src = typeof item === "string" ? item : item.src;
              const isMobile =
                typeof item === "string"
                  ? src.includes("mobile") || src.includes("photo")
                  : item.type === "mobile";
              const caption =
                typeof item === "string" ? getPortalLabel(src) : item.caption || getPortalLabel(src);

              return (
                <SwiperSlide key={idx}>
                  <div
                    onClick={() => setLightboxSrc(src)}
                    className="cursor-pointer flex flex-col h-full"
                  >
                    <div
                      className={`overflow-hidden bg-[#080808] flex items-center justify-center ${
                        isMobile ? "aspect-[3/4.5]" : "aspect-video"
                      }`}
                    >
                      <CaseStudyImage
                        src={src}
                        alt={`${project.name} design screenshot ${idx + 1}`}
                      />
                    </div>
                    <div className="p-2.5 bg-[#0a0a0a] border-t border-[#222222]/60">
                      <span className="text-[10px] tracking-wider text-muted font-semibold uppercase text-[#aaaaaa]">
                        {caption}
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Dots Indicator */}
          {rawScreenshots.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 py-2 bg-[#0a0a0a] border-t border-[#222222]/40">
              {rawScreenshots.map((_, idx) => (
                <span
                  key={idx}
                  className={`rounded-full transition-all duration-200 ${
                    idx === activeSlide
                      ? "w-4 h-1.5 bg-gold"
                      : "w-1.5 h-1.5 bg-[#444444]"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Screenshots Button */}
        {rawScreenshots.length > 1 && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => setShowAllModal(true)}
              className="inline-flex items-center gap-1.5 border border-gold/40 text-gold hover:bg-gold/10 px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-colors"
            >
              View all {rawScreenshots.length} screenshots →
            </button>
          </div>
        )}
      </div>

      {/* Desktop: Grid (md+) */}
      <div className="hidden md:grid grid-cols-2 gap-4">
        {rawScreenshots.map((item, idx) => {
          const src = typeof item === "string" ? item : item.src;
          const isMobile =
            typeof item === "string"
              ? src.includes("mobile") || src.includes("photo")
              : item.type === "mobile";
          const caption =
            typeof item === "string" ? getPortalLabel(src) : item.caption || getPortalLabel(src);

          return (
            <div key={idx} className="group flex flex-col gap-1.5">
              <div
                onClick={() => setLightboxSrc(src)}
                className={`relative border border-[#222222] rounded-xl overflow-hidden bg-[#0a0a0a] cursor-zoom-in group-hover:border-gold/40 transition-all duration-300 shadow-md ${
                  isMobile ? "aspect-[3/4.5]" : "aspect-video"
                }`}
              >
                <CaseStudyImage
                  src={src}
                  alt={`${project.name} design screenshot ${idx + 1}`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-[10px] font-semibold bg-black/75 px-3 py-1 rounded-full border border-white/5">
                    Expand View
                  </span>
                </div>
              </div>
              <span className="text-[10px] tracking-wider text-muted font-semibold uppercase text-[#555555]">
                {caption}
              </span>
            </div>
          );
        })}
      </div>

      {/* Fullscreen All Screenshots Modal — Horizontal Alignment */}
      {showAllModal && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col p-4 sm:p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
              {project.name} — All Screenshots ({rawScreenshots.length})
            </span>
            <button
              type="button"
              onClick={() => setShowAllModal(false)}
              className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          {/* Horizontal scroll track */}
          <div className="flex-1 overflow-x-auto flex items-center gap-4 py-4 snap-x no-scrollbar">
            {rawScreenshots.map((item, idx) => {
              const src = typeof item === "string" ? item : item.src;
              const caption =
                typeof item === "string" ? getPortalLabel(src) : item.caption || getPortalLabel(src);

              return (
                <div
                  key={idx}
                  className="shrink-0 w-[85vw] max-w-2xl bg-[#111] border border-white/10 rounded-xl overflow-hidden p-3 snap-center"
                >
                  <img
                    src={src}
                    alt={caption}
                    className="w-full h-auto max-h-[65vh] object-contain mx-auto rounded-lg"
                  />
                  <p className="text-xs font-bold text-white text-center mt-2.5">{caption}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function LighthouseCircle({ label, score }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = "#EF4444";
  if (score >= 90) strokeColor = "#22C55E";
  else if (score >= 50) strokeColor = "#EAB308";

  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[75px]">
      <div className="relative flex items-center justify-center w-14 h-14">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="28" cy="28" r={radius} className="stroke-[#222222] fill-none" strokeWidth="4" />
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-xs font-bold font-mono" style={{ color: strokeColor }}>
          {score}
        </span>
      </div>
      <span className="text-[9px] tracking-wider text-[#888888] font-mono uppercase text-center">
        {label}
      </span>
    </div>
  );
}

function TabContentSwiper({ slides }) {
  const [activeSlide, setActiveSlide] = useState(0);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative rounded-2xl border border-[#222222]/80 bg-[#0d0d0d] p-4 sm:p-6 shadow-xl text-left select-text overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#222222]/80 gap-3">
        {/* Slide Label */}
        <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
          {slides[activeSlide]?.label}
        </span>

        {/* Counter & Nav Arrows */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-[9px] font-mono font-bold text-[#888888] bg-[#141414] px-2.5 py-0.5 rounded-full border border-[#222222]">
            {activeSlide + 1} / {slides.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={activeSlide === 0}
              onClick={() => setActiveSlide((c) => Math.max(0, c - 1))}
              className="p-1 rounded-md border border-[#222222] bg-[#141414] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-gold hover:text-gold transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              disabled={activeSlide === slides.length - 1}
              onClick={() => setActiveSlide((c) => Math.min(slides.length - 1, c + 1))}
              className="p-1 rounded-md border border-[#222222] bg-[#141414] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-gold hover:text-gold transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Swiper Content */}
      <Swiper
        modules={[Pagination]}
        slidesPerView={1}
        spaceBetween={16}
        onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
        className="w-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="w-full">
            <div className="w-full min-h-[200px]">
              {slide.content}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom Dots Indicator */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 pt-3 mt-4 border-t border-[#222222]/60">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === activeSlide
                  ? "w-5 h-1.5 bg-gold shadow-sm shadow-gold/30"
                  : "w-1.5 h-1.5 bg-[#333333] hover:bg-[#666666]"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CaseStudyPage() {
  const { id } = useParams();
  const { t: langT } = useLanguage();
  const lbl = langT.labels || {};
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [activeSection, setActiveSection] = useState("scope");

  const projectIndex = projects.findIndex((p) => p.slug === id);
  const project = projects[projectIndex];

  // Section refs for scroll tracking
  const scopeRef = useRef(null);
  const designRef = useRef(null);
  const buildRef = useRef(null);
  const testRef = useRef(null);
  const shipRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!lightboxSrc) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setLightboxSrc(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxSrc]);

  useEffect(() => {
    const sections = [
      { id: "scope", ref: scopeRef },
      { id: "design", ref: designRef },
      { id: "build", ref: buildRef },
      { id: "test", ref: testRef },
      { id: "ship", ref: shipRef }
    ];

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((sec) => {
      if (sec.ref.current) observer.observe(sec.ref.current);
    });

    return () => {
      sections.forEach((sec) => {
        if (sec.ref.current) observer.unobserve(sec.ref.current);
      });
    };
  }, [project]);

  const getPortalLabel = (src) => {
    const filename = src.toLowerCase();
    if (filename.includes("admin")) return "ADMIN PORTAL";
    if (filename.includes("employee") || filename.includes("leave") || filename.includes("payslip")) return "EMPLOYEE PORTAL";
    if (filename.includes("career") || filename.includes("carrer") || filename.includes("jobs")) return "CAREERS PORTAL";
    if (filename.includes("mobile") || filename.includes("photo")) return "MOBILE APPLICATION";
    return "USER PORTAL";
  };

  const sectionsList = [
    { id: "scope", num: "01", name: "SCOPE" },
    { id: "design", num: "02", name: "DESIGN" },
    { id: "build", num: "03", name: "BUILD" },
    { id: "test", num: "04", name: "TEST" },
    { id: "ship", num: "05", name: "SHIP" }
  ];

  const handleSidebarClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--th-bg)]" style={{ color: 'var(--th-text)' }}>
        <h2 className="font-display text-2xl font-bold mb-4">{lbl.projectNotFound || "Project Not Found"}</h2>
        <Link to="/#projects" className="text-gold hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> {lbl.backToProjects || "Back to Projects"}
        </Link>
      </div>
    );
  }

  const seoTitle = project ? `${project.name} — Case Study | Yohannes Bayeh` : "Case Study | Yohannes Bayeh";
  const seoDesc = project ? (project.subtitle || project.description || `Explore the interactive case study for ${project.name} built by Yohannes Bayeh.`) : "Interactive project case study by Yohannes Bayeh.";
  const seoImage = project?.image ? (project.image.startsWith("http") ? project.image : `https://yohannes-bayeh.vercel.app${project.image}`) : undefined;
  const seoUrl = `https://yohannes-bayeh.vercel.app/projects/${id}`;

  return (
    <main className="min-h-screen bg-[var(--th-bg)] selection:bg-gold/30 selection:text-gold pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden" style={{ color: 'var(--th-text)' }}>
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        image={seoImage}
        url={seoUrl}
      />
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-muted hover:text-gold uppercase transition-colors"
        >
          <ArrowLeft size={14} /> {lbl.backToProjects || "Back to Projects"}
        </Link>
      </div>

      {/* Hero Header */}
      <header className="max-w-6xl mx-auto mb-12">
        <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs font-semibold text-gold">{project.number}</span>
              <span className="text-xs font-semibold text-muted">{project.year}</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
              {project.name}
            </h1>
            <p className="text-base sm:text-lg text-muted max-w-2xl font-light">
              {project.tagline || project.description}
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 max-w-full">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 shrink-0 bg-[var(--th-card)] border border-line hover:border-gold/40 hover:text-gold px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer"
            >
              <Printer size={14} /> Print
            </button>
            {project.requirementsDoc && (
              <a
                href={project.requirementsDoc}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 shrink-0 border border-gold/70 text-gold hover:bg-gold hover:text-[#080808] bg-gold/10 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 shadow-sm"
              >
                <FileText size={14} /> {lbl.reqDoc || "Requirements Doc"}
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 shrink-0 bg-[var(--th-card)] border border-line hover:border-gold/40 hover:text-gold px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300"
              >
                <Github size={14} /> {lbl.repository || "Repository"}
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 shrink-0 bg-gold hover:bg-gold/90 text-[#080808] px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 shadow-lg shadow-gold/15"
              >
                <ExternalLink size={14} /> {lbl.liveDemo || "Live Demo"}
              </a>
            )}
          </div>
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tech.map((t) => (
            <span
              key={t}
              className="bg-[#111111] border border-[#222222] text-[#888888] text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Main Hero Banner */}
        <div className="relative border border-[#222222] rounded-2xl overflow-hidden aspect-[21/9] bg-[#0d0d0d] shadow-xl">
          <CaseStudyImage src={project.screenshots?.thumbnail || project.screenshot} alt={project.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </header>

      {/* Mobile Section Tab Bar (below header, lg hidden) */}
      <div className="lg:hidden max-w-6xl mx-auto mb-6">
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
          <div className="flex gap-1 w-max">
            {sectionsList.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleSidebarClick(sec.id)}
                className={`flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-200 border ${
                  activeSection === sec.id
                    ? "bg-gold/10 border-gold/40 text-gold"
                    : "bg-[#111111] border-[#222222] text-[#888888] hover:border-gold/20 hover:text-[#aaaaaa]"
                }`}
              >
                <span className="text-[8px] opacity-60">{sec.num}</span>
                {sec.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-12 relative items-start">
        {/* Sticky Left Navigation (Desktop only) */}
        <aside className="hidden lg:block sticky top-32 space-y-6">
          <div className="border-l border-[#222222] pl-4 py-1 space-y-4">
            {sectionsList.map((sec) => (
              <button
                key={sec.id}
                onClick={() => handleSidebarClick(sec.id)}
                className={`flex flex-col items-start gap-0.5 text-left transition-all duration-300 ${
                  activeSection === sec.id ? "text-gold translate-x-1" : "text-[#555555] hover:text-[#aaaaaa]"
                }`}
              >
                <span className="font-mono text-[10px] tracking-widest">{sec.num}</span>
                <span className="text-xs font-bold tracking-wider">{sec.name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Sections Content */}
        <div className="space-y-16">
          {/* 01 SCOPE SECTION */}
          <section
            id="scope"
            ref={scopeRef}
            className="scroll-mt-28 bg-[#111111] border border-[#222222]/80 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 border-b border-[#222222]/60 pb-4 mb-6">
              <span className="font-mono text-xs text-gold">01</span>
              <h2 className="font-display text-lg font-bold tracking-wider uppercase">Scope &amp; Goals</h2>
            </div>
            
            <p className="text-sm text-[#aaaaaa] leading-relaxed mb-6">
              {project.stages.scope.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-gold uppercase mb-3 font-mono">Project Requirements</h3>
                <ul className="space-y-2">
                  {project.stages.scope.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#888888] leading-relaxed">
                      <span className="text-gold mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {extra.userStories && extra.userStories.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold tracking-wider text-gold uppercase mb-3 font-mono">User Stories</h3>
                  <ul className="space-y-2">
                    {extra.userStories.map((story, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#888888] leading-relaxed">
                        <span className="text-gold mt-1">”</span>
                        <span className="italic">{story}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* 02 DESIGN SECTION — Clean Grid */}
          <section
            id="design"
            ref={designRef}
            className="scroll-mt-28 bg-[#111111] border border-[#222222]/80 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 border-b border-[#222222]/60 pb-4 mb-6">
              <span className="font-mono text-xs text-gold">02</span>
              <h2 className="font-display text-lg font-bold tracking-wider uppercase">Visual &amp; System Design</h2>
            </div>

            <p className="text-sm text-[#aaaaaa] leading-relaxed mb-6">
              {project.stages.design.summary}
            </p>

            {/* Screenshots Section (Clean 2x2 Grid) */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold tracking-wider text-gold uppercase mb-4 font-mono">System Interfaces</h3>
              <DesignScreenshotGallery
                project={project}
                setLightboxSrc={setLightboxSrc}
                getPortalLabel={getPortalLabel}
              />
            </div>

            {/* Colors and Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#222222]/40">
              {extra.design?.colors && extra.design.colors.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold tracking-wider text-gold uppercase mb-3 font-mono">Color Palette</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {extra.design.colors.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#151515] border border-[#222222] rounded-lg p-2 pr-3.5 flex-1 min-w-[120px]">
                        <div className="w-6 h-6 rounded border border-white/5 shrink-0" style={{ backgroundColor: color.hex }} />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-semibold text-white leading-none">{color.name}</span>
                          <span className="text-[8px] font-mono text-[#555555]">{color.hex}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {extra.design?.components && extra.design.components.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold tracking-wider text-gold uppercase mb-3 font-mono">Modular Components</h3>
                  <div className="flex flex-wrap gap-2">
                    {extra.design.components.map((comp, idx) => (
                      <span
                        key={idx}
                        className="bg-[#151515] border border-[#222222]/60 text-[#888888] text-[9px] font-mono px-2.5 py-1 rounded"
                      >
                        &lt;{comp} /&gt;
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 03 BUILD SECTION */}
          <section
            id="build"
            ref={buildRef}
            className="scroll-mt-28 bg-[#111111] border border-[#222222]/80 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 border-b border-[#222222]/60 pb-4 mb-6">
              <span className="font-mono text-xs text-gold">03</span>
              <h2 className="font-display text-lg font-bold tracking-wider uppercase">Architecture &amp; Build</h2>
            </div>

            <p className="text-sm text-[#aaaaaa] leading-relaxed mb-6">
              {project.stages.build.summary}
            </p>

            <TabContentSwiper
              slides={[
                ...(extra.build?.architectureDiagram
                  ? [
                      {
                        label: "🏗️ ARCHITECTURE",
                        content: (
                          <div>
                            <h4 className="text-xs font-semibold tracking-wider text-gold uppercase font-mono mb-4">Architecture Diagram</h4>
                            <div className="bg-[#0a0a0a] border border-[#222222]/80 rounded-xl p-6 flex flex-col items-center gap-0 overflow-x-auto">
                              {extra.build.architectureDiagram.map((node, idx, arr) => (
                                <div key={idx} className="flex flex-col items-center w-full max-w-sm">
                                  <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border w-full justify-center ${
                                    node.primary ? "bg-gold/10 border-gold/40 text-gold" : "bg-[#141414] border-[#222222]/60 text-white"
                                  }`}>
                                    {node.iconKey && <ArchIcon iconKey={node.iconKey} size={22} />}
                                    <div className="text-center">
                                      <div className={`font-mono font-bold text-xs ${node.primary ? "text-gold" : "text-white"}`}>
                                        {node.label}
                                      </div>
                                      {node.sub && <div className="text-[9px] text-[#555555] mt-0.5 font-mono">{node.sub}</div>}
                                    </div>
                                  </div>
                                  {idx < arr.length - 1 && !arr[idx + 1]?.services && (
                                    <div className="flex flex-col items-center my-1">
                                      <div className="w-px h-4 bg-[#333333]" />
                                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M4 6L0 0H8L4 6Z" fill="#444444" /></svg>
                                    </div>
                                  )}
                                  {node.services && (
                                    <div className="flex flex-col items-center w-full">
                                      <div className="flex flex-col items-center my-1">
                                        <div className="w-px h-4 bg-[#333333]" />
                                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M4 6L0 0H8L4 6Z" fill="#444444" /></svg>
                                      </div>
                                      <div className="flex flex-wrap justify-center gap-2 w-full">
                                        {node.services.map((svc, si) => (
                                          <div key={si} className="flex items-center gap-1.5 bg-[#141414] border border-[#222222]/60 rounded-lg px-3 py-2 min-w-[120px] flex-1">
                                            {svc.iconKey && <ArchIcon iconKey={svc.iconKey} size={18} />}
                                            <div>
                                              <div className="text-[10px] font-mono font-semibold text-white">{svc.label}</div>
                                              <div className="text-[8px] text-[#555555] font-mono">{svc.sub}</div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ),
                      },
                    ]
                  : []),
                ...(project.codeSnippet || project.stages.build?.snippet
                  ? [
                      {
                        label: "💻 CODE SNIPPET",
                        content: (
                          <div className="space-y-3">
                            <h4 className="text-xs font-semibold tracking-wider text-gold uppercase font-mono">
                              {project.codeSnippet ? project.codeSnippet.title : "Implementation Snippet"}
                            </h4>
                            <div className="rounded-xl border border-[#222222]/80 overflow-hidden shadow-inner">
                              <div className="flex items-center justify-between bg-[#141414] border-b border-[#222222] px-4 py-2.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                                  <span className="ml-3 text-[9px] font-mono text-[#888888]">
                                    {project.codeSnippet?.language || "javascript"}
                                  </span>
                                </div>
                                <span className="text-[8px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                                  {project.codeSnippet?.language || "js"}
                                </span>
                              </div>
                              <pre className="overflow-x-auto border-l-4 border-gold bg-[#0a0a0a] p-4 font-mono text-[10px] leading-relaxed select-text max-h-[300px] code-scrollbar">
                                <code dangerouslySetInnerHTML={{ __html: highlightCode(project.codeSnippet ? project.codeSnippet.code : project.stages.build.snippet) }} />
                              </pre>
                            </div>
                          </div>
                        ),
                      },
                    ]
                  : []),
                ...(extra.build?.techDecisions && extra.build.techDecisions.length > 0
                  ? [
                      {
                        label: "⚡ TECH DECISIONS",
                        content: (
                          <div className="space-y-3">
                            <h4 className="text-xs font-semibold tracking-wider text-gold uppercase font-mono mb-3">Key Technical Decisions</h4>
                            <div className="space-y-2">
                              {extra.build.techDecisions.map((decision, idx) => (
                                <div key={idx} className="flex items-start gap-3 bg-[#141414] border border-[#222222] rounded-xl px-4 py-3">
                                  <div className="w-5 h-5 rounded-md bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-gold text-[9px] font-bold font-mono">{String(idx + 1).padStart(2, "0")}</span>
                                  </div>
                                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                    <span className="text-xs font-bold text-white">{decision.choice}</span>
                                    <span className="text-[10px] text-[#aaaaaa] leading-relaxed">{decision.reason}</span>
                                  </div>
                                  {decision.badge && (
                                    <span className="shrink-0 text-[8px] font-mono font-semibold px-2 py-0.5 rounded border border-gold/20 text-gold bg-gold/5 uppercase tracking-wider">
                                      {decision.badge}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          </section>

          {/* 04 TEST SECTION — Clean 3 Sections */}
          <section
            id="test"
            ref={testRef}
            className="scroll-mt-28 bg-[#111111] border border-[#222222]/80 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 border-b border-[#222222]/60 pb-4 mb-6">
              <span className="font-mono text-xs text-gold">04</span>
              <h2 className="font-display text-lg font-bold tracking-wider uppercase">Testing &amp; QA</h2>
            </div>

            <p className="text-sm text-[#aaaaaa] leading-relaxed mb-6">
              {project.stages.test.summary}
            </p>

            <TestSection testData={extra.test} />
          </section>

          {/* 05 SHIP SECTION */}
          <section
            id="ship"
            ref={shipRef}
            className="scroll-mt-28 bg-[#111111] border border-[#222222]/80 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 border-b border-[#222222]/60 pb-4 mb-6">
              <span className="font-mono text-xs text-gold">05</span>
              <h2 className="font-display text-lg font-bold tracking-wider uppercase">Shipping &amp; Metrics</h2>
            </div>

            <p className="text-sm text-[#aaaaaa] leading-relaxed mb-6">
              {project.stages.ship.summary}
            </p>

            {/* 1-Line Tested Devices & Browsers */}
            <div className="mb-6 p-3 bg-[#151515] border border-[#222222] rounded-xl text-xs font-mono text-gold">
              Tested on Desktop, Tablet, Mobile — Chrome, Firefox, Edge
            </div>

            {/* Lighthouse Scores */}
            {extra.ship?.lighthouse && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold tracking-wider text-gold uppercase mb-3 font-mono">Performance Audits</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3 bg-[#0a0a0a] border border-[#222222]/80 rounded-xl p-4">
                  <LighthouseCircle label="Performance" score={extra.ship.lighthouse.performance} />
                  <LighthouseCircle label="Accessibility" score={extra.ship.lighthouse.accessibility} />
                  <LighthouseCircle label="Best Practices" score={extra.ship.lighthouse.bestPractices} />
                  <LighthouseCircle label="SEO" score={extra.ship.lighthouse.seo} />
                </div>
              </div>
            )}

            {/* Deployment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#151515] border border-[#222222] rounded-xl p-4">
                <h4 className="text-[10px] font-semibold text-gold uppercase tracking-wider mb-3 font-mono">Deployment Stack</h4>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-[#555555] block">Frontend Host</span>
                    <span className="font-mono text-white">{extra.ship.deploymentStack.frontend}</span>
                  </div>
                  <div>
                    <span className="text-[#555555] block">Backend Host</span>
                    <span className="font-mono text-white">{extra.ship.deploymentStack.backend}</span>
                  </div>
                  <div>
                    <span className="text-[#555555] block">Database Server</span>
                    <span className="font-mono text-white">{extra.ship.deploymentStack.database}</span>
                  </div>
                  <div>
                    <span className="text-[#555555] block">CI/CD Pipeline</span>
                    <span className="font-mono text-white">{extra.ship.deploymentStack.host}</span>
                  </div>
                </div>
              </div>

              {/* CI/CD config snippet */}
              {extra.ship?.deployConfig && (
                <div className="flex flex-col">
                  <h4 className="text-[10px] font-semibold text-gold uppercase tracking-wider mb-2 font-mono">CI/CD Pipeline Config</h4>
                  <pre className="flex-1 overflow-x-auto rounded-xl bg-[#0a0a0a] p-3 font-mono text-[8px] leading-relaxed border border-[#222222] select-all max-h-[140px] no-scrollbar">
                    <code>{extra.ship.deployConfig}</code>
                  </pre>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Footer Navigation (Next/Prev Projects) */}
      <footer className="max-w-6xl mx-auto mt-16 pt-8 border-t border-[#222222]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to={`/projects/${prevProject.slug}`}
            className="flex items-center gap-3 bg-[#111111] border border-[#222222] hover:border-gold/40 hover:text-gold p-4 rounded-xl text-left transition-all duration-300 min-w-[200px] flex-1 group"
          >
            <ChevronLeft size={20} className="text-gold group-hover:-translate-x-1 transition-transform" />
            <div>
              <span className="text-[9px] tracking-wider font-mono text-[#555555] block">PREVIOUS PROJECT</span>
              <span className="text-xs font-bold text-white group-hover:text-gold">{prevProject.name}</span>
            </div>
          </Link>

          <Link
            to={`/projects/${nextProject.slug}`}
            className="flex items-center justify-between bg-[#111111] border border-[#222222] hover:border-gold/40 hover:text-gold p-4 rounded-xl text-right transition-all duration-300 min-w-[200px] flex-1 group"
          >
            <div className="text-left md:text-right">
              <span className="text-[9px] tracking-wider font-mono text-[#555555] block">NEXT PROJECT</span>
              <span className="text-xs font-bold text-white group-hover:text-gold">{nextProject.name}</span>
            </div>
            <ChevronRight size={20} className="text-gold group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </footer>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxSrc && (
          <m.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightboxSrc(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
          >
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[85vh] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]"
            >
              <img
                src={lightboxSrc}
                alt="Screenshot view"
                className="w-full h-auto max-h-[85vh] object-contain mx-auto"
              />
              <button
                onClick={() => setLightboxSrc(null)}
                className="absolute top-4 right-4 bg-black/80 hover:bg-black/95 text-white p-2 rounded-full border border-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </main>
  );
}
