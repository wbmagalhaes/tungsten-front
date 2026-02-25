import api from './api';

export type JobStatus = 'queued' | 'running' | 'done' | 'failed' | 'cancelled';
export type JobKind = 'sandbox';
export type Language = 'python';

export interface SandboxPayload {
  language: Language;
  code: string;
  stdin: string | null;
}

export interface SandboxResult {
  stdout: string;
  stderr: string;
  exit_code: number;
  duration_ms: number;
}

export interface Job {
  id: string;
  user_id: string;
  kind: JobKind;
  status: JobStatus;
  payload: SandboxPayload;
  result: SandboxResult | null;
  error: string | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  results: T[];
}

export interface ListJobsParams {
  kind?: JobKind;
  status?: JobStatus;
  page?: number;
  page_size?: number;
}

export interface RunSandboxRequest {
  language: Language;
  code: string;
  stdin?: string;
}

export const listJobs = async (params?: ListJobsParams) => {
  const res = await api.get<PaginatedResponse<Job>>('/api/jobs', { params });
  return res.data;
};

export const getJob = async (jobId: string) => {
  const res = await api.get<Job>(`/api/jobs/${jobId}`);
  return res.data;
};

export const runSandbox = async (body: RunSandboxRequest) => {
  const res = await api.post<Job>('/api/sandbox/run', body);
  return res.data;
};

export const cancelJob = async (jobId: string) => {
  const res = await api.post(`/api/jobs/${jobId}/cancel`);
  return res.data;
};

export const retryJob = async (jobId: string) => {
  const res = await api.post<Job>(`/api/jobs/${jobId}/retry`);
  return res.data;
};
