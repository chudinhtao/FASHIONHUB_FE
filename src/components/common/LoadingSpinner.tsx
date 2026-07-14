import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingSpinnerProps {
  tip?: string;
  height?: string | number;
}

export function LoadingSpinner({ tip = 'Đang tải dữ liệu...', height = '300px' }: LoadingSpinnerProps) {
  const antIcon = <LoadingOutlined style={{ fontSize: 32, color: '#C5A880' }} spin />;

  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <Spin indicator={antIcon} tip={tip}>
        <div className="py-12 px-24" />
      </Spin>
    </div>
  );
}
