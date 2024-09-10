import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { UserDTO } from 'src/modules/users/dto/user.dto';
import { TransactionDTO } from './transaction.dto';
import {
  FormatAccountDigit,
  FormatAccountNumber,
} from '../../../common/utils/transform.utils';
import { NumberToPrecision } from '../../../common/utils/format.utils';

@Exclude()
export class AccountDTO {
  @Expose({ name: 'id' })
  @Transform(FormatAccountNumber)
  account: string;

  @Expose()
  @Transform(FormatAccountDigit)
  digit: string;

  @Expose()
  @Transform(({ value }) => NumberToPrecision(value))
  balance: number;

  @Expose({ name: 'owner' })
  @Transform(({ value }) => value?.name)
  holder: string;

  @Expose()
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

  constructor(partial: Partial<AccountDTO>) {
    Object.assign(this, partial);
  }
}
