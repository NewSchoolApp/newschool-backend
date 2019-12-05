export interface SettingsInterface {
  getApplicationPort(): string;
  getEnvironment(): string;
  getDatabaseName(): string;
  getDatabaseUser(): string;
  getDatabasePassword(): string;
  getDatabasePort(): string;
}