import { body } from 'express-validator';
import { requiredValidator } from '../utils/validateUtils.js';

import type { ValidationChain } from 'express-validator';
import { isExistEmail, isExistNickname } from '../service/usersSheet.js';

const validateEmailChain = (): ValidationChain => {
  return body('email')
    .trim()
    .notEmpty()
    .withMessage('信箱欄位必填')
    .bail()
    .isEmail()
    .withMessage('Email 格式錯誤');
};

const validateNicknameChain = (): ValidationChain => {
  return body('nickname')
    .trim()
    .notEmpty()
    .withMessage('暱稱欄位必填')
    .bail()
    .custom((nickname: string) => {
      // 1️⃣ 長度（Unicode-aware）
      const length = Array.from(nickname).length;
      if (length < 2 || length > 20) {
        throw new Error('暱稱長度需介於 2~20 字');
      }

      // 2️⃣ 禁止危險字元
      const INVALID_CHAR_REGEX = /[<>/\\{}[\]|^~`$]/;
      if (INVALID_CHAR_REGEX.test(nickname)) {
        throw new Error('暱稱包含不允許的字元');
      }

      // 3️⃣ 禁止不可見控制字元
      if (/\p{C}/u.test(nickname)) {
        throw new Error('暱稱包含不可見字元');
      }

      return true;
    });
};

/**
 * 密碼規則
 * 長度 6～12
 * 至少包含 1 個小寫字母、1 個大寫字母、1 個數字
 * 只允許英文字母與數字
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,12}$/;
const validatePasswordChain = (
  field = 'password',
  label = '密碼欄位',
): ValidationChain =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${label}必填`)
    .bail()
    .matches(passwordRegex)
    .withMessage(
      `${label}格式錯誤，長度需 6～12，至少包含 1 個小寫字母、1 個大寫字母、1 個數字`,
    );

// 欄位是否複用驗證
const validateEmailAvailable = () => {
  return body('email').custom(async (email) => {
    const isExist = await isExistEmail(email);
    if (isExist) {
      throw new Error('信箱已被使用');
    }
    return true;
  });
};

const validateNicknameAvailable = () => {
  return body('nickname').custom(async (nickname) => {
    const isExist = await isExistNickname(nickname);
    if (isExist) {
      throw new Error('暱稱已被使用');
    }
    return true;
  });
};

export const signupValidator: ValidationChain[] = [
  validateNicknameChain(),
  validateNicknameAvailable(),
  validateEmailChain(),
  validateEmailAvailable(),
  validatePasswordChain(),
];

export const loginValidator: ValidationChain[] = [
  requiredValidator('password', '密碼欄位'),
  validateEmailChain(),
];
