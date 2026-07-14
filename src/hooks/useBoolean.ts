import { useState, useCallback } from 'react';

/**
 * Hook quản lý trạng thái boolean tiện lợi (mở/đóng modal, bật/tắt loading...).
 */
export function useBoolean(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((v) => !v), []);

  return { value, setValue, setTrue, setFalse, toggle };
}
