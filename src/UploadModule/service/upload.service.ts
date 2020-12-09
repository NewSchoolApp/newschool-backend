import * as fs from 'fs';
import { AWSError, S3 } from 'aws-sdk';
import { promisify } from 'util';
import { Response } from 'express';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { PromiseResult } from 'aws-sdk/lib/request';

const fileAccess: (
  path: string,
  mode: number | undefined,
) => Promise<void> = promisify(fs.access);

@Injectable()
export class UploadService implements OnModuleInit {
  private s3: S3;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    this.s3 = new S3(this.configService.getAwsConfiguration());
  }

  public async uploadUserPhoto(
    filePath: string,
    fileBuffer: Buffer,
  ): Promise<PromiseResult<S3.PutObjectOutput, AWSError>> {
    const params: S3.PutObjectRequest = {
      Bucket: this.configService.awsUserBucket,
      Key: filePath,
      Body: fileBuffer,
    };
    return this.s3.putObject(params).promise();
  }

  public async getUserPhoto(filePath: string): Promise<string> {
    const params: S3.GetObjectRequest = {
      Bucket: this.configService.awsUserBucket,
      Key: filePath,
    };
    return this.s3.getSignedUrlPromise('getObject', params);
  }

  public async getFile(
    filePath: string,
  ): Promise<PromiseResult<S3.GetObjectOutput, AWSError>> {
    const params: S3.GetObjectRequest = {
      Bucket: this.configService.awsUserBucket,
      Key: filePath,
    };
    return this.s3.getObject(params).promise();
  }

  public async fileExists(filePath: string): Promise<boolean> {
    const params: S3.Types.HeadObjectRequest = {
      Bucket: this.configService.awsUserBucket,
      Key: filePath,
    };
    try {
      await this.s3.headObject(params).promise();
      return true;
    } catch (e) {
      if (e.code === 'NotFound') {
        return false;
      }
      throw new InternalServerErrorException(e);
    }
  }

  public getFilesInsideFolder(folderName: string) {
    const params: S3.Types.ListObjectsV2Request = {
      Bucket: this.configService.awsUserBucket,
      Prefix: folderName,
    };
    return this.s3.listObjectsV2(params).promise();
  }

  public uploadDataToS3(
    filePath: string,
    data: any,
  ): Promise<PromiseResult<S3.PutObjectOutput, AWSError>> {
    const params: S3.Types.PutObjectRequest = {
      Bucket: this.configService.awsUserBucket,
      Key: filePath,
      Body: JSON.stringify(data),
      ContentType: 'application/json',
    };
    return this.s3.putObject(params).promise();
  }

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
      response.sendFile.bind(response),
    );
    try {
      await sendFile(fileName, { root: 'upload' });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
