import { prisma } from "./prisma.util";

export async function testDb() {
  const health = await prisma.$queryRaw`SELECT 1`;

  console.log("");
  console.log("____________________________________________");

  console.log("");
  console.log("DB HEALTH:");
  console.log(health);
  console.log("");

  console.log("____________________________________________");
  console.log("");
}
