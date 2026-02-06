import api from './api';
import type { FileMetadata } from '@models/file-metadata';
import type { Paginated } from '@models/paginated';

export const listFiles = async (params: ListFilesParams) => {
  const res = await api.get<Paginated<FileMetadata>>('/api/files', {
    params,
  });
  return res.data;
};

export const uploadFile = async ({
  file,
  dir,
  visibility,
}: UploadFileParams) => {
  const formData = new FormData();

  formData.append('file', file);

  if (dir) {
    formData.append('dir', dir);
  }

  if (visibility) {
    formData.append('visibility', visibility);
  }

  const res = await api.post<FileMetadata>('/api/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

export const readFile = async (id: string) => {
  const res = await api.get<FileMetadata>(`/api/files/${id}`);
  return res.data;
};

export const downloadFile = async (id: string) => {
  const res = await api.get<FileMetadata>(`/api/files/${id}/download`);
  return res.data;
};

export const deleteFile = async (id: string) => {
  const res = await api.delete<void>(`/api/files/${id}`);
  return res.data;
};

export const renameFile = async (id: string, body: RenameRequest) => {
  const res = await api.post<FileMetadata>(`/api/files/${id}/rename`, body);
  return res.data;
};

export const moveFile = async (id: string, body: MoveRequest) => {
  const res = await api.post<FileMetadata>(`/api/files/${id}/move`, body);
  return res.data;
};

export const archiveFile = async (id: string) => {
  const res = await api.post<void>(`/api/files/${id}/archive`);
  return res.data;
};

export const compressFile = async (id: string) => {
  const res = await api.post<FileMetadata>(`/api/files/${id}/compress`);
  return res.data;
};

export const decompressFile = async (id: string) => {
  const res = await api.post<FileMetadata>(`/api/files/${id}/decompress`);
  return res.data;
};

export const streamFile = async (id: string) => {
  const res = await api.get<FileMetadata>(`/api/files/${id}/stream`);
  return res.data;
};

export type ListFilesParams = {
  search?: string;
  dir_prefix?: string;
  page?: number;
  per_page?: number;
  include_archived?: boolean;
};

export type UploadFileParams = {
  file: File;
  dir?: string;
  visibility?: string;
};

export type RenameRequest = {
  to: string;
};

export type MoveRequest = {
  to: string;
};
