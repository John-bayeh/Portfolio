import { useState, useEffect, useRef, memo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Monitor, Smartphone, Tablet, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { GithubIcon } from "./BrandIcons";
import projects from "../data/projects";
import { useLanguage } from "../context/LanguageContext";
import extraProjectDetails from "../data/extraProjectDetails";
import { ARCH_ICONS_MAP } from "../assets/icons/ArchIcons";
import TestSection from "./TestSection";

function ArchIcon({ iconKey, size = 18 }) {
  const Component = ARCH_ICONS_MAP[iconKey];
  if (!Component) return null;
  return <Component width={size} height={size} style={{ display: "block", flexShrink: 0 }} />;
}

function TabContentSwiper({ slides }) {
  const [activeSlide, setActiveSlide] = useState(0);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative rounded-xl border border-line/60 bg-[var(--th-card)] p-4 sm:p-5 shadow-lg text-left select-text overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-line/40 gap-3">
        {/* Slide Label */}
        <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
          {slides[activeSlide]?.label}
        </span>

        {/* Counter & Nav Arrows */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[9px] font-mono font-bold text-[var(--th-text-60)] bg-[var(--th-bg)] px-2 py-0.5 rounded-full border border-line/40">
            {activeSlide + 1} / {slides.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={activeSlide === 0}
              onClick={() => setActiveSlide((c) => Math.max(0, c - 1))}
              className="p-1 rounded border border-line/40 bg-[var(--th-bg)] text-[var(--th-text)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-gold hover:text-gold transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              disabled={activeSlide === slides.length - 1}
              onClick={() => setActiveSlide((c) => Math.min(slides.length - 1, c + 1))}
              className="p-1 rounded border border-line/40 bg-[var(--th-bg)] text-[var(--th-text)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-gold hover:text-gold transition-colors"
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
        spaceBetween={14}
        onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
        className="w-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="w-full">
            <div className="w-full min-h-[180px]">
              {slide.content}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom Dots Indicator */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2.5 mt-3 border-t border-line/30">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === activeSlide
                  ? "w-5 h-1.5 bg-gold shadow-sm shadow-gold/30"
                  : "w-1.5 h-1.5 bg-[var(--th-line)] hover:bg-[var(--th-text-60)]"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Simple custom regex-based syntax highlighter for the code snippets
function highlightCode(code) {
  if (!code) return "";
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Highlight comments (green)
  escaped = escaped.replace(/(\/\/.*)/g, '<span class="text-green-500 font-normal">$1</span>');
  
  // Highlight strings (light gold/orange)
  escaped = escaped.replace(/(['"`].*?['"`])/g, '<span class="text-[#E6D080]">$1</span>');
  
  // Highlight keywords (gold/yellow)
  const keywords = /\b(const|let|var|function|return|import|export|from|await|async|if|else|post|json|status|send)\b/g;
  escaped = escaped.replace(keywords, '<span class="text-[#C9A84C] font-semibold">$1</span>');
  
  return escaped;
}

// Lighthouse Circular Progress Bar component
function LighthouseCircle({ label, score }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = "#EF4444"; // red < 50
  if (score >= 90) strokeColor = "#22C55E"; // green
  else if (score >= 50) strokeColor = "#EAB308"; // yellow

  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[70px]">
      <div className="relative flex items-center justify-center w-14 h-14">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="28"
            cy="28"
            r={radius}
            className="stroke-[#222] fill-none"
            strokeWidth="3.5"
          />
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-xs font-semibold" style={{ color: strokeColor }}>
          {score}
        </span>
      </div>
      <span className="text-[9px] tracking-wider text-muted font-medium uppercase text-center">
        {label}
      </span>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const tabContentVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      duration: 0.25
    }
  }
};

const tabItemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const ProjectRow = memo(function ProjectRow({ project, isExpanded, onToggleExpanded }) {
  const { number, name, description, tech, year, github, live, privateReason, screenshot, screenshots, requirementsDoc, slug, stages, codeSnippet } =
    project;
  const thumbnail = screenshots?.thumbnail || screenshot;
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState("SCOPE");
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const rowRef = useRef(null);

  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e) => { if (e.key === "Escape") setLightboxSrc(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxSrc]);

  const handleToggle = () => {
    onToggleExpanded();
  };

  const { t } = useLanguage();
  const lbl = t.labels || {};
  const tabLabels = t.tabs || {};

  const extra = extraProjectDetails[slug] || {
    userStories: [],
    design: { colors: [], components: [] },
    build: { architecture: "N/A" },
    test: { cases: [] },
    ship: { lighthouse: { performance: 90, accessibility: 90, bestPractices: 90, seo: 90 }, deploymentStack: { frontend: "N/A", backend: "N/A", database: "N/A", host: "N/A" }, deployConfig: "" }
  };

  const tabs = [
    { id: "SCOPE", name: tabLabels.scope || "SCOPE" },
    { id: "DESIGN", name: tabLabels.design || "DESIGN" },
    { id: "BUILD", name: tabLabels.build || "BUILD" },
    { id: "TEST", name: tabLabels.test || "TEST" },
    { id: "SHIP", name: tabLabels.ship || "SHIP" },
  ];

  return (
    <m.div
      ref={rowRef}
      variants={rowVariants}
      onClick={handleToggle}
      className={`group relative flex flex-col gap-4 rounded-xl border border-line bg-card p-4 sm:p-5 transition-all duration-300 border-l-4 ${
        isExpanded 
          ? "border-l-gold border-gold/40 shadow-xl bg-[var(--th-card)]" 
          : "border-l-transparent hover:border-l-gold/60 hover:border-gold/20 hover:-translate-y-0.5 hover:shadow-md"
      } cursor-pointer select-none`}
    >
      {/* Top row heading/links info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-4 flex-1">
          {/* Left side: Thumbnail */}
          <div className="relative w-[80px] h-[60px] shrink-0 overflow-hidden rounded-lg border border-line flex items-center justify-center bg-[var(--th-bg)]">
            {!imageError && thumbnail ? (
              <img
                src={thumbnail}
                alt={name}
                width={80}
                height={60}
                loading="lazy"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
              />
            ) : (
              <span className="font-mono text-lg font-semibold text-gold transition-transform duration-300 group-hover:scale-103">
                {number}
              </span>
            )}
          </div>

          {/* Middle: Number, Name, Tech stack */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-gold">{number}</span>
              <h3 className="font-display text-lg font-semibold transition-colors duration-300 group-hover:text-gold" style={{ color: 'var(--th-text)' }}>
                {name}
              </h3>
            </div>
            <p className="text-xs" style={{ color: 'var(--th-text-40)' }}>{description}</p>
            <p className="text-xs" style={{ color: 'var(--th-text-60)' }}>
              {tech.join(" • ")}
            </p>
          </div>
        </div>

        {/* Right side: Year, Github, Live demo */}
        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-line/30 pt-3 sm:pt-0 sm:border-0">
          <span className="text-sm font-medium" style={{ color: 'var(--th-text-40)' }}>{year}</span>
          <div className="flex items-center gap-2">
            {/* GitHub icon button */}
            {github ? (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-gold hover:text-gold"
                style={{ color: 'var(--th-text)' }}
                aria-label="View Source Code"
              >
                <GithubIcon size={16} />
              </a>
            ) : (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  disabled
                  className="peer flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted cursor-not-allowed"
                  aria-label="Source Code Not Available"
                >
                  <GithubIcon size={16} />
                </button>
              </div>
            )}
            
            {/* Live arrow button */}
            {live ? (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-gold hover:text-gold"
                style={{ color: 'var(--th-text)' }}
                aria-label="View Live Site"
              >
                <ArrowUpRight size={16} />
              </a>
            ) : (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  disabled
                  className="peer flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted cursor-not-allowed"
                  aria-label="Live Site Not Available"
                >
                  <ArrowUpRight size={16} />
                </button>
                {privateReason && (
                  <div className="absolute bottom-full right-0 mb-2 w-64 rounded-lg border border-line bg-[var(--th-card)] p-3 text-xs opacity-0 peer-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
                    <span className="font-bold block mb-1" style={{ color: '#ef4444' }}>🔒 Private Project</span>
                    <span className="font-bold" style={{ color: '#ef4444' }}>{privateReason}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable panel container */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
            className="overflow-hidden w-full border-t border-line/40 pt-4 mt-2"
          >
            <div className="bg-[var(--th-card)] rounded-xl p-5 border border-line/60 relative text-left select-text overflow-x-hidden" style={{ color: 'var(--th-text)' }}>
              {/* Close Button */}
              <button
                type="button"
                onClick={onToggleExpanded}
                className="absolute top-4 right-4 text-muted hover:text-white transition-colors"
                aria-label="Collapse details"
              >
                <X size={18} />
              </button>

              {/* Navigation Tabs */}
              <div className="flex border-b border-line gap-5 mb-5 pb-2 overflow-x-auto no-scrollbar max-w-[calc(100%-24px)]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-[10px] sm:text-xs font-semibold tracking-wider pb-1 transition-all border-b-2 ${
                      activeTab === tab.id
                        ? "border-gold text-gold"
                        : "border-transparent text-[#555555] hover:text-[#888]"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* Tab Content Panels */}
              <AnimatePresence mode="wait">
                <m.div
                  key={activeTab}
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="w-full min-h-[160px]"
                >
                  {/* SCOPE TAB */}
                  {activeTab === "SCOPE" && (
                    <div className="space-y-4">
                      {stages.scope?.summary && (
                        <m.p variants={tabItemVariants} className="text-xs text-muted mb-2">
                          {stages.scope.summary}
                        </m.p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                        {stages.scope?.items && (
                          <m.div variants={tabItemVariants}>
                            <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-2">Scope Requirements</h4>
                            <ul className="space-y-2">
                              {stages.scope.items.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs">
                                  <span className="text-gold font-bold shrink-0">✓</span>
                                  <span className="text-[#a0a0a0]">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </m.div>
                        )}
                        
                        {extra.userStories && (
                          <m.div variants={tabItemVariants}>
                            <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-2">User Stories</h4>
                            <ul className="space-y-2">
                              {extra.userStories.map((story, idx) => (
                                <li key={idx} className="bg-[var(--th-bg)] border border-line/40 rounded-lg p-2.5 text-xs text-muted italic" style={{ color: 'var(--th-text-60)' }}>
                                  "{story}"
                                </li>
                              ))}
                            </ul>
                          </m.div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* DESIGN TAB — Clean 2x2 Grid + Colors */}
                  {activeTab === "DESIGN" && (
                    <div className="space-y-4">
                      {stages.design?.summary && (
                        <m.p variants={tabItemVariants} className="text-xs text-muted mb-2">
                          {stages.design.summary}
                        </m.p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                        {/* Left: Colors & Components */}
                        <div className="space-y-4">
                          {extra.design?.colors && (
                            <m.div variants={tabItemVariants}>
                              <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-2">{lbl.colorPalette || "Color Palette"}</h4>
                              <div className="flex flex-wrap gap-2">
                                {extra.design.colors.map((color) => (
                                  <div key={color.hex} className="flex items-center gap-2 bg-[var(--th-bg)] border border-line/40 rounded-lg p-1.5 pr-2.5">
                                    <div className="w-6 h-6 rounded border border-line shrink-0" style={{ backgroundColor: color.hex }} />
                                    <div>
                                      <div className="text-[10px] font-semibold" style={{ color: 'var(--th-text)' }}>{color.name}</div>
                                      <div className="text-[8px] font-mono text-muted">{color.hex}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </m.div>
                          )}

                          {extra.design?.components && (
                            <m.div variants={tabItemVariants}>
                              <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-2">{lbl.uiComponents || "Modular UI Components"}</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {extra.design.components.map((comp) => (
                                  <span key={comp} className="bg-[var(--th-bg)] border border-line/50 text-muted text-[10px] px-2 py-0.5 rounded font-mono" style={{ color: 'var(--th-text-60)' }}>
                                    &lt;{comp} /&gt;
                                  </span>
                                ))}
                              </div>
                            </m.div>
                          )}
                        </div>

                        {/* Right: Max 4 Screenshots in a Clean 2x2 Grid */}
                        {(() => {
                          const items = Array.isArray(screenshots) && screenshots.length > 0
                            ? screenshots
                            : screenshots?.design?.length > 0
                              ? screenshots.design.map(src => ({ src, type: src.includes('mobile') || src.includes('photo') ? 'mobile' : 'desktop' }))
                              : null;
                          if (!items && !thumbnail) return null;
                          return (
                            <m.div variants={tabItemVariants} className="flex flex-col">
                              <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-2">{lbl.interfacePreview || "Interface Preview"}</h4>
                              {items ? (
                                <div className="grid grid-cols-2 gap-3.5">
                                  {items.slice(0, 4).map((item, i) => {
                                    const src = typeof item === 'string' ? item : item.src;
                                    const isMobile = typeof item === 'string'
                                      ? (src.includes('mobile') || src.includes('photo'))
                                      : item.type === 'mobile';
                                    return (
                                      <div
                                        key={i}
                                        onClick={(e) => { e.stopPropagation(); setLightboxSrc(src); }}
                                        className={`border border-line rounded-lg overflow-hidden bg-[var(--th-bg)] cursor-zoom-in group/thumb relative transition-all duration-300 hover:border-gold/30 ${
                                          isMobile ? 'aspect-[3/4.5]' : 'aspect-video'
                                        }`}
                                      >
                                        <img
                                          src={src}
                                          alt={`${name} screenshot ${i + 1}`}
                                          width={400}
                                          height={225}
                                          loading="lazy"
                                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/thumb:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                          <span className="opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 text-white text-[10px] font-semibold bg-black/60 px-2 py-0.5 rounded">View</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div
                                  onClick={(e) => { e.stopPropagation(); setLightboxSrc(thumbnail); }}
                                  className="border border-line rounded-lg overflow-hidden bg-[var(--th-bg)] cursor-zoom-in aspect-video max-w-sm"
                                >
                                  <img src={thumbnail} alt={name} width={400} height={225} loading="lazy" className="w-full h-full object-cover object-top" />
                                </div>
                              )}
                            </m.div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* BUILD TAB */}
                  {activeTab === "BUILD" && (
                    <div className="space-y-4">
                      {stages.build?.summary && (
                        <m.p variants={tabItemVariants} className="text-xs text-muted mb-2">
                          {stages.build.summary}
                        </m.p>
                      )}

                      <TabContentSwiper
                        slides={[
                          ...(extra.build?.architectureDiagram
                            ? [
                                {
                                  label: "🏗️ ARCHITECTURE",
                                  content: (
                                    <div>
                                      <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-3">{lbl.archDiagram || "Architecture Diagram"}</h4>
                                      <div className="bg-[var(--th-bg)] border border-line/40 rounded-xl p-4 flex flex-col items-center gap-0 overflow-x-auto">
                                        {extra.build.architectureDiagram.map((node, idx, arr) => (
                                          <div key={idx} className="flex flex-col items-center w-full max-w-xs">
                                            {!node.services && (
                                              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-full justify-center ${
                                                node.primary ? "bg-gold/10 border-gold/40" : "bg-[var(--th-card)] border-line/40"
                                              }`}>
                                                {node.iconKey && <ArchIcon iconKey={node.iconKey} size={18} />}
                                                <div className="text-center">
                                                  <div className="font-mono font-bold text-[10px]" style={{ color: node.primary ? 'var(--color-role, #C9A84C)' : 'var(--th-text)' }}>
                                                    {node.label}
                                                  </div>
                                                  {node.sub && (
                                                    <div className="text-[8px] mt-0.5 font-mono" style={{ color: 'var(--th-text-60)' }}>{node.sub}</div>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                            {!node.services && idx < arr.length - 1 && !arr[idx + 1]?.services && (
                                              <div className="flex flex-col items-center my-1">
                                                <div className="w-px h-3 bg-line" style={{ backgroundColor: 'var(--th-line)' }} />
                                                <svg width="7" height="5" viewBox="0 0 8 6" fill="none"><path d="M4 6L0 0H8L4 6Z" fill="var(--th-muted)" /></svg>
                                              </div>
                                            )}
                                            {node.services && (
                                              <div className="flex flex-col items-center w-full">
                                                <div className="flex flex-col items-center my-1">
                                                  <div className="w-px h-3 bg-line" style={{ backgroundColor: 'var(--th-line)' }} />
                                                  <svg width="7" height="5" viewBox="0 0 8 6" fill="none"><path d="M4 6L0 0H8L4 6Z" fill="var(--th-muted)" /></svg>
                                                </div>
                                                <div className="flex flex-wrap justify-center gap-1.5 w-full">
                                                  {node.services.map((svc, si) => (
                                                    <div key={si} className="flex items-center gap-1.5 bg-[var(--th-card)] border border-line/40 rounded-lg px-2.5 py-1.5 flex-1 min-w-[90px]">
                                                      {svc.iconKey && <ArchIcon iconKey={svc.iconKey} size={15} />}
                                                      <div>
                                                        <div className="text-[9px] font-mono font-semibold" style={{ color: 'var(--th-text)' }}>{svc.label}</div>
                                                        <div className="text-[7px] font-mono" style={{ color: 'var(--th-text-60)' }}>{svc.sub}</div>
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
                          ...(codeSnippet || stages.build?.snippet
                            ? [
                                {
                                  label: "💻 CODE SNIPPET",
                                  content: (
                                    <div className="space-y-2">
                                      <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase font-mono">
                                        {codeSnippet ? codeSnippet.title : (lbl.implSnippet || "Implementation Snippet")}
                                      </h4>
                                      <div className="rounded-lg border border-line/40 overflow-hidden">
                                        <div className="flex items-center justify-between bg-[var(--th-bg)] border-b border-line/30 px-3 py-2">
                                          <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                                            <span className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                                            <span className="w-2 h-2 rounded-full bg-[#27C93F]" />
                                            <span className="ml-2 text-[8px] font-mono text-muted">
                                              {codeSnippet ? (codeSnippet.language || "javascript") : "javascript"}
                                            </span>
                                          </div>
                                          <span className="text-[7px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                                            {codeSnippet ? (codeSnippet.language || "js") : "js"}
                                          </span>
                                        </div>
                                        <pre className="overflow-x-auto border-l-4 border-gold bg-[var(--th-bg)] p-3.5 font-mono text-[10px] leading-relaxed select-text max-h-[220px] code-scrollbar" style={{ color: 'var(--th-text)' }}>
                                          <code dangerouslySetInnerHTML={{ __html: highlightCode(codeSnippet ? codeSnippet.code : stages.build.snippet) }} />
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
                                    <div className="space-y-2">
                                      <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase font-mono mb-2">{lbl.techDecisions || "Key Technical Decisions"}</h4>
                                      <div className="space-y-1.5">
                                        {extra.build.techDecisions.map((decision, idx) => (
                                          <div key={idx} className="flex items-start gap-2.5 bg-[var(--th-bg)] border border-line/30 hover:border-gold/20 rounded-lg px-3 py-2">
                                            <div className="w-4 h-4 rounded bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                                              <span className="text-gold text-[7px] font-bold font-mono">{String(idx + 1).padStart(2, "0")}</span>
                                            </div>
                                            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                              <span className="text-[10px] font-semibold" style={{ color: 'var(--th-text)' }}>{decision.choice}</span>
                                              <span className="text-[9px] text-muted leading-relaxed">{decision.reason}</span>
                                            </div>
                                            {decision.badge && (
                                              <span className="ml-auto shrink-0 text-[7px] font-mono font-semibold px-1.5 py-0.5 rounded border border-gold/20 text-gold/70 bg-gold/5 uppercase tracking-wider self-start">
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
                    </div>
                  )}

                  {/* TEST TAB — Clean 3 Sections Only */}
                  {activeTab === "TEST" && (
                    <div className="space-y-4">
                      {stages.test?.summary && (
                        <m.p variants={tabItemVariants} className="text-xs text-muted mb-2">
                          {stages.test.summary}
                        </m.p>
                      )}
                      <m.div variants={tabItemVariants}>
                        <TestSection testData={extra.test} />
                      </m.div>
                    </div>
                  )}

                  {/* SHIP TAB — Includes Lighthouse Scores & 1-line Tested Devices */}
                  {activeTab === "SHIP" && (
                    <div className="space-y-4">
                      {stages.ship?.summary && (
                        <m.p variants={tabItemVariants} className="text-xs text-muted mb-2">
                          {stages.ship.summary}
                        </m.p>
                      )}

                      {/* 1-Line Tested Devices & Browsers */}
                      <m.div variants={tabItemVariants} className="p-3 bg-[var(--th-bg)] border border-line/40 rounded-lg text-xs font-mono text-[var(--th-text-60)]">
                        <span className="text-gold font-bold">Tested on Desktop, Tablet, Mobile — Chrome, Firefox, Edge</span>
                      </m.div>

                      {/* Lighthouse Scores */}
                      {extra.ship?.lighthouse && (
                        <m.div variants={tabItemVariants}>
                          <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-2">{lbl.lighthouseMetrics || "Lighthouse Audit Metrics"}</h4>
                          <div className="flex flex-wrap gap-4">
                            <LighthouseCircle label="Performance" score={extra.ship.lighthouse.performance} />
                            <LighthouseCircle label="Accessibility" score={extra.ship.lighthouse.accessibility} />
                            <LighthouseCircle label="Best Practices" score={extra.ship.lighthouse.bestPractices} />
                            <LighthouseCircle label="SEO" score={extra.ship.lighthouse.seo} />
                          </div>
                        </m.div>
                      )}

                      {extra.ship?.deploymentStack && (
                        <m.div variants={tabItemVariants}>
                          <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-2">{lbl.deployEnv || "Deployment Environment"}</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-[var(--th-bg)] border border-line/40 rounded-lg p-2.5">
                              <div className="text-[8px] text-muted uppercase tracking-wider mb-0.5">{lbl.frontend || "Frontend"}</div>
                              <div className="text-xs font-semibold" style={{ color: 'var(--th-text)' }}>{extra.ship.deploymentStack.frontend}</div>
                            </div>
                            <div className="bg-[var(--th-bg)] border border-line/40 rounded-lg p-2.5">
                              <div className="text-[8px] text-muted uppercase tracking-wider mb-0.5">{lbl.backend || "Backend"}</div>
                              <div className="text-xs font-semibold" style={{ color: 'var(--th-text)' }}>{extra.ship.deploymentStack.backend}</div>
                            </div>
                            <div className="bg-[var(--th-bg)] border border-line/40 rounded-lg p-2.5">
                              <div className="text-[8px] text-muted uppercase tracking-wider mb-0.5">{lbl.database || "Database"}</div>
                              <div className="text-xs font-semibold" style={{ color: 'var(--th-text)' }}>{extra.ship.deploymentStack.database}</div>
                            </div>
                            <div className="bg-[var(--th-bg)] border border-line/40 rounded-lg p-2.5">
                              <div className="text-[8px] text-muted uppercase tracking-wider mb-0.5">{lbl.infraHost || "Infrastructure Host"}</div>
                              <div className="text-xs font-semibold" style={{ color: 'var(--th-text)' }}>{extra.ship.deploymentStack.host}</div>
                            </div>
                          </div>
                        </m.div>
                      )}

                      {extra.ship?.deployConfig && (
                        <m.div variants={tabItemVariants} className="space-y-1">
                          <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase">{lbl.deployPipeline || "Deployment Pipeline Configuration"}</h4>
                          <pre className="overflow-x-auto rounded-lg border-l-4 border-gold bg-[var(--th-bg)] p-3.5 font-mono text-[10px] leading-relaxed no-scrollbar select-text max-h-[160px] border border-line/40">
                            <code className="text-muted" style={{ color: 'var(--th-text-60)' }}>{extra.ship.deployConfig}</code>
                          </pre>
                        </m.div>
                      )}

                      <m.div variants={tabItemVariants} className="flex flex-wrap items-center justify-between gap-4 border-t border-line/30 pt-3">
                        <div className="flex items-center gap-5 text-[11px] text-muted font-mono">
                          <div>
                            <span className="font-semibold text-gold uppercase">{lbl.version || "Version:"}</span> v1.0.0
                          </div>
                          <div>
                            <span className="font-semibold text-gold uppercase">{lbl.date || "Date:"}</span> Dec {year}
                          </div>
                        </div>

                        {live && (
                          <a
                            href={live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-gold text-[#080808] px-4 py-2 rounded-full text-[11px] font-semibold hover:bg-gold/80 transition-colors"
                          >
                            {lbl.liveDemo || "Live Demo"} <ArrowUpRight size={13} />
                          </a>
                        )}
                      </m.div>
                    </div>
                  )}
                </m.div>
              </AnimatePresence>

              {/* Bottom Row PRD Doc Button */}
              <div className="flex justify-end items-center gap-3 mt-5 pt-4 border-t border-line/30">
                {requirementsDoc && (
                  <a
                    href={requirementsDoc}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="inline-flex items-center gap-2 border border-gold/70 text-gold hover:bg-gold hover:text-[#080808] bg-gold/10 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 shadow-sm"
                  >
                    <FileText size={14} /> {lbl.reqDoc || "Requirements Doc"}
                  </a>
                )}
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
});

export default function Projects() {
  const { t } = useLanguage();
  const p = t.projects;
  const [expandedProjectNum, setExpandedProjectNum] = useState(null);

  // Keyboard support: Escape key closes the expanded panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setExpandedProjectNum(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section id="projects" className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            {p.sectionLabel}
          </p>
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            <span style={{ color: 'var(--th-text)' }}>{p.heading1}</span>
            <span className="text-gold">{p.heading2}</span>
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--th-text-60)' }}>{p.subtitle}</p>
        </div>

        {/* Vertical list container with Framer Motion stagger */}
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col gap-4"
        >
          {projects.map((proj) => {
            const isExpanded = expandedProjectNum === proj.number;
            return (
              <ProjectRow 
                key={proj.number} 
                project={proj} 
                isExpanded={isExpanded}
                onToggleExpanded={() => setExpandedProjectNum(isExpanded ? null : proj.number)}
              />
            );
          })}
        </m.div>
      </div>
    </section>
  );
}
