import { sheets_v4 } from 'googleapis';

// ============ Client 型別 ============
export type TSheetsClient = sheets_v4.Sheets;

// 1. ValueRange - 讀取/寫入資料時最常用
export type TValueRange = sheets_v4.Schema$ValueRange;

// 2. Spreadsheet - 完整的試算表資訊
export type TSpreadsheet = sheets_v4.Schema$Spreadsheet;

// 3. Sheet - 單一工作表資訊
export type TSheet = sheets_v4.Schema$Sheet;

// 4. SheetProperties - 工作表屬性
export type TSheetProperties = sheets_v4.Schema$SheetProperties;

// 5. BatchUpdateValuesResponse - 批次更新回應
export type TBatchUpdateValuesResponse =
  sheets_v4.Schema$BatchUpdateValuesResponse;

// 6. AppendValuesResponse - 附加資料回應
export type TAppendValuesResponse = sheets_v4.Schema$AppendValuesResponse;

// 7. ClearValuesResponse - 清除資料回應
export type TClearValuesResponse = sheets_v4.Schema$ClearValuesResponse;
