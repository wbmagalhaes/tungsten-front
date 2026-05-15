import api from './api';
import type { Paginated } from '@models/paginated';

export type JobStatus = 'queued' | 'running' | 'done' | 'failed' | 'cancelled';

export interface Job {
  id: string;
  user_id: string;
  name: string;
  language: string;
  code: string;
  stdin: string | null;
  priority: number;
  trigger?: JobTrigger;
  trigger_type?: JobTrigger['type'];
  trigger_config?: Record<string, unknown>;
  timeout_seconds: number | null;
  max_attempts: number | null;
  enabled: boolean;
  result_topics: string[];
  result_queues: string[];
  next_fire_at: string | null;
  last_fired_at: string | null;
  created_at: string;
  updated_at: string;
}

export const normalizeTrigger = (job: Job): JobTrigger => {
  if (job.trigger) return job.trigger;
  const t = job.trigger_type ?? 'eager';
  const c = job.trigger_config ?? {};
  switch (t) {
    case 'eager':
      return { type: 'eager' };
    case 'timestamp':
      return { type: 'timestamp', at: String(c.at ?? '') };
    case 'cron':
      return {
        type: 'cron',
        expr: String(c.expr ?? ''),
        tz: c.tz ? String(c.tz) : undefined,
      };
    case 'queue':
      return { type: 'queue', queue_id: String(c.queue_id ?? '') };
    default:
      return { type: 'eager' };
  }
};

export interface JobExecution {
  id: string;
  job_id: string;
  status: JobStatus;
  stdout: string | null;
  stderr: string | null;
  exit_code: number | null;
  duration_ms: number | null;
  error: string | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

export interface ListJobsParams {
  search?: string;
  page?: number;
  page_size?: number;
}

export interface ListExecutionsParams {
  status?: JobStatus;
  page?: number;
  page_size?: number;
}

export type JobTrigger =
  | { type: 'eager' }
  | { type: 'timestamp'; at: string }
  | { type: 'cron'; expr: string; tz?: string }
  | { type: 'queue'; queue_id: string };

export interface CreateJobRequest {
  name: string;
  language: string;
  code: string;
  stdin?: string | null;
  priority?: number;
  trigger: JobTrigger;
  timeout_seconds?: number | null;
  max_attempts?: number | null;
  enabled?: boolean;
  result_topics?: string[];
  result_queues?: string[];
}

export interface UpdateJobRequest {
  name?: string;
  language?: string;
  code?: string;
  stdin?: string | null;
  priority?: number;
  trigger?: JobTrigger;
  timeout_seconds?: number | null;
  max_attempts?: number | null;
  enabled?: boolean;
  result_topics?: string[];
  result_queues?: string[];
}

export const listJobs = async (params?: ListJobsParams) => {
  const res = await api.get<Paginated<Job>>('/api/jobs', { params });
  return res.data;
};

export const getJob = async (jobId: string) => {
  const res = await api.get<Job>(`/api/jobs/${jobId}`);
  return res.data;
};

export const createJob = async (body: CreateJobRequest) => {
  const res = await api.post<Job>('/api/jobs', body);
  return res.data;
};

export const updateJob = async (jobId: string, body: UpdateJobRequest) => {
  const res = await api.patch<Job>(`/api/jobs/${jobId}`, body);
  return res.data;
};

export const deleteJob = async (jobId: string) => {
  await api.delete(`/api/jobs/${jobId}`);
};

export const runJob = async (jobId: string) => {
  const res = await api.post<JobExecution>(`/api/jobs/${jobId}/run`);
  return res.data;
};

export const listJobExecutions = async (
  jobId: string,
  params?: ListExecutionsParams,
) => {
  const res = await api.get<Paginated<JobExecution>>(
    `/api/jobs/${jobId}/executions`,
    { params },
  );
  return res.data;
};

export const getExecution = async (executionId: string) => {
  const res = await api.get<JobExecution>(`/api/executions/${executionId}`);
  return res.data;
};

export const cancelExecution = async (executionId: string) => {
  const res = await api.post(`/api/executions/${executionId}/cancel`);
  return res.data;
};

export const retryExecution = async (executionId: string) => {
  const res = await api.post<JobExecution>(
    `/api/executions/${executionId}/retry`,
  );
  return res.data;
};

export const listFailedExecutions = async (params?: ListExecutionsParams) => {
  const res = await api.get<Paginated<JobExecution>>(
    '/api/admin/jobs/executions/failed',
    { params },
  );
  return res.data;
};

export interface JobLanguageConfig {
  language: string;
  default_timeout_seconds: number;
  concurrency: number;
  max_attempts: number;
  base_delay_seconds: number;
  enabled: boolean;
}

export interface ListJobLanguagesParams {
  page?: number;
  page_size?: number;
}

export const listJobLanguages = async (params?: ListJobLanguagesParams) => {
  const res = await api.get<Paginated<JobLanguageConfig>>(
    '/api/admin/jobs/languages',
    { params },
  );
  return res.data;
};

export const createJobLanguage = async (body: JobLanguageConfig) => {
  const res = await api.post<JobLanguageConfig>(
    '/api/admin/jobs/languages',
    body,
  );
  return res.data;
};
