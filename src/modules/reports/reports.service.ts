import { Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts/services/accounts.service';
import { DetailsFilterDTO, SummaryFilterDTO } from './dto/filter.dto';
import { FormatDate, NumberToPrecision } from '../../common/utils/format.utils';
import { OperationType } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly accountService: AccountsService) {}

  async summary(filter: SummaryFilterDTO) {
    const accounts = await this.accountService.findAll(filter);

    return accounts.map((account) => {
      const initialValue = {
        income: 0,
        expense: 0,
        details: {
          deposits: 0,
          withdrawals: 0,
          transfersIn: 0,
          transfersOut: 0,
        },
      };
      
      const details = account.transactions.reduce((total, transaction) => {
        switch (transaction.type) {
          case OperationType.DEPOSIT:
          case OperationType.TRANSFER_IN:
            if (transaction.type === OperationType.TRANSFER_IN) {
              total.details.transfersIn += transaction.amount;
            } else {
              total.details.deposits += transaction.amount;
            }

            return {
              ...total,
              income: NumberToPrecision(
                (total.income || 0) + transaction.amount,
              ),
            };
          case OperationType.TRANSFER_OUT:
          case OperationType.WITHDRAWAL:
            if (transaction.type === OperationType.WITHDRAWAL) {
              total.details.withdrawals += transaction.amount;
            } else {
              total.details.transfersOut += transaction.amount;
            }
            return {
              ...total,
              expense: NumberToPrecision(
                (total?.expense || 0) + transaction.amount,
              ),
            };
        }
      }, initialValue);

      const openingBalance = account.transactions.at(0)?.balance || 0;
      const closingBalance = account.transactions.reduce(
        (total, transaction) => {
          switch (transaction.type) {
            case OperationType.DEPOSIT:
            case OperationType.TRANSFER_IN:
              return NumberToPrecision(total + transaction.amount);
            case OperationType.TRANSFER_OUT:
            case OperationType.WITHDRAWAL:
              return NumberToPrecision(total - transaction.amount);
          }
        },
        0,
      );
      const netChange = NumberToPrecision(closingBalance - openingBalance);

      return {
        period: `${FormatDate(filter?.start)} - ${FormatDate(filter?.end)}`,
        holder: account.owner.name,
        account: account.id,
        openingBalance,
        closingBalance,
        netChange,
        ...details,
      };
    });
  }

  async details(filter?: DetailsFilterDTO) {
    const account = await this.accountService.findOne(
      {
        id: +filter.account,
      },
      filter,
    );
    const openingBalance = account.transactions.at(0)?.balance || 0;
    const closingBalance = account.transactions.reduce((total, transaction) => {
      switch (transaction.type) {
        case OperationType.DEPOSIT:
        case OperationType.TRANSFER_IN:
          return NumberToPrecision(total + transaction.amount);
        case OperationType.TRANSFER_OUT:
        case OperationType.WITHDRAWAL:
          return NumberToPrecision(total - transaction.amount);
        default:
          return total
      }
    }, 0);
    const netChange = NumberToPrecision(closingBalance - openingBalance);

    return {
      period: `${FormatDate(filter?.start)} - ${FormatDate(filter?.end)}`,
      openingBalance,
      closingBalance,
      netChange,
      ...account,
    };
  }
}
