import React from 'react';
import { Breadcrumb, Typography } from 'antd';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  extra?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, extra }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6 border-b border-[#E5E7EB] bg-white px-6 mb-6 w-full">
      <div className="space-y-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb className="mb-2 text-[11px] tracking-wide uppercase">
            {breadcrumbs.map((item, index) => (
              <Breadcrumb.Item key={index}>
                {item.href ? <Link href={item.href}>{item.title}</Link> : item.title}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        )}
        <Title level={3} style={{ margin: 0, fontFamily: 'var(--font-outfit)', fontWeight: 600, letterSpacing: '0.02em' }}>
          {title}
        </Title>
        {description && (
          <Paragraph type="secondary" style={{ margin: 0 }} className="text-xs">
            {description}
          </Paragraph>
        )}
      </div>

      {extra && <div className="flex items-center gap-3 self-end md:self-center">{extra}</div>}
    </div>
  );
}
