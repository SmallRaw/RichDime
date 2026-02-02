/**
 * 统计服务
 * Drizzle ORM 重写
 */

import { sql } from 'drizzle-orm';
import { getDrizzle, type DrizzleTransaction } from '../connection';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  getPeriodsInRange,
  addMonths,
  now,
} from '../utils/date';
import { calculatePercentage } from '../utils/money';
import { getAllAccounts } from '../repositories/account.repository';
import { getCategoryById } from '../repositories/category.repository';
import type {
  TransactionSummary,
  CategoryStatistics,
  AccountBalanceChange,
  PeriodStatistics,
  TrendData,
  DateRange,
  TransactionFilter,
} from '../models/types';

/**
 * 获取交易摘要
 */
export async function getTransactionSummary(
  filter: TransactionFilter = {},
  tx?: DrizzleTransaction
): Promise<TransactionSummary> {
  const db = tx ?? await getDrizzle();

  const incomeResult = await db.all<{ total: number | null }>(sql`
    SELECT SUM(amount) as total FROM transactions
    WHERE is_void = 0 AND type = 'income'
      ${filter.dateRange ? sql`AND date >= ${filter.dateRange.start} AND date <= ${filter.dateRange.end}` : sql``}
      ${filter.accountId ? sql`AND (account_id = ${filter.accountId} OR to_account_id = ${filter.accountId})` : sql``}
      ${filter.categoryId ? sql`AND category_id = ${filter.categoryId}` : sql``}
  `);

  const expenseResult = await db.all<{ total: number | null }>(sql`
    SELECT SUM(amount) as total FROM transactions
    WHERE is_void = 0 AND type = 'expense'
      ${filter.dateRange ? sql`AND date >= ${filter.dateRange.start} AND date <= ${filter.dateRange.end}` : sql``}
      ${filter.accountId ? sql`AND (account_id = ${filter.accountId} OR to_account_id = ${filter.accountId})` : sql``}
      ${filter.categoryId ? sql`AND category_id = ${filter.categoryId}` : sql``}
  `);

  const countResult = await db.all<{ count: number }>(sql`
    SELECT COUNT(*) as count FROM transactions
    WHERE is_void = 0
      ${filter.dateRange ? sql`AND date >= ${filter.dateRange.start} AND date <= ${filter.dateRange.end}` : sql``}
      ${filter.accountId ? sql`AND (account_id = ${filter.accountId} OR to_account_id = ${filter.accountId})` : sql``}
      ${filter.categoryId ? sql`AND category_id = ${filter.categoryId}` : sql``}
  `);

  const totalIncome = incomeResult[0]?.total ?? 0;
  const totalExpense = expenseResult[0]?.total ?? 0;

  return {
    totalIncome,
    totalExpense,
    netAmount: totalIncome - totalExpense,
    transactionCount: countResult[0]?.count ?? 0,
  };
}

/**
 * 获取今日摘要
 */
export async function getTodaySummary(): Promise<TransactionSummary> {
  const today = now();
  return getTransactionSummary({
    dateRange: { start: startOfDay(today), end: endOfDay(today) },
  });
}

/**
 * 获取本周摘要
 */
export async function getWeekSummary(): Promise<TransactionSummary> {
  const today = now();
  return getTransactionSummary({
    dateRange: { start: startOfWeek(today), end: endOfWeek(today) },
  });
}

/**
 * 获取本月摘要
 */
export async function getMonthSummary(): Promise<TransactionSummary> {
  const today = now();
  return getTransactionSummary({
    dateRange: { start: startOfMonth(today), end: endOfMonth(today) },
  });
}

/**
 * 获取本年摘要
 */
export async function getYearSummary(): Promise<TransactionSummary> {
  const today = now();
  return getTransactionSummary({
    dateRange: { start: startOfYear(today), end: endOfYear(today) },
  });
}

/**
 * 获取分类统计
 */
