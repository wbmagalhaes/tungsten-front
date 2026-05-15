import api from './api';
import type { Paginated } from '@models/paginated';

export type BucketVisibility = 0 | 1 | 2;

export const BUCKET_VISIBILITY_LABELS: Record<BucketVisibility, string> = {
  0: 'private',
  1: 'public',
  2: 'unlisted',
};

export interface Bucket {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  default_visibility: BucketVisibility;
  archive_after_days: number | null;
  delete_after_days: number | null;
  event_topics: string[];
  event_queues: string[];
  created_at: string;
  updated_at: string;
}

export interface BucketGrant {
  user_id: string;
  permission: string;
}

export interface ListBucketsParams {
  search?: string;
  page?: number;
  page_size?: number;
}

export interface CreateBucketRequest {
  name: string;
  description?: string;
  default_visibility?: BucketVisibility;
  archive_after_days?: number | null;
  delete_after_days?: number | null;
  event_topics?: string[];
  event_queues?: string[];
}

export interface UpdateBucketRequest {
  name?: string;
  description?: string;
  default_visibility?: BucketVisibility;
  archive_after_days?: number | null;
  delete_after_days?: number | null;
  event_topics?: string[];
  event_queues?: string[];
}

export const listBuckets = async (params?: ListBucketsParams) => {
  const res = await api.get<Paginated<Bucket>>('/api/buckets', { params });
  return res.data;
};

export const getBucket = async (id: string) => {
  const res = await api.get<Bucket>(`/api/buckets/${id}`);
  return res.data;
};

export const createBucket = async (body: CreateBucketRequest) => {
  const res = await api.post<Bucket>('/api/buckets', body);
  return res.data;
};

export const updateBucket = async (id: string, body: UpdateBucketRequest) => {
  const res = await api.patch<Bucket>(`/api/buckets/${id}`, body);
  return res.data;
};

export const deleteBucket = async (id: string) => {
  await api.delete(`/api/buckets/${id}`);
};

export interface ListGrantsParams {
  page?: number;
  page_size?: number;
}

export const listBucketGrants = async (
  id: string,
  params?: ListGrantsParams,
) => {
  const res = await api.get<Paginated<BucketGrant>>(
    `/api/buckets/${id}/grants`,
    { params },
  );
  return res.data;
};

export const createBucketGrant = async (id: string, body: BucketGrant) => {
  const res = await api.post<BucketGrant>(`/api/buckets/${id}/grants`, body);
  return res.data;
};

export const deleteBucketGrant = async (
  id: string,
  userId: string,
  permission: string,
) => {
  await api.delete(`/api/buckets/${id}/grants/${userId}/${permission}`);
};
