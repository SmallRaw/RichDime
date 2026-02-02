import { useState, useCallback, useMemo } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus';
import { queryKeys } from '../../hooks/database/query-keys';
import {
  Icon,
  Text,
  SegmentControl,
  SectionTitle,
  EmptyState,
  CategoryListItem,
  CategorySuggestedItem,
  useThemeColors,
} from '@rich-dime/component';
import {
  ChevronDown,
  ArrowUpDown,
  Plus,
  Wallet,
} from 'lucide-react-native';
import { useCategories } from '../../hooks/database';
import type { Category } from '@rich-dime/database';

const TAB_OPTIONS = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
];

// Category emoji mappings (shared with add-transaction)
const CATEGORY_EMOJIS: Record<string, string> = {
  餐饮: '\u{1F37D}\u{FE0F}',
  零食: '\u{1F354}',
  电器数码: '\u{1F4BB}',
  交通出行: '\u{1F684}',
  休闲娱乐: '\u{1F3AE}',
  日用百货: '\u{1F6D2}',
  网费话费: '\u{1F4F1}',
  医疗健康: '\u{2764}\u{FE0F}',
  汽车加油: '\u{26FD}',
  学习: '\u{1F4DA}',
  住房: '\u{1F3E0}',
  衣服: '\u{1F454}',
  咖啡: '\u{2615}',
  购物: '\u{1F6D2}',
  交通: '\u{1F684}',
  服饰: '\u{1F454}',
  医疗: '\u{2764}\u{FE0F}',
  娱乐: '\u{1F3AE}',
  礼物: '\u{1F381}',
  通讯: '\u{1F4F1}',
  工资: '\u{1F4BC}',
  奖金: '\u{1F4C8}',
  投资: '\u{1F4B0}',
  其他: '\u{1F4B5}',
  美容: '\u{1F484}',
};

// Suggested categories that users might want to add
const SUGGESTED_EXPENSE_CATEGORIES = [
  'Transport',
  'Subscriptions',
  'Groceries',
  'Family',
  'Utilities',
  'Fashion',
  'Healthcare',
  'Pets',
  'Sneakers',
  'Gifts',
];

const SUGGESTED_INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Rental Income',
  'Side Hustle',
  'Dividends',
  'Gifts',
  'Refunds',
  'Bonus',
  'Interest',
];

// Available colors for suggested categories (same as category-form)
const AVAILABLE_COLORS = [
  '#3b82f6',
  '#ef4444',
  '#f97316',
  '#a855f7',
  '#06b6d4',
  '#14b8a6',
  '#f59e0b',
  '#ec4899',
  '#78716c',
  '#6366f1',
  '#8b5cf6',
  '#f472b6',
  '#22c55e',
  '#64748b',
];

export interface EditCategoriesScreenProps {
  onClose?: () => void;
  onAddCategory?: () => void;
  onEditCategory?: (category: Category) => void;
}

export function EditCategoriesScreen({
  onClose,
  onAddCategory,
  onEditCategory,
}: EditCategoriesScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [isSortMode, setIsSortMode] = useState(false);

  const { expenseCategories, incomeCategories, addCategory } = useCategories();

  // Refresh categories when screen regains focus (skip initial mount)
  useRefetchOnFocus([queryKeys.categories.all]);

  const currentCategories = useMemo(() => {
    return activeTab === 'expense' ? expenseCategories : incomeCategories;
  }, [activeTab, expenseCategories, incomeCategories]);

  // Filter suggested categories: only show ones not already added
  const suggestedCategories = useMemo(() => {
    const existingNames = new Set(
      currentCategories.map((c) => c.name.toLowerCase())
    );
    const suggestions =
      activeTab === 'expense'
        ? SUGGESTED_EXPENSE_CATEGORIES
        : SUGGESTED_INCOME_CATEGORIES;
    return suggestions.filter((name) => !existingNames.has(name.toLowerCase()));
  }, [activeTab, currentCategories]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as 'expense' | 'income');
    setIsSortMode(false);
  }, []);

  const handleToggleSort = useCallback(() => {
    setIsSortMode((prev) => !prev);
  }, []);

  const handleCategoryPress = useCallback(
    (category: Category) => {
      if (!isSortMode) {
        onEditCategory?.(category);
      }
    },
    [isSortMode, onEditCategory]
  );

  const handleAddSuggested = useCallback(
    async (name: string) => {
      const randomColor =
        AVAILABLE_COLORS[Math.floor(Math.random() * AVAILABLE_COLORS.length)];
      await addCategory({
        name,
        type: activeTab,
        icon: '📁',
        color: randomColor,
      });
    },
    [activeTab, addCategory]
  );

  const sectionTitle =
    activeTab === 'expense' ? 'EXPENSE CATEGORIES' : 'INCOME CATEGORIES';
  const isEmpty = currentCategories.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
      {/* Drag Indicator */}
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
        <View style={{ height: 4, width: 36, borderRadius: 9999, backgroundColor: colors.border }} />
      </View>

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
        <Pressable
          onPress={onClose}
          style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon as={ChevronDown} size={24} color={colors.foreground} />
        </Pressable>
        <Text variant="title">Categories</Text>
        <Pressable
          onPress={handleToggleSort}
          style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon
            as={ArrowUpDown}
            size={22}
            color={colors.foreground}
          />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }}>
        <SectionTitle title={sectionTitle} />

        {isEmpty ? (
          /* Empty State */
          <View style={{ marginHorizontal: 16, alignItems: 'center', gap: 12, borderRadius: 12, backgroundColor: colors.muted, paddingHorizontal: 16, paddingVertical: 32 }}>
            <View style={{ height: 48, width: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: colors.background }}>
              <Icon
                as={Wallet}
                size={28}
                color={colors.mutedForeground}
              />
            </View>
            <Text variant="caption" style={{ textAlign: 'center' }}>
              No {activeTab} categories found, click the 'New' button to add
              some
            </Text>
          </View>
        ) : (
          /* Category List */
          <View>
            {currentCategories.map((category) => {
              // Support both emoji characters and legacy lucide icon names
              // Check if icon is a real emoji (not alphanumeric lucide icon name)
              const isEmoji =
                category.icon &&
                !/^[a-zA-Z0-9-]+$/.test(category.icon);
              const emoji = isEmoji
                ? category.icon
                : CATEGORY_EMOJIS[category.name] || '📁';
              return (
                <CategoryListItem
                  key={category.id}
                  emoji={emoji}
                  name={category.name}
                  color={category.color}
                  showDragHandle={isSortMode}
                  onPress={() => handleCategoryPress(category)}
                />
              );
            })}
          </View>
        )}

        {/* Spacer */}
        <View style={{ height: 16, backgroundColor: colors.muted }} />

        {/* Suggested Section */}
        {suggestedCategories.length > 0 && (
          <>
            <SectionTitle title="SUGGESTED" />
            <View>
              {suggestedCategories.map((name) => (
                <CategorySuggestedItem
                  key={name}
                  name={name}
                  onAdd={() => handleAddSuggested(name)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer */}
      <View
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 16, paddingVertical: 12, paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <SegmentControl
          options={TAB_OPTIONS}
          value={activeTab}
          onValueChange={handleTabChange}
        />
        <Pressable
          onPress={onAddCategory}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 9999, backgroundColor: colors.foreground, paddingHorizontal: 16, paddingVertical: 8 }}
        >
          <Icon
            as={Plus}
            size={16}
            color={colors.background}
          />
          <Text variant="labelMedium" color={colors.background}>
            New
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
