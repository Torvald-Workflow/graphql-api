// You can load you .env file here synchronously using dotenv package (not installed here),
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ConnectionOptions } from 'typeorm';

let data: any;
if (!(process.env.NODE_ENV === 'production') && fs.existsSync('.env')) {
  data = dotenv.parse(fs.readFileSync(`.env`));
} else {
  data = process.env;
}
// You can also make a singleton service that load and expose the .env file content.
// ...

// Check typeORM documentation for more information.
const config: ConnectionOptions = {
  type: 'postgres',
  host: data.DATABASE_HOST,
  port: parseInt(data.DATABASE_PORT, 10),
  username: data.DATABASE_USER,
  password: data.DATABASE_PASSWORD,
  database: data.DATABASE_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  // We are using migrations, synchronize should be set to false.
  synchronize: process.env.NODE_ENV !== 'production',

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  // migrationsRun: (process.env.NODE_ENV === 'production') ? true : false,
  migrationsRun: process.env.NODE_ENV === 'production',
  logging: true,
  logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/migrations',
  },
};

export = config;
