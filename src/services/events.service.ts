import api from './api';
import type { Paginated } from '@models/paginated';

export interface FailedEvent {
  id: string;
  event_type: string;
  payload: Record<string, unknown>;
  error: string;
  attempts: number;
  created_at: string;
  failed_at: string;
}

export const listFailedEvents = async () => {
  const res = await api.get<Paginated<FailedEvent>>('/api/events/failed');
  return res.data;
};
