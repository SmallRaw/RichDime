/**
 * 数据库 Schema 定义
 * 使用 SQLite 作为本地数据库
 */

export const SCHEMA_VERSION = 1;

/** 数据库初始化 SQL */
export const INIT_SCHEMA = `
-- 账户表
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cash', 'bank', 'credit', 'investment', 'other')),
  currency TEXT NOT NULL DEFAULT 'CNY',
  balance INTEGER NOT NULL DEFAULT 0,
  initial_balance INTEGER NOT NULL DEFAULT 0,
  icon TEXT NOT NULL DEFAULT 'wallet',
  color TEXT NOT NULL DEFAULT '#6366f1',
  is_archived INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'transfer')),
  icon TEXT NOT NULL DEFAULT 'folder',
  color TEXT NOT NULL DEFAULT '#6366f1',
  parent_id TEXT,
  is_system INTEGER NOT NULL DEFAULT 0,
  is_archived INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 交易记录表
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'transfer')),
  amount INTEGER NOT NULL CHECK (amount >= 0),
  category_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  to_account_id TEXT,
  note TEXT NOT NULL DEFAULT '',
  date INTEGER NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  attachments TEXT NOT NULL DEFAULT '[]',
  recurring_id TEXT,
  is_void INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  FOREIGN KEY (to_account_id) REFERENCES accounts(id),
  FOREIGN KEY (recurring_id) REFERENCES recurring_transactions(id) ON DELETE SET NULL
);

-- 循环记账表
CREATE TABLE IF NOT EXISTS recurring_transactions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'transfer')),
  amount INTEGER NOT NULL CHECK (amount >= 0),
  category_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  to_account_id TEXT,
  note TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '[]',
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),
  day_of_month INTEGER,
  day_of_week INTEGER CHECK (day_of_week IS NULL OR (day_of_week >= 0 AND day_of_week <= 6)),
  start_date INTEGER NOT NULL,
  end_date INTEGER,
  last_executed_at INTEGER,
  next_execute_at INTEGER NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  FOREIGN KEY (to_account_id) REFERENCES accounts(id)
);

-- 预算表
CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT,
  account_id TEXT,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  frequency TEXT NOT NULL CHECK (frequency IN ('monthly', 'yearly')),
  start_date INTEGER NOT NULL,
  end_date INTEGER,
  alert_threshold INTEGER NOT NULL DEFAULT 80,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- Schema 版本表
CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER PRIMARY KEY
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_recurring_id ON transactions(recurring_id);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_recurring_next_execute ON recurring_transactions(next_execute_at);
CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON budgets(category_id);
`;

/** 预设分类数据 */
export const DEFAULT_CATEGORIES = [
  // 支出分类
  { id: 'cat_expense_food', name: '餐饮', type: 'expense', icon: 'utensils', color: '#f97316', sortOrder: 1 },
  { id: 'cat_expense_transport', name: '交通', type: 'expense', icon: 'car', color: '#3b82f6', sortOrder: 2 },
  { id: 'cat_expense_shopping', name: '购物', type: 'expense', icon: 'shopping-bag', color: '#ec4899', sortOrder: 3 },
  { id: 'cat_expense_entertainment', name: '娱乐', type: 'expense', icon: 'gamepad-2', color: '#8b5cf6', sortOrder: 4 },
  { id: 'cat_expense_housing', name: '住房', type: 'expense', icon: 'home', color: '#14b8a6', sortOrder: 5 },
  { id: 'cat_expense_utilities', name: '水电煤', type: 'expense', icon: 'lightbulb', color: '#eab308', sortOrder: 6 },
  { id: 'cat_expense_health', name: '医疗', type: 'expense', icon: 'heart-pulse', color: '#ef4444', sortOrder: 7 },
  { id: 'cat_expense_education', name: '教育', type: 'expense', icon: 'graduation-cap', color: '#06b6d4', sortOrder: 8 },
  { id: 'cat_expense_communication', name: '通讯', type: 'expense', icon: 'smartphone', color: '#64748b', sortOrder: 9 },
  { id: 'cat_expense_other', name: '其他支出', type: 'expense', icon: 'more-horizontal', color: '#94a3b8', sortOrder: 99 },

  // 收入分类
  { id: 'cat_income_salary', name: '工资', type: 'income', icon: 'briefcase', color: '#22c55e', sortOrder: 1 },
  { id: 'cat_income_bonus', name: '奖金', type: 'income', icon: 'gift', color: '#f59e0b', sortOrder: 2 },
  { id: 'cat_income_investment', name: '投资收益', type: 'income', icon: 'trending-up', color: '#10b981', sortOrder: 3 },
  { id: 'cat_income_parttime', name: '兼职', type: 'income', icon: 'clock', color: '#6366f1', sortOrder: 4 },
  { id: 'cat_income_refund', name: '报销', type: 'income', icon: 'receipt', color: '#0ea5e9', sortOrder: 5 },
  { id: 'cat_income_other', name: '其他收入', type: 'income', icon: 'plus-circle', color: '#84cc16', sortOrder: 99 },

  // 转账分类
  { id: 'cat_transfer', name: '转账', type: 'transfer', icon: 'arrow-left-right', color: '#6366f1', sortOrder: 1 },
];

/** 预设账户数据 */
export const DEFAULT_ACCOUNTS = [
  { id: 'acc_cash', name: '现金', type: 'cash', icon: 'banknote', color: '#22c55e', sortOrder: 1 },
  { id: 'acc_bank', name: '银行卡', type: 'bank', icon: 'credit-card', color: '#3b82f6', sortOrder: 2 },
  { id: 'acc_alipay', name: '支付宝', type: 'other', icon: 'wallet', color: '#0ea5e9', sortOrder: 3 },
  { id: 'acc_wechat', name: '微信', type: 'other', icon: 'message-circle', color: '#22c55e', sortOrder: 4 },
];