export async function getCategoryStatistics(
  type: 'expense' | 'income',
  dateRange?: DateRange,
  tx?: DrizzleTransaction
): Promise<CategoryStatistics[]> {
  const db = tx ?? await getDrizzle();

  const rows = await db.all<{
    category_id: string;
    total_amount: number;
    transaction_count: number;
  }>(sql`
    SELECT
      category_id,
      SUM(amount) as total_amount,
      COUNT(*) as transaction_count
    FROM transactions
    WHERE type = ${type} AND is_void = 0
      ${dateRange ? sql`AND date >= ${dateRange.start} AND date <= ${dateRange.end}` : sql``}
    GROUP BY category_id
    ORDER BY total_amount DESC
  `);

  const totalAmount = rows.reduce((sum, row) => sum + row.total_amount, 0);
  const statistics: CategoryStatistics[] = [];

  for (const row of rows) {
    const category = await getCategoryById(row.category_id, tx);
    if (category) {
      statistics.push({
        categoryId: row.category_id,
        categoryName: category.name,
        categoryIcon: category.icon,
        categoryColor: category.color,
        totalAmount: row.total_amount,
        transactionCount: row.transaction_count,
        percentage: calculatePercentage(row.total_amount, totalAmount),
      });
    }
  }

  return statistics;
}

/**
 * 获取账户余额变动
 */
export async function getAccountBalanceChanges(
  dateRange: DateRange,
  tx?: DrizzleTransaction
): Promise<AccountBalanceChange[]> {
  const db = tx ?? await getDrizzle();
  const accountList = await getAllAccounts(false, tx);
  const changes: AccountBalanceChange[] = [];

  for (const account of accountList) {
    const beforeStart = await db.all<{
      income: number | null;
      expense: number | null;
      transfer_in: number | null;
      transfer_out: number | null;
    }>(sql`
      SELECT
        SUM(CASE WHEN type = 'income' AND account_id = ${account.id} THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' AND account_id = ${account.id} THEN amount ELSE 0 END) as expense,
        SUM(CASE WHEN type = 'transfer' AND to_account_id = ${account.id} THEN amount ELSE 0 END) as transfer_in,
        SUM(CASE WHEN type = 'transfer' AND account_id = ${account.id} THEN amount ELSE 0 END) as transfer_out
      FROM transactions
      WHERE is_void = 0 AND date < ${dateRange.start}
    `);

    const row0 = beforeStart[0];
    const startBalance =
      account.initialBalance +
      (row0?.income ?? 0) -
      (row0?.expense ?? 0) +
      (row0?.transfer_in ?? 0) -
      (row0?.transfer_out ?? 0);

    const periodChanges = await db.all<{
      income: number | null;
      expense: number | null;
      transfer_in: number | null;
      transfer_out: number | null;
    }>(sql`
      SELECT
        SUM(CASE WHEN type = 'income' AND account_id = ${account.id} THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' AND account_id = ${account.id} THEN amount ELSE 0 END) as expense,
        SUM(CASE WHEN type = 'transfer' AND to_account_id = ${account.id} THEN amount ELSE 0 END) as transfer_in,
        SUM(CASE WHEN type = 'transfer' AND account_id = ${account.id} THEN amount ELSE 0 END) as transfer_out
      FROM transactions
      WHERE is_void = 0 AND date >= ${dateRange.start} AND date <= ${dateRange.end}
    `);

    const row1 = periodChanges[0];
    const totalIncome = row1?.income ?? 0;
    const totalExpense = row1?.expense ?? 0;
    const transferIn = row1?.transfer_in ?? 0;
    const transferOut = row1?.transfer_out ?? 0;
    const netChange = totalIncome - totalExpense + transferIn - transferOut;

    changes.push({
      accountId: account.id,
      accountName: account.name,
      startBalance,
      endBalance: startBalance + netChange,
      totalIncome,
      totalExpense,
      netChange,
    });
  }

  return changes;
}

/**
 * 获取时间段统计（用于图表）
 */
