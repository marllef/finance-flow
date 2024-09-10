import { OperationType, TransactionStatus } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { NumberToPrecision } from '../../../common/utils/format.utils';
import { FormatAccountNumber } from '../../../common/utils/transform.utils';

@Exclude()
export class TransactionDTO {
  @Exclude()
  id: number;

  @Expose({ name: 'uniqueId' })
  key: string;

  @Expose()
  @Transform(({ value }) => NumberToPrecision(value))
  amount: number;

  @Exclude()
  @Transform(({ value }) => NumberToPrecision(value))
  balance: number;

  @Expose()
  type: OperationType;

  @Expose()
  status: TransactionStatus;

  @Expose()
  description: string;

  @Expose()
  date: Date;

  @Expose({ name: 'accountId' })
  @Transform(FormatAccountNumber)
  account: number;

  @Expose()
  refer: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<TransactionDTO>) {
    Object.assign(this, partial);
  }
}
