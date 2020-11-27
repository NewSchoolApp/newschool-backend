import { OrderEnum } from '../../CommonsModule/enum/order.enum';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { UserStatusEnum } from '../enum/UserStatusEnum';
import { UserService } from '../../UserModule/service/user.service';
import { CourseTakenStatusEnum } from '../../CourseModule/enum/enum';
import { getCoursesByFinished } from '../interfaces/getCoursesByFinished';
import { CourseTakenService } from '../../CourseModule/service/v1/course-taken.service';

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

  getUsersInCourseQuantity(
    status: CourseTakenStatusEnum,
  ): number | PromiseLike<number> {
    if (!status) {
      return this.courseTakenService.getUsersWithCompletedAndTakenCourses();
    }
    if (status === CourseTakenStatusEnum.COMPLETED) {
      return this.courseTakenService.getUsersWithCompletedCourses();
    }
    return this.courseTakenService.getUsersWithTakenCourses();
  }

  getCoursesByFinished(
    order: OrderEnum,
    limit: number,
  ): Promise<getCoursesByFinished> {
    //deve executar uma função presente em 'courses.taken.service' que por sua vez retorna o resultado de uma query no db
    return this.courseTakenService.getCoursesByFinished(order, limit);
  }
}