export async function getPeriodStatistics(
  periodType: 'day' | 'week' | 'month' | 'year',
  dateRange: DateRange,
  tx?: DrizzleTransaction
): Promise<PeriodStatistics[]> {
  const db = tx ?? await getDrizzle();
  const periods = getPeriodsInRange(dateRange.start, dateRange.end, periodType);
  const statistics: PeriodStatistics[] = [];

  for (const period of periods) {
    const result = await db.all<{
      income: number | null;
      expense: number | null;
    }>(sql`
      SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
      FROM transactions
      WHERE is_void = 0 AND date >= ${period.start} AND date <= ${period.end}
    `);

    const income = result[0]?.income ?? 0;
    const expense = result[0]?.expense ?? 0;

    statistics.push({
      period: period.label,
      periodStart: period.start,
      periodEnd: period.end,
      income,
      expense,
      netAmount: income - expense,
    });
  }

  return statistics;
}

/**
 * 获取趋势数据（最近 N 个月）
 */
export async function getTrendData(months: number = 6): Promise<TrendData> {
  const today = now();
  const startDate = startOfMonth(addMonths(today, -(months - 1)));
  const endDate = endOfMonth(today);

  const periods = await getPeriodStatistics('month', { start: startDate, end: endDate });

  const totalIncome = periods.reduce((sum, p) => sum + p.income, 0);
  const totalExpense = periods.reduce((sum, p) => sum + p.expense, 0);
  const averageIncome = periods.length > 0 ? totalIncome / periods.length : 0;
  const averageExpense = periods.length > 0 ? totalExpense / periods.length : 0;

  let incomeGrowth = 0;
  let expenseGrowth = 0;

  if (periods.length >= 2) {
    const firstPeriod = periods[0];
    const lastPeriod = periods[periods.length - 1];
    if (firstPeriod.income > 0) {
      incomeGrowth = ((lastPeriod.income - firstPeriod.income) / firstPeriod.income) * 100;
    }
    if (firstPeriod.expense > 0) {
      expenseGrowth = ((lastPeriod.expense - firstPeriod.expense) / firstPeriod.expense) * 100;
    }
  }

  return {
    periods,
    averageIncome: Math.round(averageIncome),
    averageExpense: Math.round(averageExpense),
    incomeGrowth: Math.round(incomeGrowth * 100) / 100,
    expenseGrowth: Math.round(expenseGrowth * 100) / 100,
  };
}

/**
 * 获取支出排行
 */
export async function getExpenseRanking(
  topN: number = 5,
  dateRange?: DateRange
): Promise<CategoryStatistics[]> {
  const statistics = await getCategoryStatistics('expense', dateRange);
  return statistics.slice(0, topN);
}

/**
 * 获取收入排行
 */
export async function getIncomeRanking(
  topN: number = 5,
  dateRange?: DateRange
): Promise<CategoryStatistics[]> {
  const statistics = await getCategoryStatistics('income', dateRange);
  return statistics.slice(0, topN);
}

/**
 * 获取日均支出
 */
export async function getDailyAverageExpense(dateRange: DateRange, tx?: DrizzleTransaction): Promise<number> {
  const db = tx ?? await getDrizzle();

  const result = await db.all<{ total: number | null }>(sql`
    SELECT SUM(amount) as total
    FROM transactions
    WHERE type = 'expense' AND is_void = 0
      AND date >= ${dateRange.start} AND date <= ${dateRange.end}
  `);

  const total = result[0]?.total ?? 0;
  const days = Math.ceil((dateRange.end - dateRange.start) / (24 * 60 * 60 * 1000)) + 1;
  return Math.round(total / days);
}

/**
 * 获取最大单笔支出
 */
export async function getLargestExpense(
  dateRange?: DateRange,
  tx?: DrizzleTransaction
): Promise<{ amount: number; date: number; categoryId: string } | null> {
  const db = tx ?? await getDrizzle();

  const result = await db.all<{
    amount: number;
    date: number;
    category_id: string;
  }>(sql`
    SELECT amount, date, category_id
    FROM transactions
    WHERE type = 'expense' AND is_void = 0
      ${dateRange ? sql`AND date >= ${dateRange.start} AND date <= ${dateRange.end}` : sql``}
    ORDER BY amount DESC
    LIMIT 1
  `);

  if (result.length === 0) {
    return null;
  }

  return {
    amount: result[0].amount,
    date: result[0].date,
    categoryId: result[0].category_id,
  };
}
