// Account Service
// deleteAccount, recalculateAccountBalance — re-exported via repositories/index.ts for backward compat

// Category Service
// updateCategory (as updateCategorySafe), deleteCategory — re-exported via repositories/index.ts
export { updateCategorySafe } from './category.service';

// Transaction Service
// createTransaction, updateTransaction, voidTransaction, deleteTransaction — re-exported via repositories/index.ts
export { createTransactionWithBalance } from './transaction.service';

// Budget Service
// getBudgetExecution, getAllBudgetExecutions, getOverBudgetAlerts — re-exported via repositories/index.ts

// Statistics Service
export {
  getTransactionSummary,
  getTodaySummary,
  getWeekSummary,
  getMonthSummary,
  getYearSummary,
  getCategoryStatistics,
  getAccountBalanceChanges,
  getPeriodStatistics,
  getTrendData,
  getExpenseRanking,
  getIncomeRanking,
  getDailyAverageExpense,
  getLargestExpense,
} from './statistics.service';

// Recurring Service
export {
  executeAllDueRecurringTransactions,
  manualExecuteRecurring,
  skipRecurringExecution,
  getUpcomingRecurringTransactions,
  type RecurringExecutionResult,
} from './recurring.service';
