import React from 'react';
import { Button, Empty, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'Không tìm thấy dữ liệu',
  description = 'Hiện tại không có mục nào để hiển thị hoặc bộ lọc của bạn không khớp.',
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border border-[#E5E7EB] text-center w-full">
      <Empty
        image={<InboxOutlined style={{ fontSize: '48px', color: '#C5A880' }} />}
        imageStyle={{ height: 60 }}
        description={
          <div className="mt-4">
            <Title level={5} style={{ margin: 0, fontFamily: 'var(--font-outfit)' }}>
              {title}
            </Title>
            <Paragraph type="secondary" className="mt-2 max-w-sm mx-auto text-xs leading-relaxed">
              {description}
            </Paragraph>
          </div>
        }
      >
        {actionText && onAction && (
          <Button type="primary" onClick={onAction} className="elegant-button mt-2 h-9">
            {actionText}
          </Button>
        )}
      </Empty>
    </div>
  );
}
