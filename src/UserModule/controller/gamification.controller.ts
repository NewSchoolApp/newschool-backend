import { GamificationService } from './../service/gamification.service';
import { UserPointsDto } from './../dto/user-points.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  HttpCode,
  UseGuards,
  Body,
  Logger,
} from '@nestjs/common';
import { Constants, RoleGuard } from 'src/CommonsModule';

@ApiTags('Gamification')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.GAMIFICATION_ENDPOINT}`,
)
export class GamificationController {
  private readonly logger = new Logger(GamificationController.name);

  constructor(private readonly gamificationService: GamificationService) {}

  @Post('/:userId/points')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Add user points',
    description: 'Add user points',
  })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have EXTERNAL role',
  })
  @UseGuards(RoleGuard)
  public async addPointsToUser(
    @Body() userPoints: UserPointsDto,
  ): Promise<void> {
    this.gamificationService.AddPointsToUser(
      userPoints.userId,
      userPoints.points,
    );
  }
}
