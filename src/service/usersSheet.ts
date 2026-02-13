import { v4 as uuid, type UUIDTypes } from 'uuid';

import { configManager } from '../config/index.js';
import { getSheetsClient } from './getSheetClient.js';
import {
  appendRow,
  normalizeRows,
  updateRow,
} from '../utils/normalizeSheets.js';

import type { TSheetsClient } from '../types/sheets.js';
import type {
  TCreateUserData,
  TUser,
  TUserUpdatePayload,
  TUserRowData,
} from '../types/users.js';

import {
  findByPredicate,
  findWithIndex,
  isExistBy,
} from '../utils/handleDataUtils.js';
const SHEET_ID = configManager.sheets.spreadsheet_id;

const USER_SHEET_RANGE = process.env.GOOGLE_USER_RANGE || "'users'!A:L";
const USER_COLUMNS = [
  'id',
  'email',
  'passwordHash',
  'name',
  'nickname',
  'phone',
  'avatarUrl',
  'liveCity',
  'liveDistrict',
  'introduce',
  'role',
  'registerStatus',
] as const;

const initializeUserSheet = async (sheets: TSheetsClient) => {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: USER_SHEET_RANGE,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[...USER_COLUMNS], USER_COLUMNS.map(() => '')],
    },
  });
};

// 查詢使用者列表資料
export const getUserRows = async () => {
  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.values
    .get({
      spreadsheetId: SHEET_ID,
      range: USER_SHEET_RANGE,
    })
    .catch((error) => {
      if (error.code === 400 || error.code === 404) {
        return { data: { values: [] } };
      }
      throw error;
    });

  const rawValues = response.data.values || [];

  if (rawValues.length === 0) {
    await initializeUserSheet(sheets);
    return [];
  }
  const users = normalizeRows<TUser>(rawValues, USER_COLUMNS);
  return users;
};

//用戶註冊
export const createUser = async (userData: TCreateUserData) => {
  const payload: TUser = {
    id: uuid(),
    role: 'USER',
    registerStatus: 'BASIC',
    passwordHash: null,
    name: null,
    phone: null,
    avatarUrl: null,
    liveCity: null,
    liveDistrict: null,
    introduce: null,
    ...userData,
  };

  const sheets = getSheetsClient();
  await appendRow<TUser>(sheets, USER_SHEET_RANGE, USER_COLUMNS, payload);
};

// 查找用戶是否存在 By email
export const findExistUserByMail = async (email: string) => {
  const users = await getUserRows();
  return findByPredicate(users, (user) => user.email === email);
};

// 查找用戶是否存在 By Id
export const findExistUserById = async (id: UUIDTypes) => {
  const users = await getUserRows();
  return findByPredicate(users, (user) => user.id === id);
};

// 查找信箱欄位是否存在
export const isExistEmail = async (email: string) => {
  const users = await getUserRows();
  return isExistBy(users, (user) => user.email === email);
};

// 查找暱稱是否存在
export const isExistNickname = async (nickname: string) => {
  const users = await getUserRows();
  return isExistBy(users, (user) => user.nickname === nickname);
};

// 使用 id 查詢使用者資料
export const findUserRowById = async (
  userId: string,
): Promise<TUserRowData | undefined> => {
  const users = await getUserRows();
  return findWithIndex(users, (user) => user.id === userId);
};

// 更新使用者資料列
export const updateUserProfileRow = async (
  userRow: TUserRowData,
  payload: TUserUpdatePayload,
) => {
  const updatedUser = {
    ...userRow.item,
    ...payload,
  };
  const sheets = getSheetsClient();
  await updateRow<TUser>(
    sheets,
    'users',
    userRow.sheetIndex,
    USER_COLUMNS,
    updatedUser,
  );
};

export const updateUserPasswordRow = async (
  userRow: TUserRowData,
  passwordHash: string,
) => {
  const updatedUser = {
    ...userRow.item,
    passwordHash,
  };
  const sheets = getSheetsClient();
  await updateRow<TUser>(
    sheets,
    'users',
    userRow.sheetIndex,
    USER_COLUMNS,
    updatedUser,
  );
};
