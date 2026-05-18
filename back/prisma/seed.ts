import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.create({
    data: {
      id: '2a45c335-f0d4-40c1-a377-1da61ad64ebc',
      name: 'ADMIN01',
      email: 'admin001@admin.com',
      hashedPassword:
        '$2a$12$N7Q1976JFGW9vqly3X7rvO.1.5m1gQLd/WUlQfPuh.LJUYMYw4K4.',
      role: 'ADMIN',
      isActive: true,
      createdAt: '2026-03-09T14:52:07.464Z',
      updatedAt: '2026-03-09T14:52:07.464Z',
    },
  });
}

seed()
  .then(() => {
    console.log('DATABASE SEEDED');
  })
  .catch((e) => {
    console.log(`ERROR ON DATABASE SEED`);
    console.log(e);
  });
