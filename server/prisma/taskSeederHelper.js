/**
 * Task Seeder Helper
 * Generates rich, realistic tasks, subtasks, comments, and worklogs
 * dynamically tailored to whatever projects and users exist in the database.
 */

export function getProjectTaskTemplates(project) {
  const name = (project.name || "").toLowerCase();
  const desc = (project.description || "").toLowerCase();
  const text = `${name} ${desc}`;

  if (text.includes("web") || text.includes("redesign") || text.includes("site") || text.includes("ui/ux")) {
    return [
      {
        title: "Design homepage & landing page mockup",
        description: "Create high-fidelity mockups in Figma with modern design system tokens and responsive layouts.",
        status: "Done",
        priority: "High",
        progress: 100,
        estimatedHours: 16,
        offsetStart: 0.05,
        offsetDue: 0.25,
        subtasks: [
          { title: "User research & wireframe sketches", isCompleted: true },
          { title: "Figma high-fidelity prototype", isCompleted: true },
          { title: "Design review with marketing stakeholders", isCompleted: true }
        ],
        comments: [
          "Mockup approved by product and marketing teams. Ready for slicing."
        ],
        worklogs: [
          { hours: 8, description: "Wireframing and initial UI exploration" },
          { hours: 8, description: "Finalizing design system tokens and Figma components" }
        ]
      },
      {
        title: "Implement responsive header & navigation bar",
        description: "Develop responsive navigation header with hamburger menu, blur effects, and smooth drawer transitions.",
        status: "In Progress",
        priority: "High",
        progress: 60,
        estimatedHours: 20,
        offsetStart: 0.20,
        offsetDue: 0.45,
        subtasks: [
          { title: "Desktop navigation layout & dropdowns", isCompleted: true },
          { title: "Mobile hamburger menu drawer", isCompleted: true },
          { title: "Keyboard navigation & ARIA accessibility", isCompleted: false }
        ],
        comments: [
          "Mobile drawer transition completed, currently testing on iOS and Android viewports."
        ],
        worklogs: [
          { hours: 6, description: "Header layout and desktop navigation links" },
          { hours: 6, description: "Mobile drawer animation with Framer Motion" }
        ]
      },
      {
        title: "Accessibility (a11y) & typography contrast audit",
        description: "Audit typography sizes, heading hierarchy, and contrast ratios to meet WCAG 2.1 AA compliance.",
        status: "Review",
        priority: "Medium",
        progress: 85,
        estimatedHours: 12,
        offsetStart: 0.35,
        offsetDue: 0.55,
        subtasks: [
          { title: "Run automated axe-core & Lighthouse audit", isCompleted: true },
          { title: "Fix low-contrast button and subtitle styles", isCompleted: true },
          { title: "QA sign-off on screen reader testing", isCompleted: false }
        ],
        comments: [
          "Accessibility score improved to 96/100 on Lighthouse. Pending final QA verification."
        ],
        worklogs: [
          { hours: 6, description: "Lighthouse audit and contrast adjustments" },
          { hours: 4, description: "Screen reader tests with NVDA and VoiceOver" }
        ]
      },
      {
        title: "Setup analytics tracking & conversion goals",
        description: "Integrate Google Analytics 4, heatmaps, and event tracking for CTA buttons and forms.",
        status: "To Do",
        priority: "Medium",
        progress: 0,
        estimatedHours: 10,
        offsetStart: 0.55,
        offsetDue: 0.75,
        subtasks: [
          { title: "Configure GA4 property and GTM container", isCompleted: false },
          { title: "Setup custom event triggers for CTA button clicks", isCompleted: false },
          { title: "Verify tag firing in Google Tag Assistant", isCompleted: false }
        ],
        comments: [],
        worklogs: []
      },
      {
        title: "Fix mobile menu backdrop blur glitch",
        description: "Investigate and resolve backdrop-filter rendering issues on iOS Safari and older Chrome browsers.",
        status: "To Do",
        priority: "High",
        progress: 0,
        estimatedHours: 6,
        offsetStart: 0.50,
        offsetDue: 0.65,
        subtasks: [
          { title: "Inspect WebKit backdrop-filter CSS prefixing", isCompleted: false },
          { title: "Test hardware acceleration workarounds", isCompleted: false }
        ],
        comments: [
          "Reported by QA: menu background flickers when scrolling on iPhone 12."
        ],
        worklogs: []
      }
    ];
  }

  if (text.includes("mobile") || text.includes("app") || text.includes("flutter") || text.includes("react native") || text.includes("ios") || text.includes("android")) {
    return [
      {
        title: "Research cross-platform frameworks (React Native vs Flutter)",
        description: "Evaluate performance, community support, hardware access, and ecosystem for mobile app foundation.",
        status: "Done",
        priority: "High",
        progress: 100,
        estimatedHours: 20,
        offsetStart: 0.05,
        offsetDue: 0.20,
        subtasks: [
          { title: "Benchmark performance & bundle sizes", isCompleted: true },
          { title: "Assess existing team skillsets in React", isCompleted: true },
          { title: "Publish decision matrix document", isCompleted: true }
        ],
        comments: [
          "React Native selected for faster iteration and seamless TypeScript sharing."
        ],
        worklogs: [
          { hours: 10, description: "Benchmarking sample apps in React Native and Flutter" },
          { hours: 10, description: "Compiling decision document and presentation" }
        ]
      },
      {
        title: "Setup development environment & CI/CD workflow",
        description: "Configure React Native toolchain, Metro bundler, Fastlane scripts, and automated GitHub Actions builds.",
        status: "In Progress",
        priority: "High",
        progress: 75,
        estimatedHours: 24,
        offsetStart: 0.15,
        offsetDue: 0.40,
        subtasks: [
          { title: "Configure Fastlane build scripts for iOS & Android", isCompleted: true },
          { title: "Setup GitHub Actions workflow for staging builds", isCompleted: true },
          { title: "Automate TestFlight distribution", isCompleted: false }
        ],
        comments: [
          "Android build pipeline is green; configuring iOS provisioning profiles."
        ],
        worklogs: [
          { hours: 10, description: "Fastlane and Android SDK automated build script" },
          { hours: 8, description: "GitHub Actions workflow setup and secrets configuration" }
        ]
      },
      {
        title: "Create app architecture diagram & state management RFC",
        description: "Design overall app state flow, offline-first data caching strategy, and modular feature architecture.",
        status: "Review",
        priority: "High",
        progress: 90,
        estimatedHours: 16,
        offsetStart: 0.30,
        offsetDue: 0.50,
        subtasks: [
          { title: "Draw data-flow architecture diagram", isCompleted: true },
          { title: "Define Zustand store slices and middleware", isCompleted: true },
          { title: "Peer architectural review with PM and Tech Lead", isCompleted: false }
        ],
        comments: [
          "RFC draft submitted. Ready for peer review comments."
        ],
        worklogs: [
          { hours: 8, description: "Architecture diagram and state management design" },
          { hours: 6, description: "Drafting RFC document and API specifications" }
        ]
      },
      {
        title: "Implement authentication flow (Biometrics & OAuth)",
        description: "Implement sign-in with Google/Apple, biometric authentication (FaceID/Fingerprint), and secure JWT storage.",
        status: "To Do",
        priority: "High",
        progress: 0,
        estimatedHours: 28,
        offsetStart: 0.45,
        offsetDue: 0.70,
        subtasks: [
          { title: "Setup keychain / secure storage for refresh token", isCompleted: false },
          { title: "Implement FaceID / TouchID biometric prompt", isCompleted: false },
          { title: "Handle session expiration and silent token refresh", isCompleted: false }
        ],
        comments: [],
        worklogs: []
      },
      {
        title: "Push notification service integration",
        description: "Integrate Firebase Cloud Messaging (FCM) and Apple Push Notification service (APNs).",
        status: "To Do",
        priority: "Medium",
        progress: 0,
        estimatedHours: 16,
        offsetStart: 0.60,
        offsetDue: 0.85,
        subtasks: [
          { title: "Setup FCM credentials and APNs p8 certificate", isCompleted: false },
          { title: "Handle foreground and background notification tap events", isCompleted: false }
        ],
        comments: [],
        worklogs: []
      }
    ];
  }

  if (text.includes("api") || text.includes("payment") || text.includes("integration") || text.includes("backend") || text.includes("gateway")) {
    return [
      {
        title: "Review payment gateway documentation & API specifications",
        description: "Thoroughly review gateway API specifications, error handling models, idempotency keys, and webhook security.",
        status: "Done",
        priority: "High",
        progress: 100,
        estimatedHours: 12,
        offsetStart: 0.05,
        offsetDue: 0.20,
        subtasks: [
          { title: "Study Stripe / Midtrans API specs and sandbox limits", isCompleted: true },
          { title: "List required webhook event types and signature schemas", isCompleted: true }
        ],
        comments: [
          "Sandbox credentials acquired and tested with curl."
        ],
        worklogs: [
          { hours: 6, description: "Documentation review and API contract mapping" },
          { hours: 6, description: "Sandbox configuration and credential setup" }
        ]
      },
      {
        title: "Implement payment checkout & charge endpoint",
        description: "Create REST API endpoints to initiate payments, create checkout sessions, and validate currency amounts.",
        status: "In Progress",
        priority: "High",
        progress: 50,
        estimatedHours: 24,
        offsetStart: 0.20,
        offsetDue: 0.50,
        subtasks: [
          { title: "Create payment session initiation endpoint", isCompleted: true },
          { title: "Add amount rounding and multi-currency validator", isCompleted: true },
          { title: "Implement idempotency key verification middleware", isCompleted: false }
        ],
        comments: [
          "Payment intent endpoint responds successfully in test mode. Adding idempotency checks."
        ],
        worklogs: [
          { hours: 8, description: "Payment checkout endpoint scaffold and validation" },
          { hours: 4, description: "Currency calculation logic and unit tests" }
        ]
      },
      {
        title: "Review security audit & PCI-DSS compliance",
        description: "Validate compliance with PCI-DSS requirements, ensuring zero storage of sensitive cardholder details.",
        status: "Review",
        priority: "High",
        progress: 85,
        estimatedHours: 14,
        offsetStart: 0.40,
        offsetDue: 0.65,
        subtasks: [
          { title: "Run automated security vulnerability scan", isCompleted: true },
          { title: "Verify logs do not contain raw PAN or CVV", isCompleted: true },
          { title: "Sign-off from internal compliance officer", isCompleted: false }
        ],
        comments: [
          "Security scan shows 0 high-risk issues. Log sanitize filter verified."
        ],
        worklogs: [
          { hours: 8, description: "Log audit and credential tokenization verification" },
          { hours: 4, description: "Security documentation checklist review" }
        ]
      },
      {
        title: "Write integration tests for payment webhook flow",
        description: "Develop automated tests to simulate webhook events (payment.succeeded, payment.failed, charge.refunded).",
        status: "To Do",
        priority: "Medium",
        progress: 0,
        estimatedHours: 16,
        offsetStart: 0.60,
        offsetDue: 0.85,
        subtasks: [
          { title: "Mock webhook HMAC signature verification", isCompleted: false },
          { title: "Test idempotency on duplicate webhook deliveries", isCompleted: false },
          { title: "Test database transaction rollback on webhook failure", isCompleted: false }
        ],
        comments: [],
        worklogs: []
      },
      {
        title: "Setup automated alert monitoring for failed transactions",
        description: "Configure alerting via Slack/Discord and Prometheus metrics for transaction failure spikes.",
        status: "To Do",
        priority: "Low",
        progress: 0,
        estimatedHours: 8,
        offsetStart: 0.70,
        offsetDue: 0.95,
        subtasks: [
          { title: "Setup notification webhook channel", isCompleted: false },
          { title: "Set alert threshold: >3% payment failure rate in 10 mins", isCompleted: false }
        ],
        comments: [],
        worklogs: []
      }
    ];
  }

  if (text.includes("database") || text.includes("migration") || text.includes("postgres") || text.includes("mysql") || text.includes("sql")) {
    return [
      {
        title: "Analyze schema differences and data type mapping",
        description: "Audit MySQL tables, data types, indexes, and constraints to define clean PostgreSQL migration mappings.",
        status: "Done",
        priority: "High",
        progress: 100,
        estimatedHours: 18,
        offsetStart: 0.05,
        offsetDue: 0.25,
        subtasks: [
          { title: "Map MySQL data types to PostgreSQL equivalents", isCompleted: true },
          { title: "Review foreign keys, cascade rules, and check constraints", isCompleted: true },
          { title: "Compile mapping documentation for the engineering team", isCompleted: true }
        ],
        comments: [
          "All table types successfully mapped without data truncation risk."
        ],
        worklogs: [
          { hours: 10, description: "Schema inspection and type compatibility comparison" },
          { hours: 8, description: "Mapping documentation and team review" }
        ]
      },
      {
        title: "Create automated migration scripts & constraints",
        description: "Write ETL migration scripts with Prisma schema migrations and sequence resets.",
        status: "Done",
        priority: "High",
        progress: 100,
        estimatedHours: 26,
        offsetStart: 0.20,
        offsetDue: 0.50,
        subtasks: [
          { title: "Write batch extraction and insertion scripts", isCompleted: true },
          { title: "Add composite indexes and unique constraints", isCompleted: true },
          { title: "Reset auto-increment sequence counters", isCompleted: true }
        ],
        comments: [
          "Scripts tested with mock database dump."
        ],
        worklogs: [
          { hours: 14, description: "Prisma schema migration and batch script creation" },
          { hours: 12, description: "Indexing and sequence generator optimizations" }
        ]
      },
      {
        title: "Dry-run data migration on staging database",
        description: "Execute full migration rehearsal on staging with production-sized dataset and monitor downtime window.",
        status: "Done",
        priority: "High",
        progress: 100,
        estimatedHours: 16,
        offsetStart: 0.45,
        offsetDue: 0.70,
        subtasks: [
          { title: "Dump and sanitize staging data", isCompleted: true },
          { title: "Measure execution runtime and bottleneck queries", isCompleted: true },
          { title: "Verify row count matches between source and target", isCompleted: true }
        ],
        comments: [
          "Rehearsal finished in 18 minutes, well within 1-hour maintenance target."
        ],
        worklogs: [
          { hours: 8, description: "Staging database provisioning and dump preparation" },
          { hours: 8, description: "Migration execution timing and validation checks" }
        ]
      },
      {
        title: "Validate data integrity & query performance benchmarking",
        description: "Run comprehensive row count checks, checksum verifications, and benchmark critical application queries.",
        status: "Done",
        priority: "Medium",
        progress: 100,
        estimatedHours: 14,
        offsetStart: 0.65,
        offsetDue: 0.85,
        subtasks: [
          { title: "Run checksum queries on all core transactional tables", isCompleted: true },
          { title: "Benchmark top 20 queries with EXPLAIN ANALYZE", isCompleted: true }
        ],
        comments: [
          "Performance is ~25% faster on PostgreSQL thanks to better indexing."
        ],
        worklogs: [
          { hours: 8, description: "Checksum comparisons and data validation script" },
          { hours: 6, description: "EXPLAIN ANALYZE benchmark tests" }
        ]
      },
      {
        title: "Production database cutover and rollback verification",
        description: "Execute scheduled live cutover during maintenance window with automated health checks.",
        status: "Done",
        priority: "High",
        progress: 100,
        estimatedHours: 12,
        offsetStart: 0.80,
        offsetDue: 0.98,
        subtasks: [
          { title: "Put application into read-only maintenance mode", isCompleted: true },
          { title: "Perform final delta sync and database cutover", isCompleted: true },
          { title: "Verify application health checks and switch DNS", isCompleted: true }
        ],
        comments: [
          "Cutover executed smoothly with zero data loss."
        ],
        worklogs: [
          { hours: 6, description: "Live cutover execution and delta sync" },
          { hours: 6, description: "Post-migration verification and monitoring" }
        ]
      }
    ];
  }

  if (text.includes("marketing") || text.includes("campaign") || text.includes("promo") || text.includes("ads")) {
    return [
      {
        title: "Formulate campaign goals & target audience personas",
        description: "Define key campaign objectives, target customer segments, and primary performance metrics (CPA, CTR, ROAS).",
        status: "Done",
        priority: "High",
        progress: 100,
        estimatedHours: 14,
        offsetStart: 0.05,
        offsetDue: 0.25,
        subtasks: [
          { title: "Define target CPA and conversion KPIs", isCompleted: true },
          { title: "Build customer persona profiles (SME & Enterprise)", isCompleted: true }
        ],
        comments: [
          "Campaign strategy and target KPIs approved."
        ],
        worklogs: [
          { hours: 8, description: "Market research and audience persona segmentation" },
          { hours: 6, description: "KPI target modeling and channel allocation" }
        ]
      },
      {
        title: "Design creative banners & promotional assets",
        description: "Produce visual assets for social media, Google Display Network, and marketing landing pages.",
        status: "Done",
        priority: "Medium",
        progress: 100,
        estimatedHours: 22,
        offsetStart: 0.20,
        offsetDue: 0.50,
        subtasks: [
          { title: "Design banner sets in 5 standard IAB display sizes", isCompleted: true },
          { title: "Create 15-second promotional video reel for Instagram/LinkedIn", isCompleted: true }
        ],
        comments: [
          "All creative assets delivered in high resolution."
        ],
        worklogs: [
          { hours: 12, description: "Display ad banner design and resizing" },
          { hours: 10, description: "Motion graphics reel animation and sound mixing" }
        ]
      },
      {
        title: "Copywriting for email newsletter & ad headlines",
        description: "Draft persuasive ad copy, value propositions, and a 3-part email onboarding sequence.",
        status: "Done",
        priority: "Medium",
        progress: 100,
        estimatedHours: 12,
        offsetStart: 0.35,
        offsetDue: 0.60,
        subtasks: [
          { title: "Write A/B testing ad copy variations", isCompleted: true },
          { title: "Draft 3-step email nurture drip sequence", isCompleted: true }
        ],
        comments: [
          "Copywriting reviewed and approved."
        ],
        worklogs: [
          { hours: 6, description: "Ad headline copy variations" },
          { hours: 6, description: "Email marketing copy and call-to-action refinement" }
        ]
      },
      {
        title: "Launch Google Ads & Meta advertising campaign",
        description: "Configure ad groups, targeting parameters, pixel conversion tracking, and campaign launch.",
        status: "Done",
        priority: "High",
        progress: 100,
        estimatedHours: 16,
        offsetStart: 0.55,
        offsetDue: 0.80,
        subtasks: [
          { title: "Setup Meta Pixel and Google Conversion tags", isCompleted: true },
          { title: "Allocate budget and bidding strategy", isCompleted: true }
        ],
        comments: [
          "Campaign launched across both channels."
        ],
        worklogs: [
          { hours: 8, description: "Ad platform setup, audience targeting, and bidding" },
          { hours: 8, description: "Conversion tracking and budget schedules" }
        ]
      },
      {
        title: "Campaign performance review & ROI analytics report",
        description: "Analyze campaign metrics, conversion funnel drop-offs, and calculate final return on ad spend.",
        status: "Done",
        priority: "Low",
        progress: 100,
        estimatedHours: 10,
        offsetStart: 0.75,
        offsetDue: 0.98,
        subtasks: [
          { title: "Aggregate conversion metrics across channels", isCompleted: true },
          { title: "Present retrospective report to executive team", isCompleted: true }
        ],
        comments: [
          "Campaign exceeded target ROAS by 18%."
        ],
        worklogs: [
          { hours: 6, description: "Data aggregation and metric calculations" },
          { hours: 4, description: "Final presentation slide deck" }
        ]
      }
    ];
  }

  // Fallback for any other project (Dynamic general project template)
  return [
    {
      title: `Scope Definition & Requirements for ${project.name}`,
      description: `Gather requirements, define key deliverables, and align project scope with stakeholders.`,
      status: project.status === "Planning" ? "Done" : "Done",
      priority: "High",
      progress: 100,
      estimatedHours: 16,
      offsetStart: 0.05,
      offsetDue: 0.20,
      subtasks: [
        { title: "Conduct stakeholder discovery session", isCompleted: true },
        { title: "Draft product requirements document (PRD)", isCompleted: true },
        { title: "Sign-off on deliverables checklist", isCompleted: true }
      ],
      comments: [
        "Project scope approved by project manager."
      ],
      worklogs: [
        { hours: 8, description: "Requirements gathering and discovery" },
        { hours: 8, description: "Documentation and scope breakdown" }
      ]
    },
    {
      title: `System Architecture & Implementation Plan`,
      description: `Define technical architecture, component structure, and workflow milestones.`,
      status: project.status === "Planning" ? "In Progress" : "Done",
      priority: "High",
      progress: project.status === "Planning" ? 60 : 100,
      estimatedHours: 20,
      offsetStart: 0.15,
      offsetDue: 0.38,
      subtasks: [
        { title: "Architectural blueprint and data flow diagram", isCompleted: true },
        { title: "Component breakdown and dependency matrix", isCompleted: project.status !== "Planning" }
      ],
      comments: [
        "Architecture plan reviewed by technical lead."
      ],
      worklogs: [
        { hours: 10, description: "Architectural planning and diagramming" }
      ]
    },
    {
      title: `Core Feature Implementation (Phase 1)`,
      description: `Implement primary functionalities, data models, and business logic.`,
      status: project.status === "Completed" || project.status === "Archived" ? "Done" : "In Progress",
      priority: "High",
      progress: project.status === "Completed" || project.status === "Archived" ? 100 : 55,
      estimatedHours: 32,
      offsetStart: 0.30,
      offsetDue: 0.60,
      subtasks: [
        { title: "Core logic and service layer", isCompleted: true },
        { title: "Data validation and error handling", isCompleted: true },
        { title: "Integration wiring with frontend", isCompleted: project.status === "Completed" || project.status === "Archived" }
      ],
      comments: [
        "Phase 1 development is progressing smoothly according to milestone."
      ],
      worklogs: [
        { hours: 12, description: "Developing core service layer" },
        { hours: 6, description: "Writing input validators and exception handlers" }
      ]
    },
    {
      title: `UI/UX Polish & Responsive Adaptations`,
      description: `Refine user interface aesthetics, responsive viewports, and visual interaction states.`,
      status: project.status === "Completed" || project.status === "Archived" ? "Done" : "Review",
      priority: "Medium",
      progress: project.status === "Completed" || project.status === "Archived" ? 100 : 80,
      estimatedHours: 18,
      offsetStart: 0.50,
      offsetDue: 0.75,
      subtasks: [
        { title: "Review mobile and tablet responsiveness", isCompleted: true },
        { title: "Interaction micro-animations and feedback states", isCompleted: true },
        { title: "Final UI review", isCompleted: project.status === "Completed" || project.status === "Archived" }
      ],
      comments: [
        "Interface reviewed on multiple screen resolutions."
      ],
      worklogs: [
        { hours: 8, description: "Responsive adjustments and CSS polish" }
      ]
    },
    {
      title: `Quality Assurance, Testing & Deployment`,
      description: `Perform end-to-end regression tests, user acceptance testing (UAT), and prepare production deployment.`,
      status: project.status === "Completed" || project.status === "Archived" ? "Done" : "To Do",
      priority: "High",
      progress: project.status === "Completed" || project.status === "Archived" ? 100 : 0,
      estimatedHours: 24,
      offsetStart: 0.70,
      offsetDue: 0.95,
      subtasks: [
        { title: "End-to-end integration test execution", isCompleted: project.status === "Completed" || project.status === "Archived" },
        { title: "User acceptance testing sign-off", isCompleted: project.status === "Completed" || project.status === "Archived" },
        { title: "Production deployment and release notes", isCompleted: project.status === "Completed" || project.status === "Archived" }
      ],
      comments: [],
      worklogs: project.status === "Completed" || project.status === "Archived" ? [
        { hours: 14, description: "UAT testing and deployment verification" }
      ] : []
    }
  ];
}

