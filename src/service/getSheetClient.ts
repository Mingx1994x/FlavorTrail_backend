import { google } from 'googleapis';
import { configManager } from '../config/index.js';
import type { TCredentialsConfig } from '../types/config.js';

/**
 * Reuse the Google Sheets client so we do not re-authenticate on every request.
 */
const SHEET_ID = configManager.sheets.spreadsheet_id;
export const buildCredentialsFromEnv = (): TCredentialsConfig => {
  return {
    type: configManager.credentials.type,
    project_id: configManager.credentials.project_id,
    private_key_id: configManager.credentials.private_key_id,
    private_key: configManager.credentials.private_key,
    client_email: configManager.credentials.client_email,
    client_id: configManager.credentials.client_id,
  };
};

// auth
let cached: ReturnType<typeof google.sheets> | null = null;

export const initSheetsClient = async () => {
  if (cached) return cached;

  const credentials = buildCredentialsFromEnv();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const client = google.sheets({ version: 'v4', auth });

  // 🔍 health check
  await client.spreadsheets.get({
    spreadsheetId: SHEET_ID,
  });

  cached = client;
  return cached;
};

export const getSheetsClient = () => {
  if (!cached) {
    throw new Error('Sheets client not initialized');
  }
  return cached;
};
