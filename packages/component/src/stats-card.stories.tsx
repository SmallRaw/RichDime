import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { StatsCard } from './stats-card';

const meta = {
  title: 'Bookkeeping/StatsCard',
  component: StatsCard,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: '#fafafa' }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['income', 'expense', 'balance'],
    },
    label: { control: 'text' },
    amount: { control: 'text' },
    change: { control: 'text' },
  },
} satisfies Meta<typeof StatsCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Income: Story = {
  args: {
    variant: 'income',
    label: 'Income',
    amount: '¥15,680.00',
    change: '+12.5% vs last month',
  },
};

export const Expense: Story = {
  args: {
    variant: 'expense',
    label: 'Expense',
    amount: '¥8,240.00',
    change: '-5.2% vs last month',
  },
};

export const Balance: Story = {
  args: {
    variant: 'balance',
    label: 'Balance',
    amount: '¥7,440.00',
    change: 'This month',
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
      <StatsCard
        variant="income"
        label="Income"
        amount="¥15,680.00"
        change="+12.5% vs last month"
        style={{ width: 170 }}
      />
      <StatsCard
        variant="expense"
        label="Expense"
        amount="¥8,240.00"
        change="-5.2% vs last month"
        style={{ width: 170 }}
      />
      <StatsCard
        variant="balance"
        label="Balance"
        amount="¥7,440.00"
        change="This month"
        style={{ width: 170 }}
      />
    </View>
  ),
};

export const WithoutChange: Story = {
  args: {
    variant: 'income',
    label: 'Total Income',
    amount: '¥25,000.00',
  },
};
