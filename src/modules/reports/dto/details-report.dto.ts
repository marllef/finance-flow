import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  FormatAccountDigit,
  FormatAccountNumber,
} from '../../../common/utils/transform.utils';
import { OperationType, TransactionStatus } from '@prisma/client';
import { NumberToPrecision } from '../../../common/utils/format.utils';

@Exclude()
export class DetailsReportDTO {
  @Expose()
  period: string;

  @Expose({ name: 'owner' })
  @Transform(({ value }) => value.name)
  holder: string;

  @Expose({ name: 'id' })
  @Transform(FormatAccountNumber)
  account: string;

  @Expose()
  @Transform(FormatAccountDigit)
  digit: string;

  @Expose({name: 'balance'})
  @Transform(({ value }) => NumberToPrecision(value))
  balance: number;

  @Exclude()
  isActive: boolean;

  @Expose()
  @Type(() => TransactionDTO)
  transactions: TransactionDTO[];

  @Exclude()
  ownerId: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<DetailsReportDTO>) {
    Object.assign(this, partial);
  }
}

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
  @Transform(({ value }) => value ?? undefined)
  refer: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<TransactionDTO>) {
    Object.assign(this, partial);
  }
}
