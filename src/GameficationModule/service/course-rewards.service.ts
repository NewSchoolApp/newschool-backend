import { Injectable } from '@nestjs/common';
import { On } from '../pub-sub.decorator';

interface TestOnFirstTake {
  userId: string;
  alternative: string;
}

@Injectable()
export class CourseRewardsService {
  @On('CourseReward::TestOnFirstTake')
  checkTestReward(message: string, data: TestOnFirstTake): void {
    console.log('mensagem chegou', message, data);
  }
}
