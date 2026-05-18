import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
export { Prisma as PrismaGenerated } from '@prisma/client';

export class PrismaClientGenerated extends PrismaClient {}

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
// ! need previewFeatures = ["driverAdapters"] on prisma schema

export const prisma = new PrismaClientGenerated({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});
