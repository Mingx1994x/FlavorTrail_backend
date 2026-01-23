import { configManager } from '../config/index.js';
import type { TSheetsClient } from '../types/sheets.js';

const SHEET_ID = configManager.sheets.spreadsheet_id;

/**
 * 將 Google Sheets 的二維陣列轉換為物件陣列
 * @param rows - Google Sheets 回傳的二維陣列，第一列為標題
 * @returns 物件陣列，以第一列作為 key
 */
export const normalizeRows = <T extends Record<string, any>>(
  rows: any[][],
  columns: readonly (keyof T)[]
): T[] => {
  if (!rows || rows.length === 0) {
    return [];
  }

  const [header, ...dataRows] = rows;

  return dataRows.map((row) =>
    columns.reduce((acc, key, index) => {
      acc[key] = row[index] ?? '';
      return acc;
    }, {} as T)
  );
};

export const appendRow = async <T extends Record<string, any>>(
  sheets: TSheetsClient,
  range: string,
  columns: readonly (keyof T)[],
  payload: T
): Promise<void> => {
  const row = columns.map((key) => {
    const value = payload[key];
    return value === undefined || value === null ? '' : value;
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [row],
    },
  });
};
