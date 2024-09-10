import { User, UserRoles } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  isActive: boolean;

  @Expose()
  role: UserRoles;
  
  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;
  
  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
