/**
 * 账户管理 Hook
 */

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabaseContext } from '../../providers/database-provider';
import { queryKeys } from './query-keys';
import {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  getTotalBalance,
  recalculateAccountBalance,
} from '@rich-dime/database';
import type {
  Account,
  CreateAccountDTO,
  UpdateAccountDTO,
} from '@rich-dime/database';

interface UseAccountsResult {
  accounts: Account[];
  totalBalance: number;
  defaultAccount: Account | undefined;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  getAccount: (id: string) => Promise<Account | null>;
  addAccount: (data: CreateAccountDTO) => Promise<Account>;
  editAccount: (id: string, data: UpdateAccountDTO) => Promise<Account>;
  removeAccount: (id: string) => Promise<void>;
  archiveAccount: (id: string) => Promise<Account>;
  recalculateBalance: (id: string) => Promise<number>;
}

/**
 * 账户管理 Hook
 */
export function useAccounts(): UseAccountsResult {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: async () => {
      const [accountList, balance] = await Promise.all([
        getAllAccounts(false),
        getTotalBalance(),
      ]);
      return { accounts: accountList, totalBalance: balance };
    },
    enabled: isInitialized,
  });

  const accounts = data?.accounts ?? [];
  const totalBalance = data?.totalBalance ?? 0;

  // 默认账户：第一个未归档的账户
  const defaultAccount = accounts.find((acc) => !acc.isArchived);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
  }, [queryClient]);

  const getAccount = useCallback(async (id: string): Promise<Account | null> => {
    return getAccountById(id);
  }, []);

  const invalidateAccounts = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
  };

  const addMutation = useMutation({
    mutationFn: (data: CreateAccountDTO) => createAccount(data),
    onSuccess: invalidateAccounts,
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountDTO }) => updateAccount(id, data),
    onSuccess: invalidateAccounts,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAccount(id),
    onSuccess: invalidateAccounts,
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => updateAccount(id, { isArchived: true }),
    onSuccess: invalidateAccounts,
  });

  const recalculateMutation = useMutation({
    mutationFn: (id: string) => recalculateAccountBalance(id),
    onSuccess: invalidateAccounts,
  });

  const addAccount = useCallback(async (data: CreateAccountDTO): Promise<Account> => {
    return addMutation.mutateAsync(data);
  }, [addMutation]);

  const editAccount = useCallback(async (id: string, data: UpdateAccountDTO): Promise<Account> => {
    return editMutation.mutateAsync({ id, data });
  }, [editMutation]);

  const removeAccount = useCallback(async (id: string): Promise<void> => {
    await deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const archiveAccount = useCallback(async (id: string): Promise<Account> => {
    return archiveMutation.mutateAsync(id);
  }, [archiveMutation]);

  const recalculateBalance = useCallback(async (id: string): Promise<number> => {
    return recalculateMutation.mutateAsync(id);
  }, [recalculateMutation]);

  return {
    accounts,
    totalBalance,
    defaultAccount,
    isLoading,
    error: error ?? null,
    refresh,
    getAccount,
    addAccount,
    editAccount,
    removeAccount,
    archiveAccount,
    recalculateBalance,
  };
}

/**
 * 单个账户 Hook
 */
export function useAccount(id: string) {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const { data: account = null, isLoading, error } = useQuery({
    queryKey: queryKeys.accounts.detail(id),
    queryFn: () => getAccountById(id),
    enabled: isInitialized,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.accounts.detail(id) });
  }, [queryClient, id]);

  return { account, isLoading, error: error ?? null, refresh };
}
