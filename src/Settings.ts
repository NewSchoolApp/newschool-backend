import { SettingsInterface } from './SettingsInterface';

export class Settings implements SettingsInterface {
  public getApplicationPort(): string {
    return process.env.PORT;
  }

  public getEnvironment(): string {
    return process.env.NODE_ENV;
  }

  public getDatabaseName(): string {
    return process.env.DATABASE_NAME;
  }

  public getDatabaseUser(): string {
    return process.env.DATABASE_USER;
  }

  public getDatabasePassword(): string {
    return process.env.DATABASE_PASSWORD;
  }

  public getDatabasePort(): string {
    return process.env.DATABASE_PORT;
  }
}
