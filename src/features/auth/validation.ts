import { z } from 'zod';

// Schema & Types Đăng nhập (LoginForm)
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email không được để trống.' })
    .email({ message: 'Địa chỉ email không hợp lệ.' }),
  password: z
    .string()
    .min(1, { message: 'Mật khẩu không được để trống.' }),
});

export type LoginFields = z.infer<typeof loginSchema>;

// Schema & Types Đăng ký (RegisterForm)
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email không được để trống.' })
      .email({ message: 'Địa chỉ email không hợp lệ.' })
      .max(100, { message: 'Email tối đa 100 ký tự.' }),
    password: z
      .string()
      .min(6, { message: 'Mật khẩu phải từ 6 đến 50 ký tự.' })
      .max(50, { message: 'Mật khẩu phải từ 6 đến 50 ký tự.' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Xác nhận mật khẩu không được để trống.' }),
    name: z
      .string()
      .min(2, { message: 'Họ tên phải từ 2 đến 50 ký tự.' })
      .max(50, { message: 'Họ tên phải từ 2 đến 50 ký tự.' }),
    phone: z
      .string()
      .optional()
      .or(z.literal('')),
    address: z
      .string()
      .max(200, { message: 'Địa chỉ tối đa 200 ký tự.' })
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmPassword'],
  });

export type RegisterFields = z.infer<typeof registerSchema>;

// Schema & Types Quên mật khẩu (ForgotPasswordForm)
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email không được để trống.' })
    .email({ message: 'Địa chỉ email không hợp lệ.' }),
});

export type ForgotPasswordFields = z.infer<typeof forgotPasswordSchema>;

// Schema & Types Đặt lại mật khẩu (ResetPasswordForm)
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Mật khẩu mới phải từ 6 đến 50 ký tự.' })
      .max(50, { message: 'Mật khẩu mới phải từ 6 đến 50 ký tự.' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Xác nhận mật khẩu không được để trống.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmPassword'],
  });

export type ResetPasswordFields = z.infer<typeof resetPasswordSchema>;
