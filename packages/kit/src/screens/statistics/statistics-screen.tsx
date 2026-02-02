import * as React from 'react';
import { View, ScrollView, ActivityIndicator, PanResponder, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus';
import { queryKeys } from '../../hooks/database/query-keys';
import { useDatabaseContext } from '../../providers/database-provider';
import { statisticsTimePeriodAtom, statisticsPeriodOffsetAtom } from '../../store/atoms';
import Svg, { Circle } from 'react-native-svg';
import {
  Text,
  SegmentControl,
  TransactionItem,
  EmptyState,
  ScreenHeader,
  LoadingState,
  Row,
  Stack,
  YStack,
  Section,
  useThemeColors,
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
import {
  formatMoney,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addWeeks,
  addMonths,
  addYears,
  now,
  getPeriodStatistics,
} from '@rich-dime/database';
import type { DateRange, CategoryStatistics, PeriodStatistics } from '@rich-dime/database';
import {
  useSummary,
  useCategoryStatistics,
  useExpenseRanking,
  useCategories,
  useAccounts,
} from '../../hooks/database';

// ============ Constants ============

const TIME_TABS = [
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
  { value: 'year', label: '年' },
] as const;

type TimePeriod = 'week' | 'month' | 'year';

const CATEGORY_COLORS: Record<string, string> = {
  '餐饮': '#F97316',
  '购物': '#3B82F6',
  '交通': '#22C55E',
  '娱乐': '#A855F7',
  '医疗': '#EF4444',
  '通讯': '#06B6D4',
  '美容': '#EC4899',
  '教育': '#F59E0B',
  '宠物': '#8B5CF6',
  '居家': '#14B8A6',
  '礼金': '#64748B',
  '其他': '#78716C',
};

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

const WEEK_DAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

const MONTH_X_LABELS = ['1', '8', '15', '22', '31'];

// ============ Helper Functions ============

function getDateRange(period: TimePeriod, offset: number): DateRange {
  const currentTime = now();
  switch (period) {
    case 'week': {
      const base = addWeeks(currentTime, offset);
      return { start: startOfWeek(base), end: endOfWeek(base) };
    }
    case 'month': {
      const base = addMonths(currentTime, offset);
      return { start: startOfMonth(base), end: endOfMonth(base) };
    }
    case 'year': {
      const base = addYears(currentTime, offset);
      return { start: startOfYear(base), end: endOfYear(base) };
    }
  }
}

function getPeriodLabel(period: TimePeriod, offset: number): { expense: string; balance: string } {
  if (offset === 0) {
    switch (period) {
      case 'week':
        return { expense: '本周支出', balance: '本周结余' };
      case 'month':
        return { expense: '本月支出', balance: '本月结余' };
      case 'year':
        return { expense: '本年支出', balance: '本年结余' };
    }
  }
  return { expense: '总支出', balance: '净结余' };
}

function getHeaderTitle(period: TimePeriod, dateRange: DateRange): string {
  const d = new Date(dateRange.start);
  switch (period) {
    case 'week':
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    case 'month':
      return `${d.getFullYear()}年${d.getMonth() + 1}月`;
    case 'year':
      return `${d.getFullYear()}年`;
  }
}

interface ChartDataItem {
  label: string;
  value: number;
}

function buildChartData(period: TimePeriod, periodStats: PeriodStatistics[], dateRange: DateRange): ChartDataItem[] {
  switch (period) {
    case 'week': {
      // 7 days, Monday-Sunday
      const data: ChartDataItem[] = WEEK_DAY_LABELS.map((label) => ({ label, value: 0 }));
      for (const stat of periodStats) {
        const d = new Date(stat.periodStart);
        // getDay: 0=Sun, convert to Mon=0..Sun=6
        const dayIndex = (d.getDay() + 6) % 7;
        if (dayIndex >= 0 && dayIndex < 7) {
          data[dayIndex] = { label: data[dayIndex].label, value: stat.expense };
        }
      }
      return data;
    }
    case 'month': {
      // Days in the target month (derived from dateRange)
      const d = new Date(dateRange.start);
      const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      const data: ChartDataItem[] = Array.from({ length: daysInMonth }, (_, i) => ({
        label: String(i + 1),
        value: 0,
      }));
      for (const stat of periodStats) {
        const day = new Date(stat.periodStart).getDate();
        if (day >= 1 && day <= daysInMonth) {
          data[day - 1] = { label: data[day - 1].label, value: stat.expense };
        }
      }
      return data;
    }
    case 'year': {
      const data: ChartDataItem[] = Array.from({ length: 12 }, (_, i) => ({
        label: String(i + 1),
        value: 0,
      }));
      for (const stat of periodStats) {
        const month = new Date(stat.periodStart).getMonth();
        if (month >= 0 && month < 12) {
          data[month] = { label: data[month].label, value: stat.expense };
        }
      }
      return data;
    }
  }
}

function getChartBarStyle(period: TimePeriod) {
  switch (period) {
    case 'week':
      return { width: 32, borderRadius: 4, gap: 8 };
    case 'month':
      return { width: 8, borderRadius: 2, gap: 2 };
    case 'year':
      return { width: 20, borderRadius: 4, gap: 4 };
  }
}

function getCategoryColor(categoryName: string): string {
  return CATEGORY_COLORS[categoryName] ?? '#78716C';
}

function getCategoryIcon(iconName: string): LucideIcon {
  return CATEGORY_ICONS[iconName] ?? MoreHorizontal;
}

// ============ Sub-components ============

interface BarChartProps {
  period: TimePeriod;
  data: ChartDataItem[];
  activeIndex: number;
  activeColor: string;
  inactiveColor: string;
}

function BarChart({ period, data, activeIndex, activeColor, inactiveColor }: BarChartProps) {
  const colors = useThemeColors();
  const barStyle = getChartBarStyle(period);
  const maxValue = Math.max(...data.map((d) => d.value), 0.01);

  // For month view, only show specific x labels
  const showAllLabels = period !== 'month';

  return (
    <View style={{ gap: 8, width: '100%' }}>
      {/* Bars */}
      <View
        style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 120, paddingHorizontal: 8, gap: barStyle.gap }}
      >
        {data.map((item, index) => {
          const heightPercent = (item.value / maxValue) * 100;
          const isActive = index === activeIndex;
          return (
            <View
              key={`bar-${index}`}
              style={{
                width: barStyle.width,
                height: `${Math.max(heightPercent, 2)}%`,
                borderRadius: barStyle.borderRadius,
                backgroundColor: isActive ? activeColor : inactiveColor,
              }}
            />
          );
        })}
      </View>

      {/* X-axis labels */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, width: '100%' }}>
        {showAllLabels
          ? data.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <View key={`label-${index}`} style={{ width: barStyle.width, alignItems: 'center' }}>
                  <Text
                    style={{ fontSize: 11, fontWeight: isActive ? '500' : '400' }}
                    color={isActive ? colors.foreground : colors.mutedForeground}
                  >
                    {item.label}
                  </Text>
                </View>
              );
            })
          : MONTH_X_LABELS.map((label) => {
              const index = parseInt(label, 10) - 1;
              const isActive = index === activeIndex;
              return (
                <Text
                  key={`mlabel-${label}`}
                  style={{ fontSize: 11, fontWeight: isActive ? '500' : '400' }}
                  color={isActive ? colors.foreground : colors.mutedForeground}
                >
                  {label}
                </Text>
              );
            })}
      </View>
    </View>
  );
}

