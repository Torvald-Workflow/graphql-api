import * as dotenv from 'dotenv';
import { existsSync, readFileSync } from 'fs';

let data: any;
if (!(process.env.NODE_ENV === 'production') && existsSync('.env')) {
  data = dotenv.parse(readFileSync(`.env`));
} else {
  data = process.env;
}

export const jwtConstants = {
  secret: data.JWT_SECRET,
};
