import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { Constants } from '../../CommonsModule';
import ensureFileExists from '../utils/ensureFileExists';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('Upload')
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.UPLOAD_ENDPOINT}`,
)
export class UploadController {
  @Get(':fileName')
  async serveAvatar(@Param('fileName') fileName, @Res() res): Promise<void> {
    await ensureFileExists(`${__dirname}/../../../upload/${fileName}`).catch(
      () => {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          error: 'Not Found',
          message: `File '${fileName}' not found`,
        });
      },
    );
    res.sendFile(fileName, { root: 'upload' });
  }
}