/**
 * Calculates realistic start and due dates within a project's timeline
 */
export function calculateTaskDates(project, offsetStart, offsetDue) {
  const now = new Date();
  let baseStart = project.startDate ? new Date(project.startDate) : new Date(now.getTime() - 30 * 86400000);
  let baseEnd = project.endDate ? new Date(project.endDate) : new Date(now.getTime() + 60 * 86400000);

  const durationMs = Math.max(baseEnd.getTime() - baseStart.getTime(), 14 * 86400000);
  const taskStartMs = baseStart.getTime() + durationMs * offsetStart;
  const taskDueMs = baseStart.getTime() + durationMs * offsetDue;

  return {
    startDate: new Date(taskStartMs),
    dueDate: new Date(taskDueMs)
  };
}

/**
 * Executes task seeding for given projects and users
 */
export async function seedTasksForProjects(prisma, options = {}) {
  const { reset = false, specificProjectId = null } = options;

  const projects = await prisma.project.findMany({
    where: specificProjectId ? { id: parseInt(specificProjectId) } : undefined,
    include: { tasks: true }
  });

  const users = await prisma.user.findMany();
  if (users.length === 0) {
    throw new Error("No users found in database. Please seed users first.");
  }

  // Filter members and PMs for task assignments
  const assignees = users.filter((u) => u.role === "Member" || u.role === "PM");
  const availableAssignees = assignees.length > 0 ? assignees : users;

  let totalTasksCreated = 0;
  let totalSubtasksCreated = 0;
  let totalCommentsCreated = 0;
  let totalWorklogsCreated = 0;

  for (const project of projects) {
    if (reset && project.tasks.length > 0) {
      const taskIds = project.tasks.map((t) => t.id);
      await prisma.comment.deleteMany({ where: { taskId: { in: taskIds } } });
      await prisma.subtask.deleteMany({ where: { taskId: { in: taskIds } } });
      await prisma.worklog.deleteMany({ where: { taskId: { in: taskIds } } });
      await prisma.task.deleteMany({ where: { projectId: project.id } });
    } else if (!reset && project.tasks.length > 0) {
      // If not resetting and project already has tasks, skip to prevent duplicates
      continue;
    }

    const templates = getProjectTaskTemplates(project);

    for (let i = 0; i < templates.length; i++) {
      const tmpl = templates[i];
      const assignee = availableAssignees[(i + project.id) % availableAssignees.length];
      const { startDate, dueDate } = calculateTaskDates(project, tmpl.offsetStart, tmpl.offsetDue);

      // Adjust task status if the project itself is Completed or Archived
      let finalStatus = tmpl.status;
      let finalProgress = tmpl.progress;
      if (project.status === "Completed" || project.status === "Archived") {
        finalStatus = "Done";
        finalProgress = 100;
      }

      const task = await prisma.task.create({
        data: {
          projectId: project.id,
          title: tmpl.title,
          description: tmpl.description,
          status: finalStatus,
          priority: tmpl.priority,
          assigneeId: assignee.id,
          startDate,
          dueDate,
          progress: finalProgress,
          estimatedHours: tmpl.estimatedHours
        }
      });
      totalTasksCreated++;

      // Create Subtasks
      if (tmpl.subtasks && tmpl.subtasks.length > 0) {
        for (const st of tmpl.subtasks) {
          const isDone = finalStatus === "Done" ? true : st.isCompleted;
          await prisma.subtask.create({
            data: {
              taskId: task.id,
              title: st.title,
              isCompleted: isDone
            }
          });
          totalSubtasksCreated++;
        }
      }

      // Create Comments
      if (tmpl.comments && tmpl.comments.length > 0) {
        const commentAuthor = users.find((u) => u.role === "PM") || users[0];
        for (const msg of tmpl.comments) {
          await prisma.comment.create({
            data: {
              taskId: task.id,
              userId: commentAuthor.id,
              message: msg
            }
          });
          totalCommentsCreated++;
        }
      }

      // Create Worklogs
      if (tmpl.worklogs && tmpl.worklogs.length > 0 && (finalStatus !== "To Do")) {
        for (const wl of tmpl.worklogs) {
          await prisma.worklog.create({
            data: {
              taskId: task.id,
              userId: assignee.id,
              hours: wl.hours,
              description: wl.description
            }
          });
          totalWorklogsCreated++;
        }
      }
    }
  }

  return {
    projectsCount: projects.length,
    tasksCreated: totalTasksCreated,
    subtasksCreated: totalSubtasksCreated,
    commentsCreated: totalCommentsCreated,
    worklogsCreated: totalWorklogsCreated
  };
}
