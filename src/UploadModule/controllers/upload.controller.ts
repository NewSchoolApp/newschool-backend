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
    const exists = await ensureFileExists(
      `${__dirname}/../../../upload/${fileName}`,
    )
      .then(() => true)
      .catch(() => {
        res.status(HttpStatus.NOT_FOUND).send({
          statusCode: 404,
          error: 'Not Found',
          message: `File '${fileName}' not found`,
        });
      });
    if (!exists) {
      return;
    }
    res.sendFile(fileName, { root: 'upload' }, (error: Error) => {
      if (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: error.message,
        });
      }
    });
  }
}
