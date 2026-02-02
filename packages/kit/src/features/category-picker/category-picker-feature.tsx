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
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="h-14 flex-row items-center justify-between px-4">
        <Pressable onPress={onClose} className="p-2">
          <Icon as={X} className="size-6 text-foreground" />
        </Pressable>
        <SegmentControl
          options={CATEGORY_TYPES}
          value={currentType}
          onValueChange={handleTypeChange}
        />
        <Pressable onPress={onTransferPress} className="p-2">
          <Icon as={ArrowLeftRight} className="size-6 text-foreground" />
        </Pressable>
      </View>

      {/* Search */}
      <View className="px-4 py-2">
        <View className="flex-row items-center gap-2 rounded-full bg-muted px-4 py-2">
          <Icon as={Search} className="size-4 text-muted-foreground" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search categories"
            placeholderTextColor={colors.mutedForeground}
            className="flex-1 bg-transparent text-base text-foreground"
          />
        </View>
      </View>

      {/* Categories Grid */}
      <ScrollView className="flex-1 px-4">
        <SectionTitle
          title={currentType === 'expense' ? 'EXPENSE CATEGORIES' : 'INCOME CATEGORIES'}
        />
        {isLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator size="small" />
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-4 py-4">
            {filteredCategories.map((category) => (
              <View key={category.id} className="w-[72px]">
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
