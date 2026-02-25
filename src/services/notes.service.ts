import type { Paginated } from '@models/paginated';
import api from './api';

export interface Note {
  id: string;
  user_id: string;
  icon: string;
  title: string;
  body: string;
  color: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ListNotesParams {
  search?: string;
  page?: number;
  page_size?: number;
}

export interface CreateNoteRequest {
  title: string;
  body: string;
  icon: string;
  color: string;
}

export interface UpdateNoteRequest {
  title?: string;
  body?: string;
  icon?: string;
  color?: string;
}

export const listNotes = async (params?: ListNotesParams) => {
  const res = await api.get<Paginated<Note>>('/api/notes', { params });
  return res.data;
};

export const getNote = async (id: string) => {
  const res = await api.get<Note>(`/api/notes/${id}`);
  return res.data;
};

export const createNote = async (body: CreateNoteRequest) => {
  const res = await api.post<Note>('/api/notes', body);
  return res.data;
};

export const updateNote = async (id: string, body: UpdateNoteRequest) => {
  const res = await api.patch<Note>(`/api/notes/${id}`, body);
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await api.delete(`/api/notes/${id}`);
  return res.data;
};