interface DonutSegment {
  color: string;
  percentage: number;
  categoryId: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  totalAmount: number;
  selectedCategoryId: string | null;
  selectedAmount: number | null;
  selectedName: string | null;
  onPress: () => void;
}

const DONUT_SIZE = 96;
const DONUT_RADIUS = 38;
const DONUT_STROKE = 12;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

function DonutChart({ segments, totalAmount, selectedCategoryId, selectedAmount, selectedName, onPress }: DonutChartProps) {
  const colors = useThemeColors();
  let cumulativeOffset = 0;

  return (
    <Pressable onPress={onPress}>
      <View style={{ width: DONUT_SIZE, height: DONUT_SIZE, position: 'relative' }}>
        <Svg width={DONUT_SIZE} height={DONUT_SIZE} viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}>
          {segments.map((seg, i) => {
            const dashLength = (seg.percentage / 100) * DONUT_CIRCUMFERENCE;
            const dashGap = DONUT_CIRCUMFERENCE - dashLength;
            // Rotate so arcs start from top (-90deg), then offset by cumulative
            const rotation = -90 + (cumulativeOffset / 100) * 360;
            cumulativeOffset += seg.percentage;

            const isSelected = selectedCategoryId === seg.categoryId;
            const dimmed = selectedCategoryId != null && !isSelected;

            return (
              <Circle
                key={seg.categoryId}
                cx={DONUT_SIZE / 2}
                cy={DONUT_SIZE / 2}
                r={DONUT_RADIUS}
                fill="none"
                stroke={seg.color}
                strokeWidth={DONUT_STROKE}
                strokeDasharray={`${dashLength} ${dashGap}`}
                strokeLinecap="butt"
                rotation={rotation}
                origin={`${DONUT_SIZE / 2}, ${DONUT_SIZE / 2}`}
                opacity={dimmed ? 0.25 : 1}
              />
            );
          })}
        </Svg>
        <YStack
          ai="center"
          jc="center"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents="none"
        >
          <Text style={{ fontSize: 11, fontWeight: '600' }} color={colors.foreground}>
            ¥{formatMoney(selectedAmount ?? totalAmount)}
          </Text>
          <Text style={{ fontSize: 9 }} color={colors.mutedForeground}>
            {selectedName ?? '总支出'}
          </Text>
        </YStack>
      </View>
    </Pressable>
  );
}

