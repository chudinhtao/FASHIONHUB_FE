import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd';
import React from 'react';

export interface ModalProps extends AntdModalProps {}

/**
 * Component Modal dùng chung của dự án, bọc từ Ant Design Modal.
 */
export const Modal: React.FC<ModalProps> = ({ children, ...props }) => {
  return <AntdModal {...props}>{children}</AntdModal>;
};

Modal.displayName = 'Modal';
export type { ModalProps as AntdModalProps };
