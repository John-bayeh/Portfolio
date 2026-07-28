import { memo, useState } from "react";

// Regex-based simple code highlighter
function highlightCode(code) {
  if (!code) return "";
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  escaped = escaped.replace(/(\/\/.*)/g, '<span class="text-green-500 font-normal">$1</span>');
  escaped = escaped.replace(/(['"`].*?['"`])/g, '<span class="text-[#E6D080]">$1</span>');
  escaped = escaped.replace(
    /\b(const|let|var|function|return|if|else|async|await|new|import|export|from|class|extends|try|catch|throw|for|while|switch|case|default|break|continue|describe|it|expect|beforeAll|afterAll|jest|require)\b/g,
    '<span class="text-[#7AA2F7]">$1</span>'
  );
  escaped = escaped.replace(
    /\b(true|false|null|undefined|toBe|toEqual|toMatch|toBeCalled|mockImplementation)\b/g,
    '<span class="text-[#FF9E64] font-semibold">$1</span>'
  );
  return escaped;
}

const TestSection = memo(function TestSection({ testData }) {
  if (!testData) return null;

  const [lightboxSrc, setLightboxSrc] = useState(null);

  const { testCases = [], cases = [], jestSnippet, k6Snippet, codeSnippet, testingScreenshots = [] } = testData;

  // SECTION 1 — HERO SCREENSHOT (single most impressive screenshot)
  const heroScreenshot = testingScreenshots.length > 0 ? testingScreenshots[0] : null;

  // SECTION 2 — TEST RESULTS TABLE (top 6 rows, 3 columns: Test Case | Expected | Result)
  const rawCases = testCases.length > 0 ? testCases : cases;
  const tableRows = rawCases.slice(0, 6).map((c) => ({
    name: c.test || c.scenario || c.name || "Test Case",
    expected: c.expected || "Expected behavior verified",
    result: (c.result || "pass").toLowerCase(),
  }));

  // SECTION 3 — CODE SNIPPET (ONE snippet, max 15 lines)
  const rawSnippet = jestSnippet || k6Snippet || codeSnippet;
  let codeSnippetText = "";
  let langLabel = "JavaScript";

  if (rawSnippet) {
    if (typeof rawSnippet === "string") {
      codeSnippetText = rawSnippet;
    } else if (rawSnippet.code) {
      codeSnippetText = rawSnippet.code;
      langLabel = rawSnippet.language || rawSnippet.title || "JavaScript";
    }
  }

  // Trim to max 15 lines
  const slicedCode = codeSnippetText
    ? codeSnippetText.split("\n").slice(0, 15).join("\n")
    : "";

  const heroSrc = heroScreenshot
    ? heroScreenshot.url || heroScreenshot.src || heroScreenshot
    : null;

  return (
    <div className="space-y-6 select-text text-left">
      {/* LIGHTBOX OVERLAY */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className="fixed top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white text-lg transition-colors z-[10000]"
            onClick={() => setLightboxSrc(null)}
            aria-label="Close lightbox"
          >
            ✕
          </button>
          <img
            src={lightboxSrc}
            alt="Full screenshot"
            className="w-full max-w-3xl rounded-xl shadow-2xl border border-white/10 my-8"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* SECTION 1 — HERO SCREENSHOT (top) */}
      {heroScreenshot && (
        <div className="space-y-2">
          <div
            className="w-full rounded-xl overflow-hidden border border-line/60 bg-[#080808] cursor-zoom-in group relative"
            onClick={() => setLightboxSrc(heroSrc)}
            title="Click to view full size"
          >
            <img
              src={heroSrc}
              alt={heroScreenshot.title || "Test Verification Proof"}
              className="w-full h-auto block transition-transform duration-300 group-hover:scale-[1.01] cursor-zoom-in"
              loading="lazy"
            />
            {/* Hover hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/70 text-white text-xs font-mono px-3 py-1.5 rounded-lg border border-white/20">
                🔍 Click to enlarge
              </span>
            </div>
          </div>
          <p className="text-xs font-mono font-semibold text-gold">
            {heroScreenshot.title
              ? `PROVED: ${heroScreenshot.title} ${heroScreenshot.badge ? `(${heroScreenshot.badge})` : ""}`
              : "PROVED: Automated system verification passed successfully"}
          </p>
        </div>
      )}

      {/* SECTION 2 — TEST RESULTS TABLE (middle) */}
      {tableRows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-line/60 bg-[#0d0d0d]">
          <table className="w-full border-collapse text-left text-[11px] font-sans">
            <thead>
              <tr className="border-b border-line/40 bg-[var(--th-bg)] text-muted">
                <th className="py-2.5 px-4 font-semibold uppercase tracking-wider text-[9px] w-5/12">
                  Test Case
                </th>
                <th className="py-2.5 px-4 font-semibold uppercase tracking-wider text-[9px] w-5/12">
                  Expected
                </th>
                <th className="py-2.5 px-4 font-semibold uppercase tracking-wider text-right text-[9px] w-2/12">
                  Result
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/30 text-[var(--th-text-60)]">
              {tableRows.map((row, idx) => {
                const isPass = row.result.includes("pass") || row.result.includes("fixed") || row.result.includes("done");
                return (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-4 font-medium text-[var(--th-text)]">
                      {row.name}
                    </td>
                    <td className="py-2.5 px-4">{row.expected}</td>
                    <td className="py-2.5 px-4 text-right">
                      {isPass ? (
                        <span className="inline-flex items-center bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                          PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                          FAIL
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* SECTION 3 — CODE SNIPPET (bottom) */}
      {slicedCode && (
        <div className="rounded-xl border border-line/60 overflow-hidden bg-[#0D0D0D] shadow-inner">
          <div className="flex items-center justify-between bg-[#141414] border-b border-line/30 px-4 py-2">
            <span className="text-[9px] font-mono text-muted uppercase tracking-wider">
              Test Code Evidence
            </span>
            <span className="text-[8px] font-mono font-bold text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
              {langLabel}
            </span>
          </div>
          <pre className="overflow-x-auto border-l-4 border-gold bg-[#0D0D0D] p-4 font-mono text-[10px] leading-relaxed text-white select-text code-scrollbar max-h-[220px]">
            <code dangerouslySetInnerHTML={{ __html: highlightCode(slicedCode) }} />
          </pre>
        </div>
      )}
    </div>
  );
});

export default TestSection;
