import { requireEnv } from '../utils/handleEnv.js';

const GOOGLE_SA_TYPE = requireEnv('GOOGLE_SA_TYPE');
const GOOGLE_SA_PROJECT_ID = requireEnv('GOOGLE_SA_PROJECT_ID');
const GOOGLE_SA_PRIVATE_KEY_ID = requireEnv('GOOGLE_SA_PRIVATE_KEY_ID');
const GOOGLE_SA_PRIVATE_KEY = requireEnv('GOOGLE_SA_PRIVATE_KEY').replace(
  /\\n/g,
  '\n'
);
const GOOGLE_SA_CLIENT_EMAIL = requireEnv('GOOGLE_SA_CLIENT_EMAIL');
const GOOGLE_SA_CLIENT_ID = requireEnv('GOOGLE_SA_CLIENT_ID');

export const credentials = {
  type: GOOGLE_SA_TYPE,
  project_id: GOOGLE_SA_PROJECT_ID,
  private_key_id: GOOGLE_SA_PRIVATE_KEY_ID,
  private_key: GOOGLE_SA_PRIVATE_KEY,
  client_email: GOOGLE_SA_CLIENT_EMAIL,
  client_id: GOOGLE_SA_CLIENT_ID,
} as const;
