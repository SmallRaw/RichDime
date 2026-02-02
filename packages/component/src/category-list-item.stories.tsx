import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { CategoryListItem } from './category-list-item';

const meta = {
  title: 'Bookkeeping/CategoryListItem',
  component: CategoryListItem,
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#ffffff', width: 358 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    emoji: { control: 'text' },
    name: { control: 'text' },
    color: { control: 'color' },
    showDragHandle: { control: 'boolean' },
  },
} satisfies Meta<typeof CategoryListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    emoji: '🍽️',
    name: '餐饮',
    color: '#3b82f6',
  },
};

export const WithDragHandle: Story = {
  args: {
    emoji: '🍽️',
    name: '餐饮',
    color: '#3b82f6',
    showDragHandle: true,
  },
};

export const DifferentColors: Story = {
  render: () => (
    <View style={{ width: 358 }}>
      <CategoryListItem emoji="🍽️" name="餐饮" color="#3b82f6" />
      <CategoryListItem emoji="🛒" name="购物" color="#22c55e" />
      <CategoryListItem emoji="🚗" name="交通" color="#f97316" />
      <CategoryListItem emoji="🏠" name="住房" color="#8b5cf6" />
      <CategoryListItem emoji="🎮" name="娱乐" color="#ec4899" />
    </View>
  ),
};

export const SortMode: Story = {
  render: () => (
    <View style={{ width: 358 }}>
      <CategoryListItem emoji="🍽️" name="餐饮" color="#3b82f6" showDragHandle />
      <CategoryListItem emoji="🛒" name="购物" color="#22c55e" showDragHandle />
      <CategoryListItem emoji="🚗" name="交通" color="#f97316" showDragHandle />
      <CategoryListItem emoji="🏠" name="住房" color="#8b5cf6" showDragHandle />
    </View>
  ),
};

export const IncomeCategories: Story = {
  render: () => (
    <View style={{ width: 358 }}>
      <CategoryListItem emoji="💼" name="工资" color="#16a34a" />
      <CategoryListItem emoji="💰" name="奖金" color="#059669" />
      <CategoryListItem emoji="📈" name="投资" color="#10b981" />
      <CategoryListItem emoji="🎁" name="礼金" color="#14b8a6" />
    </View>
  ),
};
