import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class FraudThrottlerGuard extends ThrottlerGuard {
  protected errorMessage = 'Your request has been blocked due to potential fraudulent activity. Please contact support if you believe this is an error.';
}
