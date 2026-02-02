/**
 * Jotai atoms — persistent UI state that survives tab navigation
 */

import { atom } from 'jotai';

// ============ Statistics Screen ============

export type TimePeriod = 'week' | 'month' | 'year';

/** 统计页 - 选中的时间维度 */
export const statisticsTimePeriodAtom = atom<TimePeriod>('month');

/** 统计页 - 时间偏移（0 = 当前，-1 = 上一期） */
export const statisticsPeriodOffsetAtom = atom(0);

// ============ Transactions Screen ============

type TransactionPeriod = 'week' | 'month' | 'year';

/** 交易列表页 - 选中的时间维度 */
export const transactionsPeriodAtom = atom<TransactionPeriod>('month');
