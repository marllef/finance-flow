import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from '../services/accounts.service';
import { CreateAccountDTO } from '../dto/create.dto';
import { UpdateAccountDTO } from '../dto/update.dto';
import { FilterDTO } from '../dto/filter.dto';
import { AccountDTO } from '../dto/account.dto';
import { plainToInstance } from 'class-transformer';
import { RolesGuard } from '../../../modules/auth/guards/roles.guard';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt-auth.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRoles } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Roles(UserRoles.USER)
  @Post()
  async create(@Body() data: CreateAccountDTO) {
    const response = await this.accountsService.create(data);
    return plainToInstance(AccountDTO, response);
  }

  @Roles(UserRoles.ADMIN)
  @Get()
  async findAll() {
    const response = await this.accountsService.findAll();
    return plainToInstance(AccountDTO, response);
  }

  @Roles(UserRoles.USER)
  @Get(':account_number/statement')
  async statement(
    @Param('account_number') accountNumber: string,
    @Query() filter?: FilterDTO,
  ) {
    const response = await this.accountsService.findOne(
      { id: +accountNumber },
      filter,
    );
    return plainToInstance(AccountDTO, response);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Get(':account_number/balance')
  async ballance(@Param('account_number') accountNumber: string) {
    const response = await this.accountsService.showBallance({
      id: +accountNumber,
    });

    return plainToInstance(AccountDTO, response);
  }

  @Roles(UserRoles.ADMIN)
  @Patch(':account_number')
  async update(
    @Param('account_number') accountNumber: string,
    @Body() data: UpdateAccountDTO,
  ) {
    const response = await this.accountsService.update(+accountNumber, data);
    return plainToInstance(AccountDTO, response);
  }

  @Roles(UserRoles.ADMIN)
  @Delete(':account_number')
  async remove(@Param('account_number') accountNumber: string) {
    const response = await this.accountsService.remove(+accountNumber);
    return plainToInstance(AccountDTO, response);
  }
}
