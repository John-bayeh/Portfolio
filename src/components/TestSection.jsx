import { useState, memo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Play, Cpu, ShieldAlert, CheckCircle2, AlertTriangle, Wrench, HelpCircle, Terminal, FileCode, Image as ImageIcon } from "lucide-react";
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
  const [current, setCurrent] = useState(0);
  if (!screenshots || screenshots.length === 0) return null;

  const prev = () => setCurrent((c) => (c - 1 + screenshots.length) % screenshots.length);
  const next = () => setCurrent((c) => (c + 1) % screenshots.length);

  return (
    <div className="mt-4 pt-3 border-t border-line/30">
      <div className="flex items-center gap-2 mb-3">
        <ImageIcon className="w-3.5 h-3.5 text-gold" />
        <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider">
          Visual Testing Proof ({screenshots.length} Screenshot{screenshots.length > 1 ? "s" : ""})
        </span>
      </div>

      {/* Mobile: carousel (< md) */}
      <div className="block md:hidden">
        <div className="relative">
          {/* Counter */}
          <span className="absolute top-2 right-2 z-10 text-[9px] font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded-full">
            {current + 1} / {screenshots.length}
          </span>

          {/* Slide */}
          {(() => {
            const img = screenshots[current];
            const isVertical = /mobile|iphone|tablet|390px|vertical|portrait/i.test(
              `${img.url} ${img.title || ''} ${img.badge || ''}`
            );
            return (
              <div
                onClick={() => onSelectImage(img)}
                className="group relative bg-[var(--th-card)] border border-line hover:border-gold/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md"
              >
                <div className={`overflow-hidden bg-[var(--th-bg)] flex items-center justify-center ${isVertical ? 'aspect-[9/16] p-2' : 'aspect-video'}`}>
                  <img
                    src={img.url}
                    alt={img.title || `Test Proof ${current + 1}`}
                    width={isVertical ? 300 : 400}
                    height={isVertical ? 533 : 225}
                    loading="lazy"
                    className={`w-full h-full transition-transform duration-300 ${isVertical ? 'object-contain rounded-md' : 'object-cover'}`}
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
            );
          })()}

          {/* Prev / Next arrows */}
          {screenshots.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                aria-label="Previous screenshot"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                aria-label="Next screenshot"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {screenshots.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {screenshots.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Go to screenshot ${idx + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  idx === current
                    ? 'w-4 h-1.5 bg-gold'
                    : 'w-1.5 h-1.5 bg-[#444]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: grid (md+) */}
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

      {/* Category Filter Tabs — horizontally scrollable on mobile */}
      <div className="border-b border-[#222222]/80 pb-3">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-1.5 w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all duration-200 border ${
                  selectedCategory === cat
                    ? "bg-gold/10 border-gold/40 text-gold shadow-sm shadow-gold/5"
                    : "bg-[#111111] border-[#222222] text-[#888888] hover:border-gold/20 hover:text-[#aaaaaa]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <p className="text-[10px] font-mono text-[#666666] mt-2">Click any screenshot to expand</p>
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

              {/* Category Test Cases Grid */}
              {categoryTestCases.length > 0 && (
                <m.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 gap-3"
                >
                  {categoryTestCases.map((tc, idx) => (
                    <m.div
                      key={tc.scenario + idx}
                      variants={itemVariants}
                      className="bg-[var(--th-card)] border border-line/80 rounded-xl p-4 hover:border-gold/25 transition-all duration-300 shadow-md group relative overflow-hidden"
                    >
                      {/* Top Row: Category tag and status badge */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold font-mono tracking-wider text-muted uppercase">
                            {tc.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Tool tag */}
                          <span className="text-[8px] font-mono px-2 py-0.5 rounded border border-line bg-[var(--th-bg)] text-muted">
                            {tc.tool}
                          </span>

                          {/* Status Badge */}
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
      <div className="space-y-3 pt-6 border-t border-[#222222]/80">
        <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
          <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase font-mono shrink-0">
            {lbl.testScripts || "Embedded Test Scripts"}
          </h4>
          {/* Switcher — scrollable on mobile */}
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex bg-[#111] border border-[#222222] rounded-lg p-0.5 w-max">
              <button
                onClick={() => setActiveCodeTab("jest")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-bold font-mono transition-all shrink-0 ${
                  activeCodeTab === "jest"
                    ? "bg-gold text-[#080808]"
                    : "text-[#888] hover:text-white"
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
                    : "text-[#888] hover:text-white"
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
