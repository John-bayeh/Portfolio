// All selected work — ordered as displayed in the Projects section.
const projects = [
  {
    number: "01",
    slug: "askuala-link-hr",
    name: "AskualaLink HR",
    description: "HR and attendance management for growing teams.",
    tech: ["Next.js", "Node.js"],
    year: "2026",
    github: "https://github.com/askualalink/AskualaLink-HR-Recruitment-System-front",
    live: null,
    requirementsDoc: "https://docs.google.com/document/d/1XeCw6PAjrqdjem1k-BbSE4sZjFWMz-fyzKbf5FqXF9g/edit?tab=t.0",
    screenshots: {
      thumbnail: '/screenshots/askualalink-hr/home_mobile.jpg',
      design: [
        '/screenshots/askualalink-hr/home_mobile.jpg',
        '/screenshots/askualalink-hr/mobile_1.jpg',
        '/screenshots/askualalink-hr/admin-dashboard.png',
        '/screenshots/askualalink-hr/admin-employees.png',
        '/screenshots/askualalink-hr/mobile_2.jpg',
        '/screenshots/askualalink-hr/mobile_3.jpg',
        '/screenshots/askualalink-hr/admin-payroll.png',
        '/screenshots/askualalink-hr/employee-dashboard.png',
      ]
    },
    tagline: "Streamlining HR operations from hire to retire.",
    codeSnippet: {
      title: 'Role-Based Access Control Middleware',
      language: 'javascript',
      code: `const protect = async (req, res, next) => {
  let token;
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized' 
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findByPk(decoded.id);
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: \`Role \${req.user.role} not authorized\`
      });
    }
    next();
  };
};`
    },
    stages: {
      scope: {
        summary: "AskualaLink-HR is an integrated HR management platform designed to modernize workplace operations through four core pillars: Identity-Verified Attendance, AI-Driven Talent Acquisition, Automated Candidate Engagement, and Precision Payroll Management. The system bridges the gap between hiring a candidate and ensuring they are paid accurately for their physical presence.",
        items: [
          "Zero-Trust Attendance: 3-way check (SSO Identity + GPS Geofence + specific Router BSSID MAC address) to prevent proxy clock-ins",
          "Prompt-Driven AI Ranking: Gemini/Grok AI-powered CV parser & semantic resume scoring (0-100) using custom natural-language instructions",
          "One-Click Communication: NodeMailer SMTP service that triggers automated HTML templates to a dynamic Top-N shortlist of candidates",
          "Seamless Hire-to-Pay Automation: Monthly salaries, overtime, and deductions calculated automatically from verified attendance logs",
          "User Roles: Secure role-based access control (RBAC) separating Admin, HR / Manager, and Employee self-service views",
        ],
      },
      design: {
        summary: "Dashboard-first UI with sidebar navigation, data tables, and a calendar view for attendance.",
        decisions: [
          "Next.js App Router for SSR and role-based layouts",
          "Tailwind + shadcn/ui for consistent components",
          "PostgreSQL with Prisma ORM for relational data",
          "JWT + refresh token auth flow",
        ],
        screenshot: "/screenshots/project-01.png",
      },
      build: {
        summary: "Built modular feature slices — each HR module is an independent route with its own data layer.",
        snippet: `// Attendance check-in endpoint
app.post('/api/attendance/checkin', authenticate, async (req, res) => {
  const existing = await db.attendance.findFirst({
    where: { employeeId: req.body.employeeId, date: today() },
  });
  if (existing?.checkIn)
    return res.status(409).json({ error: 'Already checked in' });
  const record = await db.attendance.create({
    data: { employeeId: req.body.employeeId, checkIn: new Date() },
  });
  res.json(record);
});`,
        highlights: [
          "Role-based route guards",
          "Optimistic UI updates",
          "CSV export for reports",
        ],
      },
      test: {
        summary: "Manual QA across all user roles plus integration tests for attendance and leave APIs.",
        cases: [
          "Admin can create, edit, and deactivate employees",
          "Employee cannot access other employees records",
          "Leave request triggers notification to manager",
          "Attendance report exports correct date range",
          "Handles concurrent check-in attempts gracefully",
        ],
      },
      ship: {
        summary: "Deployed on Vercel (frontend) and Railway (backend). CI runs lint and build on every push.",
        details: [
          "Frontend: Vercel — automatic preview deployments on PRs",
          "Backend: Railway — Node.js + PostgreSQL",
          "CI: GitHub Actions — lint, build, type-check",
          "Secrets managed via Vercel/Railway dashboards",
        ],
      },
    },
  },
  {
    number: "02",
    slug: "telegram-award",
    name: "Telegram Award",
    description: "Voting and awards platform for Telegram channels.",
    tech: ["React", "Node.js"],
    year: "2025",
    github: "https://github.com/John-bayeh/Telegram_Award_Website",
    live: null,
    requirementsDoc: "/docs/telegram-award-requirements.html",
    screenshot: "/screenshots/project-04.png",
    tagline: "Community-driven awards, powered by Telegram.",
    stages: {
      scope: {
        summary: "Public voting site where Telegram channel admins nominate members and audiences vote for winners.",
        items: [
          "Anyone can view nominations and vote once per category",
          "Admins manage categories and nominees via dashboard",
          "Voting window with open/close dates",
          "Real-time vote count display",
        ],
      },
      design: {
        summary: "Award-show aesthetic — dark background, gold accents, animated vote counters.",
        decisions: [
          "React SPA — no SSR needed",
          "Node.js REST API for vote submission",
          "MongoDB for flexible nominee/category schema",
          "Framer Motion for vote count animations",
        ],
        screenshot: "/screenshots/project-04.png",
      },
      build: {
        summary: "Vote submission uses IP + fingerprint check to prevent duplicates without requiring login.",
        snippet: `// Vote deduplication
router.post('/vote', async (req, res) => {
  const { nomineeId, categoryId, fingerprint } = req.body;
  const voted = await VoteLog.exists({ categoryId, fingerprint });
  if (voted) return res.status(429).json({ error: 'Already voted' });
  await Promise.all([
    Nominee.updateOne({ _id: nomineeId }, { $inc: { votes: 1 } }),
    VoteLog.create({ categoryId, fingerprint }),
  ]);
  res.json({ ok: true });
});`,
        highlights: [
          "Duplicate vote prevention",
          "Real-time counter updates",
          "Admin vote reset capability",
        ],
      },
      test: {
        summary: "Tested voting rules, admin controls, and the open/close window logic.",
        cases: [
          "User cannot vote twice in the same category",
          "Votes are counted correctly under concurrent submissions",
          "Admin can open and close voting per category",
          "Closed categories show results not vote buttons",
          "Invalid nominee IDs return 404",
        ],
      },
      ship: {
        summary: "Static frontend on Netlify, API on Render. Admins received a private dashboard URL.",
        details: [
          "Frontend: Netlify — instant deploys from main branch",
          "Backend: Render — Node.js",
          "Database: MongoDB Atlas free cluster",
          "Admin access via private URL with token",
        ],
      },
    },
  },
  {
    number: "03",
    slug: "todo-app",
    name: "Todo App",
    description: "Task manager with done / not-done filter.",
    tech: ["React", "Node.js"],
    year: "2025",
    github: "https://github.com/John-bayeh/Todoappnew",
    live: null,
    screenshot: "/screenshots/project-05.png",
    tagline: "Simple, fast, and distraction-free task management.",
    stages: {
      scope: {
        summary: "Minimal full-stack todo app focused on speed — add, complete, filter, delete tasks without friction.",
        items: [
          "Add tasks with a single input + enter",
          "Mark tasks done/undone",
          "Filter: All / Active / Completed",
          "Persist tasks in a backend database",
        ],
      },
      design: {
        summary: "Minimal single-column layout. No sidebar, no modals — everything in one view.",
        decisions: [
          "React functional components with hooks",
          "Express REST API — 4 endpoints only",
          "SQLite for zero-config local persistence",
          "CSS Modules for scoped styling",
        ],
        screenshot: "/screenshots/project-05.png",
      },
      build: {
        summary: "Optimistic UI updates — tasks appear instantly before the API confirms.",
        snippet: `// Optimistic toggle
function toggleTask(id) {
  setTasks(prev =>
    prev.map(t => t.id === id ? { ...t, done: !t.done } : t)
  );
  api.patch(\`/tasks/\${id}/toggle\`).catch(() => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
  });
}`,
        highlights: [
          "Optimistic UI",
          "Filter state preserved on reload",
          "Keyboard-first UX",
        ],
      },
      test: {
        summary: "Manual smoke tests covering all CRUD operations and filter states.",
        cases: [
          "Adding an empty task is prevented",
          "Completed tasks appear in Completed filter",
          "Deleting a task removes it from all filters",
          "Tasks persist after page refresh",
          "Filter state preserved in URL params",
        ],
      },
      ship: {
        summary: "Frontend and backend deployed together on Railway as a monorepo.",
        details: [
          "Frontend: Served as static build from Express",
          "Backend: Railway — Node + SQLite",
          "Deploy: push to main triggers auto-deploy",
          "No external services or secrets needed",
        ],
      },
    },
  },
  {
    number: "04",
    slug: "hr-assistant-ai",
    name: "HR Assistant AI",
    description: "AI chatbot for HR queries.",
    tech: ["React", "Python"],
    year: "2026",
    github: "https://github.com/John-bayeh/hr-assistant",
    live: "https://hr-assistant-o1ktjq8e8-john-bayehs-projects.vercel.app",
    screenshot: "/screenshots/project-06.png",
    tagline: "Instant answers to HR policy questions, powered by AI.",
    stages: {
      scope: {
        summary: "AI chatbot employees can ask HR policy questions without waiting for an HR rep.",
        items: [
          "Chat interface with streaming responses",
          "Knowledge base from HR policy documents",
          "Context-aware follow-up questions",
          "No hallucination on out-of-scope queries",
          "Admin can update the knowledge base",
        ],
      },
      design: {
        summary: "RAG architecture — retrieval augmented generation so answers are grounded in actual company docs.",
        decisions: [
          "Python FastAPI backend with LangChain",
          "OpenAI GPT-4o for generation",
          "ChromaDB for vector embeddings",
          "React frontend with streaming SSE",
        ],
        screenshot: "/screenshots/project-06.png",
      },
      build: {
        summary: "Documents are chunked, embedded, and stored in ChromaDB. Top-k chunks retrieved at query time.",
        snippet: `# RAG retrieval pipeline
def answer_query(question: str):
    docs = vectorstore.similarity_search(question, k=4)
    context = "\\n\\n".join(d.page_content for d in docs)
    prompt = HR_SYSTEM_PROMPT.format(context=context)
    for chunk in llm.stream([
        SystemMessage(content=prompt),
        HumanMessage(content=question),
    ]):
        yield chunk.content`,
        highlights: [
          "Streaming responses via SSE",
          "Source citation in answers",
          "Graceful out-of-scope handling",
        ],
      },
      test: {
        summary: "Tested accuracy on policy questions and robustness against out-of-scope queries.",
        cases: [
          "Correctly answers leave balance questions from policy doc",
          "Refuses to answer questions outside HR domain",
          "Follow-up questions maintain context",
          "Streaming works on slow connections",
          "Admin doc upload updates knowledge base without restart",
        ],
      },
      ship: {
        summary: "Frontend on Vercel, Python API on Render. ChromaDB persisted on a mounted volume.",
        details: [
          "Frontend: Vercel — React SPA",
          "Backend: Render — Python FastAPI",
          "Vector DB: ChromaDB on Render persistent disk",
          "Secrets: OpenAI API key via Render env vars",
        ],
      },
    },
  },
  {
    number: "05",
    slug: "formula-management",
    name: "Formula Management",
    description: "Web-based project management system.",
    tech: ["React"],
    year: "2026",
    github: "https://github.com/askualalink/formula_mgmt",
    live: null,
    screenshot: "/screenshots/project-07.png",
    tagline: "Project tracking built for formula-driven workflows.",
    stages: {
      scope: {
        summary: "Project management tool for teams working with formula-based calculations — tracking projects, formulas, versions, and approvals.",
        items: [
          "Create and manage projects with associated formulas",
          "Version control for formula changes",
          "Approval workflow: Draft → Review → Approved",
          "Dashboard with project status overview",
          "Export approved formulas as PDF/CSV",
        ],
      },
      design: {
        summary: "Data-dense dashboard layout with sidebar navigation and tables with detail panels.",
        decisions: [
          "React with Context API for global state",
          "React Table for sortable/filterable data grids",
          "localStorage persistence for demo",
          "Modular components for easy backend integration later",
        ],
        screenshot: "/screenshots/project-07.png",
      },
      build: {
        summary: "Formula versioning stores each change as an immutable record with a parent reference.",
        snippet: `// Immutable formula versioning
function createNewVersion(formula, changes) {
  return {
    id: crypto.randomUUID(),
    parentId: formula.id,
    version: formula.version + 1,
    ...changes,
    status: 'draft',
    createdAt: new Date().toISOString(),
  };
}`,
        highlights: [
          "Immutable version history",
          "Approval state machine",
          "Bulk CSV export",
        ],
      },
      test: {
        summary: "Tested the approval workflow state machine and formula versioning edge cases.",
        cases: [
          "Cannot approve a formula still in Draft state",
          "Approving supersedes the previous approved version",
          "Formula history shows full audit trail",
          "Export includes only approved formulas",
          "Dashboard counts update after status changes",
        ],
      },
      ship: {
        summary: "Static React app deployed on GitHub Pages. No backend required for the demo.",
        details: [
          "Hosting: GitHub Pages — static build",
          "Build: Vite output to /dist",
          "Data: localStorage for demo persistence",
          "Deploy: manual gh-pages push",
        ],
      },
    },
  },
  {
    number: "06",
    slug: "hotel-master",
    name: "Hotel Master",
    description: "Premium hotel services showcase and booking system.",
    tech: ["React", "Node.js", "Tailwind CSS"],
    year: "2026",
    github: "https://github.com/John-bayeh/Hotel_Master",
    live: "https://hotel-master-qfcz78r5v-john-bayehs-projects.vercel.app/#ReactJS",
    screenshot: "/screenshots/Hotel_Master.png",
    tagline: "A premium hotel experience, from landing page to booking.",
    stages: {
      scope: {
        summary: "Full hotel website with room showcase, amenities, booking form, and contact — targeted at boutique hotels.",
        items: [
          "Landing hero with CTA to book",
          "Room listings with photos, pricing, and availability",
          "Amenities and services section",
          "Booking form with date picker and room selection",
          "Mobile-responsive, fast-loading",
        ],
      },
      design: {
        summary: "Luxury aesthetic — dark backgrounds, gold accents, large typography, full-bleed imagery.",
        decisions: [
          "React SPA with react-scroll for smooth navigation",
          "Tailwind CSS for utility-first styling",
          "Framer Motion for entrance animations",
          "Node.js backend for booking form submission",
        ],
        screenshot: "/screenshots/Hotel_Master.png",
      },
      build: {
        summary: "Booking form validates availability client-side and submits to Node backend which stores the reservation.",
        snippet: `// Booking availability check
async function checkAvailability(roomId, checkIn, checkOut) {
  const conflicts = await Booking.countDocuments({
    roomId,
    status: { $ne: 'cancelled' },
    $or: [
      { checkIn: { $lt: checkOut, $gte: checkIn } },
      { checkOut: { $gt: checkIn, $lte: checkOut } },
    ],
  });
  return conflicts === 0;
}`,
        highlights: [
          "Smooth scroll navigation",
          "Date conflict detection",
          "Animated room cards",
          "Mobile-first layout",
        ],
      },
      test: {
        summary: "QA covered booking edge cases, form validation, and responsive layout across devices.",
        cases: [
          "Cannot book a room with conflicting dates",
          "Check-out date must be after check-in date",
          "Booking confirmation sent on success",
          "All images load correctly on mobile",
          "Smooth scroll works across all section links",
        ],
      },
      ship: {
        summary: "Frontend on Vercel with automatic deploys. Backend on Railway.",
        details: [
          "Frontend: Vercel — automatic deploys on push to main",
          "Backend: Railway — Node.js + MongoDB",
          "Live: https://hotel-master-qfcz78r5v-john-bayehs-projects.vercel.app",
          "Custom domain configured via Vercel",
        ],
      },
    },
  },
];

export default projects;
