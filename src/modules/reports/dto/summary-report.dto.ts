import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  FormatAccountDigit,
  FormatAccountNumber,
} from '../../../common/utils/transform.utils';

@Exclude()
export class SummaryReportDTO {
  @Expose()
  period: string;

  @Expose()
  holder: string;

  @Expose()
  @Transform(FormatAccountNumber)
  account: string;

  @Expose()
  openingBalance: number;

  @Expose()
  closingBalance: number;

  @Expose()
  netChange: number;

  @Expose()
  income: number;

  @Expose()
  expense: number;

  @Expose()
  @Type(() => DetailsDTO)
  details: DetailsDTO[];

  constructor(partial: Partial<SummaryReportDTO>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class DetailsDTO {
  @Expose()
  deposits: number;

  @Expose()
  withdrawals: number;

  @Expose()
  transfersIn: number;

  @Expose()
  transfersOut: number;

  constructor(partial: Partial<DetailsDTO>) {
    Object.assign(this, partial);
  }
}
