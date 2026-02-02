import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Plus, Download, Trash2, Settings, ChevronRight } from 'lucide-react-native';
import { Button } from './button';
import { Text } from './text';
import { Icon } from './icon';

const meta = {
  title: 'Components/Button',
  component: Button,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: '#fafafa', gap: 16 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Button>
      <Text>Button</Text>
    </Button>
  ),
};

export const Secondary: Story = {
  render: () => (
    <Button variant="secondary">
      <Text>Secondary</Text>
    </Button>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Button variant="destructive">
      <Text>Destructive</Text>
    </Button>
  ),
};

export const Outline: Story = {
  render: () => (
    <Button variant="outline">
      <Text>Outline</Text>
    </Button>
  ),
};

export const Ghost: Story = {
  render: () => (
    <Button variant="ghost">
      <Text>Ghost</Text>
    </Button>
  ),
};

export const Link: Story = {
  render: () => (
    <Button variant="link">
      <Text>Link</Text>
    </Button>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Button>
      <Icon as={Plus} className="size-4 text-primary-foreground" />
      <Text>Add New</Text>
    </Button>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <Button size="icon">
      <Icon as={Plus} className="size-4 text-primary-foreground" />
    </Button>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Button size="sm">
        <Text>Small</Text>
      </Button>
      <Button size="default">
        <Text>Default</Text>
      </Button>
      <Button size="lg">
        <Text>Large</Text>
      </Button>
    </View>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Button variant="default">
        <Text>Default</Text>
      </Button>
      <Button variant="secondary">
        <Text>Secondary</Text>
      </Button>
      <Button variant="destructive">
        <Text>Destructive</Text>
      </Button>
      <Button variant="outline">
        <Text>Outline</Text>
      </Button>
      <Button variant="ghost">
        <Text>Ghost</Text>
      </Button>
      <Button variant="link">
        <Text>Link</Text>
      </Button>
    </View>
  ),
};

export const Disabled: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Button disabled>
        <Text>Disabled Default</Text>
      </Button>
      <Button variant="secondary" disabled>
        <Text>Disabled Secondary</Text>
      </Button>
      <Button variant="outline" disabled>
        <Text>Disabled Outline</Text>
      </Button>
    </View>
  ),
};

export const WithTrailingIcon: Story = {
  render: () => (
    <Button variant="outline">
      <Text>Continue</Text>
      <Icon as={ChevronRight} className="size-4 text-foreground" />
    </Button>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Button size="icon" variant="default">
        <Icon as={Plus} className="size-4 text-primary-foreground" />
      </Button>
      <Button size="icon" variant="secondary">
        <Icon as={Download} className="size-4 text-secondary-foreground" />
      </Button>
      <Button size="icon" variant="destructive">
        <Icon as={Trash2} className="size-4 text-white" />
      </Button>
      <Button size="icon" variant="outline">
        <Icon as={Settings} className="size-4 text-foreground" />
      </Button>
      <Button size="icon" variant="ghost">
        <Icon as={Settings} className="size-4 text-foreground" />
      </Button>
    </View>
  ),
};
