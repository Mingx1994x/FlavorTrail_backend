import type { UUIDTypes } from 'uuid';

export type TUserRole = 'ADMIN' | 'USER';
export type TUserRegisterStatus = 'BASIC' | 'PROFILE';

export type TUser = {
  id: UUIDTypes;
  role: TUserRole;
  email: string;
  nickname: string;
  passwordHash: string | null;
  registerStatus: TUserRegisterStatus;
  name: string | null;
  phone: string | null;
  avatarUrl: string | null;
  liveCity: string | null;
  liveDistrict: string | null;
  introduce: string | null;
};

export type TUserBasic = {
  id: UUIDTypes;
  role: TUserRole;
  email: string;
  nickname: string;
  passwordHash: string | null;
  registerStatus: 'BASIC';
};

export type TUserProfile = TUserBasic & {
  registerStatus: 'PROFILE';
  name: string;
  phone: string;
  liveCity: string;
  liveDistrict: string;
};

export type TCreateUserData = {
  email: string;
  nickname: string;
  passwordHash?: string | null;
};

export type TUserJWTPayload = {
  id: UUIDTypes;
  role: TUserRole;
};

export type TUserUpdatePayload = Partial<
  Pick<
    TUser,
    | 'nickname'
    | 'name'
    | 'phone'
    | 'avatarUrl'
    | 'liveCity'
    | 'liveDistrict'
    | 'introduce'
  >
>;
