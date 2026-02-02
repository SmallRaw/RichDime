/**
 * 金额工具函数
 * 所有金额在数据库中以分（cents）为单位存储，避免浮点数精度问题
 */

import type { CurrencyCode } from '../models/types';

/** 将元转换为分 */
export function yuanToCents(yuan: number): number {
  return Math.round(yuan * 100);
}

/** 将分转换为元 */
export function centsToYuan(cents: number): number {
  return cents / 100;
}

/** 格式化金额显示（分 -> 带符号的字符串） */
export function formatAmount(
  cents: number,
  currency: CurrencyCode = 'CNY',
  showSign: boolean = false
): string {
  const yuan = centsToYuan(Math.abs(cents));

  const symbols: Record<CurrencyCode, string> = {
    CNY: '¥',
    USD: '$',
    EUR: '€',
    JPY: '¥',
    GBP: '£',
    HKD: 'HK$',
    TWD: 'NT$',
  };

  const decimals: Record<CurrencyCode, number> = {
    CNY: 2,
    USD: 2,
    EUR: 2,
    JPY: 0,  // 日元没有小数
    GBP: 2,
    HKD: 2,
    TWD: 0,  // 新台币通常不显示小数
  };

  const symbol = symbols[currency];
  const decimal = decimals[currency];
  const formatted = yuan.toFixed(decimal);

  let result = `${symbol}${formatted}`;

  if (showSign && cents !== 0) {
    result = cents > 0 ? `+${result}` : `-${result}`;
  }

  return result;
}

/** 格式化金额（不带货币符号） */
export function formatAmountNumber(cents: number, decimals: number = 2): string {
  return centsToYuan(cents).toFixed(decimals);
}

/** 格式化金额为带千分位的字符串（不带货币符号） */
export function formatMoney(cents: number, decimals: number = 2): string {
  const yuan = centsToYuan(Math.abs(cents));
  const parts = yuan.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/** 计算百分比 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 10000) / 100; // 保留两位小数
}

/** 安全的金额加法（避免浮点数问题） */
export function addAmounts(...amounts: number[]): number {
  return amounts.reduce((sum, amount) => sum + amount, 0);
}

/** 安全的金额减法 */
export function subtractAmounts(a: number, b: number): number {
  return a - b;
}
