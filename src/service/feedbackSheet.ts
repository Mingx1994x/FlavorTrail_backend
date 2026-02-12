import { v4 as uuid, type UUIDTypes } from 'uuid';

import { configManager } from '../config/index.js';
import { getSheetsClient } from './getSheetClient.js';
import { normalizeRows } from '../utils/normalizeSheets.js';

import type { TSheetsClient } from '../types/sheets.js';
import type { TFeedback } from '../types/feedback.js';
const SHEET_ID = configManager.sheets.spreadsheet_id;

const FEEDBACK_SHEET_RANGE =
  process.env.GOOGLE_FEEDBACK_RANGE || "'feedback'!A:F";
const FEEDBACK_COLUMNS = [
  'id',
  'imageUrl',
  'content',
  'userNickname',
  'status',
  'createdAt',
] as const;

const initializeFeedbackSheet = async (sheets: TSheetsClient) => {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: FEEDBACK_SHEET_RANGE,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[...FEEDBACK_COLUMNS], FEEDBACK_COLUMNS.map(() => '')],
    },
  });
};

export const getFeedbackRows = async () => {
  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.values
    .get({
      spreadsheetId: SHEET_ID,
      range: FEEDBACK_SHEET_RANGE,
    })
    .catch((error) => {
      if (error.code === 400 || error.code === 404) {
        return { data: { values: [] } };
      }
      throw error;
    });

  const rawValues = response.data.values || [];

  if (rawValues.length === 0) {
    await initializeFeedbackSheet(sheets);
    return [];
  }
  const feedback = normalizeRows<TFeedback>(rawValues, FEEDBACK_COLUMNS);
  return feedback.filter((item) => item.status === 'published');
};
