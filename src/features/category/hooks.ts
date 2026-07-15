import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';
import { categoryApi } from './api';
import { Category } from '@/types';
import { toast } from 'sonner';

// React Query Wrappers
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await categoryApi.getCategories();
      return res.data;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; parentId?: string }) => categoryApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; parentId?: string | null } }) =>
      categoryApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Custom Feature Hook
export const useCategoryAdmin = () => {
  const { t } = useTranslation();

  // Queries & Mutations
  const { data: categories, isLoading, isError, refetch } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState('');
  const [formName, setFormName] = useState('');
  const [formParentId, setFormParentId] = useState('');

  // Open modal for Create
  const handleOpenCreate = () => {
    setModalMode('create');
    setFormName('');
    setFormParentId('');
    setSelectedId('');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (cat: Category) => {
    setModalMode('edit');
    setSelectedId(cat.id);
    setFormName(cat.name);
    setFormParentId(cat.parentId || '');
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Flattened list helper (to select a parent category)
  const getFlatCategoriesList = (nodes: Category[], depth = 0): { id: string; name: string; depth: number }[] => {
    let result: { id: string; name: string; depth: number }[] = [];
    nodes.forEach((node) => {
      // Exclude currently edited category to prevent circular reference
      if (node.id !== selectedId) {
        result.push({ id: node.id, name: node.name, depth });
        if (node.children && node.children.length > 0) {
          result = result.concat(getFlatCategoriesList(node.children, depth + 1));
        }
      }
    });
    return result;
  };

  const flatCategories = categories ? getFlatCategoriesList(categories) : [];

  // Form Submit Action
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error(t('admin.categories.nameRequired', 'Tên danh mục không được để trống'));
      return;
    }

    const payload = {
      name: formName.trim(),
      parentId: formParentId || undefined,
    };

    if (modalMode === 'create') {
      createCategoryMutation.mutate(payload, {
        onSuccess: () => {
          toast.success(t('admin.categories.createSuccess', 'Tạo danh mục thành công'));
          setIsModalOpen(false);
        },
        onError: (err: any) => {
          toast.error(err.message || t('admin.categories.createError', 'Lỗi khi tạo danh mục'));
        },
      });
    } else {
      updateCategoryMutation.mutate(
        {
          id: selectedId,
          data: {
            name: formName.trim(),
            parentId: formParentId || null,
          },
        },
        {
          onSuccess: () => {
            toast.success(t('admin.categories.updateSuccess', 'Cập nhật danh mục thành công'));
            setIsModalOpen(false);
          },
          onError: (err: any) => {
            toast.error(err.message || t('admin.categories.updateError', 'Lỗi khi cập nhật danh mục'));
          },
        },
      );
    }
  };

  // Delete Category Action
  const handleDelete = (cat: Category) => {
    Modal.confirm({
      title: t('admin.common.confirmDeleteTitle', 'Xác nhận xóa'),
      content: t('admin.categories.deleteConfirm', {
        name: cat.name,
        defaultValue: `Bạn chắc chắn muốn xóa danh mục "${cat.name}"? Thao tác này sẽ xóa vĩnh viễn danh mục này khỏi hệ thống.`,
      }),
      okText: t('admin.common.deleteBtn', 'Xóa'),
      okType: 'danger',
      cancelText: t('admin.common.cancelBtn', 'Hủy'),
      onOk() {
        return new Promise((resolve) => {
          deleteCategoryMutation.mutate(cat.id, {
            onSuccess: () => {
              toast.success(t('admin.categories.deleteSuccess', 'Xóa danh mục thành công'));
              resolve(null);
            },
            onError: (err: any) => {
              toast.error(err.message || t('admin.categories.deleteError', 'Lỗi khi xóa danh mục'));
              resolve(null);
            },
          });
        });
      },
    });
  };

  return {
    t,
    categories,
    isLoading,
    isError,
    refetch,
    isModalOpen,
    setIsModalOpen,
    modalMode,
    setModalMode,
    selectedId,
    setSelectedId,
    formName,
    setFormName,
    formParentId,
    setFormParentId,
    flatCategories,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSubmit,
    handleDelete,
  };
};
