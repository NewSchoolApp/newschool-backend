import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Constants } from '../../CommonsModule/constants';
import { NeedRole } from '../../CommonsModule/guard/role-metadata.guard';
import { RoleGuard } from '../../CommonsModule/guard/role.guard';
import { DashboardService } from '../service/dashboard.service';
import { UserStatusEnum } from '../enum/UserStatusEnum';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { UserQuantityDTO } from '../dto/user-quantity.dto';
import { ApiTags } from '@nestjs/swagger';
import { CertificateQuantityDTO } from '../dto/certificate-quantity.dto';
import { CourseTakenStatusEnum } from '../../CourseModule/enum/enum';
import { OrderEnum } from '../enum/order.enum';
import { CourseTakenUsersDTO } from '../dto/course-taken-users.dto';
import { getCoursesByFinished } from '../interfaces/getCoursesByFinished';

@ApiTags('Dashboard')
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.DASHBOARD_ENDPOINT}`,
)
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get('/user/quantity')
  @UseGuards(RoleGuard)
  @NeedRole(RoleEnum.ADMIN)
  public async getUserQuantity(
    @Query('status') status?: UserStatusEnum,
  ): Promise<UserQuantityDTO> {
    return { totalElements: await this.service.getUserQuantity(status) };
  }

  @Get('/certificate/quantity')
  @UseGuards(RoleGuard)
  @NeedRole(RoleEnum.ADMIN)
  public async getCertificateQuantity(): Promise<CertificateQuantityDTO> {
    return { totalElements: await this.service.getCertificateQuantity() };
  }

  @Get('/course-taken/user/quantity')
  @UseGuards(RoleGuard)
  @NeedRole(RoleEnum.ADMIN)
  public async getUsersInCourseQuantity(
    @Query('status') status?: CourseTakenStatusEnum,
  ): Promise<CourseTakenUsersDTO> {
    return {
      totalElements: await this.service.getUsersInCourseQuantity(status),
    };
  }

  @Get('/course/views')
  //@UseGuards(RoleGuard)
  //@NeedRole(RoleEnum.ADMIN)
  public async getCoursesByViews(
    @Query('order') order: OrderEnum = OrderEnum.ASC, // Indica que order precisa ter um dos tipos presentes no enum. Se não, recebe o valor 'ASC'
    @Query('limit') limit = 10,
  ): Promise<getCoursesByFinished> {
    const result = await this.service.getCoursesByFinished(order, limit);
    return result;
  }
}
