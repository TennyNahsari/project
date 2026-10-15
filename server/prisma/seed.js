import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedTasksForProjects } from "./taskSeederHelper.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.comment.deleteMany();
  await prisma.subtask.deleteMany();
  await prisma.worklog.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const userAdmin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "Admin"
    }
  });

  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "PM"
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      password: hashedPassword,
      role: "Member"
    }
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Bob Wilson",
      email: "bob@example.com",
      password: hashedPassword,
      role: "Member"
    }
  });

  console.log("✅ Created 4 users (Admin, PM, Members)");

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Redesign company website with modern UI/UX",
      status: "Ongoing",
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-03-30"),
      ownerId: user1.id
    }
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Mobile App Development",
      description: "Build cross-platform mobile application",
      status: "Planning",
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-06-15"),
      ownerId: user1.id
    }
  });

  const project3 = await prisma.project.create({
    data: {
      name: "API Integration",
      description: "Integrate third-party payment gateway",
      status: "Ongoing",
      startDate: new Date("2026-01-20"),
      endDate: new Date("2026-02-28"),
      ownerId: user1.id
    }
  });

  const project4 = await prisma.project.create({
    data: {
      name: "Database Migration",
      description: "Migrate from MySQL to PostgreSQL",
      status: "Completed",
      startDate: new Date("2025-12-01"),
      endDate: new Date("2026-01-15"),
      ownerId: user1.id
    }
  });

  const project5 = await prisma.project.create({
    data: {
      name: "Marketing Campaign",
      description: "Q1 2026 digital marketing campaign",
      status: "Archived",
      startDate: new Date("2025-11-01"),
      endDate: new Date("2025-12-31"),
      ownerId: user1.id
    }
  });

  console.log("✅ Created 5 projects");

  // Create tasks adapting to existing projects
  console.log("🌱 Creating tasks, subtasks, comments, and worklogs adapting to projects...");
  const taskSeedResult = await seedTasksForProjects(prisma, { reset: false });
  console.log(`✅ Created ${taskSeedResult.tasksCreated} tasks across ${taskSeedResult.projectsCount} projects`);
  console.log(`   - ${taskSeedResult.subtasksCreated} subtasks`);
  console.log(`   - ${taskSeedResult.commentsCreated} comments`);
  console.log(`   - ${taskSeedResult.worklogsCreated} worklogs`);

  console.log("\n🎉 Seeding completed successfully!");
  console.log("\nTest credentials:");
  console.log("Email: admin@example.com | Password: password123 (Admin)");
  console.log("Email: john@example.com  | Password: password123 (PM)");
  console.log("Email: jane@example.com  | Password: password123 (Member)");
  console.log("Email: bob@example.com   | Password: password123 (Member)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
