import 'dotenv/config';
import { web } from './web.js';
import { jwt } from './jwt.js';
import { credentials } from './credentials.js';
import { sheets } from './sheets.js';
import type { TConfig } from '../types/config.js';

export const configManager: TConfig = {
  web,
  jwt,
  credentials,
  sheets,
};
