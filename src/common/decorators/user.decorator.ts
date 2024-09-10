import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDTO } from 'src/modules/users/dto/user.dto';

export const RequestUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserDTO;
    return data ? user?.[data] : user;
  },
);