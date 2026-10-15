-- ========================================================
-- DATABASE INITIALIZATION SCRIPT FOR POSTGRESQL
-- Project Management App
--
-- DEFAULT LOGIN ACCOUNTS:
-- Admin           : admin@example.com | Password: password123
-- Project Manager : john@example.com  | Password: password123
-- Member          : jane@example.com / bob@example.com | Password: password123
-- ========================================================

-- Drop table jika sudah ada (berdasarkan dependency hierarchy)
DROP TABLE IF EXISTS "Comment" CASCADE;
DROP TABLE IF EXISTS "Task" CASCADE;
DROP TABLE IF EXISTS "Project" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- 1. Table User
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'Member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table Project
CREATE TABLE "Project" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'Planning',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "ownerId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table Task
CREATE TABLE "Task" (
    "id" SERIAL PRIMARY KEY,
    "projectId" INTEGER NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'To Do',
    "priority" VARCHAR(50) NOT NULL DEFAULT 'Medium',
    "assigneeId" INTEGER REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "dueDate" TIMESTAMP(3),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3),
    "estimatedHours" DOUBLE PRECISION
);

-- 4. Table Comment
CREATE TABLE "Comment" (
    "id" SERIAL PRIMARY KEY,
    "taskId" INTEGER NOT NULL REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexing
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- ========================================================
-- INITIAL SEED DATA (Password default: password123)
-- ========================================================

-- Insert Sample Users
INSERT INTO "User" ("id", "name", "email", "password", "role", "createdAt") VALUES
(1, 'Admin User', 'admin@example.com', '$2a$10$rZcZGlZ.SGk7Y6x.l129puyph5uWXQrTFK7AicM1scReByAUqWP6y', 'Admin', NOW()),
(2, 'John Doe', 'john@example.com', '$2a$10$rZcZGlZ.SGk7Y6x.l129puyph5uWXQrTFK7AicM1scReByAUqWP6y', 'PM', NOW()),
(3, 'Jane Smith', 'jane@example.com', '$2a$10$rZcZGlZ.SGk7Y6x.l129puyph5uWXQrTFK7AicM1scReByAUqWP6y', 'Member', NOW()),
(4, 'Bob Wilson', 'bob@example.com', '$2a$10$rZcZGlZ.SGk7Y6x.l129puyph5uWXQrTFK7AicM1scReByAUqWP6y', 'Member', NOW());

-- Reset sequence generator untuk User.id
SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max(id), 1)) FROM "User";

-- Insert Sample Projects
INSERT INTO "Project" ("id", "name", "description", "status", "startDate", "endDate", "ownerId", "createdAt", "updatedAt") VALUES
(1, 'Website Redesign', 'Redesign company website with modern UI/UX', 'Ongoing', '2026-01-15 00:00:00', '2026-03-30 00:00:00', 2, NOW(), NOW()),
(2, 'Mobile App Development', 'Build cross-platform mobile application', 'Planning', '2026-02-01 00:00:00', '2026-06-15 00:00:00', 2, NOW(), NOW()),
(3, 'API Integration', 'Integrate third-party payment gateway', 'Ongoing', '2026-01-20 00:00:00', '2026-02-28 00:00:00', 2, NOW(), NOW()),
(4, 'Database Migration', 'Migrate from MySQL to PostgreSQL', 'Completed', '2025-12-01 00:00:00', '2026-01-15 00:00:00', 2, NOW(), NOW()),
(5, 'Marketing Campaign', 'Q1 2026 digital marketing campaign', 'Archived', '2025-11-01 00:00:00', '2025-12-31 00:00:00', 2, NOW(), NOW());

-- Reset sequence generator untuk Project.id
SELECT setval(pg_get_serial_sequence('"Project"', 'id'), coalesce(max(id), 1)) FROM "Project";

