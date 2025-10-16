import { Meta, StoryObj } from '@storybook/nextjs';
import { TodoForm } from '.';
import { todoActionStoryMock } from '@/core/__test__/mocks/todo-action-story';

const meta: Meta<typeof TodoForm> = {
  title: 'Components/Forms/TodoForm',
  component: TodoForm,
  decorators: [
    Story => (
      <div className='max-w-screen-md mx-auto p-12'>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    action: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof TodoForm>;

export const Default: Story = {
  args: {
    action: todoActionStoryMock.create.success,
  },
};

export const WithError: Story = {
  args: {
    action: todoActionStoryMock.create.error,
  },
};
