/**
 * 交易业务服务
 * 校验 + 余额联动（原子事务）
 */

import { withDrizzleTransaction, type DrizzleTransaction } from '../connection';
import { now } from '../utils/date';
import {
  insertTransaction,
  getTransactionById,
  updateTransactionFields,
  deleteTransactionRow,
} from '../repositories/transaction.repository';
import { updateAccountBalance } from '../repositories/account.repository';
import type {
  Transaction,
  TransactionType,
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from '../models/types';

/**
 * 应用交易对账户余额的影响
 */
async function applyTransactionToBalance(
  type: TransactionType,
  amount: number,
  accountId: string,
  toAccountId?: string | null,
  tx?: DrizzleTransaction
): Promise<void> {
  switch (type) {
    case 'expense':
      await updateAccountBalance(accountId, -amount, tx);
      break;
    case 'income':
      await updateAccountBalance(accountId, amount, tx);
      break;
    case 'transfer':
      await updateAccountBalance(accountId, -amount, tx);
      if (toAccountId) {
        await updateAccountBalance(toAccountId, amount, tx);
      }
      break;
  }
}

/**
 * 撤销交易对账户余额的影响
 */
async function reverseTransactionFromBalance(
  type: TransactionType,
  amount: number,
  accountId: string,
  toAccountId?: string | null,
  tx?: DrizzleTransaction
): Promise<void> {
  switch (type) {
    case 'expense':
      await updateAccountBalance(accountId, amount, tx);
      break;
    case 'income':
      await updateAccountBalance(accountId, -amount, tx);
      break;
    case 'transfer':
      await updateAccountBalance(accountId, amount, tx);
      if (toAccountId) {
        await updateAccountBalance(toAccountId, -amount, tx);
      }
      break;
  }
}

/**
 * 创建交易（含余额联动）
 */
export async function createTransaction(dto: CreateTransactionDTO): Promise<Transaction> {
  return withDrizzleTransaction(async (tx) => {
    const transactionDate = dto.date ?? now();

    // 校验转账类型
    if (dto.type === 'transfer' && !dto.toAccountId) {
      throw new Error('Transfer transaction requires toAccountId');
    }
    if (dto.type !== 'transfer' && dto.toAccountId) {
      throw new Error('toAccountId is only for transfer transactions');
    }

    // 插入交易
    const transaction = await insertTransaction({
      type: dto.type,
      amount: dto.amount,
      categoryId: dto.categoryId,
      accountId: dto.accountId,
      toAccountId: dto.toAccountId,
      note: dto.note,
      date: transactionDate,
      tags: dto.tags,
      attachments: dto.attachments,
    }, tx);

    // 更新余额
    await applyTransactionToBalance(dto.type, dto.amount, dto.accountId, dto.toAccountId, tx);

    return transaction;
  });
}

/**
 * 更新交易（含余额联动）
 */
export async function updateTransaction(id: string, dto: UpdateTransactionDTO): Promise<Transaction> {
  return withDrizzleTransaction(async (tx) => {
    const original = await getTransactionById(id, tx);
    if (!original) {
      throw new Error('Transaction not found');
    }
    if (original.isVoid) {
      throw new Error('Cannot update voided transaction');
    }

    // 撤销旧余额
    await reverseTransactionFromBalance(
      original.type,
      original.amount,
      original.accountId,
      original.toAccountId,
      tx
    );

    // 计算新值
    const newType = dto.type ?? original.type;
    const newAmount = dto.amount ?? original.amount;
    const newAccountId = dto.accountId ?? original.accountId;
    const newToAccountId = dto.toAccountId !== undefined ? dto.toAccountId : original.toAccountId;

    // 校验转账
    if (newType === 'transfer' && !newToAccountId) {
      throw new Error('Transfer transaction requires toAccountId');
    }
    if (newType !== 'transfer' && newToAccountId) {
      throw new Error('toAccountId is only for transfer transactions');
    }

    // 更新字段
    const transaction = await updateTransactionFields(id, {
      type: dto.type,
      amount: dto.amount,
      categoryId: dto.categoryId,
      accountId: dto.accountId,
      toAccountId: dto.toAccountId !== undefined ? (dto.toAccountId ?? null) : undefined,
      note: dto.note,
      date: dto.date,
      tags: dto.tags,
      attachments: dto.attachments,
    }, tx);

    // 应用新余额
    await applyTransactionToBalance(newType, newAmount, newAccountId, newToAccountId, tx);

    return transaction;
  });
}

/**
 * 作废交易（标记 + 撤销余额）
 */
export async function voidTransaction(id: string): Promise<Transaction> {
  return withDrizzleTransaction(async (tx) => {
    const transaction = await getTransactionById(id, tx);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    if (transaction.isVoid) {
      throw new Error('Transaction is already voided');
    }

    // 撤销余额
    await reverseTransactionFromBalance(
      transaction.type,
      transaction.amount,
      transaction.accountId,
      transaction.toAccountId,
      tx
    );

    // 标记作废
    return updateTransactionFields(id, { isVoid: true }, tx);
  });
}

/**
 * 删除交易（物理删除 + 撤销余额）
 */
export async function deleteTransaction(id: string): Promise<void> {
  return withDrizzleTransaction(async (tx) => {
    const transaction = await getTransactionById(id, tx);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // 未作废的交易需要撤销余额
    if (!transaction.isVoid) {
      await reverseTransactionFromBalance(
        transaction.type,
        transaction.amount,
        transaction.accountId,
        transaction.toAccountId,
        tx
      );
    }

    await deleteTransactionRow(id, tx);
  });
}

/**
 * 创建交易（含余额联动）— 用于 Service 层内部调用（如 Recurring）
 * 接受 tx 参数以在已有事务中运行
 */
export async function createTransactionWithBalance(
  data: {
    type: TransactionType;
    amount: number;
    categoryId: string;
    accountId: string;
    toAccountId?: string | null;
    note?: string;
    date: number;
    tags?: string[];
    recurringId?: string | null;
  },
  tx: DrizzleTransaction
): Promise<Transaction> {
  // 插入交易
  const transaction = await insertTransaction({
    type: data.type,
    amount: data.amount,
    categoryId: data.categoryId,
    accountId: data.accountId,
    toAccountId: data.toAccountId,
    note: data.note,
    date: data.date,
    tags: data.tags,
    recurringId: data.recurringId,
  }, tx);

  // 更新余额
  await applyTransactionToBalance(data.type, data.amount, data.accountId, data.toAccountId, tx);

  return transaction;
}
