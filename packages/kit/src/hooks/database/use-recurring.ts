/**
 * 循环记账管理 Hook
 */

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabaseContext } from '../../providers/database-provider';
import { queryKeys } from './query-keys';
import {
  getAllRecurringTransactions,
  getRecurringTransactionById,
  createRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  activateRecurringTransaction,
  deactivateRecurringTransaction,
  executeAllDueRecurringTransactions,
  manualExecuteRecurring,
  skipRecurringExecution,
  getUpcomingRecurringTransactions,
} from '@rich-dime/database';
import type {
  RecurringTransaction,
  CreateRecurringTransactionDTO,
  UpdateRecurringTransactionDTO,
} from '@rich-dime/database';

interface UseRecurringTransactionsResult {
  recurringTransactions: RecurringTransaction[];
  upcomingTransactions: RecurringTransaction[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  getRecurring: (id: string) => Promise<RecurringTransaction | null>;
  addRecurring: (data: CreateRecurringTransactionDTO) => Promise<RecurringTransaction>;
  editRecurring: (id: string, data: UpdateRecurringTransactionDTO) => Promise<RecurringTransaction>;
  removeRecurring: (id: string) => Promise<void>;
  activate: (id: string) => Promise<RecurringTransaction>;
  deactivate: (id: string) => Promise<RecurringTransaction>;
  executeNow: (id: string) => Promise<void>;
  skipNext: (id: string) => Promise<void>;
  executeDue: () => Promise<void>;
}

/**
 * 循环记账管理 Hook
 */
export function useRecurringTransactions(): UseRecurringTransactionsResult {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.recurring.all,
    queryFn: async () => {
      const [all, upcoming] = await Promise.all([
        getAllRecurringTransactions(false),
        getUpcomingRecurringTransactions(7),
      ]);
      return { recurringTransactions: all, upcomingTransactions: upcoming };
    },
    enabled: isInitialized,
  });

  const recurringTransactions = data?.recurringTransactions ?? [];
  const upcomingTransactions = data?.upcomingTransactions ?? [];

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.recurring.all });
  }, [queryClient]);

  const getRecurring = useCallback(async (id: string): Promise<RecurringTransaction | null> => {
    return getRecurringTransactionById(id);
  }, []);

  const invalidateRecurring = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.recurring.all });
  };

  const invalidateRecurringAndTransactions = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.recurring.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.statistics.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
  };

  const addMutation = useMutation({
    mutationFn: (data: CreateRecurringTransactionDTO) => createRecurringTransaction(data),
    onSuccess: invalidateRecurring,
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecurringTransactionDTO }) =>
      updateRecurringTransaction(id, data),
    onSuccess: invalidateRecurring,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRecurringTransaction(id),
    onSuccess: invalidateRecurring,
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => activateRecurringTransaction(id),
    onSuccess: invalidateRecurring,
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => deactivateRecurringTransaction(id),
    onSuccess: invalidateRecurring,
  });

  const executeNowMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await manualExecuteRecurring(id);
      if (!result.success) {
        throw new Error(result.error ?? 'Failed to execute recurring transaction');
      }
    },
    onSuccess: invalidateRecurringAndTransactions,
  });

  const skipMutation = useMutation({
    mutationFn: (id: string) => skipRecurringExecution(id),
    onSuccess: invalidateRecurring,
  });

  const executeDueMutation = useMutation({
    mutationFn: () => executeAllDueRecurringTransactions(),
    onSuccess: invalidateRecurringAndTransactions,
  });

  const addRecurring = useCallback(
    async (data: CreateRecurringTransactionDTO): Promise<RecurringTransaction> => {
      return addMutation.mutateAsync(data);
    },
    [addMutation]
  );

  const editRecurring = useCallback(
    async (id: string, data: UpdateRecurringTransactionDTO): Promise<RecurringTransaction> => {
      return editMutation.mutateAsync({ id, data });
    },
    [editMutation]
  );

  const removeRecurring = useCallback(async (id: string): Promise<void> => {
    await deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const activate = useCallback(async (id: string): Promise<RecurringTransaction> => {
    return activateMutation.mutateAsync(id);
  }, [activateMutation]);

  const deactivate = useCallback(async (id: string): Promise<RecurringTransaction> => {
    return deactivateMutation.mutateAsync(id);
  }, [deactivateMutation]);

  const executeNow = useCallback(async (id: string): Promise<void> => {
    await executeNowMutation.mutateAsync(id);
  }, [executeNowMutation]);

  const skipNext = useCallback(async (id: string): Promise<void> => {
    await skipMutation.mutateAsync(id);
  }, [skipMutation]);

  const executeDue = useCallback(async (): Promise<void> => {
    await executeDueMutation.mutateAsync();
  }, [executeDueMutation]);

  return {
    recurringTransactions,
    upcomingTransactions,
    isLoading,
    error: error ?? null,
    refresh,
    getRecurring,
    addRecurring,
    editRecurring,
    removeRecurring,
    activate,
    deactivate,
    executeNow,
    skipNext,
    executeDue,
  };
}

/**
 * 单个循环记账 Hook
 */
export function useRecurringTransaction(id: string) {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const { data: recurring = null, isLoading, error } = useQuery({
    queryKey: queryKeys.recurring.detail(id),
    queryFn: () => getRecurringTransactionById(id),
    enabled: isInitialized,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.recurring.detail(id) });
  }, [queryClient, id]);

  return { recurring, isLoading, error: error ?? null, refresh };
}
