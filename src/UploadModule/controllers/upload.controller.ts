import { Controller, Get, Param, Res } from '@nestjs/common';
import { Constants } from '../../CommonsModule';
import { ApiTags } from '@nestjs/swagger';
import { UploadService } from '../service';

@ApiTags('Upload')
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.UPLOAD_ENDPOINT}`,
)
export class UploadController {
  constructor(private readonly service: UploadService) {}

  @Get(':fileName')
  async serveFile(@Param('fileName') fileName, @Res() response): Promise<void> {
    return this.service.sendFile(fileName, response);
  }
}
