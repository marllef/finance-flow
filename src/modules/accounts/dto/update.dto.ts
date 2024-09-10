import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAccountDTO {
  @IsBoolean()
  isActive: boolean;
}
