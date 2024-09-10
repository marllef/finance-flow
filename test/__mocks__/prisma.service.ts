import { PrismaClient, Prisma, User } from '@prisma/client';
import { AccountDTO } from 'src/modules/accounts/dto/account.dto';
import { UserDTO } from 'src/modules/users/dto/user.dto';

export const mockUsers: UserDTO[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    isActive: true,
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'hashedPassword',
    isActive: true,
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'hashedPassword',
    isActive: true,
    role: 'ADMIN',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockAccounts = [
  { id: 1, digit: 0, balance: 100.0, ownerId: 1, isActive: true },
  { id: 2, digit: 0, balance: 50.0, ownerId: 2, isActive: true },
];

export const mockTransactions = [
  {
    id: 1,
    uniqueId: 'tx1',
    amount: 100.0,
    balance: 1100.0,
    type: 'DEPOSIT',
    status: 'COMPLETED',
    date: new Date(),
    accountId: 1,
  },
  {
    id: 2,
    uniqueId: 'tx2',
    amount: 50.0,
    balance: 1950.0,
    type: 'WITHDRAWAL',
    status: 'COMPLETED',
    date: new Date(),
    accountId: 2,
  },
];

const prismaMock = {
  user: {
    findUnique: jest.fn().mockImplementation(async ({ where }) => {
      return mockUsers.find((user) => user.id === where.id || user.email === where.email);
    }),
    findMany: jest.fn().mockResolvedValue(mockUsers),
    create: jest.fn().mockImplementation(async (data) => {
      const newUser = { id: mockUsers.length + 1, ...data.data };
      mockUsers.push(newUser);
      return newUser;
    }),
    update: jest.fn().mockImplementation(async ({ where, data }) => {
      const userIndex = mockUsers.findIndex((user) => user.id === where.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
        return mockUsers[userIndex];
      }
      return null;
    }),
    delete: jest.fn().mockImplementation(async ({ where }) => {
      const userIndex = mockUsers.findIndex((user) => user.id === where.id);
      if (userIndex !== -1) {
        return mockUsers.splice(userIndex, 1)[0];
      }
      return null;
    }),
  },
  account: {
    findUnique: jest.fn().mockImplementation(async ({ where }) => {
      if (!!where?.ownerId) {
        return mockAccounts.find(
          (account) =>
            account.id === where.id && account.ownerId === where.ownerId,
        );
      }
      return mockAccounts.find((account) => account.id === where.id);
    }),
    findMany: jest.fn().mockResolvedValue(mockAccounts),
    create: jest.fn().mockImplementation(async (data) => {
      const newOwner: UserDTO = {
        id: mockUsers.length + 1,
        ...data.data.owner.create,
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsers.push(newOwner);
      const newAccount = {
        id: mockAccounts.length + 1,
        ...data.data,
        isActive: true,
        owner: newOwner,
        transactions: [],
      };
      mockAccounts.push(newAccount);
      return newAccount;
    }),
    update: jest.fn().mockImplementation(async ({ where, data }) => {
      const accountIndex = mockAccounts.findIndex(
        (account) => account.id === where.id,
      );
      let balance = mockAccounts[accountIndex].balance;
      if (data.balance.decrement) {
        balance -= data.balance.decrement;
      } else if (data.balance.increment) {
        balance += data.balance.increment;
      } else {
        balance = data.balance;
      }

      if (accountIndex !== -1) {
        mockAccounts[accountIndex] = {
          ...mockAccounts[accountIndex],
          ...data,
          balance: balance,
        };
        return mockAccounts[accountIndex];
      }
      return null;
    }),
    delete: jest.fn().mockImplementation(async ({ where }) => {
      const accountIndex = mockAccounts.findIndex(
        (account) => account.id === Number(where.id),
      );
      if (accountIndex !== -1) {
        return mockAccounts.splice(accountIndex, 1)[0];
      }
      return null;
    }),
  },
  transaction: {
    findUnique: jest.fn().mockImplementation(async ({ where }) => {
      return mockTransactions.find(
        (transaction) => transaction.id === where.id,
      );
    }),
    findMany: jest.fn().mockImplementation(async ({ where }) => {
      if (where && where.where && where.where.accountId) {
        return mockTransactions.filter(
          (transaction) => transaction.accountId === where.where.accountId,
        );
      }
      return mockTransactions;
    }),
    create: jest.fn().mockImplementation(async (data) => {
      const newTransaction = { id: mockTransactions.length + 1, ...data.data };
      mockTransactions.push(newTransaction);
      return newTransaction;
    }),
    update: jest.fn().mockImplementation(async ({ where, data }) => {
      const transactionIndex = mockTransactions.findIndex(
        (transaction) => transaction.id === where.id,
      );

      let balance = mockTransactions[transactionIndex].balance;

      if (data.balance?.decrement) {
        balance -= data.balance.decrement;
      } else if (data.balance?.increment) {
        balance += data.balance.increment;
      } else {
        balance = data.balance;
      }

      let amount = mockTransactions[transactionIndex].amount;
      if (data.amount?.decrement) {
        amount -= data.amount.decrement;
      } else if (data.amount?.increment) {
        amount += data.amount.increment;
      } else {
        amount = data.amount;
      }

      if (transactionIndex !== -1) {
        mockTransactions[transactionIndex] = {
          ...mockTransactions[transactionIndex],
          ...data,
          balance: balance,
          amount: amount,
        };
        return mockTransactions[transactionIndex];
      }
      return null;
    }),
    delete: jest.fn().mockImplementation(async ({ where }) => {
      const transactionIndex = mockTransactions.findIndex(
        (transaction) => transaction.id === where.id,
      );
      if (transactionIndex !== -1) {
        return mockTransactions.splice(transactionIndex, 1)[0];
      }
      return null;
    }),
  },
  $transaction: jest
    .fn()
    .mockImplementation(async (callback) => callback(prismaMock)),
};

export const MockPrismaService = prismaMock as unknown as PrismaClient;