-- Insert Sample Tasks (25 tasks across all 5 projects)
INSERT INTO "Task" ("id", "projectId", "title", "description", "status", "priority", "assigneeId", "startDate", "dueDate", "progress", "createdAt", "updatedAt") VALUES
-- Project 1: Website Redesign
(1, 1, 'Design homepage & landing page mockup', 'Create high-fidelity mockups in Figma with modern design system tokens', 'Done', 'High', 3, '2026-01-18 00:00:00', '2026-01-30 00:00:00', 100, NOW(), NOW()),
(2, 1, 'Implement responsive header & navigation bar', 'Develop responsive navigation header with hamburger menu and blur effects', 'In Progress', 'High', 4, '2026-01-28 00:00:00', '2026-02-15 00:00:00', 60, NOW(), NOW()),
(3, 1, 'Accessibility (a11y) & typography contrast audit', 'Audit typography sizes, heading hierarchy, and contrast ratios for WCAG AA', 'Review', 'Medium', 3, '2026-02-08 00:00:00', '2026-02-22 00:00:00', 85, NOW(), NOW()),
(4, 1, 'Setup analytics tracking & conversion goals', 'Integrate Google Analytics 4, heatmaps, and event tracking for CTA buttons', 'To Do', 'Medium', 3, '2026-02-20 00:00:00', '2026-03-05 00:00:00', 0, NOW(), NOW()),
(5, 1, 'Fix mobile menu backdrop blur glitch', 'Investigate and resolve backdrop-filter rendering issues on iOS Safari', 'To Do', 'High', 4, '2026-02-16 00:00:00', '2026-02-26 00:00:00', 0, NOW(), NOW()),
-- Project 2: Mobile App Development
(6, 2, 'Research cross-platform frameworks (React Native vs Flutter)', 'Evaluate performance, community support, and ecosystem for mobile foundation', 'Done', 'High', 3, '2026-02-05 00:00:00', '2026-02-20 00:00:00', 100, NOW(), NOW()),
(7, 2, 'Setup development environment & CI/CD workflow', 'Configure React Native toolchain, Metro bundler, Fastlane, and GitHub Actions', 'In Progress', 'High', 4, '2026-02-18 00:00:00', '2026-03-10 00:00:00', 75, NOW(), NOW()),
(8, 2, 'Create app architecture diagram & state management RFC', 'Design app state flow, offline-first data caching strategy, and modular architecture', 'Review', 'High', 4, '2026-03-01 00:00:00', '2026-03-20 00:00:00', 90, NOW(), NOW()),
(9, 2, 'Implement authentication flow (Biometrics & OAuth)', 'Implement sign-in with Google/Apple, biometric auth, and secure JWT storage', 'To Do', 'High', 3, '2026-03-15 00:00:00', '2026-04-10 00:00:00', 0, NOW(), NOW()),
(10, 2, 'Push notification service integration', 'Integrate Firebase Cloud Messaging (FCM) and Apple Push Notifications (APNs)', 'To Do', 'Medium', 4, '2026-04-01 00:00:00', '2026-04-25 00:00:00', 0, NOW(), NOW()),
-- Project 3: API Integration
(11, 3, 'Review payment gateway documentation & API specifications', 'Thoroughly review gateway API specs, idempotency keys, and webhook security', 'Done', 'High', 4, '2026-01-22 00:00:00', '2026-01-28 00:00:00', 100, NOW(), NOW()),
(12, 3, 'Implement payment checkout & charge endpoint', 'Create REST API endpoints to initiate payments and validate currency amounts', 'In Progress', 'High', 4, '2026-01-27 00:00:00', '2026-02-10 00:00:00', 50, NOW(), NOW()),
(13, 3, 'Review security audit & PCI-DSS compliance', 'Validate compliance with PCI-DSS requirements, ensuring zero raw card storage', 'Review', 'High', 3, '2026-02-04 00:00:00', '2026-02-15 00:00:00', 85, NOW(), NOW()),
(14, 3, 'Write integration tests for payment webhook flow', 'Develop automated tests to simulate webhook events and signature verification', 'To Do', 'Medium', 3, '2026-02-12 00:00:00', '2026-02-22 00:00:00', 0, NOW(), NOW()),
(15, 3, 'Setup automated alert monitoring for failed transactions', 'Configure alerting via Slack/Discord and Prometheus metrics for failure spikes', 'To Do', 'Low', 4, '2026-02-18 00:00:00', '2026-02-27 00:00:00', 0, NOW(), NOW()),
-- Project 4: Database Migration
(16, 4, 'Analyze schema differences and data type mapping', 'Audit MySQL tables, data types, indexes, and constraints for PostgreSQL', 'Done', 'High', 4, '2025-12-03 00:00:00', '2025-12-12 00:00:00', 100, NOW(), NOW()),
(17, 4, 'Create automated migration scripts & constraints', 'Write ETL migration scripts with Prisma schema migrations and sequence resets', 'Done', 'High', 4, '2025-12-10 00:00:00', '2025-12-22 00:00:00', 100, NOW(), NOW()),
(18, 4, 'Dry-run data migration on staging database', 'Execute full migration rehearsal on staging with production-sized dataset', 'Done', 'High', 3, '2025-12-20 00:00:00', '2026-01-02 00:00:00', 100, NOW(), NOW()),
(19, 4, 'Validate data integrity & query performance benchmarking', 'Run comprehensive row count checks and benchmark critical application queries', 'Done', 'Medium', 3, '2026-01-01 00:00:00', '2026-01-08 00:00:00', 100, NOW(), NOW()),
(20, 4, 'Production database cutover and rollback verification', 'Execute live cutover during maintenance window with automated health checks', 'Done', 'High', 4, '2026-01-08 00:00:00', '2026-01-14 00:00:00', 100, NOW(), NOW()),
-- Project 5: Marketing Campaign
(21, 5, 'Formulate campaign goals & target audience personas', 'Define key campaign objectives, target customer segments, and CPA/ROAS metrics', 'Done', 'High', 2, '2025-11-04 00:00:00', '2025-11-15 00:00:00', 100, NOW(), NOW()),
(22, 5, 'Design creative banners & promotional assets', 'Produce visual assets for social media, Google Display Network, and landing pages', 'Done', 'Medium', 3, '2025-11-12 00:00:00', '2025-11-28 00:00:00', 100, NOW(), NOW()),
(23, 5, 'Copywriting for email newsletter & ad headlines', 'Draft persuasive ad copy, value propositions, and a 3-part nurture sequence', 'Done', 'Medium', 2, '2025-11-20 00:00:00', '2025-12-05 00:00:00', 100, NOW(), NOW()),
(24, 5, 'Launch Google Ads & Meta advertising campaign', 'Configure ad groups, targeting parameters, pixel conversion tracking, and launch', 'Done', 'High', 4, '2025-12-01 00:00:00', '2025-12-15 00:00:00', 100, NOW(), NOW()),
(25, 5, 'Campaign performance review & ROI analytics report', 'Analyze campaign metrics, conversion funnel drop-offs, and calculate final ROAS', 'Done', 'Low', 2, '2025-12-16 00:00:00', '2025-12-30 00:00:00', 100, NOW(), NOW());

-- Reset sequence generator untuk Task.id
SELECT setval(pg_get_serial_sequence('"Task"', 'id'), coalesce(max(id), 1)) FROM "Task";

-- Insert Sample Comments
INSERT INTO "Comment" ("id", "taskId", "userId", "message", "createdAt") VALUES
(1, 1, 2, 'Great work on the mockup! Design looks modern and clean.', NOW()),
(2, 2, 2, 'Please ensure mobile menu works on all screen sizes.', NOW()),
(3, 2, 4, 'Will do! Currently testing on iPhone and Android devices.', NOW()),
(4, 5, 3, 'Environment setup almost complete. Just need to configure iOS simulator.', NOW()),
(5, 8, 2, 'Make sure to handle all error cases properly.', NOW());

-- Reset sequence generator untuk Comment.id
SELECT setval(pg_get_serial_sequence('"Comment"', 'id'), coalesce(max(id), 1)) FROM "Comment";
