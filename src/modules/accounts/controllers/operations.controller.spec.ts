import { Test, TestingModule } from '@nestjs/testing';
import { OperationsController } from './operations.controller';
import { OperationsService } from '../services/operations.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { FraudThrottlerGuard } from '../../../common/guards/throttle.guard';
import { TransferDTO } from '../dto/transfer.dto';
import { WithdrawDTO } from '../dto/withdraw.dto';
import { DepositDTO } from '../dto/deposit.dto';
import { UserRoles } from '@prisma/client';
import { UserDTO } from '../../../modules/users/dto/user.dto';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '../../../app.module';
import {
  mockAccounts,
  MockPrismaService,
  mockUsers,
} from '../../../../test/__mocks__/prisma.service';
import { PrismaService } from '../../../common/services/prisma.service';

describe('OperationsController', () => {
  let controller: OperationsController;
  let operationsService: OperationsService;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationsController],
      providers: [
        {
          provide: PrismaService,
          useValue: MockPrismaService,
        },
        OperationsService,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(FraudThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OperationsController>(OperationsController);
    operationsService = module.get<OperationsService>(OperationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(operationsService).toBeDefined();
  });

  describe('transfer', () => {
    it('should call operationsService.transfer with the correct data', async () => {
      const user = mockUsers[0];

      const transferDTO: TransferDTO = {
        amount: 1,
        fromAccount: '00001',
        toAccount: '00002',
      };

      let spy = jest.spyOn(operationsService, 'transfer');
      await controller.transfer(transferDTO, user);

      expect(spy).toHaveBeenCalledWith(user, transferDTO);
    });

    it('should throw BadRequestException if account does not exist to user', async () => {
      const user = mockUsers[0];

      const transferDTO: TransferDTO = {
        amount: 1,
        fromAccount: '00002',
        toAccount: '00001',
      };

      await expect(controller.transfer(transferDTO, user)).rejects.toThrow(
        new BadRequestException('Account not found'),
      );
    });

    it('should throw BadRequestException if insufficient balance', async () => {
      const sourceAccountNumber = '00001';
      const targetAccountNumber = '00002';
      const user = mockUsers[0];

      const transferData: TransferDTO = {
        amount: 555,
        fromAccount: sourceAccountNumber,
        toAccount: targetAccountNumber,
      };

      await expect(controller.transfer(transferData, user)).rejects.toThrow(
        new BadRequestException('Insufficient balance'),
      );
    });

    it('should throw BadRequestException if operationsService.withdraw with the incorrect account data', async () => {
      const sourceAccountNumber = '00002'; // this account is not associated with this user
      const targetAccountNumber = '00001';
      const user = mockUsers[0];

      const transferData: TransferDTO = {
        amount: 5,
        fromAccount: sourceAccountNumber,
        toAccount: targetAccountNumber,
      };

      await expect(controller.transfer(transferData, user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should decrement the source account balance and increment the target account balance', async () => {
      const sourceAccountNumber = '00001';
      const targetAccountNumber = '00002';
      const user = mockUsers[0];

      const sourceAccountBefore = mockAccounts.find(
        (acc) => acc.id === Number(sourceAccountNumber),
      );
      const targetAccountBefore = mockAccounts.find(
        (acc) => acc.id === Number(targetAccountNumber),
      );

      const transferData: TransferDTO = {
        amount: 1.5,
        fromAccount: sourceAccountNumber,
        toAccount: targetAccountNumber,
      };

      await controller.transfer(transferData, user);

      const sourceAccountAfter = mockAccounts.find(
        (acc) => acc.id === Number(sourceAccountNumber),
      );
      const targetAccountAfter = mockAccounts.find(
        (acc) => acc.id === Number(targetAccountNumber),
      );

      expect(sourceAccountAfter.balance).toEqual(
        sourceAccountBefore.balance - transferData.amount,
      );

      expect(targetAccountAfter.balance).toEqual(
        targetAccountBefore.balance + transferData.amount,
      );
    });
  });

  describe('withdraw', () => {
    it('should call operationsService.withdraw with the correct data', () => {
      const user = mockUsers[0];

      const withdrawDTO: WithdrawDTO = {
        amount: 1,
        account: '0001',
      };

      let spy = jest.spyOn(operationsService, 'withdraw');
      controller.withdraw(withdrawDTO, user);

      expect(spy).toHaveBeenCalledWith(user, withdrawDTO);
    });

    it('should throw BadRequestException if account does not exist to user', async () => {
      const user = mockUsers[0];

      const withdrawDTO: WithdrawDTO = {
        amount: 1,
        account: '0002',
      };

      await expect(controller.withdraw(withdrawDTO, user)).rejects.toThrow(
        new BadRequestException('Account not found'),
      );
    });

    it('should throw BadRequestException if insufficient balance', async () => {
      const user = mockUsers[0];
      const withdrawDTO: WithdrawDTO = {
        amount: 555,
        account: '0001',
      };

      await expect(controller.withdraw(withdrawDTO, user)).rejects.toThrow(
        new BadRequestException('Insufficient balance'),
      );
    });

    it('should throw BadRequestException if operationsService.withdraw with the incorrect account data', async () => {
      const user = mockUsers[0];

      const withdrawDTO: WithdrawDTO = {
        amount: 5,
        account: '0002', // this account is not associated with this user
      };

      await expect(controller.withdraw(withdrawDTO, user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should decrement the account balance', async () => {
      const accountNumber = '00001';
      const user = mockUsers[0];
      const account = mockAccounts.find(
        (acc) => acc.id === Number(accountNumber),
      );

      const withdrawDTO: WithdrawDTO = {
        amount: 5,
        account: accountNumber,
      };

      const result = await controller.withdraw(withdrawDTO, user);
      expect(result.balance).toEqual(account.balance - withdrawDTO.amount);
    });
  });

  describe('deposit', () => {
    it('should call operationsService.deposit with the correct data', async () => {
      const user = mockUsers[0];

      const depositDTO: DepositDTO = {
        amount: 1,
        account: '00001',
      };

      let spy = jest.spyOn(operationsService, 'deposit');
      await controller.deposit(depositDTO);

      expect(spy).toHaveBeenCalledWith(depositDTO);
    });

    it('should throw BadRequestException if account does not exist', async () => {
      const depositDTO: DepositDTO = {
        amount: 1,
        account: '00015',
      };

      await expect(controller.deposit(depositDTO)).rejects.toThrow(
        new BadRequestException('Account not found'),
      );
    });

    it('should increment the account balance', async () => {
      const accountNumber = '00001';
      const account = mockAccounts.find(
        (acc) => acc.id === Number(accountNumber),
      );

      const depositDTO = {
        amount: 15,
        account: accountNumber,
      };

      const result = await controller.deposit(depositDTO);
      expect(result.balance).toEqual(account.balance + depositDTO.amount);
    });
  });
});
