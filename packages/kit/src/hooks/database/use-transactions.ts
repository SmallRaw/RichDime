/**
 * 交易记录管理 Hook
 */

import { useCallback, useMemo } from 'react';
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabaseContext } from '../../providers/database-provider';
import { queryKeys } from './query-keys';
import {
  getTransactionById,
  createTransaction,
  updateTransaction,
  voidTransaction,
  deleteTransaction,
  getTransactionsGroupedByDate,
} from '@rich-dime/database';
import type {
  Transaction,
  TransactionFilter,
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from '@rich-dime/database';

interface TransactionGroup {
  date: string;
  dateTimestamp: number;
  transactions: Transaction[];
}

interface UseTransactionsResult {
  transactions: Transaction[];
  groups: TransactionGroup[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasMore: boolean;
  };
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  getTransaction: (id: string) => Promise<Transaction | null>;
  addTransaction: (data: CreateTransactionDTO) => Promise<Transaction>;
  editTransaction: (id: string, data: UpdateTransactionDTO) => Promise<Transaction>;
  voidTx: (id: string) => Promise<Transaction>;
  removeTx: (id: string) => Promise<void>;
}

const DEFAULT_PAGE_SIZE = 20;

const EMPTY_PAGINATION = {
  total: 0,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  totalPages: 0,
  hasMore: false,
};

/**
 * 交易记录管理 Hook
 *
 * filter 由调用方控制，当 filter 对象变化时 query key 自动切换，
 * 无需内部 setState + useEffect 同步。
 */
export function useTransactions(
  filter: TransactionFilter = {}
): UseTransactionsResult {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetchingNextPage: isLoadingMore,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: queryKeys.transactions.list(filter as Record<string, unknown>),
    queryFn: async ({ pageParam = 1 }) => {
      return getTransactionsGroupedByDate(filter, {
        page: pageParam,
        pageSize: DEFAULT_PAGE_SIZE,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: isInitialized,
  });

  // Derive flat transactions and merged groups from all pages
  const { transactions, groups, pagination } = useMemo(() => {
    if (!data?.pages?.length) {
      return { transactions: [] as Transaction[], groups: [] as TransactionGroup[], pagination: EMPTY_PAGINATION };
    }

    const allTransactions: Transaction[] = [];
    const mergedGroups: TransactionGroup[] = [];

    for (const page of data.pages) {
      allTransactions.push(...page.pagination.data);
      for (const newGroup of page.groups) {
        const existingIndex = mergedGroups.findIndex((g) => g.date === newGroup.date);
        if (existingIndex !== -1) {
          mergedGroups[existingIndex].transactions.push(...newGroup.transactions);
        } else {
          mergedGroups.push({ ...newGroup });
        }
      }
    }

    const lastPage = data.pages[data.pages.length - 1];
    return {
      transactions: allTransactions,
      groups: mergedGroups,
      pagination: {
        total: lastPage.pagination.total,
        page: lastPage.pagination.page,
        pageSize: lastPage.pagination.pageSize,
        totalPages: lastPage.pagination.totalPages,
        hasMore: hasNextPage ?? false,
      },
    };
  }, [data, hasNextPage]);

  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const loadMore = useCallback(async () => {
    if (!isLoadingMore && hasNextPage) {
      await fetchNextPage();
    }
  }, [isLoadingMore, hasNextPage, fetchNextPage]);

  const getTransaction = useCallback(async (id: string): Promise<Transaction | null> => {
    return getTransactionById(id);
  }, []);

  const invalidateTransactionRelated = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.statistics.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
  };

  const addMutation = useMutation({
    mutationFn: (data: CreateTransactionDTO) => createTransaction(data),
    onSuccess: invalidateTransactionRelated,
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionDTO }) => updateTransaction(id, data),
    onSuccess: invalidateTransactionRelated,
  });

  const voidMutation = useMutation({
    mutationFn: (id: string) => voidTransaction(id),
    onSuccess: invalidateTransactionRelated,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: invalidateTransactionRelated,
  });

  const addTransaction = useCallback(async (data: CreateTransactionDTO): Promise<Transaction> => {
    return addMutation.mutateAsync(data);
  }, [addMutation]);

  const editTransaction = useCallback(
    async (id: string, data: UpdateTransactionDTO): Promise<Transaction> => {
      return editMutation.mutateAsync({ id, data });
    },
    [editMutation]
  );

  const voidTx = useCallback(async (id: string): Promise<Transaction> => {
    return voidMutation.mutateAsync(id);
  }, [voidMutation]);

  const removeTx = useCallback(async (id: string): Promise<void> => {
    await deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  return {
    transactions,
    groups,
    pagination,
    isLoading,
    isLoadingMore,
    error: error ?? null,
    refresh,
    loadMore,
    getTransaction,
    addTransaction,
    editTransaction,
    voidTx,
    removeTx,
  };
}

/**
 * 单个交易 Hook
 */
export function useTransaction(id: string) {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const { data: transaction = null, isLoading, error } = useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: () => getTransactionById(id),
    enabled: isInitialized,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.transactions.detail(id) });
  }, [queryClient, id]);

  return { transaction, isLoading, error: error ?? null, refresh };
}

/**
 * 添加交易的简化 Hook
 */
export function useAddTransaction() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateTransactionDTO) => createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.statistics.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
    },
  });

  const addTransaction = useCallback(async (data: CreateTransactionDTO): Promise<Transaction> => {
    return mutation.mutateAsync(data);
  }, [mutation]);

  const reset = useCallback(() => {
    mutation.reset();
  }, [mutation]);

  return {
    addTransaction,
    isSubmitting: mutation.isPending,
    error: mutation.error ?? null,
    lastTransaction: mutation.data ?? null,
    reset,
  };
}
