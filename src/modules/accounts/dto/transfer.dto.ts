import { IsNumber, IsNumberString, IsPositive } from 'class-validator';

export class TransferDTO {
  @IsNumberString()
  fromAccount: string;

  @IsNumberString()
  toAccount: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
