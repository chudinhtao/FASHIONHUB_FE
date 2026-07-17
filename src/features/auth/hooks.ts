import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth';
import { authApi } from './api';
import {
  loginSchema,
  LoginFields,
  registerSchema,
  RegisterFields,
  forgotPasswordSchema,
  ForgotPasswordFields,
  resetPasswordSchema,
  ResetPasswordFields,
} from './validation';

// ==========================================
// 1. HOOKS NGHIỆP VỤ LIÊN KẾT API
// ==========================================

/**
 * Hook xử lý Đăng nhập
 */
export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [loading, setLoading] = useState(false);

  const login = async (data: LoginFields) => {
    setLoading(true);
    try {
      const response = await authApi.login(data);
      const payload: any = response.data || response;

      if (payload && payload.accessToken) {
        // Lưu access token
        localStorage.setItem('access_token', payload.accessToken);
        Cookies.set('access_token', payload.accessToken, { expires: 7, secure: true, sameSite: 'strict' });

        // Cập nhật state
        setAuth(payload.user);

        toast.success(t('auth.loginSuccess'), {
          description: currentLanguage === 'vi'
            ? `Chào mừng quay trở lại, ${payload.user.name}!`
            : `Welcome back, ${payload.user.name}!`,
        });

        // Điều hướng theo vai trò (Role-based navigation)
        if (payload.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/products');
        }
      }
    } catch (error: any) {
      console.error('Đăng nhập thất bại:', error);
      const msg = error.message || t('auth.wrongPassword');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}

/**
 * Hook xử lý Đăng ký
 */
export function useRegister() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [loading, setLoading] = useState(false);

  const register = async (data: RegisterFields) => {
    setLoading(true);
    try {
      const response = await authApi.register(data);
      const payload: any = response.data || response;

      if (payload) {
        toast.success(t('auth.registerSuccess'), {
          description: currentLanguage === 'vi'
            ? 'Chào mừng bạn đến với FashionHub. Vui lòng đăng nhập.'
            : 'Welcome to FashionHub. Please log in to continue.',
        });
        router.push('/login');
      }
    } catch (error: any) {
      console.error('Đăng ký thất bại:', error);
      const msg = error.message || t('auth.system.internalServerError');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
}

/**
 * Hook xử lý Quên mật khẩu
 */
export function useForgotPassword() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const forgotPassword = async (data: ForgotPasswordFields) => {
    setLoading(true);
    try {
      const response = await authApi.forgotPassword(data);
      const payload: any = response.data || response;

      toast.success(t('auth.forgotSuccess'), {
        description: t('auth.forgotDesc'),
      });

      if (payload && payload.resetToken) {
        setTimeout(() => {
          router.push(`/reset-password?token=${payload.resetToken}`);
        }, 1500);
      }
    } catch (error: any) {
      console.error('Yêu cầu khôi phục mật khẩu thất bại:', error);
      const msg = error.message || t('auth.system.internalServerError');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, loading };
}

/**
 * Hook xử lý Đặt lại mật khẩu
 */
export function useResetPassword() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const resetPassword = async (token: string, data: ResetPasswordFields) => {
    if (!token) {
      toast.error(t('auth.resetTokenMissing'));
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({
        token,
        password: data.password,
      });

      toast.success(t('auth.resetSuccess'), {
        description: t('auth.resetSuccessDesc'),
      });

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error: any) {
      console.error('Đặt lại mật khẩu thất bại:', error);
      const msg = error.message || t('auth.system.internalServerError');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
}

/**
 * Hook xử lý Đăng xuất
 */
export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch (e) {
      console.warn('Backend logout failed or session already cleared. Clearing client state.', e);
    } finally {
      localStorage.removeItem('access_token');
      Cookies.remove('access_token');
      clearAuth();
      toast.success(t('auth.logoutSuccess'), {
        description: t('auth.logoutGoodbye'),
      });
      router.push('/login');
      setLoading(false);
    }
  };

  return { logout, loading };
}

// ==========================================
// 2. HOOKS QUẢN LÝ BIỂU MẪU (FORM HOOKS)
// ==========================================

/**
 * Hook quản lý Form Đăng nhập
 */
export function useLoginForm() {
  const { login, loading } = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return {
    control,
    errors,
    loading,
    onSubmit: handleSubmit(login),
  };
}

/**
 * Hook quản lý Form Đăng ký
 */
export function useRegisterForm() {
  const { register, loading } = useRegister();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      address: '',
    },
  });

  return {
    control,
    errors,
    loading,
    onSubmit: handleSubmit(register),
  };
}

/**
 * Hook quản lý Form Quên mật khẩu
 */
export function useForgotPasswordForm() {
  const { forgotPassword, loading } = useForgotPassword();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  return {
    control,
    errors,
    loading,
    onSubmit: handleSubmit(forgotPassword),
  };
}

/**
 * Hook quản lý Form Đặt lại mật khẩu
 */
export function useResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams ? (searchParams.get('token') || '') : '';
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const { resetPassword, loading } = useResetPassword();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFields>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit((data) => {
    resetPassword(token, data);
  });

  return {
    t,
    i18n,
    currentLanguage,
    token,
    control,
    errors,
    loading,
    onSubmit,
  };
}

export function useProfileView() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { logout, loading: loggingOut } = useLogout();
  const [mounted, setMounted] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditAddress(user.address || '');
    }
  }, [user]);

  const handleCancel = () => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditAddress(user.address || '');
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      toast.error(currentLanguage === 'vi' ? 'Tên không được để trống.' : 'Name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      const response = await authApi.updateMe({
        name: editName,
        phone: editPhone,
        address: editAddress,
      });

      if (response && response.data) {
        setAuth(response.data);
        toast.success(currentLanguage === 'vi' ? 'Cập nhật hồ sơ thành công!' : 'Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || (currentLanguage === 'vi' ? 'Cập nhật thất bại.' : 'Update failed.'));
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(currentLanguage === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : t('auth.addressEmpty');

  return {
    t,
    i18n,
    currentLanguage,
    router,
    user,
    isAuthenticated,
    loggingOut,
    mounted,
    formattedDate,
    logout,
    isEditing,
    setIsEditing,
    editName,
    setEditName,
    editPhone,
    setEditPhone,
    editAddress,
    setEditAddress,
    saving,
    handleCancel,
    handleSave,
  };
}
