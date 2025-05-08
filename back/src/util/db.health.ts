import { prisma } from "./orm/prisma/prisma.util";

export async function testDb() {
  try {
    const health = await prisma.$queryRaw`SELECT 1`;
    console.log("");
    console.log("____________________________________________");
    console.log("");
    console.log("DB HEALTH:");
    console.log("");
    console.log(health);
    console.log("");
    console.log("____________________________________________");
    console.log("");
  } catch (error) {
    console.log("");
    console.log("____________________________________________");
    console.log("");
    console.log("DATABASE ERROR!");
    console.log(error);
    console.log("");
    console.log("____________________________________________");
    console.log("");
    process.exit(1);
  }
}
