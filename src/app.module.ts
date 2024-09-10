import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from './modules/accounts/accounts.module';
import { ReportsModule } from './modules/reports/reports.module';
import { minutes, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AccountsModule,
    ReportsModule,
    ThrottlerModule.forRoot([
      {
        ttl: minutes(1),
        limit: 5,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
