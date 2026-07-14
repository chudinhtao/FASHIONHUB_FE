import { Table as AntdTable, TableProps as AntdTableProps } from 'antd';
import React from 'react';

export interface TableProps<RecordType = any> extends AntdTableProps<RecordType> {}

/**
 * Component Table dùng chung của dự án, bọc lại từ Ant Design Table.
 * Giữ nguyên generic RecordType để gõ type an toàn cho các dòng trong bảng.
 */
export function Table<RecordType extends object = any>(props: TableProps<RecordType>) {
  return <AntdTable {...props} />;
}
export type { TableProps as AntdTableProps };
