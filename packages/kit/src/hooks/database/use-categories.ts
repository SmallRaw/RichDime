/**
 * 分类管理 Hook
 */

import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabaseContext } from '../../providers/database-provider';
import { queryKeys } from './query-keys';
import {
  getAllCategories,
  getCategoryById,
  getChildCategories,
  getCategoriesByType,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@rich-dime/database';
import type {
  Category,
  TransactionType,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '@rich-dime/database';

interface UseCategoriesResult {
  categories: Category[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  transferCategories: Category[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  getCategory: (id: string) => Promise<Category | null>;
  getCategoriesByTransactionType: (type: TransactionType) => Category[];
  getChildren: (parentId: string) => Promise<Category[]>;
  addCategory: (data: CreateCategoryDTO) => Promise<Category>;
  editCategory: (id: string, data: UpdateCategoryDTO) => Promise<Category>;
  removeCategory: (id: string) => Promise<void>;
  archiveCategory: (id: string) => Promise<Category>;
}

/**
 * 分类管理 Hook
 */
export function useCategories(): UseCategoriesResult {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => getAllCategories(false),
    enabled: isInitialized,
  });

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === 'expense'),
    [categories]
  );

  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === 'income'),
    [categories]
  );

  const transferCategories = useMemo(
    () => categories.filter((c) => c.type === 'transfer'),
    [categories]
  );

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
  }, [queryClient]);

  const getCategory = useCallback(async (id: string): Promise<Category | null> => {
    return getCategoryById(id);
  }, []);

  const getCategoriesByTransactionType = useCallback(
    (type: TransactionType): Category[] => {
      return categories.filter((c) => c.type === type);
    },
    [categories]
  );

  const getChildren = useCallback(async (parentId: string): Promise<Category[]> => {
    return getChildCategories(parentId);
  }, []);

  const addMutation = useMutation({
    mutationFn: (data: CreateCategoryDTO) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDTO }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => updateCategory(id, { isArchived: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });

  const addCategory = useCallback(async (data: CreateCategoryDTO): Promise<Category> => {
    return addMutation.mutateAsync(data);
  }, [addMutation]);

  const editCategory = useCallback(async (id: string, data: UpdateCategoryDTO): Promise<Category> => {
    return editMutation.mutateAsync({ id, data });
  }, [editMutation]);

  const removeCategory = useCallback(async (id: string): Promise<void> => {
    await deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const archiveCategory = useCallback(async (id: string): Promise<Category> => {
    return archiveMutation.mutateAsync(id);
  }, [archiveMutation]);

  return {
    categories,
    expenseCategories,
    incomeCategories,
    transferCategories,
    isLoading,
    error: error ?? null,
    refresh,
    getCategory,
    getCategoriesByTransactionType,
    getChildren,
    addCategory,
    editCategory,
    removeCategory,
    archiveCategory,
  };
}

/**
 * 按类型获取分类 Hook
 */
export function useCategoriesByType(type: TransactionType) {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: queryKeys.categories.byType(type),
    queryFn: () => getCategoriesByType(type, false),
    enabled: isInitialized,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.categories.byType(type) });
  }, [queryClient, type]);

  return { categories, isLoading, error: error ?? null, refresh };
}
