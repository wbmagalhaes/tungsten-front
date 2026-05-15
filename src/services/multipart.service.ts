import api from './api';

export interface StartMultipartRequest {
  bucket_id?: string;
  filename: string;
  size: number;
  mime?: string;
  dir?: string;
  visibility?: 'public' | 'private';
}

export interface StartMultipartResponse {
  upload_id: string;
  part_size: number;
  parts_count: number;
}

export interface UploadPartResponse {
  part_number: number;
  etag: string;
}

export interface CompletePart {
  part_number: number;
  etag: string;
}

export const startMultipart = async (body: StartMultipartRequest) => {
  const res = await api.post<StartMultipartResponse>('/api/multipart', body);
  return res.data;
};

export const uploadPart = async (
  uploadId: string,
  partNumber: number,
  blob: Blob,
  onProgress?: (percent: number) => void,
) => {
  const res = await api.put<UploadPartResponse>(
    `/api/multipart/${uploadId}/parts/${partNumber}`,
    blob,
    {
      headers: { 'Content-Type': 'application/octet-stream' },
      onUploadProgress: (e) => {
        if (e.total && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      },
    },
  );
  return res.data;
};

export const completeMultipart = async (
  uploadId: string,
  parts: CompletePart[],
) => {
  const res = await api.post(`/api/multipart/${uploadId}/complete`, { parts });
  return res.data;
};

export const abortMultipart = async (uploadId: string) => {
  await api.delete(`/api/multipart/${uploadId}`);
};
