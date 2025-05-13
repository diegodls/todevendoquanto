import { prisma } from "./orm/prisma/prisma.util";

const timeToThrow = 5000;

export async function testDb() {
  const health = await prisma.$queryRaw`SELECT 1`;

  setTimeout(() => {
    if (!health) {
      console.log("");
      console.log("🔴🔴🔴🔴🔴");
      console.log("");
      console.log("ERROR ON DATABASE CONNECTION !!!");
      console.log("");
      console.log("HEALTH:");
      console.log(health);
      console.log("");
      console.log("🔴🔴🔴🔴🔴");
      console.log("");
      process.exit(1);
    }

    console.log("");
    console.log("🟢🟢🟢🟢🟢");
    console.log("");
    console.log("DATABASE ok");
    console.log("");
    console.log("HEALTH:");
    console.log(health);
    console.log("");
    console.log("🟢🟢🟢🟢🟢");
    console.log("");
  }, timeToThrow);
}
