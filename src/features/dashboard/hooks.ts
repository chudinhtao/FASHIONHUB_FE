'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/features/product/hooks';
import { useCategories } from '@/features/category/hooks';

export const useDashboardOverview = () => {
  const { t } = useTranslation();
  const router = useRouter();
  
  const { data: productsResponse, isLoading: isLoadingProducts } = useProducts({ limit: 1 });
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const totalProducts = productsResponse?.meta?.totalItems ?? productsResponse?.data?.length ?? 0;
  const totalCategories = categories?.length ?? 0;

  const statCards = [
    {
      title: t('admin.dashboard.statsProducts'),
      value: totalProducts,
      bg: 'bg-white',
    },
    {
      title: t('admin.dashboard.statsCategories'),
      value: totalCategories,
      bg: 'bg-white',
    },
    {
      title: t('admin.dashboard.statsSales'),
      value: '24,850,000 ₫',
      bg: 'bg-white',
    },
    {
      title: t('admin.dashboard.statsOrders'),
      value: 12,
      bg: 'bg-white',
    },
  ];

  const activities = [
    {
      id: 1,
      text: t('admin.dashboard.actAdminLogged'),
      time: '10 mins ago',
    },
    {
      id: 2,
      text: `${t('admin.dashboard.actProductCreated')}: Áo Thun Polo Premium`,
      time: '1 hr ago',
    },
    {
      id: 3,
      text: `${t('admin.dashboard.actCategoryCreated')}: Áo Khoác Gió`,
      time: 'Yesterday',
    },
  ];

  return {
    t,
    router,
    isLoading: isLoadingProducts || isLoadingCategories,
    statCards,
    activities,
  };
};
