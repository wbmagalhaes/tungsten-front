import api from './api';
import type { Paginated } from '@models/paginated';

export interface Queue {
  id: string;
  name: string;
  visibility_timeout: number;
  max_receive_count: number;
  created_at: string;
  updated_at: string;
}

export type QueueMessageStatus =
  | 'visible'
  | 'invisible'
  | 'completed'
  | 'failed';

export interface QueueMessage {
  id: string;
  queue_id: string;
  payload: string;
  dedup_key: string | null;
  status: QueueMessageStatus;
  receive_count: number;
  receipt_handle: string | null;
  visibility_expires_at: string | null;
  created_at: string;
  last_received_at: string | null;
  finished_at: string | null;
}

export interface ListMessagesParams {
  page?: number;
  page_size?: number;
}

export interface QueueGrant {
  user_id: string;
  permission: string;
}

export interface ListQueuesParams {
  search?: string;
  page?: number;
  page_size?: number;
}

export interface CreateQueueRequest {
  name: string;
  visibility_timeout?: number;
  max_receive_count?: number;
}

export interface UpdateQueueRequest {
  name?: string;
  visibility_timeout?: number;
  max_receive_count?: number;
}

export interface SendMessageRequest {
  payload: string;
}

export interface ReceiveParams {
  max_messages?: number;
  wait_time?: number;
}

export const listQueues = async (params?: ListQueuesParams) => {
  const res = await api.get<Paginated<Queue>>('/api/queues', { params });
  return res.data;
};

export const getQueue = async (id: string) => {
  const res = await api.get<Queue>(`/api/queues/${id}`);
  return res.data;
};

export const createQueue = async (body: CreateQueueRequest) => {
  const res = await api.post<Queue>('/api/queues', body);
  return res.data;
};

export const updateQueue = async (id: string, body: UpdateQueueRequest) => {
  const res = await api.patch<Queue>(`/api/queues/${id}`, body);
  return res.data;
};

export const deleteQueue = async (id: string) => {
  await api.delete(`/api/queues/${id}`);
};

export interface ListGrantsParams {
  page?: number;
  page_size?: number;
}

export const listQueueGrants = async (
  id: string,
  params?: ListGrantsParams,
) => {
  const res = await api.get<Paginated<QueueGrant>>(
    `/api/queues/${id}/grants`,
    { params },
  );
  return res.data;
};

export const createQueueGrant = async (id: string, body: QueueGrant) => {
  const res = await api.post(`/api/queues/${id}/grants`, body);
  return res.data;
};

export const deleteQueueGrant = async (
  id: string,
  userId: string,
  permission: string,
) => {
  await api.delete(`/api/queues/${id}/grants/${userId}/${permission}`);
};

export const sendMessage = async (
  id: string,
  body: SendMessageRequest,
) => {
  const res = await api.post<QueueMessage>(`/api/queues/${id}/messages`, body);
  return res.data;
};

export const listMessages = async (
  id: string,
  params?: ListMessagesParams,
) => {
  const res = await api.get<Paginated<QueueMessage>>(
    `/api/queues/${id}/messages`,
    { params },
  );
  return res.data;
};

export const receiveMessages = async (id: string, body?: ReceiveParams) => {
  const res = await api.post<QueueMessage[]>(
    `/api/queues/${id}/receive`,
    body ?? {},
  );
  return res.data;
};

export const ackMessage = async (id: string, receiptHandle: string) => {
  const res = await api.post(
    `/api/queues/${id}/messages/${receiptHandle}/ack`,
  );
  return res.data;
};

export const nackMessage = async (id: string, receiptHandle: string) => {
  const res = await api.post(
    `/api/queues/${id}/messages/${receiptHandle}/nack`,
  );
  return res.data;
};

export const setMessageVisibility = async (
  id: string,
  receiptHandle: string,
  visibilityTimeout: number,
) => {
  const res = await api.patch(
    `/api/queues/${id}/messages/${receiptHandle}/visibility`,
    { visibility_timeout: visibilityTimeout },
  );
  return res.data;
};

export const purgeQueue = async (id: string) => {
  const res = await api.post(`/api/admin/queues/${id}/purge`);
  return res.data;
};

export const redriveQueue = async (id: string) => {
  const res = await api.post(`/api/admin/queues/${id}/redrive`);
  return res.data;
};

export const queueStreamUrl = (id: string) => `/api/queues/${id}/stream`;
