import api from './api';

export const healthCheck = async () => {
  const res = await api.get<SystemStatus>('/api/system/health');
  return res.data;
};

export const checkUpdates = async () => {
  const res = await api.get<CheckUpdatesResponse>('/api/system/updates');
  return res.data;
};

export const applyUpdates = async (body?: ApplyUpdateRequest) => {
  const res = await api.post('/api/system/upgrade', body ?? {});
  return res.data;
};

export const listServices = async () => {
  const res = await api.get<ServiceListResponse>('/api/system/services');
  return res.data;
};

export const restartService = async (body: RestartServiceRequest) => {
  const res = await api.post('/api/system/services/restart', body);
  return res.data;
};

export const rebootSystem = async () => {
  const res = await api.post('/api/system/reboot');
  return res.data;
};

export const shutdownSystem = async () => {
  const res = await api.post('/api/system/shutdown');
  return res.data;
};

export type ServiceListResponse = {
  services: string[];
};

export type RestartServiceRequest = {
  name: string;
};

export type CheckUpdatesResponse = {
  available: string | null;
};

export type ApplyUpdateRequest = {
  packages?: string[];
};

export type CompTemp = {
  label: string;
  temperature: number;
};

export type SystemStatus = {
  status: string;
  current_time: string;
  cpu_usage: number;
  comp_temps: CompTemp[];
  gpu_vendor: string;
  gpu_usage: number;
  gpu_temp: number;
  mem_total: number;
  mem_used: number;
  swap_total: number;
  swap_used: number;
  disk_total: number;
  disk_used: number;
  net_in: number;
  net_out: number;
  battery_percent: number;
  battery_status: string;
  battery_hours_left: number;
  uptime: number;
  name: string;
  kernel_version: string;
  os_version: string;
  hostname: string;
};
