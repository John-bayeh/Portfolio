// All selected work — ordered as displayed in the Projects section.
const projects = [
  {
    number: "01",
    slug: "askuala-link-hr",
    name: "AskualaLink HR",
    description: "HR and attendance management for growing teams.",
    tech: ["Next.js", "Node.js"],
    year: "2026",
    github: null,
    live: null,
    privateReason: "This is a private project — the live demo is restricted due to personal data and company policy.",
    requirementsDoc: "/docs/askualalink-hr-requirements.html",
    screenshots: {
      thumbnail: '/screenshots/askualalink-hr/home_mobile.webp',
      design: [
        '/screenshots/askualalink-hr/home_mobile.webp',
        '/screenshots/askualalink-hr/mobile_1.webp',
        '/screenshots/askualalink-hr/admin-dashboard.webp',
        '/screenshots/askualalink-hr/admin-employees.webp',
        '/screenshots/askualalink-hr/mobile_2.webp',
        '/screenshots/askualalink-hr/mobile_3.webp',
        '/screenshots/askualalink-hr/admin-payroll.webp',
        '/screenshots/askualalink-hr/employee-dashboard.webp',
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
        screenshot: "/screenshots/project-01.webp",
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
    live: "https://telegram-award-website-dpnq.vercel.app/",
    requirementsDoc: "/docs/telegram-award-requirements.html",
    screenshot: "/screenshots/telegram-award/home.webp",
    tagline: "Community-driven awards, powered by Telegram.",
    screenshots: [
      { src: "/screenshots/telegram-award/home.webp",    type: "desktop", caption: "Category grid — home page" },
      { src: "/screenshots/telegram-award/chatbot.webp", type: "mobile",  caption: "AI Award Assistant chatbot" },
      { src: "/screenshots/telegram-award/signin.webp",  type: "mobile",  caption: "One-time code sign-in flow" },
    ],
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
        summary: "Award-show aesthetic — dark navy background, cyan branding, animated vote counters, mobile-first layout.",
        decisions: [
          "React SPA — no SSR needed, runs in Telegram in-app browser",
          "Node.js REST API for vote submission",
          "MongoDB for flexible nominee/category schema",
          "Framer Motion for vote count animations",
        ],
        screenshot: "/screenshots/telegram-award/home.webp",
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
    description: "Task management web application with priority tracking, due dates, sorting, and filtering.",
    tech: ["React", "JavaScript", "CSS3"],
    year: "2025",
    github: "https://github.com/John-bayeh/Todoappnew",
    live: "https://todoappnew-six.vercel.app/",
    requirementsDoc: "/docs/todo-app-requirements.html",
    screenshot: "/screenshots/Todoapp.webp",
    screenshots: {
      thumbnail: "/screenshots/Todoapp.webp",
      design: ["/screenshots/Todoapp.webp"],
    },
    tagline: "Streamlined task management interface with priority tracking and due dates.",
    codeSnippet: {
      title: 'React Task State Management & Filtering',
      language: 'javascript',
      code: `const [tasks, setTasks] = useState([]);
const [filter, setFilter] = useState("All");
const [sortBy, setSortBy] = useState("dueDate");

const filteredTasks = useMemo(() => {
  return tasks
    .filter((task) => {
      if (filter === "Completed") return task.completed;
      if (filter === "Active") return !task.completed;
      return true;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}, [tasks, filter, sortBy]);`
    },
    stages: {
      scope: {
        summary: "A clean and functional task management app designed for daily productivity. Built to offer intuitive task creation, priority assignment, category filtering, and deadline tracking.",
        items: [
          "Interactive Task Creation: Add tasks with custom titles, descriptions, due dates, and priority levels (High, Medium, Low)",
          "Filtering & Sorting: Filter by status (All, Active, Completed) and sort by due date or priority",
          "Task Status Toggle: Quick inline status completion toggle with immediate UI feedback",
          "Rich Card UI: Visual indicators for high-priority tasks and upcoming due dates",
          "Responsive Layout: Dark purple theme optimized for desktop and mobile viewports",
        ],
      },
      design: {
        summary: "Modern dark purple productivity UI. Task form and list structured as hero components with visual priority indicators and clear action buttons.",
        decisions: [
          "React functional components with useState and useMemo for efficient state filtering",
          "Vibrant action buttons (Green for complete, Gold for edit, Red for delete) for clear visual hierarchy",
          "Dark indigo and violet theme for low eye strain during task planning",
        ],
        screenshot: "/screenshots/Todoapp.webp",
      },
      build: {
        summary: "Built with React and Vite. Components structured into TaskForm, TaskCard, and FilterBar with clean state propagation.",
        snippet: `// Task completion handler
const toggleTaskCompletion = (id) => {
  setTasks((prev) =>
    prev.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
  );
};`,
        highlights: [
          "Component-driven architecture with modular subcomponents",
          "Optimized list re-rendering with React hooks",
          "Clean form validation for required task fields",
        ],
      },
      test: {
        summary: "Tested interactive UI flows, filter states, and form inputs for smooth user experience.",
        cases: [
          "Adding a task updates the task list immediately",
          "Filtering by 'Completed' hides active tasks",
          "Priority badges render with correct color coding",
          "Form prevents submission with empty task titles",
        ],
      },
      ship: {
        summary: "Frontend SPA build optimized for static hosting.",
        details: [
          "Platform: Static Web App",
          "Frontend: React (Vite)",
          "Build Tool: Vite",
          "Deployment: Web Host",
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
    requirementsDoc: "/docs/hr-assistant-requirements.html",
    screenshot: "/screenshots/hr-assistant.webp",
    screenshots: {
      thumbnail: "/screenshots/hr-assistant.webp",
      design: ["/screenshots/hr-assistant.webp"],
    },
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
        screenshot: "/screenshots/project-06.webp",
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
    github: null,
    requirementsDoc: "/docs/formula-management-requirements.html",
    allocationDoc: "/docs/formula_management_allocation.pdf",
    live: null,
    privateReason: "This is a private project — the live demo is restricted due to personal data and company policy.",
    screenshot: "/screenshots/formula_management.webp",
    tagline: "Project tracking built for formula-driven workflows.",
    stages: {
      scope: {
        summary: "A governance platform built above the existing PMS — replacing spreadsheet-based resource allocation with 5 configurable modules: Formula Engine, Corridor Engine, Schedule Matrix, Concept Administration, and Feasibility Administration. Non-destructive PMS integration via REST API or ETL fallback.",
        items: [
          "Module 1 — Formula Engine: configurable rule-based allocation with version control, audit trail, and override workflow",
          "Module 2 — Corridor Engine: min/max/threshold compliance monitoring with real-time alerts",
          "Module 3 — Schedule Matrix: Gantt visualization, forecasting from 4,000+ historical projects, resource conflict detection",
          "Module 4 — Concept Administration: digital submission → 3-stage approval workflow (Reviewer → Committee → Management)",
          "Module 5 — Feasibility Administration: structured study registration, evaluator assignment, standardized scoring",
          "Common Layer: RBAC, PMS integration connector, non-editable audit trail (7-year retention), notification service",
          "Non-destructive PMS integration — API-first with ETL fallback, bi-directional data sync",
          "Non-goals: modifying existing PMS database schema or codebase",
        ],
      },
      design: {
        summary: "Data-dense enterprise dashboard — sidebar navigation, tabbed module views, sortable data grids, and approval workflow panels. Built for governance users who need dense information at a glance.",
        decisions: [
          "React with Context API for global module state",
          "React Table for sortable/filterable data grids across formula and corridor views",
          "PostgreSQL for relational governance data (formulas, corridors, feasibility records)",
          "Node.js + Express REST API with RBAC middleware",
          "Modular component architecture — each module is an independent route",
        ],
        screenshot: "/screenshots/formula_management.webp",
        screenshots: [
          { src: "/screenshots/formula_management.webp", type: "desktop", caption: "FORMULA DASHBOARD" },
          { src: "/screenshots/formula_Magement2.webp", type: "desktop", caption: "ALLOCATION VIEW" },
        ],
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
    live: "https://hotel-master-qfcz78r5v-john-bayehs-projects.vercel.app/",
    requirementsDoc: "/docs/hotel-master-requirements.html",
    screenshot: "/screenshots/Hotel_Master.webp",
    tagline: "A premium hotel experience, from landing page to booking.",
    stages: {
      scope: {
        summary: "A high-end hotel showcase website for boutique hotels — visitors explore technology integrations, amenities, and service offerings, then submit consultation/booking requests via an Express backend integrated with Brevo transactional email delivery.",
        items: [
          "FR-01: Interactive Service & Amenity Showcase with filterable categories",
          "FR-02: Consultation / Booking Request form with validation and submit status",
          "FR-03: Express backend API endpoint (POST /api/contact) handling contact dispatches",
          "FR-04: Brevo API integration for transactional notification emails to management",
          "FR-05: Dynamic service data API endpoint (GET /api/services)",
          "FR-06: CORS origin restrictions allowing only trusted frontend deployments",
          "Stakeholders: Hotel Visitor/Guest (browses & submits inquiries), Hotel Management (receives email notifications)",
          "Non-goals: Full booking engine with payment processing or room inventory management",
        ],
      },
      design: {
        summary: "Luxury aesthetic — deep dark backgrounds, gold accents, large serif typography, and full-bleed imagery. Built with React 19 and Tailwind CSS v4 for a premium hospitality feel.",
        decisions: [
          "React 19 SPA with react-scroll for smooth section navigation",
          "Tailwind CSS v4 for utility-first luxury styling",
          "Framer Motion for entrance animations and scroll reveals",
          "Node.js + Express backend for contact/booking form submission",
          "Brevo API for transactional email delivery to hotel management",
        ],
        screenshot: "/screenshots/Hotel_Master.webp",
        screenshots: [
          { src: "/screenshots/Hotel_Master.webp", type: "desktop", caption: "HERO SECTION" },
          { src: "/screenshots/Hotel_Master2.webp", type: "desktop", caption: "SERVICES SHOWCASE" },
          { src: "/screenshots/Hotel_Master3.webp", type: "desktop", caption: "AMENITIES SECTION" },
          { src: "/screenshots/Hotel_Master4.webp", type: "desktop", caption: "BOOKING FORM" },
          { src: "/screenshots/Hotel_Master5.webp", type: "desktop", caption: "CONTACT SECTION" },
          { src: "/screenshots/image.webp", type: "desktop", caption: "MOBILE VIEW" },
        ],
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
