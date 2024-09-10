import { PrismaService } from '../../../common/services/prisma.service';
import { DepositDTO } from '../dto/deposit.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionStatus, OperationType } from '@prisma/client';
import { TransferDTO } from '../dto/transfer.dto';
import { WithdrawDTO } from '../dto/withdraw.dto';
import { UserDTO } from 'src/modules/users/dto/user.dto';

@Injectable()
export class OperationsService {
  constructor(private readonly prisma: PrismaService) {}

  async deposit( data: DepositDTO) {
    const { account: accountId, amount } = data;

    const account = await this.prisma.account.findUnique({
      where: {
        id: +accountId,
        isActive: true,
      },
    });

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.account.update({
        where: {
          id: +accountId,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      await tx.transaction.create({
        data: {
          type: OperationType.DEPOSIT,
          status: TransactionStatus.COMPLETED,
          amount: amount,
          balance: updated.balance,
          account: {
            connect: {
              id: +accountId,
            },
          },
        },
      });

      return updated;
    });
  }

  async withdraw(owner: UserDTO, data: WithdrawDTO) {
    const { account: accountId, amount } = data;

    const account = await this.prisma.account.findUnique({
      where: {
        id: +accountId,
        isActive: true,
        ownerId: owner.id,
      },
    });

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    if (account.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.account.update({
        where: {
          id: +accountId,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      await tx.transaction.create({
        data: {
          type: OperationType.DEPOSIT,
          status: TransactionStatus.COMPLETED,
          amount: amount,
          balance: updated.balance,
          account: {
            connect: {
              id: +accountId,
            },
          },
        },
      });

      return updated;
    });
  }

  async transfer(owner: UserDTO, data: TransferDTO) {
    const { fromAccount, toAccount, amount } = data;
    const accountOut = await this.prisma.account.findUnique({
      where: {
        id: +fromAccount,
        isActive: true,
        ownerId: owner.id,
      },
    });

    const accountIn = await this.prisma.account.findUnique({
      where: {
        id: +toAccount,
        isActive: true,
      },
    });

    if (!accountOut || !accountIn) {
      throw new BadRequestException('Account not found');
    }

    if (accountOut.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    return await this.prisma.$transaction(async (tx) => {
      const updatedAccountOut = await tx.account.update({
        where: {
          id: accountOut.id,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      const txOut = await tx.transaction.create({
        data: {
          type: OperationType.TRANSFER_OUT,
          status: TransactionStatus.COMPLETED,
          amount: amount,
          balance: updatedAccountOut.balance,
          account: {
            connect: {
              id: accountOut.id,
            },
          },
        },
      });

      const updatedAccountIn = await tx.account.update({
        where: {
          id: accountIn.id,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      await tx.transaction.create({
        data: {
          type: OperationType.TRANSFER_IN,
          status: TransactionStatus.COMPLETED,
          amount: amount,
          balance: updatedAccountIn.balance,
          refer: txOut.uniqueId,
          account: {
            connect: {
              id: accountIn.id,
            },
          },
        },
      });

      return updatedAccountOut;
    });
  }
}
