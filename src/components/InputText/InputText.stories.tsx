import { InputText } from '.';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof InputText> = {
  title: 'Components/Forms/InputText',
  component: InputText,
  decorators: [
    Story => (
      <div className='max-w-screen-lg mx-auto p-12'>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'tel', 'search', 'url'],
      description: 'Tipo do input',
    },
    labelText: {
      control: 'text',
      description: 'Label do input',
    },
    errorMessage: {
      control: 'text',
      description: 'Messagem de error',
    },
    placeholder: {
      control: 'text',
      description: 'Texto do placeholder',
    },
    required: {
      control: 'boolean',
      description: 'Campo requerido?',
    },
    disabled: {
      control: 'boolean',
      description: 'Desativar campo?',
    },
    readOnly: {
      control: 'boolean',
      description: 'Apenas para leitura?',
    },
    defaultValue: {
      control: 'text',
      description: 'Valor padrão para o input',
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputText>;

export const Default: Story = {
  args: {
    type: 'text',
    labelText: 'Input Label',
    errorMessage: '',
    placeholder: 'Digite algo...',
    required: true,
    disabled: false,
    readOnly: false,
    defaultValue: 'Este é o valor padrão do input',
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    errorMessage: 'Campo com error',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    readOnly: true,
  },
};
