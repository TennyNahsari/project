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
    "startDate" TIMESTAMP(3)
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

-- Insert Sample Tasks
INSERT INTO "Task" ("id", "projectId", "title", "description", "status", "priority", "assigneeId", "startDate", "dueDate", "progress", "createdAt", "updatedAt") VALUES
(1, 1, 'Design homepage mockup', 'Create high-fidelity mockup for new homepage', 'Done', 'High', 3, '2026-01-29 00:00:00', '2026-02-05 00:00:00', 100, NOW(), NOW()),
(2, 1, 'Implement responsive header', 'Code responsive navigation header with mobile menu', 'In Progress', 'High', 4, '2026-02-03 00:00:00', '2026-02-10 00:00:00', 60, NOW(), NOW()),
(3, 1, 'Setup analytics tracking', 'Integrate Google Analytics and heatmap tools', 'To Do', 'Medium', 3, '2026-02-12 00:00:00', '2026-02-15 00:00:00', 0, NOW(), NOW()),
(4, 2, 'Research cross-platform frameworks', 'Compare React Native vs Flutter', 'Done', 'High', 3, NULL, '2026-02-03 00:00:00', 100, NOW(), NOW()),
(5, 2, 'Setup development environment', 'Install and configure React Native toolchain', 'In Progress', 'High', 4, NULL, '2026-02-08 00:00:00', 75, NOW(), NOW()),
(6, 2, 'Create app architecture diagram', 'Design overall application architecture', 'To Do', 'Medium', 3, NULL, '2026-02-12 00:00:00', 0, NOW(), NOW()),
(7, 3, 'Review payment gateway documentation', 'Study Stripe API documentation', 'Done', 'High', 4, NULL, '2026-01-25 00:00:00', 100, NOW(), NOW()),
(8, 3, 'Implement payment endpoint', 'Create API endpoint for payment processing', 'In Progress', 'High', 4, NULL, '2026-02-08 00:00:00', 40, NOW(), NOW()),
(9, 3, 'Write integration tests', 'Create unit and integration tests for payment flow', 'To Do', 'Medium', 3, NULL, '2026-02-20 00:00:00', 0, NOW(), NOW()),
(10, 1, 'Fix mobile menu bug', 'Menu not closing on mobile devices', 'To Do', 'High', 4, NULL, '2026-02-07 00:00:00', 0, NOW(), NOW()),
(11, 3, 'Review security audit', 'Review payment security audit results', 'In Progress', 'High', 3, NULL, '2026-02-08 00:00:00', 30, NOW(), NOW());

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
