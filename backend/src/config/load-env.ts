import { config } from 'dotenv';
import { getRootEnvPath } from './env-path';

config({ path: getRootEnvPath() });
