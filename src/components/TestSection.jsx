import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Cpu, ShieldAlert, CheckCircle2, AlertTriangle, Wrench, HelpCircle, Terminal, FileCode } from "lucide-react";

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

export default function TestSection({ testData }) {
  const { testCases = [], jestSnippet, k6Snippet, testingScreenshots = [] } = testData || {};
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activeCodeTab, setActiveCodeTab] = useState("jest"); // "jest" | "k6"
  const [activeImageModal, setActiveImageModal] = useState(null);

  // Get unique categories
  const categories = ["ALL", ...new Set(testCases.map((tc) => tc.category))];

  // Filter test cases
  const filteredCases = selectedCategory === "ALL"
    ? testCases
    : testCases.filter((tc) => tc.category === selectedCategory);

  // Category Icon Resolver
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Authentication":
        return <Cpu className="w-3.5 h-3.5 text-blue-400" />;
      case "RBAC":
        return <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />;
      case "Payroll":
        return <Play className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" />;
      case "Leave Management":
        return <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />;
      case "Load Testing":
      case "Stress Testing":
        return <Cpu className="w-3.5 h-3.5 text-orange-400" />;
      case "DoS Resilience":
        return <ShieldAlert className="w-3.5 h-3.5 text-red-400" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-muted" />;
    }
  };

  return (
    <div className="space-y-8 select-text text-left">
      {/* 1. TESTING SCREENSHOTS PROOF GALLERY */}
      {testingScreenshots.length > 0 && (
        <div className="space-y-3 pb-6 border-b border-[#222222]/80">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-mono text-gold uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
              🖼️ Testing Evidence &amp; Visual Proof ({testingScreenshots.length} Screenshots)
            </h3>
            <span className="text-[10px] text-[#666666] font-mono">Click screenshot to enlarge</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 items-start">
            {testingScreenshots.map((img, idx) => {
              const isVertical = /mobile|iphone|tablet|390px|vertical|portrait/i.test(
                `${img.url} ${img.title || ''} ${img.badge || ''}`
              );
              return (
                <div
                  key={idx}
                  onClick={() => setActiveImageModal(img)}
                  className="group relative bg-[#0e0e0e] border border-[#222222] hover:border-gold/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-gold/10 flex flex-col h-full"
                >
                  <div className={`overflow-hidden bg-[#050505] flex items-center justify-center ${isVertical ? 'aspect-[9/16] p-2' : 'aspect-video'}`}>
                    <img
                      src={img.url}
                      alt={img.title || `Test Proof ${idx + 1}`}
                      className={`w-full h-full group-hover:scale-105 transition-transform duration-300 ${isVertical ? 'object-contain rounded-md' : 'object-cover'}`}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2.5 bg-[#121212] mt-auto">
                    <p className="text-[11px] font-bold text-white group-hover:text-gold transition-colors truncate">
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
      )}

      {/* LIGHTBOX IMAGE MODAL */}
      <AnimatePresence>
        {activeImageModal && (
          <motion.div
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-[#222222]/80 pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all duration-200 border ${
              selectedCategory === cat
                ? "bg-gold/10 border-gold/40 text-gold shadow-sm shadow-gold/5"
                : "bg-[#111111] border-[#222222] text-[#888888] hover:border-gold/20 hover:text-[#aaaaaa]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filtered Test Cases List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-3"
      >
        <AnimatePresence mode="wait">
          {filteredCases.map((tc, idx) => (
            <motion.div
              key={tc.scenario + idx}
              variants={itemVariants}
              className="bg-[#0e0e0e] border border-[#222222]/80 rounded-xl p-4 hover:border-gold/25 transition-all duration-300 shadow-md group relative overflow-hidden"
            >
              {/* Top Row: Category tag and status badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-[#161616] border border-[#222222]">
                    {getCategoryIcon(tc.category)}
                  </span>
                  <span className="text-[10px] font-bold font-mono tracking-wider text-[#888] uppercase">
                    {tc.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Tool tag */}
                  <span className="text-[8px] font-mono px-2 py-0.5 rounded border border-[#222222] bg-[#161616] text-[#666]">
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
              <h5 className="text-xs font-semibold text-white group-hover:text-gold transition-colors duration-200 mb-1">
                {tc.scenario}
              </h5>
              <p className="text-[11px] text-[#888888] leading-relaxed mb-2">
                <span className="font-bold text-white/50">Expected:</span> {tc.expected}
              </p>

              {/* Fix notes / Performance notes */}
              {tc.fixNote && (
                <div className="mt-2.5 p-3 rounded-lg bg-gold/5 border border-gold/10 text-[10px] text-[#cda84b] leading-relaxed flex items-start gap-2">
                  <Wrench className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[8px] font-mono block mb-0.5 text-gold">Root Cause &amp; Resolution:</span>
                    {tc.fixNote}
                  </div>
                </div>
              )}

              {tc.note && (
                <div className="mt-2.5 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-[10px] text-blue-400/90 leading-relaxed flex items-start gap-2">
                  <Terminal className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[8px] font-mono block mb-0.5 text-blue-400">Load Test Metrics:</span>
                    {tc.note}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Code Snippets Section (with editor-like tab switcher) */}
      <div className="space-y-3 pt-6 border-t border-[#222222]/80">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase font-mono">
            Embedded Test Scripts
          </h4>
          {/* Switcher */}
          <div className="flex bg-[#111] border border-[#222222] rounded-lg p-0.5">
            <button
              onClick={() => setActiveCodeTab("jest")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-bold font-mono transition-all ${
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
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-bold font-mono transition-all ${
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

        {/* Code Editor Window */}
        <div className="rounded-xl border border-[#222222]/80 overflow-hidden shadow-2xl bg-[#0a0a0a]">
          {/* macOS window chrome */}
          <div className="flex items-center justify-between bg-[#141414] border-b border-[#222222] px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              <span className="ml-3 text-[9px] font-mono text-[#555555]">
                {activeCodeTab === "jest" ? jestSnippet?.title : k6Snippet?.title}
              </span>
            </div>
            <span className="text-[8px] font-mono text-gold bg-gold/5 px-2 py-0.5 rounded border border-gold/15">
              {activeCodeTab === "jest" ? "jest.spec.js" : "load-test.js"}
            </span>
          </div>

          {/* Code content */}
          <pre className="overflow-x-auto border-l-4 border-gold p-4 font-mono text-[10px] leading-relaxed no-scrollbar select-text max-h-[350px]">
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
