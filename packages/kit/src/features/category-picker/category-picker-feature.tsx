import * as React from 'react';
import { View, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import {
  Icon,
  Text,
  CategoryItem,
  SegmentControl,
  SectionTitle,
  useThemeColors,
} from '@rich-dime/component';
import { useCategories } from '../../hooks/database';
import {
  X,
  ArrowLeftRight,
  Search,
  Utensils,
  Coffee,
  ShoppingCart,
  Car,
  Home,
  Shirt,
  Heart,
  Gamepad2,
  Gift,
  Phone,
  Briefcase,
  TrendingUp,
  Wallet,
  Banknote,
  Folder,
  MoreHorizontal,
  GraduationCap,
  Smartphone,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';

// Map icon string names to LucideIcon components
const ICON_MAP: Record<string, LucideIcon> = {
  utensils: Utensils,
  coffee: Coffee,
  'shopping-cart': ShoppingCart,
  car: Car,
  home: Home,
  shirt: Shirt,
  heart: Heart,
  gamepad2: Gamepad2,
  gift: Gift,
  phone: Phone,
  briefcase: Briefcase,
  'trending-up': TrendingUp,
  wallet: Wallet,
  banknote: Banknote,
  folder: Folder,
  'more-horizontal': MoreHorizontal,
  'graduation-cap': GraduationCap,
  smartphone: Smartphone,
  zap: Zap,
};

function getIconComponent(iconName: string): LucideIcon {
  return ICON_MAP[iconName] ?? Folder;
}

// Category type for external consumers
export interface Category {
  id: string;
  icon: LucideIcon;
  label: string;
  color?: string;
  bgColor?: string;
}

const CATEGORY_TYPES = [
  { value: 'expense', label: '支出' },
  { value: 'income', label: '收入' },
];

export interface CategoryPickerFeatureProps {
  type?: 'expense' | 'income';
  selectedCategoryId?: string;
  onClose?: () => void;
  onSelectCategory?: (category: Category) => void;
  onTypeChange?: (type: 'expense' | 'income') => void;
  onTransferPress?: () => void;
}

export function CategoryPickerFeature({
  type = 'expense',
  selectedCategoryId,
  onClose,
  onSelectCategory,
  onTypeChange,
  onTransferPress,
}: CategoryPickerFeatureProps) {
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentType, setCurrentType] = React.useState(type);

  const { expenseCategories, incomeCategories, isLoading } = useCategories();

  const dbCategories = currentType === 'expense' ? expenseCategories : incomeCategories;

  // Convert DB categories to display format
  const categories: Category[] = React.useMemo(
    () =>
      dbCategories.map((cat) => ({
        id: cat.id,
        icon: getIconComponent(cat.icon),
        label: cat.name,
        color: cat.color,
      })),
    [dbCategories]
  );

  const filteredCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTypeChange = (newType: string) => {
    setCurrentType(newType as 'expense' | 'income');
    onTypeChange?.(newType as 'expense' | 'income');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
        <Pressable onPress={onClose} style={{ padding: 8 }}>
          <Icon as={X} size={24} color={colors.foreground} />
        </Pressable>
        <SegmentControl
          options={CATEGORY_TYPES}
          value={currentType}
          onValueChange={handleTypeChange}
        />
        <Pressable onPress={onTransferPress} style={{ padding: 8 }}>
          <Icon as={ArrowLeftRight} size={24} color={colors.foreground} />
        </Pressable>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 9999, backgroundColor: colors.muted, paddingHorizontal: 16, paddingVertical: 8 }}>
          <Icon as={Search} size={16} color={colors.mutedForeground} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search categories"
            placeholderTextColor={colors.mutedForeground}
            style={{ flex: 1, backgroundColor: 'transparent', fontSize: 16, color: colors.foreground }}
          />
        </View>
      </View>

      {/* Categories Grid */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        <SectionTitle
          title={currentType === 'expense' ? 'EXPENSE CATEGORIES' : 'INCOME CATEGORIES'}
        />
        {isLoading ? (
          <View style={{ alignItems: 'center', paddingVertical: 32 }}>
            <ActivityIndicator size="small" />
          </View>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, paddingVertical: 16 }}>
            {filteredCategories.map((category) => (
              <View key={category.id} style={{ width: 72 }}>
                <CategoryItem
                  icon={category.icon}
                  label={category.label}
                  selected={category.id === selectedCategoryId}
                  onPress={() => onSelectCategory?.(category)}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Export types for external use
export type { Category as CategoryPickerCategory };
