import { UserRepository } from './../repository/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GamificationService {
  constructor(private readonly userRepository: UserRepository) {}

  public async AddPointsToUser(userId: string, points: number): Promise<void> {
    this.userRepository.addPointToUser(userId, points);
  }
}
