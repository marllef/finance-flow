import { Test, TestingModule } from '@nestjs/testing';
import { OperationsController } from './operations.controller';
import { OperationsService } from '../services/operations.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FraudThrottlerGuard } from '../../../common/guards/throttle.guard';
import { TransferDTO } from '../dto/transfer.dto';
import { WithdrawDTO } from '../dto/withdraw.dto';
import { DepositDTO } from '../dto/deposit.dto';
import { UserRoles } from '@prisma/client';
import { BadRequestException, ConflictException, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '../../../app.module';
import {
  mockAccounts,
  MockPrismaService,
  mockUsers,
} from '../../../../test/__mocks__/prisma.service';
import { PrismaService } from '../../../common/services/prisma.service';
import { AccountsController } from './accounts.controller';
import { AccountsService } from '../services/accounts.service';
import { CreateAccountDTO } from '../dto/create.dto';
import { plainToInstance } from 'class-transformer';
import { AccountDTO } from '../dto/account.dto';

describe('AccountsController', () => {
  let controller: AccountsController;
  let accountService: AccountsService;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: PrismaService,
          useValue: MockPrismaService,
        },
        AccountsService,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AccountsController>(AccountsController);
    accountService = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(accountService).toBeDefined();
  });

  describe('create', () => {
    it('should create an account', async () => {
      const createAccountDto: CreateAccountDTO = {
        name: 'John Doe',
        email: 'john.new@example.com',
        password: "1234",
      };

      const result = {
        account: '00003',
        digit: '00',
        balance: 0,
        holder: 'John Doe',
        isActive: true,
        transactions: [],
      };

      const spy = jest.spyOn(accountService, 'create');
      const response = await controller.create(createAccountDto);

      expect(spy).toHaveBeenCalledWith(createAccountDto);
      expect(response).toEqual(result);
    });

    it('should throw an error when create an account and the email already exists', async () => {
      const alreadyExists = mockUsers[0];
      const createAccountDto: CreateAccountDTO = {
        name: 'John Doe',
        email: alreadyExists.email, // this emails already exists
        password: "1234",
      };
      const spy = jest.spyOn(accountService, 'create');
      await expect(controller.create(createAccountDto)).rejects.toThrow(ConflictException);
      expect(spy).toHaveBeenCalledWith(createAccountDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of accounts', async () => {

      const spy = jest.spyOn(accountService, 'findAll');
      const response = await controller.findAll();

      expect(spy).toHaveBeenCalled();
      expect(response.length).toBeGreaterThan(0);
    });
  });
});
