import type { UUIDTypes } from 'uuid';

type TFeedbackStatus = 'published' | 'archived' | 'pending';

export type TFeedback = {
  id: UUIDTypes;
  imageUrl: string;
  content: string;
  userNickname: string;
  status: TFeedbackStatus;
  createdAt: string;
};
