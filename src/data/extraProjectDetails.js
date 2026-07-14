const extraProjectDetails = {
  "askuala-link-hr": {
    userStories: [
      "As an Admin, I want to manage employee records so that I can keep the directory up to date.",
      "As an HR Manager, I want to track attendance and leave requests to monitor team availability.",
      "As an Employee, I want to check in and request leave online for convenience."
    ],
    design: {
      colors: [
        { name: "Teal", hex: "#0F766E" },
        { name: "Mint", hex: "#14B8A6" },
        { name: "Slate Dark", hex: "#0F172A" },
        { name: "Slate Light", hex: "#F8FAFC" }
      ],
      components: ["EmployeeTable", "AttendanceCalendar", "LeaveRequestForm", "RoleGuard", "StatsCard"]
    },
    build: {
      architecture: "Next.js (App Router) → Node.js (Express) → PostgreSQL (Prisma)"
    },
    test: {
      cases: [
        { test: "Admin Employee Creation", expected: "Employee account created and welcome email sent", result: "pass" },
        { test: "Unauthorized Directory Access", expected: "Employee receives 403 Forbidden on foreign files", result: "pass" },
        { test: "Leave Balance Validation", expected: "Manager gets approval notification; balances deduct on approve", result: "pass" },
        { test: "CSV Payroll Export", expected: "Generates formatted payroll data within selected date bounds", result: "pass" },
        { test: "Concurrent Check-In", expected: "Handles database lock gracefully; creates single record", result: "pass" }
      ]
    },
    ship: {
      lighthouse: { performance: 92, accessibility: 95, bestPractices: 90, seo: 98 },
      deploymentStack: {
        frontend: "Vercel",
        backend: "Railway",
        database: "PostgreSQL (Neon)",
        host: "Vercel + Railway CI/CD"
      },
      deployConfig: `name: Deploy to Production
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Build project
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.ORG_ID }}
          vercel-project-id: \${{ secrets.PROJECT_ID }}`
    }
  },
  "telegram-award": {
    userStories: [
      "As a user, I want to vote for nominees in various award categories.",
      "As a nominee, I want to see real-time vote counts to track progress.",
      "As an admin, I want to manage award categories and nominations."
    ],
    design: {
      colors: [
        { name: "Gold", hex: "#C9A84C" },
        { name: "Deep Charcoal", hex: "#111111" },
        { name: "Royal Blue", hex: "#1D4ED8" },
        { name: "Muted Gray", hex: "#6B7280" }
      ],
      components: ["VotingCard", "LiveCounter", "NomineeList", "CategoryTabs", "AdminDashboard"]
    },
    build: {
      architecture: "React SPA → Node.js (Express) → MongoDB (Mongoose)"
    },
    test: {
      cases: [
        { test: "Duplicate Vote Prevention", expected: "Second vote with same IP/fingerprint returns 429", result: "pass" },
        { test: "Vote Stagger Load Test", expected: "Database increments count accurately under 100 req/sec", result: "pass" },
        { test: "Voting Window Open/Close", expected: "Vote button is disabled when category status is closed", result: "pass" },
        { test: "Admin Category Creation", expected: "New category appears on the voting home page instantly", result: "pass" },
        { test: "Nominee Cleanup", expected: "Deleting nominee removes their record and all associated votes", result: "pass" }
      ]
    },
    ship: {
      lighthouse: { performance: 95, accessibility: 92, bestPractices: 96, seo: 90 },
      deploymentStack: {
        frontend: "Netlify",
        backend: "Render",
        database: "MongoDB Atlas",
        host: "Netlify + Render Pipeline"
      },
      deployConfig: `services:
  web:
    build: npm run build
    publish: dist/
    headers:
      /*
        Cache-Control: max-age=31536000
  api:
    type: web
    env: node
    buildCommand: npm install && npm run build
    startCommand: node server.js`
    }
  },
  "todo-app": {
    userStories: [
      "As a user, I want to add, complete, and delete tasks quickly.",
      "As a busy person, I want to filter tasks by done/not-done to focus on active work."
    ],
    design: {
      colors: [
        { name: "Indigo", hex: "#4F46E5" },
        { name: "Violet", hex: "#8B5CF6" },
        { name: "White", hex: "#FFFFFF" },
        { name: "Cool Gray", hex: "#F3F4F6" }
      ],
      components: ["TaskInput", "TaskItem", "FilterBar", "OptimisticToggle", "TaskList"]
    },
    build: {
      architecture: "React (Functional Hooks) → Node.js (Express) → SQLite (Sequelize)"
    },
    test: {
      cases: [
        { test: "Empty task validation", expected: "Input field flashes red; task creation prevented", result: "pass" },
        { test: "Optimistic toggle fallback", expected: "UI reverts to original state if patch request fails", result: "pass" },
        { test: "Complete filter visibility", expected: "Completed tasks hide when filtering for Active", result: "pass" },
        { test: "Persistent local store", expected: "Refreshed browser displays task list retrieved from db", result: "pass" },
        { test: "Delete sync", expected: "Task deleted from DOM and removed from backend sqlite database", result: "pass" }
      ]
    },
    ship: {
      lighthouse: { performance: 99, accessibility: 100, bestPractices: 98, seo: 95 },
      deploymentStack: {
        frontend: "Express Static",
        backend: "Railway",
        database: "SQLite (Local File)",
        host: "Railway Unified Monorepo"
      },
      deployConfig: `# Railway Deployment Configuration
[build]
builder = "nixpacks"
buildCommand = "npm run build"

[deploy]
startCommand = "node server.js"
restartPolicy = "on-failure"
maxRetries = 5`
    }
  },
  "hr-assistant-ai": {
    userStories: [
      "As an employee, I want to ask HR policy questions and get instant streaming answers.",
      "As an HR admin, I want to upload document updates to train the AI's knowledge base."
    ],
    design: {
      colors: [
        { name: "Emerald", hex: "#10B981" },
        { name: "Slate", hex: "#1E293B" },
        { name: "Gold Accent", hex: "#C9A84C" },
        { name: "Chat Gray", hex: "#F1F5F9" }
      ],
      components: ["ChatWindow", "MessageStream", "DocUploader", "SourceCitation", "DocList"]
    },
    build: {
      architecture: "React (SSE Stream) → Python (FastAPI + LangChain) → ChromaDB (OpenAI Embeddings)"
    },
    test: {
      cases: [
        { test: "Leave balance lookup accuracy", expected: "Chatbot extracts exact paragraph and quotes source doc", result: "pass" },
        { test: "Off-topic prompt injection", expected: "Bot responds with standard out-of-scope disclaimer", result: "pass" },
        { test: "Multi-turn context retention", expected: "Follow-up questions resolve pronouns correctly", result: "pass" },
        { test: "SSE connection retry", expected: "Reconnects automatically if socket drops during stream", result: "pass" },
        { test: "Admin document upload", expected: "Embeddings update ChromaDB; bot answers change on next run", result: "pass" }
      ]
    },
    ship: {
      lighthouse: { performance: 89, accessibility: 94, bestPractices: 92, seo: 90 },
      deploymentStack: {
        frontend: "Vercel",
        backend: "Render Web Service",
        database: "ChromaDB (Volume Mounted)",
        host: "Vercel + Render Deployment"
      },
      deployConfig: `version: 1
services:
  fastapi-backend:
    git_repo: github.com/user/hr-assistant
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    disk:
      name: chromadb-data
      mountPath: /data/chromadb
      sizeGB: 10`
    }
  },
  "formula-management": {
    userStories: [
      "As a chemist/engineer, I want to manage and version formulas with associated projects.",
      "As a manager, I want to review and approve formulas through a formal workflow."
    ],
    design: {
      colors: [
        { name: "Royal Blue", hex: "#2563EB" },
        { name: "Slate Steel", hex: "#64748B" },
        { name: "Gold Outline", hex: "#C9A84C" },
        { name: "Snow White", hex: "#FAFAFA" }
      ],
      components: ["FormulaGrid", "VersionHistory", "ApprovalFlow", "ExportButton", "ProjectCard"]
    },
    build: {
      architecture: "React (Context API) → localStorage (Mock Backend) → Client-side State"
    },
    test: {
      cases: [
        { test: "Transition state validation", expected: "Formula cannot move to 'Approved' without 'Review' phase", result: "pass" },
        { test: "Immutable version tracking", expected: "Previous versions lock; edit creates new linked child record", result: "pass" },
        { test: "Version timeline rendering", expected: "Audit list correctly maps ancestors using parentId chain", result: "pass" },
        { test: "CSV export boundaries", expected: "Export matches table filters exactly; only approved rows", result: "pass" },
        { test: "Storage overflow check", expected: "Warns user when localStorage limit is reached", result: "pass" }
      ]
    },
    ship: {
      lighthouse: { performance: 96, accessibility: 98, bestPractices: 95, seo: 92 },
      deploymentStack: {
        frontend: "GitHub Pages",
        backend: "None (Client-only Demo)",
        database: "Browser localStorage",
        host: "GitHub Pages pipeline"
      },
      deployConfig: `name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Build site
        run: |
          npm ci
          npm run build
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist`
    }
  },
  "hotel-master": {
    userStories: [
      "As a guest, I want to browse luxury rooms and view booking availability.",
      "As a guest, I want to reserve a room using a date picker without conflicts."
    ],
    design: {
      colors: [
        { name: "Luxury Gold", hex: "#C9A84C" },
        { name: "Ebony Black", hex: "#080808" },
        { name: "Charcoal Card", hex: "#111111" },
        { name: "White Text", hex: "#FFFFFF" }
      ],
      components: ["RoomShowcase", "BookingForm", "DatePicker", "AmenitiesList", "SmoothScroller"]
    },
    build: {
      architecture: "React SPA (Tailwind CSS) → Node.js (Express) → MongoDB (Mongoose)"
    },
    test: {
      cases: [
        { test: "Date conflict detection", expected: "Count of conflicting reservations returns > 0; blocks booking", result: "pass" },
        { test: "Form validation triggers", expected: "Checkout before checkin returns custom error validation", result: "pass" },
        { test: "Room filter functionality", expected: "Filters rooms by room class and pricing accurately", result: "pass" },
        { test: "Email booking notification", expected: "Postgres/MongoDB logs status; triggers nodemailer confirm", result: "pass" },
        { test: "Responsive grid layout", expected: "Adapts 3-column desktop view into 1-column mobile flow", result: "pass" }
      ]
    },
    ship: {
      lighthouse: { performance: 94, accessibility: 96, bestPractices: 92, seo: 100 },
      deploymentStack: {
        frontend: "Vercel",
        backend: "Railway",
        database: "MongoDB Atlas",
        host: "Vercel + Railway CI/CD"
      },
      deployConfig: `version: 2
builds:
  - src: package.json
    use: @vercel/static-build
    config:
      distDir: dist
routes:
  - src: "/api/(.*)"
    dest: "https://hotel-master-api.railway.app/api/$1"
  - handle: filesystem
  - src: "/(.*)"
    dest: "/index.html"`
    }
  }
};

export default extraProjectDetails;
