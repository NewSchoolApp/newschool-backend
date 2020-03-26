import { Injectable } from '@nestjs/common';
import { UserStatusEnum } from '../enum/UserStatusEnum';
import { UserService } from '../../UserModule/service/user.service';

@Injectable()
export class DashboardService {
  constructor(private userService: UserService) {}

  public async getUserQuantity(status?: UserStatusEnum): Promise<number> {
    return this.userService.getUserQuantity(status);
  }
}
