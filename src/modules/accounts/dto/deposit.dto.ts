import { Transform } from 'class-transformer';
import { IsNumber, IsNumberString, IsPositive } from 'class-validator';

export class DepositDTO {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumberString()
  account: string;
}
