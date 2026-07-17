export interface DashboardStats {
  totalSales: string;
  totalOrders: number;
  totalProducts: number;
  totalCategories: number;
}

export interface DashboardChartItem {
  date: string;
  sales: number;
  orders: number;
}

export interface DashboardStatsResponse {
  stats: DashboardStats;
  chartData: DashboardChartItem[];
}

export interface TopProductItem {
  id: string;
  name: string;
  soldQuantity: number;
  revenue: string;
  image: string;
}

export interface RecentActivityItem {
  id: string;
  type: 'ORDER' | 'REVIEW' | 'PRODUCT';
  text: string;
  createdAt: string;
}
