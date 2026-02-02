import type { Meta, StoryObj } from '@storybook/react';
import { Receipt, Search, ShoppingCart, Inbox, FolderOpen } from 'lucide-react-native';
import { EmptyState } from './empty-state';
import { Button } from './button';
import { Text } from './text';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    centered: { control: 'boolean' },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No transactions yet',
    description: 'Start tracking your expenses by adding your first transaction',
    icon: Receipt,
  },
};

export const NoDescription: Story = {
  args: {
    title: 'No items found',
    icon: Search,
  },
};

export const WithAction: Story = {
  args: {
    title: 'Your cart is empty',
    description: 'Add items to your cart to see them here',
    icon: ShoppingCart,
    action: (
      <Button>
        <Text>Browse Products</Text>
      </Button>
    ),
  },
};

export const EmptyInbox: Story = {
  args: {
    title: 'Inbox is empty',
    description: 'No new messages',
    icon: Inbox,
  },
};

export const EmptyFolder: Story = {
  args: {
    title: 'No files',
    description: 'This folder is empty. Upload or create new files to get started.',
    icon: FolderOpen,
    action: (
      <Button variant="outline">
        <Text>Upload File</Text>
      </Button>
    ),
  },
};

export const Centered: Story = {
  args: {
    title: 'Nothing here',
    description: 'This state is centered vertically',
    icon: Receipt,
    centered: true,
  },
};
