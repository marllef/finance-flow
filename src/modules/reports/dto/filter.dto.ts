import { OperationType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  isPositive,
  IsPositive,
  Validate,
} from 'class-validator';
import { formatISO } from 'date-fns';
import { DateToISO } from 'src/common/utils/format.utils';

export class SummaryFilterDTO {
  @IsDateString()
  start?: Date;

  @IsDateString()
  end?: Date;

  @IsOptional()
  @IsEnum(OperationType)
  type?: OperationType[];
}

export class DetailsFilterDTO {
  @IsNumberString()
  account: string;

  @IsDateString()
  start?: Date;

  @IsDateString()
  end?: Date;

  @IsOptional()
  @IsEnum(OperationType)
  type?: OperationType[];
}