interface CategoryFilterItemProps {
  categoryId: string;
  name: string;
  percentage: number;
  color: string;
  isSelected: boolean;
  onPress: (categoryId: string) => void;
}

// Category item with colored block on top, name and percentage below (horizontal scroll layout)
function CategoryFilterItem({ categoryId, name, percentage, color, isSelected, onPress }: CategoryFilterItemProps) {
  const colors = useThemeColors();
  return (
    <Pressable onPress={() => onPress(categoryId)}>
      <View
        style={[
          {
            alignItems: 'center',
            gap: 2,
            width: 52,
            opacity: isSelected ? 1 : 0.7,
          },
        ]}
      >
        {/* Colored block */}
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            backgroundColor: color,
          }}
        />
        {/* Category name */}
        <Text
          style={{ fontSize: 10 }}
          color={colors.mutedForeground}
          numberOfLines={1}
        >
          {name}
        </Text>
        {/* Percentage */}
        <Text style={{ fontSize: 10, fontWeight: '500' }} color={colors.foreground}>
          {Math.round(percentage)}%
        </Text>
      </View>
    </Pressable>
  );
}

// ============ Main Component ============

export interface StatisticsScreenProps {
  onCategoryPress?: (categoryId: string) => void;
  onTransactionPress?: (transactionId: string) => void;
  onViewAllTransactions?: () => void;
}

