import { ConnectionOptions } from 'typeorm';
import * as path from 'path';

require('dotenv-flow').config();

// console.log(path.resolve(path.join(__dirname, '..')) + '/.env');
// require('dotenv-flow').load([
//   path.resolve(path.join(__dirname, '..')) + '/.env',
// ]);

const databaseHost: string = process.env.DATABASE_HOST;
const databaseName: string = process.env.DATABASE_NAME;
const databasePort = Number(process.env.DATABASE_PORT);
const databaseUsername: string = process.env.DATABASE_USERNAME;
const databasePassword: string = process.env.DATABASE_PASSWORD;
const synchronize: boolean = process.env.SYNC_DATABASE == 'true';
const logging: boolean = process.env.NODE_ENV !== 'TEST';

// You can load you .env file here synchronously using dotenv package (not installed here),
// import * as dotenv from 'dotenv';
// import * as fs from 'fs';
// const environment = process.env.NODE_ENV || 'development';
// const data: any = dotenv.parse(fs.readFileSync(`${environment}.env`));
// You can also make a singleton service that load and expose the .env file content.
// ...

// Check typeORM documentation for more information.

const config: ConnectionOptions = {
  type: 'mysql',
  multipleStatements: true,
  entities: [path.resolve(path.join(__dirname)) + '/**/*.entity{.ts,.js}'],
  migrations: ['src/migration/*.ts'],
  migrationsRun: true,
  migrationsTableName: 'migration',
  cli: {
    migrationsDir: 'src/migration',
  },
  host: databaseHost,
  database: databaseName,
  port: databasePort,
  username: databaseUsername,
  password: databasePassword,
  synchronize: synchronize || false,
  logging: logging,
};

export = config;
