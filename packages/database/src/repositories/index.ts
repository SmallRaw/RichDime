// Account Repository
export {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  updateAccountBalance,
  setAccountBalance,
  getTotalBalance,
  updateAccountSortOrder,
  getAccountTransactionCount,
  deleteAccountRow,
} from './account.repository';

// 向后兼容：这些函数已移到 service 层，但保留旧导出
export { deleteAccount, recalculateAccountBalance } from '../services/account.service';

// Category Repository
export {
  getAllCategories,
  getCategoriesByType,
  getTopLevelCategories,
  getChildCategories,
  getCategoryById,
  createCategory,
  updateCategorySortOrder,
  getCategoryWithChildrenIds,
  getCategoryTransactionCount,
  getCategoryChildCount,
  deleteCategoryRow,
} from './category.repository';
// 向后兼容重命名：updateCategory 和 deleteCategory 包含业务校验
export { updateCategorySafe as updateCategory, deleteCategory } from '../services/category.service';

// Transaction Repository (纯数据操作)
export {
  getTransactions,
  getAllTransactions,
  getTransactionById,
  insertTransaction,
  updateTransactionFields,
  deleteTransactionRow,
  getTransactionsGroupedByDate,
  getTransactionsByRecurringId,
  clearRecurringId,
} from './transaction.repository';
// 向后兼容：含余额联动的操作已移到 service 层
export {
  createTransaction,
  updateTransaction,
  voidTransaction,
  deleteTransaction,
} from '../services/transaction.service';

// Recurring Transaction Repository
export {
  getAllRecurringTransactions,
  getRecurringTransactionById,
  getDueRecurringTransactions,
  createRecurringTransaction,
  updateRecurringTransaction,
  markRecurringTransactionExecuted,
  deleteRecurringTransaction,
  deactivateRecurringTransaction,
  activateRecurringTransaction,
} from './recurring.repository';

// Budget Repository
export {
  getAllBudgets,
  getBudgetById,
  getBudgetByCategory,
  createBudget,
  updateBudget,
  deleteBudget,
} from './budget.repository';
// 向后兼容：预算执行计算已移到 service 层
export { getBudgetExecution, getAllBudgetExecutions, getOverBudgetAlerts } from '../services/budget.service';
