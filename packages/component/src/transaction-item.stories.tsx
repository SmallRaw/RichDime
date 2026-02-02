import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Utensils, Briefcase, ArrowRightLeft } from 'lucide-react-native';
import { TransactionItem } from './transaction-item';

const meta = {
  title: 'Bookkeeping/TransactionItem',
  component: TransactionItem,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: '#ffffff', width: 358 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['expense', 'income', 'transfer'],
    },
    categoryName: { control: 'text' },
    note: { control: 'text' },
    amount: { control: 'text' },
    account: { control: 'text' },
  },
} satisfies Meta<typeof TransactionItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Expense: Story = {
  args: {
    variant: 'expense',
    icon: Utensils,
    categoryName: 'Dining',
    note: 'Lunch with friends',
    amount: '-¥128.00',
    account: 'Alipay',
  },
};

export const Income: Story = {
  args: {
    variant: 'income',
    icon: Briefcase,
    categoryName: 'Salary',
    note: 'Monthly payment',
    amount: '+¥15,000.00',
    account: 'Bank Card',
  },
};

export const Transfer: Story = {
  args: {
    variant: 'transfer',
    icon: ArrowRightLeft,
    categoryName: 'Transfer',
    note: 'To savings account',
    amount: '¥5,000.00',
    account: 'Bank → Savings',
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 0, width: 358 }}>
      <TransactionItem
        variant="expense"
        icon={Utensils}
        categoryName="Dining"
        note="Lunch with friends"
        amount="-¥128.00"
        account="Alipay"
      />
      <TransactionItem
        variant="income"
        icon={Briefcase}
        categoryName="Salary"
        note="Monthly payment"
        amount="+¥15,000.00"
        account="Bank Card"
      />
      <TransactionItem
        variant="transfer"
        icon={ArrowRightLeft}
        categoryName="Transfer"
        note="To savings account"
        amount="¥5,000.00"
        account="Bank → Savings"
      />
    </View>
  ),
};

export const WithoutNote: Story = {
  args: {
    variant: 'expense',
    icon: Utensils,
    categoryName: 'Dining',
    amount: '-¥128.00',
    account: 'Alipay',
  },
};

export const WithoutAccount: Story = {
  args: {
    variant: 'expense',
    icon: Utensils,
    categoryName: 'Dining',
    note: 'Lunch with friends',
    amount: '-¥128.00',
  },
};
