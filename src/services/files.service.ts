import api from './api';
import type { FileMetadata } from '@models/file-metadata';
import type { Paginated } from '@models/paginated';

export const listFiles = async (
  bucketId: string,
  params: ListFilesParams = {},
) => {
  const res = await api.get<Paginated<FileMetadata>>(
    `/api/buckets/${bucketId}/files`,
    { params },
  );
  return res.data;
};

export const uploadFile = async ({
  file,
  bucketId,
  dir,
  visibility,
  uploadedBy,
  onProgress,
}: UploadFileParams) => {
  const formData = new FormData();

  if (bucketId) {
    formData.append('bucket_id', bucketId);
  }

  if (dir) {
    formData.append('dir', dir);
  }

  if (visibility) {
    formData.append('visibility', visibility);
  }

  if (uploadedBy) {
    formData.append('uploaded_by', uploadedBy);
  }

  formData.append('file', file);

  await api.post('/api/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (event) => {
      if (event.total && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    },
  });
};

export const readFile = async (id: string) => {
  const res = await api.get<FileMetadata>(`/api/files/${id}`);
  return res.data;
};

export const downloadFile = async ({ id, onProgress }: DownloadFileParams) => {
  const res = await api.get<Blob>(`/api/files/${id}/download`, {
    responseType: 'blob',
    onDownloadProgress: (event) => {
      if (event.total && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    },
  });

  const disposition = res.headers['content-disposition'] || '';
  const match = disposition.match(/filename="(.+)"/);
  const filename = match ? match[1] : 'file';

  const blob = new Blob([res.data]);
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const deleteFile = async (id: string) => {
  const res = await api.delete<void>(`/api/files/${id}`);
  return res.data;
};

export const renameFile = async (id: string, body: RenameRequest) => {
  const res = await api.patch<FileMetadata>(
    `/api/files/${id}/actions/rename`,
    body,
  );
  return res.data;
};

export const moveFile = async (id: string, body: MoveRequest) => {
  const res = await api.patch<FileMetadata>(
    `/api/files/${id}/actions/move`,
    body,
  );
  return res.data;
};

export const archiveFile = async (id: string) => {
  const res = await api.patch<void>(`/api/files/${id}/actions/archive`);
  return res.data;
};

export const setFileVisibility = async (
  id: string,
  body: VisibilityRequest,
) => {
  const res = await api.patch<FileMetadata>(
    `/api/files/${id}/actions/visibility`,
    body,
  );
  return res.data;
};

export const compressFile = async (id: string) => {
  const res = await api.post<FileMetadata>(
    `/api/files/${id}/actions/compress`,
  );
  return res.data;
};

export const decompressFile = async (id: string) => {
  const res = await api.post<FileMetadata>(
    `/api/files/${id}/actions/decompress`,
  );
  return res.data;
};

export const updateFileMetadata = async (
  id: string,
  body: Record<string, unknown>,
) => {
  const res = await api.patch<FileMetadata>(`/api/files/${id}/metadata`, body);
  return res.data;
};

export const streamFile = async (id: string) => {
  const res = await api.get<FileMetadata>(`/api/files/${id}/stream`);
  return res.data;
};

export const viewFile = async (id: string) => {
  const res = await api.get<Blob>(`/api/files/${id}/view`, {
    responseType: 'blob',
  });
  return URL.createObjectURL(res.data);
};

export const viewFileUrl = (id: string) => `/api/files/${id}/view`;

export const signFile = async (id: string, body?: SignFileRequest) => {
  const res = await api.post<{ token: string; url: string }>(
    `/api/files/${id}/sign`,
    body ?? {},
  );
  return res.data;
};

export type ListFilesParams = {
  search?: string;
  dir_prefix?: string;
  page?: number;
  page_size?: number;
  include_archived?: boolean;
};

export type UploadFileParams = {
  file: File;
  bucketId?: string;
  dir?: string;
  visibility?: string;
  uploadedBy?: string;
  onProgress?: (percent: number) => void;
};

export type DownloadFileParams = {
  id: string;
  onProgress?: (percent: number) => void;
};

export type RenameRequest = {
  to: string;
};

export type MoveRequest = {
  to: string;
};

export type VisibilityRequest = {
  visibility: 'public' | 'private' | 'unlisted';
};

export type SignFileRequest = {
  expires_in?: number;
};
