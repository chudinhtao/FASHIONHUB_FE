'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DashboardChartItem } from '../types';

interface ChartProps {
  data: DashboardChartItem[];
  isLoading: boolean;
}

export function CombineRevenueOrdersChart({ data, isLoading }: ChartProps) {
  const { t } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="h-80 w-full bg-white border border-borderGray p-6 animate-pulse flex flex-col justify-between">
        <div className="h-4 bg-gray-200 w-1/4 rounded-none"></div>
        <div className="h-3/4 bg-gray-100 w-full mt-4 rounded-none"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-80 w-full bg-white border border-borderGray p-12 text-center flex flex-col items-center justify-center">
        <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h4 className="font-outfit text-xs font-semibold uppercase tracking-wider text-primaryBlack mb-2">
          {t('admin.dashboard.noData')}
        </h4>
      </div>
    );
  }

  // Dimensions & bounds
  const width = 1000;
  const height = 300;
  const paddingLeft = 60;
  const paddingRight = 60;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find max values for scaling
  const maxSales = Math.max(...data.map((d) => d.sales), 100000);
  const maxOrders = Math.max(...data.map((d) => d.orders), 5);

  const getX = (index: number) => {
    if (data.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  const getSalesY = (sales: number) => {
    return height - paddingBottom - (sales / maxSales) * chartHeight;
  };

  const getOrdersY = (orders: number) => {
    return height - paddingBottom - (orders / maxOrders) * chartHeight;
  };

  // Build line path
  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getOrdersY(d.orders)}`)
    .join(' ');

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  // Helper for displaying date format label
  const formatDateLabel = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white border border-borderGray p-6 relative">
      <h3 className="font-outfit text-sm font-bold uppercase tracking-widest text-primaryBlack border-b border-borderGray pb-3 mb-6">
        {t('admin.dashboard.chartTitle')}
      </h3>

      <div className="relative">
        <svg className="w-full h-auto" viewBox={`0 0 ${width} ${height}`} width="100%">
          {/* Grid lines & Left labels (Sales) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + ratio * chartHeight;
            const salesVal = maxSales * (1 - ratio);
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeDasharray="4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  fill="#6B7280"
                  fontSize="9px"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {formatCurrency(salesVal).replace('₫', '').trim()}
                </text>
              </g>
            );
          })}

          {/* Right labels (Orders) */}
          {[0, 0.5, 1].map((ratio, idx) => {
            const y = paddingTop + ratio * chartHeight;
            const orderVal = Math.round(maxOrders * (1 - ratio));
            return (
              <text
                key={idx}
                x={width - paddingRight + 10}
                y={y + 4}
                fill="#6B7280"
                fontSize="9px"
                fontFamily="monospace"
                textAnchor="start"
              >
                {orderVal} {t('admin.orders.detail.status').toLowerCase()}
              </text>
            );
          })}

          {/* Bars (Sales) */}
          {data.map((d, i) => {
            const barWidth = Math.max(12, Math.min(30, chartWidth / data.length - 10));
            const x = getX(i) - barWidth / 2;
            const y = getSalesY(d.sales);
            const barHeight = height - paddingBottom - y;
            return (
              <rect
                key={`bar-${i}`}
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(2, barHeight)}
                fill={hoveredIndex === i ? '#C5A880' : '#E5E7EB'}
                rx="1"
                className="transition-all duration-300 ease-in-out cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}

          {/* Trend Line (Orders) */}
          {data.length > 1 && (
            <path
              d={linePath}
              fill="none"
              stroke="#C5A880"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Dots on line */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getOrdersY(d.orders);
            return (
              <circle
                key={`dot-${i}`}
                cx={cx}
                cy={cy}
                r={hoveredIndex === i ? 6 : 4}
                fill="#FFFFFF"
                stroke="#C5A880"
                strokeWidth="2.5"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}

          {/* X Axis Labels */}
          {data.map((d, i) => {
            // Show every label if small dataset, or skip to fit screen
            const skip = Math.ceil(data.length / 10);
            if (i % skip !== 0 && i !== data.length - 1) return null;
            return (
              <text
                key={`label-${i}`}
                x={getX(i)}
                y={height - 15}
                fill="#6B7280"
                fontSize="9px"
                fontFamily="Outfit, sans-serif"
                fontWeight="500"
                textAnchor="middle"
              >
                {formatDateLabel(d.date)}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div
            className="absolute bg-black text-white p-3 shadow-lg pointer-events-none text-[10px] space-y-1 z-10 border border-gray-800 transition-all duration-150"
            style={{
              left: `${(getX(hoveredIndex) / width) * 100}%`,
              top: `${(getSalesY(data[hoveredIndex].sales) / height) * 100 - 30}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <p className="font-outfit font-semibold border-b border-gray-800 pb-1 mb-1">
              {data[hoveredIndex].date}
            </p>
            <p className="font-mono">
              {t('admin.dashboard.colRevenue')}: {formatCurrency(data[hoveredIndex].sales)}
            </p>
            <p className="font-mono">
              {t('admin.dashboard.statsOrders')}: {data[hoveredIndex].orders}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-6 mt-6 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-gray-200 inline-block border border-borderGray"></span>
          <span className="text-xs text-textSecondary font-outfit">
            {t('admin.dashboard.chartSalesLegend')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-primaryGold inline-block"></span>
          <span className="text-xs text-textSecondary font-outfit">
            {t('admin.dashboard.chartOrdersLegend')}
          </span>
        </div>
      </div>
    </div>
  );
}
