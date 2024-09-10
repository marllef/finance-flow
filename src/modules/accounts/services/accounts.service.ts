import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateAccountDTO } from '../dto/create.dto';
import { UpdateAccountDTO } from '../dto/update.dto';
import { PrismaService } from '../../../common/services/prisma.service';
import { OperationType, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { AccountDTO } from '../dto/account.dto';
import { FilterDTO } from '../dto/filter.dto';
import { DateToISO } from '../../../common/utils/format.utils';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAccountDTO) {
    const exists = await this.prisma.user.findUnique({
      where: { email: data?.email },
    });

    if (exists) {
      throw new ConflictException();
    }

    const password = await bcrypt.hash(data.password, 10);

    const created = await this.prisma.account.create({
      data: {
        balance: 0.0,
        owner: {
          create: {
            email: data.email,
            password: password,
            name: data.name,
          },
        },
      },
      include: {
        owner: true,
      },
    });
    return created;
  }

  async findAll(filter?: FilterDTO) {
    const { start, end } = filter ?? {};
    const allOperations = Object.values(OperationType) as OperationType[];

    const includesTranasactions = !!filter;

    const inType = Array.isArray(filter?.type)
      ? filter.type
      : typeof filter?.type === 'undefined'
        ? allOperations
        : [filter.type];

    const result = await this.prisma.account.findMany({
      include: {
        transactions: includesTranasactions
          ? {
              where: {
                date: {
                  gte: DateToISO(start),
                  lte: DateToISO(end),
                },
                type: {
                  in: inType,
                },
              },
            }
          : {
              take: 0,
            },

        owner: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    return result.map(({ transactions, ...item }) => ({
      ...item,
      transactions: filter ? transactions : undefined,
    }));
  }

  async findOne(where: Prisma.AccountWhereUniqueInput, filter?: FilterDTO) {
    const { start, end } = filter ?? {};

    const allOperations = Object.values(OperationType) as OperationType[];
    const inType = Array.isArray(filter?.type)
      ? filter.type
      : typeof filter.type === 'undefined'
        ? allOperations
        : [filter.type];

    const extract = await this.prisma.account.findUnique({
      where,
      include: {
        owner: {
          select: {
            name: true,
          },
        },
        transactions: {
          orderBy: {
            date: 'desc',
          },
          where: {
            date: {
              gte: DateToISO(start),
              lte: DateToISO(end),
            },
            type: {
              in: inType,
            },
          },
        },
      },
    });

    return extract;
  }

  async showBallance(where: Prisma.AccountWhereUniqueInput) {
    const extract = await this.prisma.account.findUnique({
      where,
      include: {
        owner: {
          select: {
            name: true,
          },
        },
      },
    });

    return extract;
  }

  async update(id: number, data: UpdateAccountDTO) {
    return await this.prisma.account.update({
      where: {
        id,
      },
      data: {
        isActive: data.isActive,
      },
    });
  }

  async remove(id: number) {
    const exists = await this.prisma.account.findFirst({
      where: { id },
    });

    if (!exists) {
      throw new BadRequestException();
    }

    return await this.prisma.account.delete({
      where: {
        id,
      },
    });
  }
}
