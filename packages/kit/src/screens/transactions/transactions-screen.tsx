import { useState, useMemo, useCallback, useRef } from 'react';
import { View, Pressable, TextInput, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAtom } from 'jotai';
import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus';
import { queryKeys } from '../../hooks/database/query-keys';
import { transactionsPeriodAtom } from '../../store/atoms';
import { Icon, SummarySection, Text, useThemeColors } from '@rich-dime/component';
import { Search, X, SlidersHorizontal, Settings, BookOpen, Sun, Moon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import {
  TransactionListFeature,
} from '../../features/transactions';
import { useSummary } from '../../hooks/database';
import { useTheme } from '../../hooks/use-theme';
import {
  formatMoney,
  now,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from '@rich-dime/database';
import type { TransactionFilter, DateRange } from '@rich-dime/database';

const PERIODS = ['week', 'month', 'year'] as const;
type Period = (typeof PERIODS)[number];

const PERIOD_LABELS: Record<Period, string> = {
  week: 'this week',
  month: 'this month',
  year: 'this year',
};

function getDateRange(period: Period): DateRange {
  const current = now();
  switch (period) {
    case 'week':
      return { start: startOfWeek(current), end: endOfWeek(current) };
    case 'month':
      return { start: startOfMonth(current), end: endOfMonth(current) };
    case 'year':
      return { start: startOfYear(current), end: endOfYear(current) };
  }
}

export interface TransactionsScreenProps {
  onTransactionPress?: (id: string) => void;
}

export function TransactionsScreen({
  onTransactionPress,
}: TransactionsScreenProps) {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useAtom(transactionsPeriodAtom);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  const dateRange = useMemo(() => getDateRange(period), [period]);

  const { summary } = useSummary(dateRange);

  // Refresh statistics when screen regains focus (skip initial mount)
  useRefetchOnFocus([queryKeys.statistics.all]);

  const totalAmount = summary ? formatMoney(summary.totalExpense) : '0.00';

  const filter = useMemo<TransactionFilter>(() => {
    const f: TransactionFilter = { dateRange };
    if (searchText.trim()) {
      f.searchText = searchText.trim();
    }
    return f;
  }, [dateRange, searchText]);

  const handlePeriodPress = useCallback(() => {
    setPeriod((prev) => {
      const idx = PERIODS.indexOf(prev);
      return PERIODS[(idx + 1) % PERIODS.length];
    });
  }, []);

  const handleSearchOpen = useCallback(() => {
    setIsSearching(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  }, []);

  const handleSearchClose = useCallback(() => {
    setIsSearching(false);
    setSearchText('');
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      {/* Header */}
      {isSearching ? (
        <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
          <TextInput
            style={{ flex: 1, fontSize: 16, color: colors.foreground }}
            placeholder="搜索交易记录..."
            placeholderTextColor={colors.mutedForeground}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
          <Pressable onPress={handleSearchClose} style={{ padding: 8 }}>
            <Icon as={X} size={24} color={colors.foreground} />
          </Pressable>
        </View>
      ) : (
        <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
          <Pressable onPress={handleSearchOpen} style={{ padding: 8 }}>
            <Icon as={Search} size={24} color={colors.foreground} />
          </Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable style={{ padding: 8 }}>
              <Icon as={SlidersHorizontal} size={24} color={colors.foreground} />
            </Pressable>
            <Pressable style={{ padding: 8 }} onPress={() => setShowSettingsMenu(true)}>
              <Icon as={Settings} size={24} color={colors.foreground} />
            </Pressable>
          </View>
        </View>
      )}

      {/* Summary Section */}
      {!isSearching && (
        <SummarySection
          period={PERIOD_LABELS[period]}
          totalAmount={totalAmount}
          currencySymbol="¥"
          totalLabel="Spent"
          onPeriodPress={handlePeriodPress}
        />
      )}

      {/* Transaction List */}
      <TransactionListFeature
        filter={filter}
        onTransactionPress={onTransactionPress}
      />

      {/* Settings Menu Modal */}
      <Modal
        visible={showSettingsMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettingsMenu(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => setShowSettingsMenu(false)}
        >
          <View
            style={{
              position: 'absolute',
              right: 16,
              top: insets.top + 56,
              backgroundColor: colors.card,
              borderRadius: 12,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {/* Theme Toggle */}
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}
              onPress={() => {
                toggleTheme();
                setShowSettingsMenu(false);
              }}
            >
              <Icon
                as={colors.isDark ? Sun : Moon}
                size={20}
                color={colors.foreground}
                style={{ marginRight: 12 }}
              />
              <Text color={colors.foreground}>
                {colors.isDark ? '浅色模式' : '深色模式'}
              </Text>
            </Pressable>

            {/* Storybook - Only in DEV */}
            {__DEV__ && (
              <Pressable
                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border }}
                onPress={() => {
                  setShowSettingsMenu(false);
                  router.push('/storybook');
                }}
              >
                <Icon as={BookOpen} size={20} color={colors.foreground} style={{ marginRight: 12 }} />
                <Text color={colors.foreground}>Storybook</Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
