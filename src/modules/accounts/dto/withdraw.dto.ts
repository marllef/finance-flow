import { IsNumber, IsNumberString, IsPositive } from 'class-validator';

export class WithdrawDTO {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumberString()
  account: string;
}
