import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Constants, NeedRole, RoleGuard } from '../../CommonsModule';
import { ApiUseTags } from '@nestjs/swagger';
import { UploadService } from '../service';
import { RoleEnum } from '../../SecurityModule/enum';

@ApiUseTags('Upload')
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.UPLOAD_ENDPOINT}`,
)
export class UploadController {
  constructor(
    private readonly service: UploadService,
  ) {
  }

  @Get(':fileName')
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT, RoleEnum.EXTERNAL)
  @UseGuards(RoleGuard)
  async serveFile(@Param('fileName') fileName, @Res() response): Promise<void> {
    return this.service.sendFile(fileName, response);
  }
}
