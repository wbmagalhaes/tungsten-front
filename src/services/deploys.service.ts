import axios from 'axios';
import api from './api';
import type { Paginated } from '@models/paginated';

export type ProjectKind = 'static' | 'api';

export type GrantPermission = 'view' | 'deploy' | 'admin';

export interface DeployProject {
  id: string;
  owner_id: string;
  name: string;
  kind: ProjectKind;
  slug: string | null;
  created_at: string;
  last_deployed_at: string | null;
  deployed_bytes: number;
}

export interface ProjectGrant {
  project_id: string;
  user_id: string;
  permission: GrantPermission;
  created_at: string;
}

export interface ListProjectsParams {
  page?: number;
  page_size?: number;
}

export interface CreateProjectRequest {
  name: string;
  kind?: ProjectKind;
  slug?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  slug?: string | null;
}

export interface ListGrantsParams {
  page?: number;
  page_size?: number;
}

export interface CreateGrantRequest {
  user_id: string;
  permission: GrantPermission;
}

export interface DeployParams {
  bundle: Blob;
  filename?: string;
  onProgress?: (percent: number) => void;
}

export const listProjects = async (params?: ListProjectsParams) => {
  const res = await api.get<Paginated<DeployProject>>('/api/deploy/projects', {
    params,
  });
  return res.data;
};

export const getProject = async (id: string) => {
  const res = await api.get<DeployProject>(`/api/deploy/projects/${id}`);
  return res.data;
};

export const createProject = async (body: CreateProjectRequest) => {
  const res = await api.post<DeployProject>('/api/deploy/projects', body);
  return res.data;
};

export const updateProject = async (id: string, body: UpdateProjectRequest) => {
  const res = await api.patch<DeployProject>(
    `/api/deploy/projects/${id}`,
    body,
  );
  return res.data;
};

export const deleteProject = async (id: string) => {
  await api.delete(`/api/deploy/projects/${id}`);
};

export const deployProject = async (
  id: string,
  { bundle, filename, onProgress }: DeployParams,
) => {
  const formData = new FormData();
  formData.append('bundle', bundle, filename ?? 'bundle.tar.gz');

  const res = await api.post<DeployProject>(
    `/api/deploy/projects/${id}/deploy`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    },
  );
  return res.data;
};

export const listProjectGrants = async (
  id: string,
  params?: ListGrantsParams,
) => {
  const res = await api.get<Paginated<ProjectGrant>>(
    `/api/deploy/projects/${id}/grants`,
    { params },
  );
  return res.data;
};

export const createProjectGrant = async (
  id: string,
  body: CreateGrantRequest,
) => {
  await api.post(`/api/deploy/projects/${id}/grants`, body);
};

export const deleteProjectGrant = async (
  id: string,
  userId: string,
  permission: GrantPermission,
) => {
  await api.delete(`/api/deploy/projects/${id}/grants/${userId}/${permission}`);
};

const SITE_DOMAIN = 'tungsten.rocks';

export const canonicalUrl = (project: DeployProject) =>
  `https://static-${project.id}.${SITE_DOMAIN}`;

export const slugUrl = (slug: string) => `https://${slug}.${SITE_DOMAIN}`;

const RESERVED_SLUGS = new Set([
  'api',
  'app',
  'media',
  'cdn',
  'static',
  'assets',
  'storybook',
  'bar',
  'bar-api',
  'kestra',
  'status',
  'www',
  'ws',
]);

export const validateSlug = (slug: string): string | null => {
  if (slug.length < 1 || slug.length > 63) {
    return 'Slug must be between 1 and 63 characters.';
  }
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    return 'Use lowercase letters, digits and hyphens; cannot start or end with a hyphen.';
  }
  if (slug.endsWith('-')) {
    return 'Slug cannot end with a hyphen.';
  }
  if (slug.startsWith('static-')) {
    return 'Slug cannot start with "static-".';
  }
  if (RESERVED_SLUGS.has(slug)) {
    return 'This slug is reserved.';
  }
  return null;
};

export const getDeployErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong.',
): string => {
  if (!axios.isAxiosError(error)) return fallback;

  const data = error.response?.data as
    | { error?: string; errors?: Record<string, string[]> }
    | undefined;

  if (data?.error) return data.error;

  if (data?.errors) {
    const messages = Object.values(data.errors).flat();
    if (messages.length) return messages.join(' ');
  }

  if (error.response?.status === 429) {
    const retryAfter = error.response.headers?.['retry-after'];
    return retryAfter
      ? `Rate limited. Try again in ${retryAfter}s.`
      : 'Rate limited. Try again later.';
  }

  return error.message || fallback;
};
