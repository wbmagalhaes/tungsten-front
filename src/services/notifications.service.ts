import api from './api';
import type { Paginated } from '@models/paginated';

export type RecipientKind =
  | 'email'
  | 'sms'
  | 'push'
  | 'webhook'
  | 'in_app';

export interface Recipient {
  id: string;
  user_id: string;
  kind: RecipientKind;
  address: string;
  verified: boolean;
  disabled: boolean;
  created_at: string;
}

export const SYSTEM_OWNER_ID = '00000000-0000-0000-0000-000000000000';

export interface Topic {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  is_system?: boolean;
  discoverable: boolean;
  rate_limit_per_minute?: number | null;
  created_at: string;
}

export const isSystemTopic = (t: Pick<Topic, 'owner_id' | 'is_system'>) =>
  t.owner_id === SYSTEM_OWNER_ID || !!t.is_system;

export interface Subscription {
  recipient_id: string;
  topic_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  topic_id: string;
  recipient_id: string;
  subject: string;
  body: string;
  status: 'pending' | 'sent' | 'failed';
  sent_at: string | null;
  created_at: string;
}

export interface InboxItem {
  id: string;
  topic_id: string;
  subject: string;
  body: string;
  read?: boolean;
  read_at?: string | null;
  created_at: string;
}

export const isInboxItemRead = (it: InboxItem): boolean =>
  it.read === true || it.read_at != null;

const base = '/api/notifications';

export const listRecipients = async () => {
  const res = await api.get<Paginated<Recipient>>(`${base}/recipients`);
  return res.data;
};

export const getRecipient = async (id: string) => {
  const res = await api.get<Recipient>(`${base}/recipients/${id}`);
  return res.data;
};

export const createRecipient = async (body: {
  kind: RecipientKind;
  address: string;
}) => {
  const res = await api.post<Recipient>(`${base}/recipients`, body);
  return res.data;
};

export const updateRecipient = async (
  id: string,
  body: Partial<{ address: string }>,
) => {
  const res = await api.patch<Recipient>(`${base}/recipients/${id}`, body);
  return res.data;
};

export const deleteRecipient = async (id: string) => {
  await api.delete(`${base}/recipients/${id}`);
};

export const verifyRecipient = async (id: string, code?: string) => {
  const res = await api.post(`${base}/recipients/${id}/verify`, { code });
  return res.data;
};

export const setRecipientDisabled = async (id: string, disabled: boolean) => {
  const res = await api.patch<Recipient>(
    `${base}/recipients/${id}/disabled`,
    { disabled },
  );
  return res.data;
};

export const rotateRecipientSecret = async (id: string) => {
  const res = await api.post<{ secret: string }>(
    `${base}/recipients/${id}/rotate-secret`,
  );
  return res.data;
};

export const listTopics = async () => {
  const res = await api.get<Paginated<Topic>>(`${base}/topics`);
  return res.data;
};

export const listSendableTopics = async () => {
  const res = await api.get<Paginated<Topic>>(`${base}/topics/sendable`);
  return res.data;
};

export const listDiscoverableTopics = async () => {
  const res = await api.get<Paginated<Topic>>(`${base}/topics/discoverable`);
  return res.data;
};

export const listSystemTopics = async () => {
  const res = await api.get<Paginated<Topic>>(`${base}/topics/system`);
  return res.data;
};

export const createSystemTopic = async (body: {
  name: string;
  description?: string;
}) => {
  const res = await api.post<Topic>(`${base}/topics/system`, body);
  return res.data;
};

export const getTopic = async (id: string) => {
  const res = await api.get<Topic>(`${base}/topics/${id}`);
  return res.data;
};

export const createTopic = async (body: {
  name: string;
  description?: string;
  discoverable?: boolean;
}) => {
  const res = await api.post<Topic>(`${base}/topics`, body);
  return res.data;
};

export const updateTopic = async (
  id: string,
  body: Partial<{ name: string; description: string; discoverable: boolean }>,
) => {
  const res = await api.patch<Topic>(`${base}/topics/${id}`, body);
  return res.data;
};

export const deleteTopic = async (id: string) => {
  await api.delete(`${base}/topics/${id}`);
};

export const subscribeTopic = async (
  topicId: string,
  recipientId: string,
) => {
  const res = await api.post<Subscription>(
    `${base}/topics/${topicId}/subscriptions`,
    { recipient_id: recipientId },
  );
  return res.data;
};

