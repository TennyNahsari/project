import { PrismaClient } from "@prisma/client";
import { seedTasksForProjects } from "./taskSeederHelper.js";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const reset = args.includes("--reset") || args.includes("-r");

  console.log(`🌱 Seeding tasks adapting to existing projects... (reset: ${reset})`);

  const result = await seedTasksForProjects(prisma, { reset });

  console.log("✅ Task seeding completed successfully!");
  console.log(`📊 Summary:`);
  console.log(`   - Evaluated projects: ${result.projectsCount}`);
  console.log(`   - Tasks created: ${result.tasksCreated}`);
  console.log(`   - Subtasks created: ${result.subtasksCreated}`);
  console.log(`   - Comments created: ${result.commentsCreated}`);
  console.log(`   - Worklogs created: ${result.worklogsCreated}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding tasks:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
