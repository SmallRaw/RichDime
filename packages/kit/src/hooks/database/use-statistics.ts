/**
 * 统计数据 Hook
 */

import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDatabaseContext } from '../../providers/database-provider';
import { queryKeys } from './query-keys';
import {
  getTransactionSummary,
  getTodaySummary,
  getWeekSummary,
  getMonthSummary,
  getYearSummary,
  getCategoryStatistics,
  getAccountBalanceChanges,
  getTrendData,
  getExpenseRanking,
  getIncomeRanking,
  startOfMonth,
  endOfMonth,
  now,
} from '@rich-dime/database';
import type {
  TransactionSummary,
  CategoryStatistics,
  AccountBalanceChange,
  TrendData,
  DateRange,
} from '@rich-dime/database';

// ============ 摘要统计 Hooks ============

interface UseSummaryResult {
  summary: TransactionSummary | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * 今日摘要 Hook
 */
export function useTodaySummary(): UseSummaryResult {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const { data: summary = null, isLoading, error } = useQuery({
    queryKey: queryKeys.statistics.summary('today'),
    queryFn: () => getTodaySummary(),
    enabled: isInitialized,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.statistics.summary('today') });
  }, [queryClient]);

  return { summary, isLoading, error: error ?? null, refresh };
}

/**
 * 本周摘要 Hook
 */
export function useWeekSummary(): UseSummaryResult {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const { data: summary = null, isLoading, error } = useQuery({
    queryKey: queryKeys.statistics.summary('week'),
    queryFn: () => getWeekSummary(),
    enabled: isInitialized,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.statistics.summary('week') });
  }, [queryClient]);

  return { summary, isLoading, error: error ?? null, refresh };
}

/**
 * 本月摘要 Hook
 */
export function useMonthSummary(): UseSummaryResult {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const { data: summary = null, isLoading, error } = useQuery({
    queryKey: queryKeys.statistics.summary('month'),
    queryFn: () => getMonthSummary(),
    enabled: isInitialized,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.statistics.summary('month') });
  }, [queryClient]);

  return { summary, isLoading, error: error ?? null, refresh };
}

/**
 * 本年摘要 Hook
 */
export function useYearSummary(): UseSummaryResult {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const { data: summary = null, isLoading, error } = useQuery({
    queryKey: queryKeys.statistics.summary('year'),
    queryFn: () => getYearSummary(),
    enabled: isInitialized,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.statistics.summary('year') });
  }, [queryClient]);

  return { summary, isLoading, error: error ?? null, refresh };
}

/**
 * 自定义时间范围摘要 Hook
 */
export function useSummary(dateRange?: DateRange): UseSummaryResult {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const summaryKey = queryKeys.statistics.summary('custom', dateRange);

  const { data: summary = null, isLoading, error } = useQuery({
    queryKey: summaryKey,
    queryFn: () => getTransactionSummary({ dateRange }),
    enabled: isInitialized,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: summaryKey });
  }, [queryClient, summaryKey]);

  return { summary, isLoading, error: error ?? null, refresh };
}

// ============ 分类统计 Hooks ============

interface UseCategoryStatisticsResult {
  statistics: CategoryStatistics[];
  totalAmount: number;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * 分类统计 Hook
 */
export function useCategoryStatistics(
  type: 'expense' | 'income',
  dateRange?: DateRange
): UseCategoryStatisticsResult {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const statsKey = queryKeys.statistics.categoryStats(type, dateRange);

  const { data: statistics = [], isLoading, error } = useQuery({
    queryKey: statsKey,
    queryFn: () => getCategoryStatistics(type, dateRange),
    enabled: isInitialized,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: statsKey });
  }, [queryClient, statsKey]);

  const totalAmount = statistics.reduce((sum, s) => sum + s.totalAmount, 0);

  return { statistics, totalAmount, isLoading, error: error ?? null, refresh };
}

/**
 * 本月分类统计 Hook
 */
export function useMonthCategoryStatistics(type: 'expense' | 'income'): UseCategoryStatisticsResult {
  const currentTime = now();
  const dateRange: DateRange = {
    start: startOfMonth(currentTime),
    end: endOfMonth(currentTime),
  };
  return useCategoryStatistics(type, dateRange);
}

// ============ 趋势数据 Hooks ============

interface UseTrendDataResult {
  trendData: TrendData | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * 趋势数据 Hook
 */
export function useTrendData(months: number = 6): UseTrendDataResult {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const { data: trendData = null, isLoading, error } = useQuery({
    queryKey: queryKeys.statistics.trend(months),
    queryFn: () => getTrendData(months),
    enabled: isInitialized,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.statistics.trend(months) });
  }, [queryClient, months]);

  return { trendData, isLoading, error: error ?? null, refresh };
}

// ============ 账户余额变动 Hooks ============

interface UseAccountBalanceChangesResult {
  changes: AccountBalanceChange[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * 账户余额变动 Hook
 */
export function useAccountBalanceChanges(dateRange: DateRange): UseAccountBalanceChangesResult {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const balanceKey = queryKeys.statistics.balanceChanges(dateRange);

  const { data: changes = [], isLoading, error } = useQuery({
    queryKey: balanceKey,
    queryFn: () => getAccountBalanceChanges(dateRange),
    enabled: isInitialized,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: balanceKey });
  }, [queryClient, balanceKey]);

  return { changes, isLoading, error: error ?? null, refresh };
}

/**
 * 本月账户余额变动 Hook
 */
export function useMonthAccountBalanceChanges(): UseAccountBalanceChangesResult {
  const currentTime = now();
  const dateRange: DateRange = {
    start: startOfMonth(currentTime),
    end: endOfMonth(currentTime),
  };
  return useAccountBalanceChanges(dateRange);
}

// ============ 排行榜 Hooks ============

interface UseRankingResult {
  ranking: CategoryStatistics[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * 支出排行 Hook
 */
export function useExpenseRanking(topN: number = 5, dateRange?: DateRange): UseRankingResult {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const rankKey = queryKeys.statistics.expenseRanking(topN, dateRange);

  const { data: ranking = [], isLoading, error } = useQuery({
    queryKey: rankKey,
    queryFn: () => getExpenseRanking(topN, dateRange),
    enabled: isInitialized,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: rankKey });
  }, [queryClient, rankKey]);

  return { ranking, isLoading, error: error ?? null, refresh };
}

/**
 * 收入排行 Hook
 */
export function useIncomeRanking(topN: number = 5, dateRange?: DateRange): UseRankingResult {
  const { isInitialized } = useDatabaseContext();
  const queryClient = useQueryClient();

  const rankKey = queryKeys.statistics.incomeRanking(topN, dateRange);

  const { data: ranking = [], isLoading, error } = useQuery({
    queryKey: rankKey,
    queryFn: () => getIncomeRanking(topN, dateRange),
    enabled: isInitialized,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: rankKey });
  }, [queryClient, rankKey]);

  return { ranking, isLoading, error: error ?? null, refresh };
}