export function StatisticsScreen({
  onCategoryPress,
  onTransactionPress,
}: StatisticsScreenProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [timePeriod, setTimePeriod] = useAtom(statisticsTimePeriodAtom);
  const [periodOffset, setPeriodOffset] = useAtom(statisticsPeriodOffsetAtom);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);

  // Reset offset and category filter when switching period tabs
  const handleTimePeriodChange = React.useCallback((v: string) => {
    setTimePeriod(v as TimePeriod);
    setPeriodOffset(0);
    setSelectedCategoryId(null);
  }, []);

  // Reset category filter when period offset changes
  React.useEffect(() => {
    setSelectedCategoryId(null);
  }, [periodOffset]);

  // Date range derived from period + offset
  const dateRange = React.useMemo(() => getDateRange(timePeriod, periodOffset), [timePeriod, periodOffset]);

  // Summary hook (single, driven by dateRange)
  const { summary, isLoading: summaryLoading } = useSummary(dateRange);

  // Swipe gesture for period navigation
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          // Swipe right → go to past
          setPeriodOffset(v => v - 1);
        } else if (gestureState.dx < -50) {
          // Swipe left → go to future (cap at 0)
          setPeriodOffset(v => Math.min(0, v + 1));
        }
      },
    })
  ).current;

  // Category statistics
  const {
    statistics: categoryStats,
    totalAmount: categoryTotal,
    isLoading: categoryLoading,
  } = useCategoryStatistics('expense', dateRange);

  // Expense ranking for transaction list
  const {
    ranking: topExpenses,
    isLoading: rankingLoading,
  } = useExpenseRanking(20, dateRange);

  // Categories and accounts for transaction display
  const { categories } = useCategories();
  const { accounts } = useAccounts();

  // Fetch chart data via useQuery
  const { isInitialized } = useDatabaseContext();
  const { data: chartData = [] } = useQuery({
    queryKey: ['statistics', 'chartData', timePeriod, dateRange],
    queryFn: async () => {
      const granularity = timePeriod === 'year' ? 'month' : 'day';
      const stats = await getPeriodStatistics(granularity as 'day' | 'month', dateRange);
      return buildChartData(timePeriod, stats, dateRange);
    },
    enabled: isInitialized,
  });

  // Refresh all statistics when screen regains focus (skip initial mount)
  useRefetchOnFocus([queryKeys.statistics.all]);

  // Build lookup maps
  const categoryMap = React.useMemo(() => {
    const map = new Map<string, { name: string; icon: string; color: string }>();
    for (const cat of categories) {
      map.set(cat.id, { name: cat.name, icon: cat.icon, color: cat.color });
    }
    return map;
  }, [categories]);

  const accountMap = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const acc of accounts) {
      map.set(acc.id, acc.name);
    }
    return map;
  }, [accounts]);

  const labels = getPeriodLabel(timePeriod, periodOffset);
  const headerTitle = getHeaderTitle(timePeriod, dateRange);

  // Active bar index (use the highest value bar as "active")
  const activeBarIndex = React.useMemo(() => {
    let maxIdx = 0;
    let maxVal = 0;
    chartData.forEach((d, i) => {
      if (d.value > maxVal) {
        maxVal = d.value;
        maxIdx = i;
      }
    });
    return maxIdx;
  }, [chartData]);

  // Build donut chart segments
  const donutSegments = React.useMemo<DonutSegment[]>(() => {
    if (categoryTotal <= 0) return [];
    return categoryStats.map((stat) => ({
      color: getCategoryColor(stat.categoryName),
      percentage: (stat.totalAmount / categoryTotal) * 100,
      categoryId: stat.categoryId,
    }));
  }, [categoryStats, categoryTotal]);

  // Selected category info for donut center text
  const selectedCategoryStat = React.useMemo(() => {
    if (!selectedCategoryId) return null;
    return categoryStats.find((s) => s.categoryId === selectedCategoryId) ?? null;
  }, [categoryStats, selectedCategoryId]);

  // Filter expenses by selected category
  const filteredExpenses = React.useMemo(() => {
    if (!selectedCategoryId) return topExpenses;
    return topExpenses.filter((item) => item.categoryId === selectedCategoryId);
  }, [topExpenses, selectedCategoryId]);

  // Loading state
  if (summaryLoading && !summary) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
        <ScreenHeader
          title={headerTitle}
          right={
            <SegmentControl
              options={[...TIME_TABS]}
              value={timePeriod}
              onValueChange={handleTimePeriodChange}
            />
          }
        />
        <LoadingState />
      </View>
    );
  }

  const totalExpense = summary?.totalExpense ?? 0;
  const netAmount = summary?.netAmount ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      {/* Header */}
      <ScreenHeader
        title={headerTitle}
        right={
          <SegmentControl
            options={[...TIME_TABS]}
            value={timePeriod}
            onValueChange={handleTimePeriodChange}
          />
        }
      />

      {/* Content - swipeable */}
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 16 }}>
          {/* Overview Row */}
          <View style={{ paddingHorizontal: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {/* Left - Expense */}
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 11 }} color={colors.mutedForeground}>
                  {labels.expense}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'baseline' }}>
                  <Text style={{ fontSize: 24, fontWeight: '700' }} color={colors.foreground}>
                    ¥{formatMoney(totalExpense)}
                  </Text>
                </View>
              </View>
              {/* Right - Balance */}
              <View style={{ gap: 4, alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 11 }} color={colors.mutedForeground}>
                  {labels.balance}
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '600' }} color={colors.foreground}>
                  ¥{formatMoney(netAmount)}
                </Text>
              </View>
            </View>
          </View>

          {/* Chart Section */}
          <View style={{ gap: 12, paddingHorizontal: 16 }}>
            {/* Chart Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13, fontWeight: '600' }} color={colors.foreground}>
                支出趋势
              </Text>
              <Text style={{ fontSize: 11 }} color={colors.mutedForeground}>
                {headerTitle}
              </Text>
            </View>
            {/* Bar Chart */}
            <BarChart
              period={timePeriod}
              data={chartData}
              activeIndex={activeBarIndex}
              activeColor={colors.foreground}
              inactiveColor={colors.muted}
            />
          </View>

          {/* Category Section */}
          <View style={{ gap: 12, paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600' }} color={colors.foreground}>
              支出分类
            </Text>
            {categoryLoading ? (
              <ActivityIndicator size="small" />
            ) : categoryStats.length === 0 ? (
              <Text style={{ fontSize: 11 }} color={colors.mutedForeground}>
                暂无分类数据
              </Text>
            ) : (
              <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
                {/* Donut Chart */}
                <DonutChart
                  segments={donutSegments}
                  totalAmount={categoryTotal}
                  selectedCategoryId={selectedCategoryId}
                  selectedAmount={selectedCategoryStat?.totalAmount ?? null}
                  selectedName={selectedCategoryStat?.categoryName ?? null}
                  onPress={() => setSelectedCategoryId(null)}
                />
                {/* Category Filter List - Horizontal scroll with colored blocks */}
                <ScrollView
                  style={{ flex: 1 }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  nestedScrollEnabled
                >
                  <Row gap={2}>
                    {categoryStats.map((stat) => (
                      <CategoryFilterItem
                        key={stat.categoryId}
                        categoryId={stat.categoryId}
                        name={stat.categoryName}
                        percentage={categoryTotal > 0 ? (stat.totalAmount / categoryTotal) * 100 : 0}
                        color={getCategoryColor(stat.categoryName)}
                        isSelected={selectedCategoryId === stat.categoryId}
                        onPress={(id) =>
                          setSelectedCategoryId(selectedCategoryId === id ? null : id)
                        }
                      />
                    ))}
                  </Row>
                </ScrollView>
              </View>
            )}
          </View>

          {/* Transaction List Section */}
          <View style={{ gap: 16, paddingHorizontal: 16, paddingBottom: 32 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13, fontWeight: '600' }} color={colors.foreground}>
                {selectedCategoryStat ? `${selectedCategoryStat.categoryName}明细` : '交易明细'}
              </Text>
              <Text style={{ fontSize: 11 }} color={colors.mutedForeground}>
                按金额排序
              </Text>
            </View>
            {/* Transaction Items */}
            {rankingLoading ? (
              <ActivityIndicator size="small" />
            ) : filteredExpenses.length === 0 ? (
              <EmptyState
                icon={Receipt}
                title="暂无交易记录"
                description={selectedCategoryId ? '该分类下没有支出记录' : '当前时间段内没有支出记录'}
              />
            ) : (
              <View>
                {filteredExpenses.map((item) => {
                  const cat = categoryMap.get(item.categoryId);
                  return (
                    <TransactionItem
                      key={item.categoryId}
                      icon={getCategoryIcon(cat?.icon ?? 'more-horizontal')}
                      categoryName={item.categoryName}
                      note={`${item.transactionCount}笔`}
                      amount={`-¥${formatMoney(item.totalAmount)}`}
                      variant="expense"
                      onPress={() => onTransactionPress?.(item.categoryId)}
                    />
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      </View>
    </View>
  );
}
