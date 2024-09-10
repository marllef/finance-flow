import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('1234', 10);
  
    const userOne = await prisma.user.create({
      data: {
        name: 'User 1',
        email: 'user.one@example.com',
        password: password,
        role: 'USER',
      },
    });
  
    const userTwo = await prisma.user.create({
      data: {
        name: 'User 2',
        email: 'user.two@example.com',
        password: password,
        role: 'USER',
      },
    });
  
    const userThree = await prisma.user.create({
      data: {
        name: 'User 3',
        email: 'user.three@example.com',
        password: password,
        role: 'USER',
      },
    });
  
    const adminPassword = await bcrypt.hash('1234', 10);
  
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });
  
    console.log(`-- Your admin credentials are:`);
    console.log(`Username: ${admin.email}`);
    console.log(`Password: 1234`);
  
    // Seed para contas
    await prisma.account.create({
      data: {
        digit: 1,
        balance: 0,
        ownerId: userOne.id,
      },
    });
  
    await prisma.account.create({
      data: {
        digit: 2,
        balance: 0,
        ownerId: userTwo.id,
      },
    });
  
    await prisma.account.create({
      data: {
        digit: 3,
        balance: 0,
        ownerId: userThree.id,
      },
    });
  
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
