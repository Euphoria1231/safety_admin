import api from './api';
import type { ApiResponse } from '@/types';

// 仪表盘统计数据接口
export interface DashboardStats {
  total_users: number;
  total_notes: number;
  users_with_brainwave: number;
  brainwave_usage_rate: number;
}

// 仪表盘数据接口
export interface DashboardData {
  statistics: DashboardStats;
  recent_users: Array<{
    id: number;
    username: string;
    email?: string;
    created_at: string;
  }>;
  recent_notes: Array<{
    id: number;
    title: string;
    content: string;
    user_id: number;
    created_at: string;
  }>;
}

// 获取仪表盘数据
export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await api.get<ApiResponse<DashboardData>>('/dashboard');
  return response.data.data!;
}; 