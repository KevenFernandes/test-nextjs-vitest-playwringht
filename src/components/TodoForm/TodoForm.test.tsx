import { render, screen, waitFor } from '@testing-library/react';
import { TodoForm } from '.';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

describe('TodoForm (integração)', () => {
  test('Should render all form components', () => {
    const { btn, input } = renderForm();
    expect(btn).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test('Should call action with the correct values', async () => {
    const { btn, input, action } = renderForm();
    await user.type(input, 'new todo');
    await user.click(btn);
    expect(action).toHaveBeenCalledExactlyOnceWith('new todo');
  });

  test('Should cut spaces of the beginning and end of description', async () => {
    const { btn, input, action } = renderForm();
    await user.type(input, ' new todo ');
    await user.click(btn);
    expect(action).toHaveBeenCalledExactlyOnceWith('new todo');
  });

  test('Should clean the input if the form return success', async () => {
    const { btn, input } = renderForm();
    await user.type(input, 'new todo');
    await user.click(btn);
    expect(input).toHaveValue('');
  });

  test('Should disable the button while sending the action', async () => {
    const { btn, input } = renderForm({ delay: 20 });
    await user.type(input, 'new todo');
    await user.click(btn);

    await waitFor(() => expect(btn).toBeDisabled());
    await waitFor(() => expect(btn).toBeEnabled());
  });

  test('Should disable the input while sending the action', async () => {
    const { btn, input } = renderForm({ delay: 20 });
    await user.type(input, 'new todo');
    await user.click(btn);

    await waitFor(() => expect(input).toBeDisabled());
    await waitFor(() => expect(input).toBeEnabled());
  });

  test('Shoud change the button texto while sending the action', async () => {
    const { btn, input } = renderForm({ delay: 20 });
    await user.type(input, 'new todo');
    await user.click(btn);

    await waitFor(() => expect(btn).toHaveAccessibleName('Criando tarefa...'));
    await waitFor(() => expect(btn).toHaveAccessibleName('Criar tarefa'));
  });

  test('Should display the error while sending return error', async () => {
    const { btn, input } = renderForm({ success: false });
    await user.type(input, 'new todo');
    await user.click(btn);

    const error = await screen.findByRole('alert');

    expect(error).toHaveTextContent('Erro ao criar a tarefa');
    expect(input).toHaveAttribute('aria-describedby', error.id);
  });

  test('Should keep the type text in the input if the action return an error', async () => {
    const { btn, input } = renderForm({ success: false });
    await user.type(input, 'new todo');
    await user.click(btn);

    expect(input).toHaveValue('new todo');
  });
});

type RenderForms = {
  delay?: number;
  success?: boolean;
};

function renderForm({ delay = 0, success = true }: RenderForms = {}) {
  const actionSuccessResult = {
    success: true,
    todo: {
      id: 'id',
      description: 'description',
      createdAt: 'createdAt',
    },
  };
  const actionErrorRestul = {
    success: false,
    errors: ['Erro ao criar a tarefa'],
  };

  const actionResult = success ? actionSuccessResult : actionErrorRestul;

  const actionNoDelay = vi.fn().mockResolvedValue(actionResult);
  const actionDelay = vi.fn().mockImplementation(async () => {
    await new Promise(r => setTimeout(r, delay));
    return actionResult;
  });

  const action = delay > 0 ? actionDelay : actionNoDelay;

  render(<TodoForm action={action} />);

  const input = screen.getByLabelText('Tarefa');
  const btn = screen.getByRole('button');

  return {
    action,
    input,
    btn,
  };
}
