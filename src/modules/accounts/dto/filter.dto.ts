import { OperationType } from '@prisma/client';
import {  IsDateString, IsEnum, IsOptional } from 'class-validator';

export class FilterDTO {
  @IsOptional()
  @IsDateString()
  start?: Date;

  @IsOptional()
  @IsDateString()
  end?: Date;

  @IsOptional()
  @IsEnum(OperationType)
  type?: OperationType[];
}
