import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TransferDTO } from '../dto/transfer.dto';
import { OperationsService } from '../services/operations.service';
import { WithdrawDTO } from '../dto/withdraw.dto';
import { DepositDTO } from '../dto/deposit.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRoles } from '@prisma/client';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { seconds, Throttle } from '@nestjs/throttler';
import { RequestUser } from '../../../common/decorators/user.decorator';
import { UserDTO } from '../../../modules/users/dto/user.dto';
import { FraudThrottlerGuard } from '../../../common/guards/throttle.guard';

@UseGuards(JwtAuthGuard, RolesGuard, FraudThrottlerGuard)
@Throttle({ default: { limit: 5, ttl: seconds(60) } })
@Controller('operations')
export class OperationsController {
  constructor(private readonly operationService: OperationsService) {}

  @Post('transfer')
  @Roles(UserRoles.USER)
  transfer(@Body() data: TransferDTO, @RequestUser() user: UserDTO) {
    return this.operationService.transfer(user, data);
  }

  @Post('withdraw')
  @Roles(UserRoles.USER)
  withdraw(@Body() data: WithdrawDTO, @RequestUser() user: UserDTO) {
    return this.operationService.withdraw(user, data);
  }

  @Post('deposit')
  deposit(@Body() data: DepositDTO) {
    return this.operationService.deposit(data);
  }
}
