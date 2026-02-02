/**
 * 账户业务服务
 * 处理需要业务校验的账户操作
 */

import { sql } from 'drizzle-orm';
import { getDrizzle, withDrizzleTransaction, type DrizzleTransaction } from '../connection';
import {
  getAccountById,
  setAccountBalance,
  deleteAccountRow,
  getAccountTransactionCount,
} from '../repositories/account.repository';

/**
 * 重新计算账户余额（从交易记录推算）
 */
export async function recalculateAccountBalance(accountId: string, tx?: DrizzleTransaction): Promise<number> {
  const runInTx = async (db: DrizzleTransaction) => {
    const account = await getAccountById(accountId, db);
    if (!account) {
      throw new Error('Account not found');
    }

    const result = await db.all<{
      income: number | null;
      expense: number | null;
      transfer_in: number | null;
      transfer_out: number | null;
    }>(sql`
      SELECT
        SUM(CASE WHEN type = 'income' AND account_id = ${accountId} THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' AND account_id = ${accountId} THEN amount ELSE 0 END) as expense,
        SUM(CASE WHEN type = 'transfer' AND to_account_id = ${accountId} THEN amount ELSE 0 END) as transfer_in,
        SUM(CASE WHEN type = 'transfer' AND account_id = ${accountId} THEN amount ELSE 0 END) as transfer_out
      FROM transactions
      WHERE is_void = 0
    `);

    const row = result[0];
    const newBalance =
      account.initialBalance +
      (row?.income ?? 0) -
      (row?.expense ?? 0) +
      (row?.transfer_in ?? 0) -
      (row?.transfer_out ?? 0);

    await setAccountBalance(accountId, newBalance, db);
    return newBalance;
  };

  if (tx) {
    return runInTx(tx);
  }
  return withDrizzleTransaction(runInTx);
}

/**
 * 安全删除账户（有关联交易则拒绝）
 */
export async function deleteAccount(id: string): Promise<void> {
  const count = await getAccountTransactionCount(id);
  if (count > 0) {
    throw new Error('Cannot delete account with existing transactions. Archive it instead.');
  }
  await deleteAccountRow(id);
}
