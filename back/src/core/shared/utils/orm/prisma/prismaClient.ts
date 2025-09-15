import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../../../../../../generated/prisma";

class PrismaClientGenerated extends PrismaClient {}

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
// ! need previewFeatures = ["driverAdapters"] on prisma schema

const prisma = new PrismaClientGenerated({
  adapter,
  log: ["query", "info", "warn", "error"],
});

export { prisma, PrismaClientGenerated, Prisma as PrismaGenerated };
