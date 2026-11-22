import { AppHeaderUI } from '@ui';
import { MemoryRouter } from 'react-router-dom';

import type { Decorator, Meta, StoryObj } from '@storybook/react';

const withRouter: Decorator = (Story): React.JSX.Element => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

const meta = {
  component: AppHeaderUI,
  decorators: [withRouter],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'Example/Header',
} satisfies Meta<typeof AppHeaderUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {
    userName: 'John Doe',
  },
};

export const LoggedOut: Story = {
  args: {
    userName: undefined,
  },
};
