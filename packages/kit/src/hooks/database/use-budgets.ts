/**
 * 预算管理 Hook
 */

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabaseContext } from '../../providers/database-provider';
import { queryKeys } from './query-keys';
import {
  getAllBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetExecution,
  getAllBudgetExecutions,
  getOverBudgetAlerts,
} from '@rich-dime/database';
import type {
  Budget,
  BudgetExecution,
  CreateBudgetDTO,
  UpdateBudgetDTO,
} from '@rich-dime/database';

interface UseBudgetsResult {
  budgets: Budget[];
  executions: BudgetExecution[];
  alerts: BudgetExecution[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  getBudget: (id: string) => Promise<Budget | null>;
  getExecution: (id: string) => Promise<BudgetExecution | null>;
  addBudget: (data: CreateBudgetDTO) => Promise<Budget>;
  editBudget: (id: string, data: UpdateBudgetDTO) => Promise<Budget>;
  removeBudget: (id: string) => Promise<void>;
  activateBudget: (id: string) => Promise<Budget>;
  deactivateBudget: (id: string) => Promise<Budget>;
}

/**
 * 预算管理 Hook
 */
export function useBudgets(): UseBudgetsResult {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.budgets.all,
    queryFn: async () => {
      const [budgetList, executionList, alertList] = await Promise.all([
        getAllBudgets(false),
        getAllBudgetExecutions(),
        getOverBudgetAlerts(),
      ]);
      return { budgets: budgetList, executions: executionList, alerts: alertList };
    },
    enabled: isInitialized,
  });

  const budgets = data?.budgets ?? [];
  const executions = data?.executions ?? [];
  const alerts = data?.alerts ?? [];

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
  }, [queryClient]);

  const getBudgetFn = useCallback(async (id: string): Promise<Budget | null> => {
    return getBudgetById(id);
  }, []);

  const getExecution = useCallback(async (id: string): Promise<BudgetExecution | null> => {
    return getBudgetExecution(id);
  }, []);

  const invalidateBudgets = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
  };

  const addMutation = useMutation({
    mutationFn: (data: CreateBudgetDTO) => createBudget(data),
    onSuccess: invalidateBudgets,
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetDTO }) => updateBudget(id, data),
    onSuccess: invalidateBudgets,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: invalidateBudgets,
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => updateBudget(id, { isActive: true }),
    onSuccess: invalidateBudgets,
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => updateBudget(id, { isActive: false }),
    onSuccess: invalidateBudgets,
  });

  const addBudget = useCallback(async (data: CreateBudgetDTO): Promise<Budget> => {
    return addMutation.mutateAsync(data);
  }, [addMutation]);

  const editBudget = useCallback(async (id: string, data: UpdateBudgetDTO): Promise<Budget> => {
    return editMutation.mutateAsync({ id, data });
  }, [editMutation]);

  const removeBudget = useCallback(async (id: string): Promise<void> => {
    await deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const activateBudget = useCallback(async (id: string): Promise<Budget> => {
    return activateMutation.mutateAsync(id);
  }, [activateMutation]);

  const deactivateBudget = useCallback(async (id: string): Promise<Budget> => {
    return deactivateMutation.mutateAsync(id);
  }, [deactivateMutation]);

  return {
    budgets,
    executions,
    alerts,
    isLoading,
    error: error ?? null,
    refresh,
    getBudget: getBudgetFn,
    getExecution,
    addBudget,
    editBudget,
    removeBudget,
    activateBudget,
    deactivateBudget,
  };
}

/**
 * 单个预算执行情况 Hook
 */
export function useBudgetExecution(id: string) {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const { data: execution = null, isLoading, error } = useQuery({
    queryKey: queryKeys.budgets.execution(id),
    queryFn: () => getBudgetExecution(id),
    enabled: isInitialized,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.budgets.execution(id) });
  }, [queryClient, id]);

  return { execution, isLoading, error: error ?? null, refresh };
}
