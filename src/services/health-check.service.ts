import api from './api';

export const healthCheck = async () => {
  const res = await api.get<SystemStatus>('/api/system/health');
  return res.data;
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