export const listSubscriptions = async (topicId: string) => {
  const res = await api.get<Paginated<Subscription>>(
    `${base}/topics/${topicId}/subscriptions`,
  );
  return res.data;
};

export const unsubscribeTopic = async (
  topicId: string,
  recipientId: string,
) => {
  await api.delete(`${base}/topics/${topicId}/subscriptions/${recipientId}`);
};

export interface TopicPermission {
  user_id: string;
  permission: string;
}

export const listTopicPermissions = async (topicId: string) => {
  const res = await api.get<Paginated<TopicPermission>>(
    `${base}/topics/${topicId}/permissions`,
  );
  return res.data;
};

export const createTopicPermission = async (
  topicId: string,
  body: TopicPermission,
) => {
  const res = await api.post<TopicPermission>(
    `${base}/topics/${topicId}/permissions`,
    body,
  );
  return res.data;
};

export const deleteTopicPermission = async (
  topicId: string,
  userId: string,
  permission: string,
) => {
  await api.delete(
    `${base}/topics/${topicId}/permissions/${userId}/${permission}`,
  );
};

export const sendToTopic = async (
  topicId: string,
  body: { subject: string; body: string },
) => {
  const res = await api.post(`${base}/topics/${topicId}/send`, body);
  return res.data;
};

export const listNotifications = async () => {
  const res = await api.get<Paginated<Notification>>(base);
  return res.data;
};

export const getNotification = async (id: string) => {
  const res = await api.get<Notification>(`${base}/${id}`);
  return res.data;
};

export const listFailedNotifications = async () => {
  const res = await api.get<Paginated<Notification>>(`${base}/failed`);
  return res.data;
};

export const retryNotification = async (id: string) => {
  const res = await api.post(`${base}/${id}/retry`);
  return res.data;
};

export const cancelNotification = async (id: string) => {
  const res = await api.post(`${base}/${id}/cancel`);
  return res.data;
};

export interface CleanupReport {
  deleted_count: number;
  cutoff: string;
  [key: string]: unknown;
}

export const getCleanupReport = async () => {
  const res = await api.get<CleanupReport>(`${base}/admin/cleanup`);
  return res.data;
};

export interface ListUserRecipientsParams {
  page?: number;
  page_size?: number;
}

export const listUserRecipientsAdmin = async (
  userId: string,
  params?: ListUserRecipientsParams,
) => {
  const res = await api.get<Paginated<Recipient>>(
    `${base}/admin/users/${userId}/recipients`,
    { params },
  );
  return res.data;
};

export const ensureInappRecipient = async (userId: string) => {
  const res = await api.post<Recipient>(
    `${base}/admin/users/${userId}/recipients/ensure-inapp`,
  );
  return res.data;
};

export const runCleanup = async () => {
  const res = await api.post<CleanupReport>(`${base}/admin/cleanup`);
  return res.data;
};

export type PreferenceEntry = {
  id: string;
  enabled: boolean;
  address: string;
  verified: boolean;
} | null;

export interface NotificationPreferences {
  in_app: PreferenceEntry;
  email: PreferenceEntry;
  push: PreferenceEntry;
}

export const getNotificationPreferences = async () => {
  const res = await api.get<NotificationPreferences>(`${base}/preferences`);
  return res.data;
};

export const updateNotificationPreferences = async (body: {
  in_app?: boolean;
  email?: boolean;
  push?: boolean;
}) => {
  const res = await api.patch<NotificationPreferences>(
    `${base}/preferences`,
    body,
  );
  return res.data;
};

export const getVapidPublicKey = async () => {
  const res = await api.get<{ public_key: string }>(`${base}/vapid-public-key`);
  return res.data;
};

export const listInbox = async () => {
  const res = await api.get<Paginated<InboxItem>>(`${base}/inbox`);
  return res.data;
};

export const getInboxUnreadCount = async () => {
  const res = await api.get<{ count: number }>(`${base}/inbox/unread-count`);
  return res.data;
};

export const markInboxRead = async (id: string) => {
  const res = await api.post(`${base}/inbox/${id}/read`);
  return res.data;
};

export const markAllInboxRead = async () => {
  const res = await api.post(`${base}/inbox/read-all`);
  return res.data;
};

export const inboxStreamUrl = (topicId?: string) =>
  topicId ? `${base}/inbox/stream/${topicId}` : `${base}/inbox/stream`;
