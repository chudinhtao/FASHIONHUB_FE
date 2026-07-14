import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';
import React from 'react';

export interface ButtonProps extends AntdButtonProps {}

/**
 * Component Button dùng chung của dự án, bọc lại từ Ant Design Button.
 * Hỗ trợ chuyển đổi kiểu Ref sang HTMLButtonElement hoặc HTMLAnchorElement (nếu dùng href).
 */
export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>((props, ref) => {
  return <AntdButton {...props} ref={ref as any} />;
});

Button.displayName = 'Button';
export type { ButtonProps as AntdButtonProps };
