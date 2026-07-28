import { useState, memo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Play, Cpu, ShieldAlert, CheckCircle2, AlertTriangle, Wrench, HelpCircle, Terminal, FileCode, Image as ImageIcon, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useLanguage } from "../context/LanguageContext";

// Stagger variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

// Regex-based simple code highlighter
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
    /\b(const|let|var|function|return|if|else|async|await|new|import|export|from|class|extends|try|catch|throw|for|while|switch|case|default|break|continue|of|in|describe|it|expect|beforeAll|afterAll|jest|require)\b/g,
    '<span class="text-[#7AA2F7]">$1</span>'
  );
  
  // Highlight primitives
  escaped = escaped.replace(
    /\b(true|false|null|undefined|toBe|toEqual|toMatch|toBeCalled|mockImplementation|spyOn|restoreAllMocks)\b/g,
    '<span class="text-[#FF9E64] font-semibold">$1</span>'
  );
  
  return escaped;
}

// Category Screenshot Grid/Carousel Component
const CategoryScreenshotGrid = memo(function CategoryScreenshotGrid({ screenshots, onSelectImage }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showAllModal, setShowAllModal] = useState(false);
  if (!screenshots || screenshots.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-line/30">
      <div className="flex items-center gap-2 mb-3">
        <ImageIcon className="w-3.5 h-3.5 text-gold" />
        <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider">
          Visual Testing Proof ({screenshots.length} Screenshot{screenshots.length > 1 ? "s" : ""})
        </span>
      </div>

      {/* Mobile: Swiper Carousel (< md) */}
      <div className="block md:hidden">
        <div className="relative rounded-xl overflow-hidden border border-line bg-[var(--th-card)] shadow-md">
          {/* Counter top right */}
          <span className="absolute top-2.5 right-2.5 z-20 text-[9px] font-mono font-bold text-white bg-black/75 px-2.5 py-0.5 rounded-full border border-white/10">
            {activeSlide + 1} / {screenshots.length}
          </span>

          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            spaceBetween={12}
            onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
            className="w-full"
          >
            {screenshots.map((img, idx) => {
              const isVertical = /mobile|iphone|tablet|390px|vertical|portrait/i.test(
                `${img.url} ${img.title || ''} ${img.badge || ''}`
              );
              return (
                <SwiperSlide key={idx}>
                  <div
                    onClick={() => onSelectImage(img)}
                    className="cursor-pointer flex flex-col h-full"
                  >
                    <div className={`overflow-hidden bg-[var(--th-bg)] flex items-center justify-center ${isVertical ? 'aspect-[9/16] p-2' : 'aspect-video'}`}>
                      <img
                        src={img.url}
                        alt={img.title || `Test Proof ${idx + 1}`}
                        width={isVertical ? 300 : 400}
                        height={isVertical ? 533 : 225}
                        loading="lazy"
                        className={`w-full h-full object-contain ${isVertical ? 'rounded-md' : 'object-cover'}`}
                      />
                    </div>
                    <div className="p-2.5 bg-[var(--th-card)] border-t border-line/30">
                      <p className="text-[11px] font-bold truncate" style={{ color: 'var(--th-text)' }}>
                        {img.title}
                      </p>
                      {img.badge && (
                        <span className="inline-block text-[8px] font-mono font-bold uppercase tracking-wider text-gold bg-gold/10 px-1.5 py-0.5 rounded border border-gold/20 mt-1">
                          {img.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Dots Indicator */}
          {screenshots.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 py-2 bg-[var(--th-card)] border-t border-line/20">
              {screenshots.map((_, idx) => (
                <span
                  key={idx}
                  className={`rounded-full transition-all duration-200 ${
                    idx === activeSlide
                      ? 'w-4 h-1.5 bg-gold'
                      : 'w-1.5 h-1.5 bg-[#444]'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Screenshots Button */}
        {screenshots.length > 1 && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => setShowAllModal(true)}
              className="inline-flex items-center gap-1.5 border border-gold/40 text-gold hover:bg-gold/10 px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-colors"
            >
              View all {screenshots.length} screenshots →
            </button>
          </div>
        )}
      </div>

      {/* Desktop: Grid (md+) */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-3">
        {screenshots.map((img, idx) => {
          const isVertical = /mobile|iphone|tablet|390px|vertical|portrait/i.test(
            `${img.url} ${img.title || ''} ${img.badge || ''}`
          );
          return (
            <div
              key={idx}
              onClick={() => onSelectImage(img)}
              className="group relative bg-[var(--th-card)] border border-line hover:border-gold/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-gold/10 flex flex-col h-full"
            >
              <div className={`overflow-hidden bg-[var(--th-bg)] flex items-center justify-center ${isVertical ? 'aspect-[9/16] p-2' : 'aspect-video'}`}>
                <img
                  src={img.url}
                  alt={img.title || `Test Proof ${idx + 1}`}
                  width={isVertical ? 300 : 400}
                  height={isVertical ? 533 : 225}
                  loading="lazy"
                  className={`w-full h-full group-hover:scale-105 transition-transform duration-300 ${isVertical ? 'object-contain rounded-md' : 'object-cover'}`}
                />
              </div>
              <div className="p-2.5 bg-[var(--th-card)] mt-auto border-t border-line/30">
                <p className="text-[11px] font-bold group-hover:text-gold transition-colors truncate" style={{ color: 'var(--th-text)' }}>
                  {img.title}
                </p>
                {img.badge && (
                  <span className="inline-block text-[8px] font-mono font-bold uppercase tracking-wider text-gold bg-gold/10 px-1.5 py-0.5 rounded border border-gold/20 mt-1">
                    {img.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen All Screenshots Modal — Horizontal alignment */}
      {showAllModal && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col p-4 sm:p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
              All Screenshots ({screenshots.length})
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
            {screenshots.map((img, idx) => (
              <div key={idx} className="shrink-0 w-[85vw] max-w-2xl bg-[#111] border border-white/10 rounded-xl overflow-hidden p-3 snap-center">
                <img src={img.url} alt={img.title} className="w-full h-auto max-h-[65vh] object-contain mx-auto rounded-lg" />
                <p className="text-xs font-bold text-white text-center mt-2.5">{img.title}</p>
                {img.badge && (
                  <p className="text-[9px] font-mono text-gold text-center mt-1">{img.badge}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default function TestSection({ testData }) {
  const { t } = useLanguage();
  const lbl = t.labels || {};
  const { testCases = [], jestSnippet, k6Snippet, testingScreenshots = [] } = testData || {};
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activeCodeTab, setActiveCodeTab] = useState("jest"); // "jest" | "k6"
  const [activeImageModal, setActiveImageModal] = useState(null);

  // Get unique categories from both test cases & screenshots
  const tcCategories = testCases.map((tc) => tc.category);
  const imgCategories = testingScreenshots.map((img) => img.category).filter(Boolean);
  const categories = ["ALL", ...new Set([...tcCategories, ...imgCategories])];

  // Active categories list to render
  const activeCategories = selectedCategory === "ALL"
    ? categories.filter((c) => c !== "ALL")
    : [selectedCategory];

  // Category Icon Resolver
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Authentication":
        return <Cpu className="w-4 h-4 text-blue-400" />;
      case "RBAC":
        return <ShieldAlert className="w-4 h-4 text-purple-400" />;
      case "Payroll":
        return <Play className="w-4 h-4 text-emerald-400" fill="currentColor" />;
      case "Leave Management":
        return <CheckCircle2 className="w-4 h-4 text-indigo-400" />;
      case "Load Testing":
      case "Stress Testing":
        return <Cpu className="w-4 h-4 text-orange-400" />;
      case "DoS Resilience":
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-gold" />;
    }
  };

  return (
    <div className="space-y-8 select-text text-left">
      {/* LIGHTBOX IMAGE MODAL */}
      <AnimatePresence>
        {activeImageModal && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImageModal(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <div className="max-w-5xl max-h-[90vh] relative bg-[#121212] border border-[#333333] rounded-2xl overflow-hidden p-2 shadow-2xl">
              <img
                src={activeImageModal.url}
                alt={activeImageModal.title}
                className="max-h-[75vh] w-auto mx-auto object-contain rounded-xl"
              />
              <div className="p-3 text-center">
                <p className="text-sm font-bold text-white">{activeImageModal.title}</p>
                <p className="text-xs text-[#aaaaaa] mt-0.5">{activeImageModal.description || activeImageModal.badge}</p>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Category Filter Tabs — all categories fully visible across all devices and themes */}
      <div className="border-b border-[var(--th-line)] pb-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 border ${
                selectedCategory === cat
                  ? "bg-gold/10 border-gold/50 text-gold shadow-sm"
                  : "bg-[var(--th-card)] border-[var(--th-line)] text-[var(--th-text-60)] hover:border-gold/30 hover:text-[var(--th-text)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <p className="text-[10px] font-mono text-[var(--th-text-60)] mt-2.5">Click any screenshot to expand</p>
      </div>

      {/* Render Category Sections (Test Cases + Screenshots placed in their matching category) */}
      <div className="space-y-8">
        {activeCategories.map((cat) => {
          const categoryTestCases = testCases.filter((tc) => tc.category === cat);
          const categoryScreenshots = testingScreenshots.filter(
            (img) => img.category === cat || (!img.category && selectedCategory === "ALL" && false)
          );

          if (categoryTestCases.length === 0 && categoryScreenshots.length === 0) {
            return null;
          }

          return (
            <div
              key={cat}
              className="bg-[var(--th-card)]/40 border border-line/60 rounded-2xl p-5 space-y-4 shadow-sm"
            >
              {/* Category Header */}
              <div className="flex items-center gap-2.5 pb-2 border-b border-line/40">
                <span className="p-1.5 rounded-lg bg-[var(--th-bg)] border border-line">
                  {getCategoryIcon(cat)}
                </span>
                <h4 className="text-xs font-bold font-mono tracking-wider text-gold uppercase">
                  {cat} Section ({categoryTestCases.length} Test Case{categoryTestCases.length > 1 ? "s" : ""})
                </h4>
              </div>

              {/* Category Test Cases — Swiper on mobile (< md), grid on desktop (md+) */}
              {categoryTestCases.length > 0 && (
                <>
                  {/* Mobile Swiper (< md) */}
                  <div className="block md:hidden">
                    <Swiper
                      modules={[Pagination]}
                      slidesPerView={1.1}
                      spaceBetween={10}
                      className="w-full pb-1"
                    >
                      {categoryTestCases.map((tc, idx) => (
                        <SwiperSlide key={tc.scenario + idx}>
                          <div className="bg-[var(--th-card)] border border-line/80 rounded-xl p-4 shadow-md h-full flex flex-col justify-between">
                            {/* Top Row: Category tag and status badge */}
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                              <span className="text-[10px] font-bold font-mono tracking-wider text-muted uppercase">
                                {tc.category}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <span className="text-[8px] font-mono px-2 py-0.5 rounded border border-line bg-[var(--th-bg)] text-muted">
                                  {tc.tool}
                                </span>

                                {tc.result === "pass" && (
                                  <span className="inline-flex items-center gap-1 bg-[#10b981]/10 border border-[#10b981]/25 text-[#10b981] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                                    Pass
                                  </span>
                                )}
                                {tc.result === "fixed" && (
                                  <span className="inline-flex items-center gap-1 bg-gold/10 border border-gold/30 text-gold text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                                    <Wrench className="w-2.5 h-2.5 text-gold shrink-0" />
                                    Fixed
                                  </span>
                                )}
                                {tc.result === "fail" && (
                                  <span className="inline-flex items-center gap-1 bg-[#ef4444]/10 border border-[#ef4444]/25 text-[#ef4444] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                                    <AlertTriangle className="w-2.5 h-2.5 text-[#ef4444] shrink-0" />
                                    Fail
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Scenario details */}
                            <h5 className="text-xs font-semibold group-hover:text-gold transition-colors duration-200 mb-1" style={{ color: 'var(--th-text)' }}>
                              {tc.scenario}
                            </h5>
                            <p className="text-[11px] text-muted leading-relaxed mb-2">
                              <span className="font-bold opacity-75" style={{ color: 'var(--th-text)' }}>{lbl.expected || "Expected:"}</span> {tc.expected}
                            </p>

                            {/* Fix notes / Performance notes */}
                            {tc.fixNote && (
                              <div className="mt-2 p-2.5 rounded-lg bg-gold/5 border border-gold/10 text-[10px] text-[#cda84b] leading-relaxed flex items-start gap-2">
                                <Wrench className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold uppercase tracking-wider text-[8px] font-mono block mb-0.5 text-gold">{lbl.rootCause || "Root Cause & Resolution:"}</span>
                                  {tc.fixNote}
                                </div>
                              </div>
                            )}

                            {tc.note && (
                              <div className="mt-2 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10 text-[10px] text-blue-400/90 leading-relaxed flex items-start gap-2">
                                <Terminal className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold uppercase tracking-wider text-[8px] font-mono block mb-0.5 text-blue-400">{lbl.loadMetrics || "Load Test Metrics:"}</span>
                                  {tc.note}
                                </div>
                              </div>
                            )}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  {/* Desktop Grid (md+) */}
                  <m.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-3"
                  >
                    {categoryTestCases.map((tc, idx) => (
                      <m.div
                        key={tc.scenario + idx}
                        variants={itemVariants}
                        className="bg-[var(--th-card)] border border-line/80 rounded-xl p-4 hover:border-gold/25 transition-all duration-300 shadow-md group relative overflow-hidden flex flex-col justify-between"
                      >
                        {/* Top Row: Category tag and status badge */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold font-mono tracking-wider text-muted uppercase">
                              {tc.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-mono px-2 py-0.5 rounded border border-line bg-[var(--th-bg)] text-muted">
                              {tc.tool}
                            </span>

                            {tc.result === "pass" && (
                              <span className="inline-flex items-center gap-1 bg-[#10b981]/10 border border-[#10b981]/25 text-[#10b981] text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                                Pass
                              </span>
                            )}
                            {tc.result === "fixed" && (
                              <span className="inline-flex items-center gap-1 bg-gold/10 border border-gold/30 text-gold text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                                <Wrench className="w-2.5 h-2.5 text-gold shrink-0" />
                                Fixed
                              </span>
                            )}
                            {tc.result === "fail" && (
                              <span className="inline-flex items-center gap-1 bg-[#ef4444]/10 border border-[#ef4444]/25 text-[#ef4444] text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                                <AlertTriangle className="w-2.5 h-2.5 text-[#ef4444] shrink-0" />
                                Fail
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Scenario details */}
                        <h5 className="text-xs font-semibold group-hover:text-gold transition-colors duration-200 mb-1" style={{ color: 'var(--th-text)' }}>
                          {tc.scenario}
                        </h5>
                        <p className="text-[11px] text-muted leading-relaxed mb-2">
                          <span className="font-bold opacity-75" style={{ color: 'var(--th-text)' }}>{lbl.expected || "Expected:"}</span> {tc.expected}
                        </p>

                        {/* Fix notes / Performance notes */}
                        {tc.fixNote && (
                          <div className="mt-2.5 p-3 rounded-lg bg-gold/5 border border-gold/10 text-[10px] text-[#cda84b] leading-relaxed flex items-start gap-2">
                            <Wrench className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold uppercase tracking-wider text-[8px] font-mono block mb-0.5 text-gold">{lbl.rootCause || "Root Cause & Resolution:"}</span>
                              {tc.fixNote}
                            </div>
                          </div>
                        )}

                        {tc.note && (
                          <div className="mt-2.5 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-[10px] text-blue-400/90 leading-relaxed flex items-start gap-2">
                            <Terminal className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold uppercase tracking-wider text-[8px] font-mono block mb-0.5 text-blue-400">{lbl.loadMetrics || "Load Test Metrics:"}</span>
                              {tc.note}
                            </div>
                          </div>
                        )}
                      </m.div>
                    ))}
                  </m.div>
                </>
              )}

              {/* Category Screenshots rendered right inside its category section */}
              <CategoryScreenshotGrid
                screenshots={categoryScreenshots}
                onSelectImage={setActiveImageModal}
              />
            </div>
          );
        })}
      </div>

      {/* Code Snippets Section (with editor-like tab switcher) */}
      <div className="space-y-3 pt-6 border-t border-[var(--th-line)]">
        <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
          <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase font-mono shrink-0">
            {lbl.testScripts || "Embedded Test Scripts"}
          </h4>
          {/* Switcher — scrollable on mobile */}
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex bg-[var(--th-bg)] border border-[var(--th-line)] rounded-lg p-0.5 w-max">
              <button
                onClick={() => setActiveCodeTab("jest")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-bold font-mono transition-all shrink-0 ${
                  activeCodeTab === "jest"
                    ? "bg-gold text-[#080808]"
                    : "text-[var(--th-text-60)] hover:text-[var(--th-text)]"
                }`}
              >
                <FileCode className="w-3 h-3" />
                Jest + Supertest
              </button>
              <button
                onClick={() => setActiveCodeTab("k6")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-bold font-mono transition-all shrink-0 ${
                  activeCodeTab === "k6"
                    ? "bg-gold text-[#080808]"
                    : "text-[var(--th-text-60)] hover:text-[var(--th-text)]"
                }`}
              >
                <Terminal className="w-3 h-3" />
                k6 Load Test
              </button>
            </div>
          </div>
        </div>

        {/* Code Editor Window */}
        <div className="rounded-xl border border-line/80 overflow-hidden shadow-2xl bg-[var(--th-card)]">
          {/* macOS window chrome */}
          <div className="flex items-center justify-between bg-[var(--th-bg)] border-b border-line px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              <span className="ml-3 text-[9px] font-mono text-muted">
                {activeCodeTab === "jest" ? jestSnippet?.title : k6Snippet?.title}
              </span>
            </div>
            <span className="text-[8px] font-mono text-gold bg-gold/5 px-2 py-0.5 rounded border border-gold/15">
              {activeCodeTab === "jest" ? "jest.spec.js" : "load-test.js"}
            </span>
          </div>

          {/* Code content */}
          <pre className="overflow-x-auto border-l-4 border-gold p-4 font-mono text-[10px] leading-relaxed select-text max-h-[350px] bg-[var(--th-bg)] code-scrollbar" style={{ color: 'var(--th-text)' }}>
            <code
              dangerouslySetInnerHTML={{
                __html: highlightCode(
                  activeCodeTab === "jest" ? jestSnippet?.code : k6Snippet?.code
                ),
              }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
}
