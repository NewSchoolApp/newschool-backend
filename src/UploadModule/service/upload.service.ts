import { Response } from 'express';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as file from '../../CommonsModule/file';

@Injectable()
export class UploadService {
    public async sendFile(
        fileName: string,
        response: Response,
    ): Promise<void> {
        await this.ensureFileExists(fileName);
        await this.sendFileToResponse(fileName, response);
    }

    public async ensureFileExists(fileName: string): Promise<void> {
      try {
          await file.exists(
              `${__dirname}/../../../upload/${fileName}`,
          );
      } catch (error) {
          throw new NotFoundException(`File '${fileName}' not found`);
      }
    }

    public async sendFileToResponse(
            fileName: string,
            response: Response,
        ): Promise<void> {
        return new Promise((resolve, reject) => {
            response.sendfile(
                fileName,
                { root: 'upload' },
                (error: Error) => {
                    if (error) {
                        reject(new InternalServerErrorException(error.message));
                    }
                    resolve();
                },
            );
        });
    }
}
