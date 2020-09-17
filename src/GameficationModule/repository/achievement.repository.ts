import { User } from '../../UserModule/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Achievement } from './../entity/achievement.entity';

@EntityRepository(Achievement)
export class AchievementRepository extends Repository<Achievement<any>> {
  public getTestOnFirstTakeAchivementByUser<T>(
    user: User,
  ): Promise<Achievement<T>> {
    return this.findOne({ user });
  }
}
