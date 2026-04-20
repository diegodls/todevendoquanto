import { InfrastructureError } from "@/core/shared/errors/infrastructure-errors";
import { prisma } from "../config/prisma-client";

export async function testDb(timeToThrow = 3000) {
  // TODO: Maybe transform this into an app-level healthcheck utility

  console.log("");
  console.log("Checking database...");

  await prisma.$connect();

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new InfrastructureError("QUERY TIMEOUT"));
    }, timeToThrow);
  });

  try {
    await Promise.race([await prisma.$queryRawUnsafe(`SELECT 1`), timeoutPromise]);
    console.log("");
    console.log("Database is running fine!");
  } catch (error) {
    console.log("");
    console.log("Database is not feeling well");
    console.log("");
    console.log(error);
    console.log("");
    process.exit(1);
  }
}
