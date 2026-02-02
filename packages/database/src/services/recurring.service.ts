/**
 * 循环记账服务
 * 使用 TransactionService 进行交易创建+余额联动
 */

import { getDrizzle, withDrizzleTransaction } from '../connection';
import { now, startOfDay } from '../utils/date';
import { recurringTransactions } from '../schema/tables';
import { eq } from 'drizzle-orm';
import {
  getDueRecurringTransactions,
  markRecurringTransactionExecuted,
  getRecurringTransactionById,
  getUpcomingRecurringTransactions as getUpcomingRepo,
} from '../repositories/recurring.repository';
import { createTransactionWithBalance } from './transaction.service';
import type { RecurringTransaction } from '../models/types';

/** 循环记账执行结果 */
export interface RecurringExecutionResult {
  recurringId: string;
  transactionId: string | null;
  success: boolean;
  error?: string;
}

/**
 * 执行单个循环记账（在事务中调用 TransactionService）
 */
async function executeRecurringTransaction(
  recurring: RecurringTransaction
): Promise<RecurringExecutionResult> {
  try {
    return await withDrizzleTransaction(async (tx) => {
      const transactionDate = startOfDay();

      // 使用 TransactionService 创建交易+余额联动
      const transaction = await createTransactionWithBalance({
        type: recurring.type,
        amount: recurring.amount,
        categoryId: recurring.categoryId,
        accountId: recurring.accountId,
        toAccountId: recurring.toAccountId,
        note: recurring.note,
        date: transactionDate,
        tags: recurring.tags,
        recurringId: recurring.id,
      }, tx);

      // 更新循环记账状态
      await markRecurringTransactionExecuted(recurring.id, tx);

      return {
        recurringId: recurring.id,
        transactionId: transaction.id,
        success: true,
      };
    });
  } catch (error) {
    return {
      recurringId: recurring.id,
      transactionId: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 执行所有待执行的循环记账
 */
export async function executeAllDueRecurringTransactions(): Promise<RecurringExecutionResult[]> {
  const dueRecurring = await getDueRecurringTransactions();
  const results: RecurringExecutionResult[] = [];

  for (const recurring of dueRecurring) {
    // 检查是否已过结束日期
    if (recurring.endDate && startOfDay() > recurring.endDate) {
      const db = await getDrizzle();
      await db.update(recurringTransactions).set({
        isActive: false,
        updatedAt: now(),
      }).where(eq(recurringTransactions.id, recurring.id));
      continue;
    }

    const result = await executeRecurringTransaction(recurring);
    results.push(result);
  }

  return results;
}

/**
 * 手动执行单个循环记账
 */
export async function manualExecuteRecurring(recurringId: string): Promise<RecurringExecutionResult> {
  const recurring = await getRecurringTransactionById(recurringId);

  if (!recurring) {
    return {
      recurringId,
      transactionId: null,
      success: false,
      error: 'Recurring transaction not found',
    };
  }

  if (!recurring.isActive) {
    return {
      recurringId,
      transactionId: null,
      success: false,
      error: 'Recurring transaction is not active',
    };
  }

  return executeRecurringTransaction(recurring);
}

/**
 * 跳过本次循环记账
 */
export async function skipRecurringExecution(recurringId: string): Promise<void> {
  const recurring = await getRecurringTransactionById(recurringId);
  if (!recurring) {
    throw new Error('Recurring transaction not found');
  }
  await markRecurringTransactionExecuted(recurringId);
}

/**
 * 获取即将到期的循环记账
 */
export async function getUpcomingRecurringTransactions(days: number = 7): Promise<RecurringTransaction[]> {
  return getUpcomingRepo(days);
}
