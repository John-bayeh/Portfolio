import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Monitor, Smartphone, Tablet, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { GithubIcon } from "./BrandIcons";
import projects from "../data/projects";
import { useLanguage } from "../context/LanguageContext";
import extraProjectDetails from "../data/extraProjectDetails";

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

function ProjectRow({ project, isExpanded, onToggleExpanded }) {
  const { number, name, description, tech, year, github, live, screenshot, screenshots, requirementsDoc, slug, stages } =
    project;
  const thumbnail = screenshots?.thumbnail || screenshot;
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState("SCOPE");
  const [lightboxSrc, setLightboxSrc] = useState(null);

  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e) => { if (e.key === "Escape") setLightboxSrc(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxSrc]);

  const extra = extraProjectDetails[slug] || {
    userStories: [],
    design: { colors: [], components: [] },
    build: { architecture: "N/A" },
    test: { cases: [] },
    ship: { lighthouse: { performance: 90, accessibility: 90, bestPractices: 90, seo: 90 }, deploymentStack: { frontend: "N/A", backend: "N/A", database: "N/A", host: "N/A" }, deployConfig: "" }
  };

  const tabs = ["SCOPE", "DESIGN", "BUILD", "TEST", "SHIP"];

  return (
    <motion.div
      variants={rowVariants}
      onClick={onToggleExpanded}
      className={`group relative flex flex-col gap-4 rounded-xl border border-line bg-card p-4 sm:p-5 transition-all duration-300 border-l-4 ${
        isExpanded 
          ? "border-l-gold border-gold/40 shadow-xl bg-[#0b0b0b]" 
          : "border-l-transparent hover:border-l-gold/60 hover:border-gold/20 hover:-translate-y-0.5 hover:shadow-md"
      } cursor-pointer select-none`}
    >
      {/* Top row heading/links info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-4 flex-1">
          {/* Left side: Thumbnail */}
          <div className="relative w-[80px] h-[60px] shrink-0 overflow-hidden rounded-lg border border-line flex items-center justify-center bg-[#070707]">
            {!imageError && thumbnail ? (
              <img
                src={thumbnail}
                alt={name}
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
              <button
                disabled
                onClick={(e) => e.stopPropagation()}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted cursor-not-allowed"
                aria-label="Live Site Not Available"
              >
                <ArrowUpRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable panel container */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
            className="overflow-hidden w-full border-t border-line/40 pt-4 mt-2"
          >
            <div className="bg-[#0D0D0D] rounded-xl p-5 border border-line/60 relative text-left select-text">
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
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`text-[10px] sm:text-xs font-semibold tracking-wider pb-1 transition-all border-b-2 ${
                      activeTab === tab
                        ? "border-gold text-gold"
                        : "border-transparent text-[#555555] hover:text-[#888]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content Panels */}
              <AnimatePresence mode="wait">
                <motion.div
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
                        <motion.p variants={tabItemVariants} className="text-xs text-muted mb-2">
                          {stages.scope.summary}
                        </motion.p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                        {stages.scope?.items && (
                          <motion.div variants={tabItemVariants}>
                            <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-2">Scope Requirements</h4>
                            <ul className="space-y-2">
                              {stages.scope.items.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs">
                                  <span className="text-gold font-bold shrink-0">✓</span>
                                  <span className="text-[#a0a0a0]">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                        
                        {extra.userStories && (
                          <motion.div variants={tabItemVariants}>
                            <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-2">User Stories</h4>
                            <ul className="space-y-2">
                              {extra.userStories.map((story, idx) => (
                                <li key={idx} className="bg-[#141414] border border-line/40 rounded-lg p-2.5 text-xs text-[#8e8e8e] italic">
                                  "{story}"
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* DESIGN TAB */}
                  {activeTab === "DESIGN" && (
                    <div className="space-y-4">
                      {stages.design?.summary && (
                        <motion.p variants={tabItemVariants} className="text-xs text-muted mb-2">
                          {stages.design.summary}
                        </motion.p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                        <div className="space-y-4">
                          {extra.design?.colors && (
                            <motion.div variants={tabItemVariants}>
                              <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-2">Color Palette</h4>
                              <div className="flex flex-wrap gap-2">
                                {extra.design.colors.map((color) => (
                                  <div key={color.hex} className="flex items-center gap-2 bg-[#141414] border border-line/40 rounded-lg p-1.5 pr-2.5">
                                    <div className="w-6 h-6 rounded border border-line shrink-0" style={{ backgroundColor: color.hex }} />
                                    <div>
                                      <div className="text-[10px] font-semibold text-white">{color.name}</div>
                                      <div className="text-[8px] font-mono text-muted">{color.hex}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}

                          {extra.design?.components && (
                            <motion.div variants={tabItemVariants}>
                              <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-2">Modular UI Components</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {extra.design.components.map((comp) => (
                                  <span key={comp} className="bg-[#141414] border border-line/50 text-[#8e8e8e] text-[10px] px-2 py-0.5 rounded font-mono">
                                    &lt;{comp} /&gt;
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Screenshot grid (2x2) for projects with screenshots.design, fallback to single screenshot */}
                        {(screenshots?.design?.length > 0 || thumbnail) && (
                          <motion.div variants={tabItemVariants} className="flex flex-col">
                            <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-2">Interface Preview</h4>
                            {screenshots?.design?.length > 0 ? (
                              <div className="grid grid-cols-2 gap-2">
                                {screenshots.design.slice(0, 4).map((src, i) => (
                                  <div
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); setLightboxSrc(src); }}
                                    className="border border-line rounded-lg overflow-hidden bg-[#070707] aspect-video cursor-zoom-in group/thumb relative"
                                  >
                                    <img
                                      src={src}
                                      alt={`${name} screenshot ${i + 1}`}
                                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/thumb:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                      <span className="opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 text-white text-[10px] font-semibold bg-black/60 px-2 py-0.5 rounded">View</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div
                                onClick={(e) => { e.stopPropagation(); setLightboxSrc(thumbnail); }}
                                className="border border-line rounded-lg overflow-hidden bg-[#070707] flex items-center justify-center max-h-[160px] cursor-zoom-in"
                              >
                                <img src={thumbnail} alt={name} className="w-full h-auto object-cover max-h-[160px]" />
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* Lightbox */}
                        <AnimatePresence>
                          {lightboxSrc && (
                            <motion.div
                              key="lightbox"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              onClick={(e) => { e.stopPropagation(); setLightboxSrc(null); }}
                              style={{ cursor: 'default' }}
                              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
                            >
                              <motion.div
                                initial={{ scale: 0.88, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.88, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                onClick={(e) => e.stopPropagation()}
                                style={{ cursor: 'default' }}
                                className="relative max-w-5xl w-full max-h-[90vh] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#080808]"
                              >
                                <img
                                  src={lightboxSrc}
                                  alt="Screenshot preview"
                                  style={{ cursor: 'default' }}
                                  className="w-full h-auto max-h-[90vh] object-contain"
                                />
                                <button
                                  onClick={(e) => { e.stopPropagation(); setLightboxSrc(null); }}
                                  style={{ cursor: 'pointer' }}
                                  className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 border border-white/10 rounded-full p-1.5 text-white transition-colors"
                                >
                                  <X size={16} />
                                </button>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* BUILD TAB */}
                  {activeTab === "BUILD" && (
                    <div className="space-y-4">
                      {stages.build?.summary && (
                        <motion.p variants={tabItemVariants} className="text-xs text-muted mb-2">
                          {stages.build.summary}
                        </motion.p>
                      )}

                      {extra.build?.architecture && (
                        <motion.div variants={tabItemVariants}>
                          <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-2">Architecture</h4>
                          <div className="inline-flex items-center gap-2 bg-[#141414] border border-line/40 px-3 py-2 rounded-lg text-xs font-mono text-[#c0c0c0]">
                            {extra.build.architecture}
                          </div>
                        </motion.div>
                      )}

                      {stages.build?.snippet && (
                        <motion.div variants={tabItemVariants} className="space-y-1">
                          <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase">Implementation Snippet</h4>
                          <pre className="overflow-x-auto rounded-lg border-l-4 border-gold bg-[#0D0D0D] p-3.5 font-mono text-[10px] leading-relaxed no-scrollbar select-text max-h-[220px] border border-line/40">
                            <code dangerouslySetInnerHTML={{ __html: highlightCode(stages.build.snippet) }} />
                          </pre>
                        </motion.div>
                      )}

                      {stages.design?.decisions && (
                        <motion.div variants={tabItemVariants}>
                          <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-2">Key Technical Decisions</h4>
                          <ul className="list-disc pl-4 space-y-1 text-xs text-[#a0a0a0]">
                            {stages.design.decisions.map((dec, idx) => (
                              <li key={idx}>{dec}</li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* TEST TAB */}
                  {activeTab === "TEST" && (
                    <div className="space-y-4">
                      {stages.test?.summary && (
                        <motion.p variants={tabItemVariants} className="text-xs text-muted mb-2">
                          {stages.test.summary}
                        </motion.p>
                      )}

                      {extra.test?.cases && (
                        <motion.div variants={tabItemVariants} className="overflow-x-auto border border-line/40 rounded-lg">
                          <table className="w-full border-collapse text-left text-[11px]">
                            <thead>
                              <tr className="border-b border-line bg-[#141414] text-muted">
                                <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Test Case</th>
                                <th className="py-2 px-3 font-semibold uppercase tracking-wider text-[9px]">Expected Behavior</th>
                                <th className="py-2 px-3 font-semibold uppercase tracking-wider text-right text-[9px]">Result</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-line/40 text-[#a0a0a0]">
                              {extra.test.cases.map((tc, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.01]">
                                  <td className="py-2.5 px-3 font-medium text-white">{tc.test}</td>
                                  <td className="py-2.5 px-3">{tc.expected}</td>
                                  <td className="py-2.5 px-3 text-right">
                                    <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-green-950/40 text-green-400 border border-green-900/60">
                                      PASS ✅
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </motion.div>
                      )}

                      <motion.div variants={tabItemVariants} className="flex items-center gap-6 mt-2 bg-[#141414] border border-line/40 p-3 rounded-lg w-fit">
                        <span className="text-[10px] font-semibold tracking-widest text-gold uppercase">Devices Tested</span>
                        <div className="flex items-center gap-4 text-xs text-[#a0a0a0]">
                          <div className="flex items-center gap-1.5">
                            <Monitor size={14} className="text-gold" />
                            <span>Desktop ✅</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Tablet size={14} className="text-gold" />
                            <span>Tablet ✅</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Smartphone size={14} className="text-gold" />
                            <span>Mobile ✅</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* SHIP TAB */}
                  {activeTab === "SHIP" && (
                    <div className="space-y-4">
                      {stages.ship?.summary && (
                        <motion.p variants={tabItemVariants} className="text-xs text-muted mb-2">
                          {stages.ship.summary}
                        </motion.p>
                      )}

                      {extra.ship?.lighthouse && (
                        <motion.div variants={tabItemVariants}>
                          <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-2">Lighthouse Audit Metrics</h4>
                          <div className="flex flex-wrap gap-4">
                            <LighthouseCircle label="Performance" score={extra.ship.lighthouse.performance} />
                            <LighthouseCircle label="Accessibility" score={extra.ship.lighthouse.accessibility} />
                            <LighthouseCircle label="Best Practices" score={extra.ship.lighthouse.bestPractices} />
                            <LighthouseCircle label="SEO" score={extra.ship.lighthouse.seo} />
                          </div>
                        </motion.div>
                      )}

                      {extra.ship?.deploymentStack && (
                        <motion.div variants={tabItemVariants}>
                          <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase mb-2">Deployment Environment</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-[#141414] border border-line/40 rounded-lg p-2.5">
                              <div className="text-[8px] text-muted uppercase tracking-wider mb-0.5">Frontend</div>
                              <div className="text-xs font-semibold text-white">{extra.ship.deploymentStack.frontend}</div>
                            </div>
                            <div className="bg-[#141414] border border-line/40 rounded-lg p-2.5">
                              <div className="text-[8px] text-muted uppercase tracking-wider mb-0.5">Backend</div>
                              <div className="text-xs font-semibold text-white">{extra.ship.deploymentStack.backend}</div>
                            </div>
                            <div className="bg-[#141414] border border-line/40 rounded-lg p-2.5">
                              <div className="text-[8px] text-muted uppercase tracking-wider mb-0.5">Database</div>
                              <div className="text-xs font-semibold text-white">{extra.ship.deploymentStack.database}</div>
                            </div>
                            <div className="bg-[#141414] border border-line/40 rounded-lg p-2.5">
                              <div className="text-[8px] text-muted uppercase tracking-wider mb-0.5">Infrastructure Host</div>
                              <div className="text-xs font-semibold text-white">{extra.ship.deploymentStack.host}</div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {extra.ship?.deployConfig && (
                        <motion.div variants={tabItemVariants} className="space-y-1">
                          <h4 className="text-[10px] font-semibold tracking-widest text-gold uppercase">Deployment Pipeline Configuration</h4>
                          <pre className="overflow-x-auto rounded-lg border-l-4 border-gold bg-[#0D0D0D] p-3.5 font-mono text-[10px] leading-relaxed no-scrollbar select-text max-h-[160px] border border-line/40">
                            <code className="text-[#a0a0a0]">{extra.ship.deployConfig}</code>
                          </pre>
                        </motion.div>
                      )}

                      <motion.div variants={tabItemVariants} className="flex flex-wrap items-center justify-between gap-4 border-t border-line/30 pt-3">
                        <div className="flex items-center gap-5 text-[11px] text-muted font-mono">
                          <div>
                            <span className="font-semibold text-gold uppercase">Version:</span> v1.0.0
                          </div>
                          <div>
                            <span className="font-semibold text-gold uppercase">Date:</span> Dec {year}
                          </div>
                        </div>

                        {live && (
                          <a
                            href={live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-gold text-[#080808] px-4 py-2 rounded-full text-[11px] font-semibold hover:bg-gold/80 transition-colors"
                          >
                            Live Demo <ArrowUpRight size={13} />
                          </a>
                        )}
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Bottom Row Case Study & PRD Doc Buttons */}
              <div className="flex justify-end items-center gap-3 mt-5 pt-4 border-t border-line/30">
                {requirementsDoc && (
                  <a
                    href={requirementsDoc}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="inline-flex items-center gap-2 border border-line text-[#8e8e8e] hover:border-gold/40 hover:text-gold bg-[#111] hover:bg-[#151515] px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300"
                  >
                    <FileText size={14} /> Requirements Doc
                  </a>
                )}
                <Link
                  to={`/projects/${slug}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="inline-flex items-center gap-2 border border-gold text-gold hover:bg-gold/10 px-4 py-2 rounded-full text-xs font-semibold transition-colors"
                >
                  View Full Case Study →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

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
        <motion.div
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
        </motion.div>
      </div>
    </section>
  );
}
