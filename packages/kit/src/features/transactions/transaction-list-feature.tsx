import { useMemo, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import {
  TransactionItem,
  DateHeader,
  Text,
  EmptyState,
  LoadingState,
  ErrorState,
} from '@rich-dime/component';
import {
  Utensils,
  ShoppingCart,
  ShoppingBag,
  Home,
  Car,
  Gamepad2,
  Heart,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
  Briefcase,
  TrendingUp,
  Gift,
  Wallet,
  ArrowRightLeft,
  ArrowLeftRight,
  Receipt,
  Lightbulb,
  Smartphone,
  Clock,
  PlusCircle,
  Banknote,
  CreditCard,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react-native';
import { useTransactions, useCategories, useAccounts } from '../../hooks/database';
import { formatMoney } from '@rich-dime/database';
import type { Transaction, TransactionType } from '@rich-dime/database';

// 分类图标映射
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  // 支出分类图标
  utensils: Utensils,
  'shopping-cart': ShoppingCart,
  'shopping-bag': ShoppingBag,
  home: Home,
  car: Car,
  gamepad2: Gamepad2,
  'gamepad-2': Gamepad2,
  heart: Heart,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'more-horizontal': MoreHorizontal,
  lightbulb: Lightbulb,
  smartphone: Smartphone,
  // 收入分类图标
  briefcase: Briefcase,
  'trending-up': TrendingUp,
  gift: Gift,
  wallet: Wallet,
  clock: Clock,
  receipt: Receipt,
  'plus-circle': PlusCircle,
  // 转账分类图标
  'arrow-right-left': ArrowRightLeft,
  'arrow-left-right': ArrowLeftRight,
  // 账户图标
  banknote: Banknote,
  'credit-card': CreditCard,
  'message-circle': MessageCircle,
};

// 类型对应的变体
const TYPE_VARIANTS: Record<TransactionType, 'expense' | 'income' | 'transfer'> = {
  expense: 'expense',
  income: 'income',
  transfer: 'transfer',
};

// 格式化日期显示 - 使用大写英文格式
function formatDateHeader(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(date, today)) {
    return 'TODAY';
  }
  if (isSameDay(date, yesterday)) {
    return 'YESTERDAY';
  }

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const weekDay = weekDays[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];

  return `${weekDay}, ${day} ${month}`;
}

// 格式化时间
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export interface TransactionListFeatureProps {
  filter?: import('@rich-dime/database').TransactionFilter;
  onTransactionPress?: (id: string) => void;
}

export function TransactionListFeature({
  filter,
  onTransactionPress,
}: TransactionListFeatureProps) {
  const {
    groups,
    isLoading,
    error,
    refresh,
    loadMore,
    pagination,
    removeTx,
  } = useTransactions(filter);
  const { categories } = useCategories();
  const { accounts } = useAccounts();


  // 构建分类映射
  const categoryMap = useMemo(() => {
    const map = new Map<string, { name: string; icon: string; color: string }>();
    for (const cat of categories) {
      map.set(cat.id, { name: cat.name, icon: cat.icon, color: cat.color });
    }
    return map;
  }, [categories]);

  // 构建账户映射
  const accountMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const acc of accounts) {
      map.set(acc.id, acc.name);
    }
    return map;
  }, [accounts]);

  // 获取分类图标
  const getCategoryIcon = useCallback((iconName: string): LucideIcon => {
    return CATEGORY_ICONS[iconName] ?? MoreHorizontal;
  }, []);

  // 格式化金额显示
  const formatAmountDisplay = useCallback((transaction: Transaction): string => {
    const amount = formatMoney(transaction.amount);
    switch (transaction.type) {
      case 'expense':
        return `-¥${amount}`;
      case 'income':
        return `+¥${amount}`;
      case 'transfer':
        return `¥${amount}`;
    }
  }, []);

  // 获取账户显示
  const getAccountDisplay = useCallback((transaction: Transaction): string | undefined => {
    if (transaction.type === 'transfer' && transaction.toAccountId) {
      const fromAccount = accountMap.get(transaction.accountId) ?? '未知';
      const toAccount = accountMap.get(transaction.toAccountId) ?? '未知';
      return `${fromAccount} → ${toAccount}`;
    }
    return accountMap.get(transaction.accountId);
  }, [accountMap]);

  // 计算日期组的总金额
  const calculateGroupTotal = useCallback((transactions: Transaction[]): string => {
    let total = 0;
    for (const t of transactions) {
      if (t.type === 'expense') {
        total -= t.amount;
      } else if (t.type === 'income') {
        total += t.amount;
      }
    }
    const formatted = formatMoney(Math.abs(total));
    return total < 0 ? `-¥${formatted}` : `+¥${formatted}`;
  }, []);

  // 处理滚动到底部加载更多
  const handleScroll = useCallback(({ nativeEvent }: { nativeEvent: { layoutMeasurement: { height: number }; contentOffset: { y: number }; contentSize: { height: number } } }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const paddingToBottom = 50;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      if (pagination.hasMore) {
        loadMore();
      }
    }
  }, [pagination.hasMore, loadMore]);

  // 处理长按删除
  const handleLongPress = useCallback((transaction: Transaction) => {
    const cat = categoryMap.get(transaction.categoryId);
    const categoryName = cat?.name ?? '未分类';
    const amount = formatAmountDisplay(transaction);

    Alert.alert(
      '删除交易',
      `确定要删除 ${categoryName} ${amount} 吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeTx(transaction.id);
            } catch (err: any) {
              Alert.alert('删除失败', err?.message ?? '请重试');
            }
          },
        },
      ]
    );
  }, [categoryMap, formatAmountDisplay, removeTx]);


  if (isLoading && groups.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        message={`加载失败: ${error.message}`}
        onRetry={refresh}
      />
    );
  }

  if (groups.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="暂无交易记录"
        description="点击下方按钮添加第一笔账单"
        centered
      />
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      onScroll={handleScroll}
      scrollEventThrottle={400}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refresh} />
      }
    >
      {groups.map((group) => {
        const category = categoryMap.get(group.transactions[0]?.categoryId);

        return (
          <View key={group.date}>
            <DateHeader
              date={formatDateHeader(group.dateTimestamp)}
              totalAmount={calculateGroupTotal(group.transactions)}
            />
            {group.transactions.map((transaction) => {
              const cat = categoryMap.get(transaction.categoryId);
              return (
                <TransactionItem
                  key={transaction.id}
                  icon={getCategoryIcon(cat?.icon ?? 'more-horizontal')}
                  categoryName={cat?.name ?? '未分类'}
                  note={transaction.note || formatTime(transaction.date)}
                  amount={formatAmountDisplay(transaction)}
                  account={getAccountDisplay(transaction)}
                  variant={TYPE_VARIANTS[transaction.type]}
                  onPress={() => onTransactionPress?.(transaction.id)}
                  onLongPress={() => handleLongPress(transaction)}
                  delayLongPress={300}
                />
              );
            })}
          </View>
        );
      })}
      {pagination.hasMore && (
        <View style={{ alignItems: 'center', paddingVertical: 16 }}>
          <ActivityIndicator size="small" />
        </View>
      )}

    </ScrollView>
  );
}
