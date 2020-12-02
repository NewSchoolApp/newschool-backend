import { Controller, Get, Param, Res } from '@nestjs/common';
import { Constants } from '../../CommonsModule/constants';
import { ApiTags } from '@nestjs/swagger';
import { UploadService } from '../service/upload.service';

@ApiTags('Upload')
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.UPLOAD_ENDPOINT}`,
)
export class UploadController {
  constructor(private readonly service: UploadService) {}

  @Get(':fileName')
  async serveFile(
    @Param('fileName') fileName: string,
    @Res() response,
  ): Promise<void> {
    return this.service.sendFile(fileName, response);
  }
}
