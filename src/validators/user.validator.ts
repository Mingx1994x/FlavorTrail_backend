import { body } from 'express-validator';
import { requiredValidator } from '../utils/validateUtils.js';

import type { ValidationChain } from 'express-validator';
import { isExistEmail } from '../service/usersSheet.js';

const validateEmailChain = (): ValidationChain => {
  return body('email')
    .trim()
    .notEmpty()
    .withMessage('信箱欄位必填')
    .bail()
    .isEmail()
    .withMessage('Email 格式錯誤');
};

const validateNicknameValue = (nickname: string) => {
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
};

const validateNicknameChain = (): ValidationChain => {
  return body('nickname')
    .trim()
    .notEmpty()
    .withMessage('暱稱欄位必填')
    .bail()
    .custom(validateNicknameValue);
};

const validateNicknameOptional = (): ValidationChain => {
  return body('nickname')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null) return true;
      return validateNicknameValue(value);
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

const validateConfirmPasswordChain = () => {
  return body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('確認密碼與密碼不相符');
    }
    return true;
  });
};

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

// 註冊驗證器
export const signupValidator: ValidationChain[] = [
  validateNicknameChain(),
  validateEmailChain(),
  validateEmailAvailable(),
  validatePasswordChain(),
  validateConfirmPasswordChain(),
];

// 登入驗證器
export const loginValidator: ValidationChain[] = [
  requiredValidator('password', '密碼欄位'),
  validateEmailChain(),
];

// 使用者更新資料欄位驗證器
export const updateUserProfileValidator = [
  // forbidden fields
  body('email').not().exists(),
  body('passwordHash').not().exists(),
  body('role').not().exists(),
  body('registerStatus').not().exists(),

  // optional fields
  validateNicknameOptional(),
  body('name')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ max: 50 }),

  body('phone').optional({ nullable: true }).isString().trim(),

  body('avatarUrl').optional({ nullable: true }).isURL(),

  body('liveCity').optional({ nullable: true }).isString().trim(),

  body('liveDistrict').optional({ nullable: true }).isString().trim(),

  body('introduce')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ max: 200 }),
];

// 使用者更新密碼欄位驗證器
export const updateUserPasswordValidator = [
  validatePasswordChain(),
  validateConfirmPasswordChain(),
];
