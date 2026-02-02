import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Utensils, Briefcase, ShoppingBag, Car, Coffee, Gift } from 'lucide-react-native';
import { CategoryItem, CategoryChip } from './category-item';

const meta = {
  title: 'Bookkeeping/CategoryItem',
  component: CategoryItem,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: '#fafafa' }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    label: { control: 'text' },
    selected: { control: 'boolean' },
  },
} satisfies Meta<typeof CategoryItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: Utensils,
    label: 'Dining',
    selected: false,
    iconContainerClassName: 'bg-expense-muted',
    iconClassName: 'text-expense',
  },
};

export const Selected: Story = {
  args: {
    icon: Utensils,
    label: 'Dining',
    selected: true,
    iconContainerClassName: 'bg-expense-muted border-2 border-expense',
    iconClassName: 'text-expense',
  },
};

export const IncomeCategory: Story = {
  args: {
    icon: Briefcase,
    label: 'Salary',
    selected: false,
    iconContainerClassName: 'bg-income-muted',
    iconClassName: 'text-income',
  },
};

export const CategoryGrid: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
      <CategoryItem
        icon={Utensils}
        label="Dining"
        selected={true}
        iconContainerClassName="bg-expense-muted border-2 border-expense"
        iconClassName="text-expense"
      />
      <CategoryItem
        icon={ShoppingBag}
        label="Shopping"
        iconContainerClassName="bg-expense-muted"
        iconClassName="text-expense"
      />
      <CategoryItem
        icon={Car}
        label="Transport"
        iconContainerClassName="bg-expense-muted"
        iconClassName="text-expense"
      />
      <CategoryItem
        icon={Coffee}
        label="Coffee"
        iconContainerClassName="bg-expense-muted"
        iconClassName="text-expense"
      />
      <CategoryItem
        icon={Briefcase}
        label="Salary"
        iconContainerClassName="bg-income-muted"
        iconClassName="text-income"
      />
      <CategoryItem
        icon={Gift}
        label="Bonus"
        iconContainerClassName="bg-income-muted"
        iconClassName="text-income"
      />
    </View>
  ),
};

// CategoryChip stories
export const ChipDefault: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <CategoryChip icon={Utensils} label="Dining" selected={false} />
    </View>
  ),
};

export const ChipSelected: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <CategoryChip icon={Utensils} label="Dining" selected={true} />
    </View>
  ),
};

export const ChipList: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', padding: 16 }}>
      <CategoryChip icon={Utensils} label="Dining" selected={true} />
      <CategoryChip icon={ShoppingBag} label="Shopping" selected={false} />
      <CategoryChip icon={Car} label="Transport" selected={false} />
      <CategoryChip icon={Coffee} label="Coffee" selected={false} />
    </View>
  ),
};
