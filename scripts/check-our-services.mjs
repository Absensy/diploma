import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const row = await prisma.content.findFirst({ where: { section: 'our_services' } });
console.log(JSON.stringify(row?.data, null, 2));
await prisma.$disconnect();
