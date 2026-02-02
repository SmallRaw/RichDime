/**
 * 日期工具函数
 */

import type { RecurrenceFrequency, DayOfWeek } from '../models/types';

/** 获取当前时间戳 */
export function now(): number {
  return Date.now();
}

/** 获取今天开始的时间戳（00:00:00） */
export function startOfDay(timestamp: number = now()): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/** 获取今天结束的时间戳（23:59:59.999） */
export function endOfDay(timestamp: number = now()): number {
  const date = new Date(timestamp);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

/** 获取本周开始（周一） */
export function startOfWeek(timestamp: number = now()): number {
  const date = new Date(timestamp);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/** 获取本周结束（周日） */
export function endOfWeek(timestamp: number = now()): number {
  const start = new Date(startOfWeek(timestamp));
  start.setDate(start.getDate() + 6);
  start.setHours(23, 59, 59, 999);
  return start.getTime();
}

/** 获取本月开始 */
export function startOfMonth(timestamp: number = now()): number {
  const date = new Date(timestamp);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/** 获取本月结束 */
export function endOfMonth(timestamp: number = now()): number {
  const date = new Date(timestamp);
  date.setMonth(date.getMonth() + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

/** 获取本年开始 */
export function startOfYear(timestamp: number = now()): number {
  const date = new Date(timestamp);
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/** 获取本年结束 */
export function endOfYear(timestamp: number = now()): number {
  const date = new Date(timestamp);
  date.setMonth(11, 31);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

/** 添加天数 */
export function addDays(timestamp: number, days: number): number {
  const date = new Date(timestamp);
  date.setDate(date.getDate() + days);
  return date.getTime();
}

/** 添加周数 */
export function addWeeks(timestamp: number, weeks: number): number {
  return addDays(timestamp, weeks * 7);
}

/** 添加月数 */
export function addMonths(timestamp: number, months: number): number {
  const date = new Date(timestamp);
  date.setMonth(date.getMonth() + months);
  return date.getTime();
}

/** 添加年数 */
export function addYears(timestamp: number, years: number): number {
  const date = new Date(timestamp);
  date.setFullYear(date.getFullYear() + years);
  return date.getTime();
}

/** 获取两个日期之间的天数 */
export function daysBetween(start: number, end: number): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((end - start) / msPerDay);
}

/** 格式化日期为 YYYY-MM-DD */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** 格式化为年月 YYYY-MM */
export function formatYearMonth(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/** 格式化为周 YYYY-Www */
export function formatWeek(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${year}-W${String(weekNumber).padStart(2, '0')}`;
}

/** 获取日期是星期几 */
export function getDayOfWeek(timestamp: number): DayOfWeek {
  return new Date(timestamp).getDay() as DayOfWeek;
}

/** 获取日期是几号 */
export function getDayOfMonth(timestamp: number): number {
  return new Date(timestamp).getDate();
}

/**
 * 计算循环记账的下次执行时间
 */
export function calculateNextExecuteDate(
  frequency: RecurrenceFrequency,
  lastExecutedAt: number | null,
  startDate: number,
  dayOfMonth: number | null,
  dayOfWeek: DayOfWeek | null
): number {
  const baseDate = lastExecutedAt ?? startDate;
  const today = startOfDay();

  let nextDate: number;

  switch (frequency) {
    case 'daily':
      nextDate = lastExecutedAt ? addDays(baseDate, 1) : startDate;
      break;

    case 'weekly':
      if (dayOfWeek !== null) {
        // 找到下一个指定的星期几
        const currentDow = getDayOfWeek(baseDate);
        let daysToAdd = dayOfWeek - currentDow;
        if (daysToAdd <= 0 || lastExecutedAt) {
          daysToAdd += 7;
        }
        nextDate = addDays(baseDate, daysToAdd);
      } else {
        nextDate = addWeeks(baseDate, 1);
      }
      break;

    case 'biweekly':
      if (dayOfWeek !== null) {
        const currentDow = getDayOfWeek(baseDate);
        let daysToAdd = dayOfWeek - currentDow;
        if (daysToAdd <= 0 || lastExecutedAt) {
          daysToAdd += 14;
        }
        nextDate = addDays(baseDate, daysToAdd);
      } else {
        nextDate = addWeeks(baseDate, 2);
      }
      break;

    case 'monthly':
      if (dayOfMonth !== null) {
        const date = new Date(baseDate);
        if (lastExecutedAt) {
          date.setMonth(date.getMonth() + 1);
        }
        // 处理月末情况（如31号在只有30天的月份）
        const targetDay = Math.min(dayOfMonth, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());
        date.setHours(0, 0, 0, 0);
        date.setDate(targetDay);
        nextDate = date.getTime();
      } else {
        nextDate = addMonths(baseDate, 1);
      }
      break;

    case 'quarterly':
      if (dayOfMonth !== null) {
        const date = new Date(baseDate);
        if (lastExecutedAt) {
          date.setMonth(date.getMonth() + 3);
        }
        const targetDay = Math.min(dayOfMonth, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());
        date.setHours(0, 0, 0, 0);
        date.setDate(targetDay);
        nextDate = date.getTime();
      } else {
        nextDate = addMonths(baseDate, 3);
      }
      break;

    case 'yearly':
      if (dayOfMonth !== null) {
        const date = new Date(baseDate);
        if (lastExecutedAt) {
          date.setFullYear(date.getFullYear() + 1);
        }
        const targetDay = Math.min(dayOfMonth, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());
        date.setHours(0, 0, 0, 0);
        date.setDate(targetDay);
        nextDate = date.getTime();
      } else {
        nextDate = addYears(baseDate, 1);
      }
      break;

    default:
      nextDate = addMonths(baseDate, 1);
  }

  // 确保下次执行时间不早于今天
  return Math.max(nextDate, today);
}

/**
 * 获取指定时间范围内的所有周期
 */
export function getPeriodsInRange(
  start: number,
  end: number,
  periodType: 'day' | 'week' | 'month' | 'year'
): Array<{ start: number; end: number; label: string }> {
  const periods: Array<{ start: number; end: number; label: string }> = [];
  let current = start;

  while (current <= end) {
    let periodStart: number;
    let periodEnd: number;
    let label: string;

    switch (periodType) {
      case 'day':
        periodStart = startOfDay(current);
        periodEnd = endOfDay(current);
        label = formatDate(current);
        current = addDays(current, 1);
        break;
      case 'week':
        periodStart = startOfWeek(current);
        periodEnd = endOfWeek(current);
        label = formatWeek(current);
        current = addWeeks(current, 1);
        break;
      case 'month':
        periodStart = startOfMonth(current);
        periodEnd = endOfMonth(current);
        label = formatYearMonth(current);
        current = addMonths(current, 1);
        break;
      case 'year':
        periodStart = startOfYear(current);
        periodEnd = endOfYear(current);
        label = String(new Date(current).getFullYear());
        current = addYears(current, 1);
        break;
    }

    periods.push({ start: periodStart, end: periodEnd, label });
  }

  return periods;
}
