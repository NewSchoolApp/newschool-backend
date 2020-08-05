import { Injectable, NotImplementedException } from '@nestjs/common';
import { UserStatusEnum } from '../enum/UserStatusEnum';
import { UserService } from '../../UserModule/service/user.service';
import { CourseTakenService } from '../../CourseTakenModule/service/course.taken.service';

@Injectable()
export class DashboardService {
  constructor(
    private userService: UserService,
    private courseTakenService: CourseTakenService,
  ) {}

  public async getUserQuantity(status?: UserStatusEnum): Promise<number> {
    if (!status) {
      return this.userService.getUsersQuantity();
    }
    if (status === UserStatusEnum.ACTIVE) {
      return this.courseTakenService.getActiveUsersQuantity();
    }
    // TODO: will get here if status === 'INACTIVE'. it should be implemented
    throw new NotImplementedException();
  }

  getCertificateQuantity(): Promise<number> {
    return this.courseTakenService.getCertificateQuantity();
  }
}
