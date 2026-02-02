import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { SectionTitle } from './section-title';

const meta = {
  title: 'Bookkeeping/SectionTitle',
  component: SectionTitle,
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#fafafa', width: 358 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    title: { control: 'text' },
  },
} satisfies Meta<typeof SectionTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ExpenseCategories: Story = {
  args: {
    title: 'EXPENSE CATEGORIES',
  },
};

export const IncomeCategories: Story = {
  args: {
    title: 'INCOME CATEGORIES',
  },
};

export const RecentTransactions: Story = {
  args: {
    title: 'RECENT TRANSACTIONS',
  },
};

export const SuggestedCategories: Story = {
  args: {
    title: 'SUGGESTED CATEGORIES',
  },
};

export const MultipleSections: Story = {
  render: () => (
    <View style={{ width: 358, gap: 24 }}>
      <SectionTitle title="EXPENSE CATEGORIES" />
      <SectionTitle title="INCOME CATEGORIES" />
      <SectionTitle title="TRANSFER CATEGORIES" />
    </View>
  ),
};
