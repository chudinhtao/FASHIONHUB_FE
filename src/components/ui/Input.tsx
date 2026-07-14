import { Input as AntdInput, InputProps as AntdInputProps, InputRef } from 'antd';
import React from 'react';

export interface InputProps extends AntdInputProps {}

/**
 * Component Input dùng chung của dự án, bọc lại từ Ant Design Input.
 */
export const Input = React.forwardRef<InputRef, InputProps>((props, ref) => {
  return <AntdInput {...props} ref={ref} />;
});

Input.displayName = 'Input';

// Re-export các subcomponents phổ biến của Antd Input
export const TextArea = AntdInput.TextArea;
export const Password = AntdInput.Password;
export const Search = AntdInput.Search;
