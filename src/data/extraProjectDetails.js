const extraProjectDetails = {
  "askuala-link-hr": {
    userStories: [
      "As an Admin, I want to manage employee records so that I can keep the directory up to date.",
      "As an HR Manager, I want to track attendance and leave requests to monitor team availability.",
      "As an Employee, I want to check in and request leave online for convenience."
    ],
    design: {
      colors: [
        { name: "Royal Blue", hex: "#2563EB" },
        { name: "Brand Blue", hex: "#3B82F6" },
        { name: "Slate Dark", hex: "#0F172A" },
        { name: "Slate Light", hex: "#F8FAFC" }
      ],
      components: ["EmployeeTable", "AttendanceCalendar", "LeaveRequestForm", "RoleGuard", "StatsCard"]
    },
    build: {
      architecture: "Next.js (App Router) → Node.js (Express) → PostgreSQL (Prisma)",
      architectureDiagram: [
        {
          iconKey: "nextjs",
          label: "Next.js Frontend",
          sub: "App Router · SSR · Tailwind CSS",
          primary: true,
        },
        {
          iconKey: "nodejs",
          label: "Node.js + Express API",
          sub: "REST API · JWT Auth · RBAC Middleware",
        },
        {
          iconKey: "postgresql",
          label: "PostgreSQL Database",
          sub: "Sequelize ORM · Migrations",
        },
        {
          // services row — rendered side by side
          label: "External Services",
          services: [
            { iconKey: "cloudflare", label: "Cloudflare R2", sub: "File Storage" },
            { iconKey: "brevo",      label: "Brevo SMTP",    sub: "Transactional Email" },
            { iconKey: "groq",       label: "Groq AI",       sub: "HR Chatbot" },
          ],
        },
      ],
      techDecisions: [
        {
          choice: "Next.js over React",
          reason: "Server-side rendering for faster initial load and better SEO on the employee portal.",
          badge: "Performance",
        },
        {
          choice: "PostgreSQL over MongoDB",
          reason: "Complex relational data — employees, payroll runs, attendance logs all join across tables.",
          badge: "Data Integrity",
        },
        {
          choice: "Sequelize ORM",
          reason: "Type-safe queries, auto-migration support, and association definitions keep the data layer clean.",
          badge: "DX",
        },
        {
          choice: "JWT + httpOnly Cookies",
          reason: "Tokens stored in httpOnly cookies prevent XSS access; short expiry + refresh flow guards against theft.",
          badge: "Security",
        },
        {
          choice: "Cloudflare R2",
          reason: "Zero egress fees for storing employee documents (contracts, CVs) at scale.",
          badge: "Cost",
        },
        {
          choice: "Groq AI",
          reason: "Fastest free inference API available — sub-200ms responses for the HR chatbot without a GPU bill.",
          badge: "Speed",
        },
        {
          choice: "Brevo SMTP",
          reason: "Reliable transactional email delivery for offer letters, payslips, and leave notifications.",
          badge: "Reliability",
        },
      ],
    },
    test: {
      // Legacy simple cases kept for backward compat
      cases: [
        { test: "Admin Employee Creation", expected: "Employee account created and welcome email sent", result: "pass" },
        { test: "Unauthorized Directory Access", expected: "Employee receives 403 Forbidden on foreign files", result: "pass" },
        { test: "Leave Balance Validation", expected: "Manager gets approval notification; balances deduct on approve", result: "pass" },
        { test: "CSV Payroll Export", expected: "Generates formatted payroll data within selected date bounds", result: "pass" },
        { test: "Concurrent Check-In", expected: "Handles database lock gracefully; creates single record", result: "pass" }
      ],

      // Rich test cases for the new TestSection component
      testCases: [
        // ── Authentication ──────────────────────────────────────────────────
        {
          category: "Authentication",
          scenario: "Login with valid credentials",
          expected: "Returns 200, sets httpOnly accessToken cookie, returns user role",
          result: "pass",
          tool: "Jest + Supertest",
        },
        {
          category: "Authentication",
          scenario: "Login with wrong password",
          expected: "Returns 401 Unauthorized — no cookie set",
          result: "pass",
          tool: "Jest + Supertest",
        },
        {
          category: "Authentication",
          scenario: "Access protected route with expired JWT",
          expected: "Returns 401; refresh-token endpoint issues a new access token",
          result: "fixed",
          fixNote: "Refresh token rotation wasn't clearing the old token — a second request with the same refresh token still worked. Fixed by invalidating the token in the DB after first use.",
          tool: "Jest + Supertest",
        },

        // ── RBAC ────────────────────────────────────────────────────────────
        {
          category: "RBAC",
          scenario: "Employee accesses /api/payroll/all (admin-only route)",
          expected: "Returns 403 Forbidden with role error message",
          result: "pass",
          tool: "Jest + Supertest",
        },
        {
          category: "RBAC",
          scenario: "HR Manager accesses /api/employees (manager+ route)",
          expected: "Returns 200 with employee list",
          result: "pass",
          tool: "Jest + Supertest",
        },
        {
          category: "RBAC",
          scenario: "Role check bypass via manipulated JWT payload",
          expected: "Signature validation rejects tampered token — 401",
          result: "fixed",
          fixNote: "During pen-test, found the role field was being read from the request body as a fallback before token decode. Removed the fallback — role now sourced exclusively from verified JWT claims.",
          tool: "Jest + Supertest",
        },

        // ── Payroll ─────────────────────────────────────────────────────────
        {
          category: "Payroll",
          scenario: "Monthly payroll calculation with overtime",
          expected: "Gross = base + (overtime hours × 1.5× hourly rate), deductions applied correctly",
          result: "pass",
          tool: "Jest",
        },
        {
          category: "Payroll",
          scenario: "Payslip PDF export for a specific employee",
          expected: "Generates valid PDF with correct figures; download link returns 200",
          result: "pass",
          tool: "Manual QA",
        },

        // ── Leave Management ────────────────────────────────────────────────
        {
          category: "Leave Management",
          scenario: "Leave balance deduction on approval",
          expected: "Annual leave balance decremented by exact working days in range (excludes weekends)",
          result: "fixed",
          fixNote: "Off-by-one: the day-count function was using ≤ endDate instead of < endDate, adding 1 phantom day to every approved request. Fixed in leaveUtils.js with a corrected inclusive-exclusive range.",
          tool: "Jest",
        },
        {
          category: "Leave Management",
          scenario: "Manager approves leave that overlaps with another approved request",
          expected: "Returns 409 Conflict — overlap not permitted",
          result: "pass",
          tool: "Jest + Supertest",
        },

        // ── Load Testing ────────────────────────────────────────────────────
        {
          category: "Load Testing",
          scenario: "100 concurrent users fetching attendance records",
          expected: "p95 response time < 500 ms, 0% error rate",
          result: "pass",
          note: "Measured: p50=87ms · p95=312ms · p99=441ms @ 100 VUs over 60s",
          tool: "k6",
        },
        {
          category: "Load Testing",
          scenario: "50 concurrent payroll-export requests (CPU-heavy)",
          expected: "p95 < 2s, error rate < 1%",
          result: "pass",
          note: "Measured: p95=1.4s · 0 errors @ 50 VUs over 30s",
          tool: "k6",
        },

        // ── Stress Testing ──────────────────────────────────────────────────
        {
          category: "Stress Testing",
          scenario: "Ramp from 10 → 400 concurrent users over 3 min",
          expected: "Graceful degradation — no crash, connection errors return 503 not 500",
          result: "fixed",
          fixNote: "At ~280 VUs, PostgreSQL connection pool (default: 5) exhausted — requests hung then timed out with unhandled Promise rejections. Fixed by setting pool.max=20 in Sequelize config and adding a 30s acquire timeout that returns a clean 503.",
          tool: "k6",
        },

        // ── DoS Resilience ──────────────────────────────────────────────────
        {
          category: "DoS Resilience",
          scenario: "Rapid repeated login attempts (brute-force simulation)",
          expected: "express-rate-limit blocks after 5 attempts/min — returns 429 Too Many Requests",
          result: "fixed",
          fixNote: "Rate limiting wasn't in place initially. After running the k6 brute-force script, added express-rate-limit (max: 5, windowMs: 60 000) on the /auth/login route and verified the 429 response.",
          tool: "k6",
        },
        {
          category: "DoS Resilience",
          scenario: "Oversized JSON payload on POST /api/employees",
          expected: "express.json({ limit: '50kb' }) rejects with 413 Payload Too Large",
          result: "pass",
          tool: "Jest + Supertest",
        },
      ],

      // Task 1 — Real Jest + Supertest RBAC middleware test
      jestSnippet: {
        title: "RBAC Middleware — Jest + Supertest",
        language: "javascript",
        code: `const request = require('supertest');
const app     = require('../src/app');
const jwt     = require('jsonwebtoken');
const { User } = require('../src/models');

// Helper — mint a signed JWT the same way the real login does
const sign = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

// Inject token as httpOnly cookie (mirrors real browser flow)
const withCookie = (token) =>
  \`accessToken=\${token}\`;

describe('RBAC Middleware', () => {
  let adminToken, hrToken, employeeToken;

  beforeAll(async () => {
    adminToken    = sign({ id: 1, role: 'admin' });
    hrToken       = sign({ id: 2, role: 'hr' });
    employeeToken = sign({ id: 3, role: 'employee' });

    // Stub DB lookups so no real DB needed in unit tests
    jest.spyOn(User, 'findByPk').mockImplementation((id) =>
      Promise.resolve({ id, role: { 1:'admin', 2:'hr', 3:'employee' }[id] })
    );
  });

  afterAll(() => jest.restoreAllMocks());

  // ── protect() ──────────────────────────────────────────────
  it('rejects requests with no token → 401', async () => {
    const res = await request(app).get('/api/payroll/all');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects tampered token → 401', async () => {
    const bad = adminToken.slice(0, -4) + 'xxxx';
    const res = await request(app)
      .get('/api/payroll/all')
      .set('Cookie', withCookie(bad));
    expect(res.status).toBe(401);
  });

  // ── authorize(...roles) ─────────────────────────────────────
  it('allows admin to access admin-only payroll route → 200', async () => {
    const res = await request(app)
      .get('/api/payroll/all')
      .set('Cookie', withCookie(adminToken));
    expect(res.status).toBe(200);
  });

  it('blocks employee from admin-only route → 403', async () => {
    const res = await request(app)
      .get('/api/payroll/all')
      .set('Cookie', withCookie(employeeToken));
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  it('allows HR manager on manager+ route → 200', async () => {
    const res = await request(app)
      .get('/api/employees')
      .set('Cookie', withCookie(hrToken));
    expect(res.status).toBe(200);
  });

  it('blocks employee from manager+ route → 403', async () => {
    const res = await request(app)
      .get('/api/employees')
      .set('Cookie', withCookie(employeeToken));
    expect(res.status).toBe(403);
  });

  // ── regression: role must come from token, not body ─────────
  it('ignores role field injected in request body → 403', async () => {
    const res = await request(app)
      .get('/api/payroll/all')
      .set('Cookie', withCookie(employeeToken))
      .send({ role: 'admin' });           // attacker attempt
    expect(res.status).toBe(403);
  });
});`,
      },

      // Task 4 — k6 load + brute-force script
      k6Snippet: {
        title: "k6 — Attendance Load + Login Brute-force",
        language: "javascript",
        code: `import http    from 'k6/http';
import { check, sleep } from 'k6';
import { Rate }  from 'k6/metrics';

const errorRate = new Rate('errors');
const BASE      = 'http://localhost:4000';

// ── Scenario A: 100 VU attendance load test ──────────────────
export const options = {
  scenarios: {
    attendance_load: {
      executor:    'constant-vus',
      vus:         100,
      duration:    '60s',
      tags:        { scenario: 'load' },
    },
    brute_force: {
      executor:    'constant-arrival-rate',
      rate:        20,           // 20 req/s
      timeUnit:    '1s',
      duration:    '30s',
      preAllocatedVUs: 5,
      tags:        { scenario: 'dos' },
      startTime:   '65s',       // run after load test
    },
  },
  thresholds: {
    'http_req_duration{scenario:load}': ['p(95)<500'],
    'errors{scenario:dos}':             ['rate>0.8'], // expect >80% blocked
  },
};

// Shared session cookie (pre-seeded for load test)
const SESSION = { Cookie: \`accessToken=\${__ENV.TEST_TOKEN}\` };

export default function () {
  const scenario = __ENV.K6_SCENARIO || 'attendance_load';

  if (scenario === 'attendance_load') {
    // ── Fetch own attendance records ──────────────────────────
    const r = http.get(\`\${BASE}/api/attendance/me\`, {
      headers: SESSION,
    });
    const ok = check(r, {
      'status 200':       (res) => res.status === 200,
      'has records key':  (res) => res.json()?.records !== undefined,
    });
    errorRate.add(!ok);
    sleep(0.5);

  } else {
    // ── Brute-force login (DoS resilience) ───────────────────
    const res = http.post(
      \`\${BASE}/api/auth/login\`,
      JSON.stringify({ email: 'attacker@test.com', password: 'wrong' }),
      { headers: { 'Content-Type': 'application/json' } },
    );
    // After 5 attempts rate-limiter should return 429
    check(res, { 'rate limited 429': (r) => r.status === 429 });
    errorRate.add(res.status !== 429 && res.status !== 401);
  }
}`,
      },
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
        { name: "Telegram Cyan",  hex: "#2AABEE" },
        { name: "Dark Navy",      hex: "#0D1117" },
        { name: "Card Surface",   hex: "#1A1F2E" },
        { name: "Pure White",     hex: "#FFFFFF" },
        { name: "Muted Text",     hex: "#8B8FA8" },
      ],
      components: ["CategoryCard", "AIChatbot", "SignInModal", "NomineeList", "LiveVoteCounter", "AdminDashboard"],
    },
    build: {
      architecture: "React SPA → Node.js (Express) → MongoDB (Mongoose)",
      architectureDiagram: [
        {
          iconKey: "react",
          label: "React SPA (Vite)",
          sub: "Fingerprint Generation · Framer Motion · Tailwind",
          primary: true,
        },
        {
          iconKey: "nodejs",
          label: "Node.js + Express API",
          sub: "Deduplication Rules · Rate Limiting · Fraud Checks",
        },
        {
          // services row — rendered side by side
          label: "Data & Caching Layer",
          services: [
            { iconKey: "redis",   label: "Redis Cache Buffer", sub: "Lock-free increments" },
            { iconKey: "mongodb", label: "MongoDB Database",   sub: "Persistent storage" },
          ],
        },
      ],
      techDecisions: [
        {
          choice: "React (Vite) SPA over Next.js",
          reason: "Platform runs inside Telegram's in-app webview; requires ultra-lightweight client bundle and instant static loading.",
          badge: "Performance",
        },
        {
          choice: "MongoDB over SQL (PostgreSQL)",
          reason: "Flexible nominee documents accommodate varying Telegram metadata, handles, and custom profiles.",
          badge: "Flexibility",
        },
        {
          choice: "Redis Write Buffering",
          reason: "Buffers high-frequency voting bursts in memory before flushing in batches to protect MongoDB from connection exhausts.",
          badge: "Scalability",
        },
      ],
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
