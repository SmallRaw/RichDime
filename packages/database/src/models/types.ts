/**
 * 核心数据类型定义
 * Rich Dime 记账应用数据模型
 */

// ============ 基础类型 ============

/** 交易类型 */
export type TransactionType = 'expense' | 'income' | 'transfer';

/** 循环周期类型 */
export type RecurrenceFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

/** 账户类型 */
export type AccountType = 'cash' | 'bank' | 'credit' | 'investment' | 'other';

/** 货币代码 (ISO 4217) */
export type CurrencyCode = 'CNY' | 'USD' | 'EUR' | 'JPY' | 'GBP' | 'HKD' | 'TWD';

/** 星期几 (0=周日, 1=周一, ..., 6=周六) */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// ============ 实体模型 ============

/** 账户实体 */
export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: CurrencyCode;
  balance: number;           // 当前余额（分为单位）
  initialBalance: number;    // 初始余额（分为单位）
  icon: string;              // lucide 图标名
  color: string;             // 颜色标识
  isArchived: boolean;       // 是否归档
  sortOrder: number;         // 排序顺序
  createdAt: number;         // 创建时间戳
  updatedAt: number;         // 更新时间戳
}

/** 分类实体 */
export interface Category {
  id: string;
  name: string;
  type: TransactionType;     // 适用的交易类型
  icon: string;              // lucide 图标名
  color: string;             // 颜色标识
  parentId: string | null;   // 父分类ID（支持子分类）
  isSystem: boolean;         // 是否系统预设
  isArchived: boolean;       // 是否归档
  sortOrder: number;         // 排序顺序
  createdAt: number;
  updatedAt: number;
}

/** 交易记录实体 */
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;            // 金额（分为单位，始终为正数）
  categoryId: string;
  accountId: string;
  toAccountId: string | null; // 转账目标账户（仅 transfer 类型）
  note: string;              // 备注
  date: number;              // 交易日期时间戳
  tags: string[];            // 标签
  attachments: string[];     // 附件URL
  recurringId: string | null; // 关联的循环记账ID
  isVoid: boolean;           // 是否作废
  createdAt: number;
  updatedAt: number;
}

/** 循环记账实体 */
export interface RecurringTransaction {
  id: string;
  name: string;              // 循环记账名称
  type: TransactionType;
  amount: number;            // 金额（分为单位）
  categoryId: string;
  accountId: string;
  toAccountId: string | null;
  note: string;
  tags: string[];
  frequency: RecurrenceFrequency;
  dayOfMonth: number | null;  // 每月几号（1-31，monthly/quarterly/yearly）
  dayOfWeek: DayOfWeek | null; // 星期几（weekly/biweekly）
  startDate: number;          // 开始日期
  endDate: number | null;     // 结束日期（null=永久）
  lastExecutedAt: number | null; // 上次执行时间
  nextExecuteAt: number;      // 下次执行时间
  isActive: boolean;          // 是否启用
  createdAt: number;
  updatedAt: number;
}

/** 预算实体 */
export interface Budget {
  id: string;
  name: string;
  categoryId: string | null;  // null 表示总预算
  accountId: string | null;   // null 表示所有账户
  amount: number;             // 预算金额（分）
  frequency: 'monthly' | 'yearly';
  startDate: number;
  endDate: number | null;
  alertThreshold: number;     // 预警阈值（0-100 百分比）
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

// ============ 查询/统计类型 ============

/** 时间范围 */
export interface DateRange {
  start: number;  // 开始时间戳
  end: number;    // 结束时间戳
}

/** 交易查询过滤条件 */
export interface TransactionFilter {
  type?: TransactionType;
  categoryId?: string;
  categoryIds?: string[];
  accountId?: string;
  accountIds?: string[];
  dateRange?: DateRange;
  minAmount?: number;
  maxAmount?: number;
  tags?: string[];
  searchText?: string;
  includeVoid?: boolean;
}

/** 分页参数 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** 分页结果 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** 交易统计摘要 */
export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  transactionCount: number;
}

/** 分类统计 */
export interface CategoryStatistics {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

/** 账户余额变动 */
export interface AccountBalanceChange {
  accountId: string;
  accountName: string;
  startBalance: number;
  endBalance: number;
  totalIncome: number;
  totalExpense: number;
  netChange: number;
}

/** 时间段统计（用于图表） */
export interface PeriodStatistics {
  period: string;           // 时间段标识（如 "2024-01", "2024-W01"）
  periodStart: number;
  periodEnd: number;
  income: number;
  expense: number;
  netAmount: number;
}

/** 趋势数据 */
export interface TrendData {
  periods: PeriodStatistics[];
  averageIncome: number;
  averageExpense: number;
  incomeGrowth: number;     // 收入增长率
  expenseGrowth: number;    // 支出增长率
}

/** 预算执行情况 */
export interface BudgetExecution {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  daysRemaining: number;
}

// ============ 创建/更新 DTO ============

/** 创建账户 DTO */
export interface CreateAccountDTO {
  name: string;
  type: AccountType;
  currency?: CurrencyCode;
  initialBalance?: number;
  icon?: string;
  color?: string;
}

/** 更新账户 DTO */
export interface UpdateAccountDTO {
  name?: string;
  type?: AccountType;
  icon?: string;
  color?: string;
  isArchived?: boolean;
  sortOrder?: number;
}

/** 创建分类 DTO */
export interface CreateCategoryDTO {
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
  parentId?: string;
}

/** 更新分类 DTO */
export interface UpdateCategoryDTO {
  name?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  isArchived?: boolean;
  sortOrder?: number;
}

/** 创建交易 DTO */
export interface CreateTransactionDTO {
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  toAccountId?: string;
  note?: string;
  date?: number;
  tags?: string[];
  attachments?: string[];
}

/** 更新交易 DTO */
export interface UpdateTransactionDTO {
  type?: TransactionType;
  amount?: number;
  categoryId?: string;
  accountId?: string;
  toAccountId?: string;
  note?: string;
  date?: number;
  tags?: string[];
  attachments?: string[];
}

/** 创建循环记账 DTO */
export interface CreateRecurringTransactionDTO {
  name: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  toAccountId?: string;
  note?: string;
  tags?: string[];
  frequency: RecurrenceFrequency;
  dayOfMonth?: number;
  dayOfWeek?: DayOfWeek;
  startDate: number;
  endDate?: number;
}

/** 更新循环记账 DTO */
export interface UpdateRecurringTransactionDTO {
  name?: string;
  type?: TransactionType;
  amount?: number;
  categoryId?: string;
  accountId?: string;
  toAccountId?: string;
  note?: string;
  tags?: string[];
  frequency?: RecurrenceFrequency;
  dayOfMonth?: number;
  dayOfWeek?: DayOfWeek;
  startDate?: number;
  endDate?: number | null;
  isActive?: boolean;
}

/** 创建预算 DTO */
export interface CreateBudgetDTO {
  name: string;
  categoryId?: string;
  accountId?: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
  startDate?: number;
  endDate?: number;
  alertThreshold?: number;
}

/** 更新预算 DTO */
export interface UpdateBudgetDTO {
  name?: string;
  categoryId?: string;
  accountId?: string;
  amount?: number;
  frequency?: 'monthly' | 'yearly';
  startDate?: number;
  endDate?: number | null;
  alertThreshold?: number;
  isActive?: boolean;
}
