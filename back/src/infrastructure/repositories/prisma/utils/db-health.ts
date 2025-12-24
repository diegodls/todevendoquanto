import { prisma } from "../config/prisma-client";

export async function testDb(timeToThrow = 3000) {
  //TODO: Maybe transform this into a "APP class" function

  console.log("");
  console.log("👀 CHECKING DATABASE...");

  await prisma.$connect();

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("⚠️ QUERY TIMEOUT"));
    }, timeToThrow);
  });

  try {
    await Promise.race([
      await prisma.$queryRawUnsafe(`SELECT 1`),
      timeoutPromise,
    ]);
    console.log("");
    console.log("🟢 DATABASE IS RUNNING FINE!");
  } catch (error) {
    console.log("");
    console.log("🔴 DATABASE IS NOT FEELING WELL");
    console.log("");
    console.log("⚠️⚠️⚠️⚠️⚠️⚠️⚠️");
    console.log(error);
    console.log("");
    process.exit(1);
  }
}
