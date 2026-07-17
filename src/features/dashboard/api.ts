import { api } from '@/services/api';
import type { DashboardStatsResponse, TopProductItem, RecentActivityItem } from './types';

export const dashboardApi = {
  getStats: async (
    range: string,
    startDate?: string,
    endDate?: string
  ): Promise<DashboardStatsResponse> => {
    const response = await api.get('/admin/dashboard/stats', {
      params: { range, startDate, endDate },
    });
    return (response as any).data;
  },

  getTopProducts: async (): Promise<TopProductItem[]> => {
    const response = await api.get('/admin/dashboard/top-products');
    return (response as any).data;
  },

  getRecentActivities: async (): Promise<RecentActivityItem[]> => {
    const response = await api.get('/admin/dashboard/recent-activities');
    return (response as any).data;
  },
};
