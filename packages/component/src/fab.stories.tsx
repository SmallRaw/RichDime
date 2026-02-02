import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Plus, Pencil, Camera, Share } from 'lucide-react-native';
import { FAB } from './fab';

const meta = {
  title: 'Components/FAB',
  component: FAB,
  decorators: [
    (Story) => (
      <View style={{ padding: 32, backgroundColor: '#fafafa', alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
  },
} satisfies Meta<typeof FAB>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    icon: Plus,
  },
};

export const Small: Story = {
  args: {
    variant: 'default',
    size: 'sm',
    icon: Plus,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'default',
    icon: Plus,
  },
};

export const WithEditIcon: Story = {
  args: {
    variant: 'default',
    size: 'default',
    icon: Pencil,
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
      <FAB variant="default" size="default" icon={Plus} />
      <FAB variant="default" size="sm" icon={Plus} />
      <FAB variant="secondary" size="default" icon={Pencil} />
      <FAB variant="secondary" size="sm" icon={Camera} />
    </View>
  ),
};

export const CustomIcons: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
      <FAB icon={Plus} />
      <FAB icon={Pencil} />
      <FAB icon={Camera} />
      <FAB icon={Share} />
    </View>
  ),
};
