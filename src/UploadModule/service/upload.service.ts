import * as fs from 'fs';
import { promisify } from 'util';
import { Response } from 'express';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

const fileAccess: (
  path: string,
  mode: number | undefined,
) => Promise<void> = promisify(fs.access);

@Injectable()
export class UploadService {
  public async sendFile(fileName: string, response: Response): Promise<void> {
    await this.ensureFileExists(fileName);
    await this.sendFileToResponse(fileName, response);
  }

  private async ensureFileExists(fileName: string): Promise<void> {
    try {
      const path = `${__dirname}/../../../upload/${fileName}`;
      await fileAccess(path, fs.constants.F_OK);
    } catch (error) {
      throw new NotFoundException(`File '${fileName}' not found`);
    }
  }

  private async sendFileToResponse(
    fileName: string,
    response: Response,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendFile: (path: string, options: any) => Promise<void> = promisify(
      response.sendfile.bind(response),
    );
    try {
      await sendFile(fileName, { root: 'upload' });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
