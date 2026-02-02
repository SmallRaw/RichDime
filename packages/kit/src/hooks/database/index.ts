// Database initialization
export { useDatabase } from './use-database';

// Query keys
export { queryKeys } from './query-keys';

// Account hooks
export { useAccounts, useAccount } from './use-accounts';

// Category hooks
export { useCategories, useCategoriesByType } from './use-categories';

// Transaction hooks
export {
  useTransactions,
  useTransaction,
  useAddTransaction,
} from './use-transactions';

// Recurring transaction hooks
export {
  useRecurringTransactions,
  useRecurringTransaction,
} from './use-recurring';

// Budget hooks
export { useBudgets, useBudgetExecution } from './use-budgets';

// Note search hooks
export { useNoteSearch } from './use-note-search';
export type { NoteSuggestion } from './use-note-search';

// Statistics hooks
export {
  useTodaySummary,
  useWeekSummary,
  useMonthSummary,
  useYearSummary,
  useSummary,
  useCategoryStatistics,
  useMonthCategoryStatistics,
  useTrendData,
  useAccountBalanceChanges,
  useMonthAccountBalanceChanges,
  useExpenseRanking,
  useIncomeRanking,
} from './use-statistics';
