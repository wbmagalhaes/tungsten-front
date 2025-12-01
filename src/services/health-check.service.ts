import api from './api';

export const healthCheck = async () => {
  const res = await api.get<HealthCheckResponse>('/api/health-check/');
  return res.data;
};

type HealthCheckResponse = Record<string, unknown>;
