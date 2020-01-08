import { Controller, Get, Param, Res, InternalServerErrorException } from '@nestjs/common';
import { Constants } from '../../CommonsModule';
import { ApiUseTags } from '@nestjs/swagger';
import { UploadService } from '../service';

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
  async serveFile(@Param('fileName') fileName, @Res() response): Promise<void> {
    return this.service.sendFile(fileName, response);
  }
}
