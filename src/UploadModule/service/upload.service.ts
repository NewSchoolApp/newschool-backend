import * as fs from 'fs';
import { Response } from 'express';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class UploadService {
    public async sendFile(
        fileName: string,
        response: Response,
    ): Promise<void> {
        await this.ensureFileExists(fileName);
        await this.sendFileToResponse(fileName, response);
    }

    private async ensureFileExists(fileName: string): Promise<void> {
      try {
          await this.fileExists(
              `${__dirname}/../../../upload/${fileName}`,
          );
      } catch (error) {
          throw new NotFoundException(`File '${fileName}' not found`);
      }
    }

    private async sendFileToResponse(
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
    private fileExists(path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.access(path, fs.constants.F_OK, (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }
}
