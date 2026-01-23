import { requireEnv } from '../utils/handleEnv.js';

export const sheets = {
  spreadsheet_id: requireEnv('GOOGLE_SPREADSHEET_ID'),
};
