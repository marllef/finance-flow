import { PartialType } from '@nestjs/mapped-types';
import { SignUpDTO } from './sign-up.dto';

export class UpdateAuthDto extends PartialType(SignUpDTO) {}
