import { Module } from '@nestjs/common';
import { AccountsController } from './controllers/accounts.controller';
import { OperationsController } from './controllers/operations.controller';
import { PrismaService } from '../../common/services/prisma.service';
import { AccountsService } from './services/accounts.service';
import { OperationsService } from './services/operations.service';

@Module({
  controllers: [AccountsController, OperationsController],
  providers: [PrismaService, AccountsService, OperationsService],
  exports: [AccountsService],
})
export class AccountsModule {}
