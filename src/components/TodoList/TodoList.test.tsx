import { mockTodos } from '@/core/__test__/mocks/todos';
import { Todo } from '@/core/todo/schemas/todo.contract';
import { TodoList } from '.';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

describe('TodoList (integration)', () => {
  test('Should render heading, list and item list of TODOs', () => {
    const { todos } = renderList();

    const heading = screen.getByRole('heading', {
      name: /lista de tarefas/i,
      level: 1,
    });
    const list = screen.getByRole('list', {
      name: /lista de tarefas/i,
    });
    const items = screen.getAllByRole('listitem');

    expect(heading).toBeInTheDocument();
    expect(list).toHaveAttribute('aria-labelledby', heading.id);
    expect(items).toHaveLength(todos.length);

    items.forEach((item, index) => {
      expect(item).toHaveTextContent(todos[index].description);
    });
  });

  test('Should not render the items list without TODOs', () => {
    renderList({ todos: [] });

    const list = screen.queryByRole('list', { name: /lista de tarefas/i });

    expect(list).not.toBeInTheDocument();
  });

  test('Should keep the action correct for each item list', async () => {
    const { action, todos } = renderList();

    const items = screen.getAllByRole('listitem');

    const bto0 = within(items[0]).getByRole('button');
    const bto1 = within(items[1]).getByRole('button');
    const bto2 = within(items[2]).getByRole('button');

    await user.click(bto0);
    await user.click(bto1);
    await user.click(bto2);

    expect(action).toHaveBeenCalledTimes(3);
    expect(action.mock.calls[0][0]).toBe(todos[0].id);
    expect(action.mock.calls[1][0]).toBe(todos[1].id);
    expect(action.mock.calls[2][0]).toBe(todos[2].id);
  });

  test('Should disable items on the list while sending the action', async () => {
    renderList({ delay: 20 });

    const list = screen.getByRole('list', { name: /lista de tarefas/i });
    const items = screen.getAllByRole('listitem');
    const btns = within(list).getAllByRole('button');
    await user.click(btns[1]);

    const expectedDisabledCls = 'bg-gray-200 text-gray-900 hover:scale-100';
    const expectedEnabledCls = 'bg-amber-200 text-amber-900 hover:scale-105';

    await waitFor(() => {
      items.forEach(item => expect(item).toHaveClass(expectedDisabledCls));
    });
    await waitFor(() => {
      items.forEach(item => expect(item).toHaveClass(expectedEnabledCls));
    });
  });

  test('Should disable the buttons on the list while sending the action', async () => {
    renderList({ delay: 20 });

    const list = screen.getByRole('list', { name: /lista de tarefas/i });
    const btns = within(list).getAllByRole('button');
    await user.click(btns[1]);

    await waitFor(() => {
      btns.forEach(btn => expect(btn).toBeDisabled());
    });
    await waitFor(() => {
      btns.forEach(btn => expect(btn).toBeEnabled());
    });
  });

  test('Should alert the user if there is an error when deleting the TODO', async () => {
    renderList({ success: false });

    const alertFn = vi.fn();
    vi.stubGlobal('alert', alertFn);
    const btns = screen.getAllByRole('button');
    await user.click(btns[1]);

    expect(alertFn).toHaveBeenCalledExactlyOnceWith('Error ao apagar todo');
  });

  test('Should not call action if the id is invalid, empty or formed only with spaces', async () => {
    const { action } = renderList({
      todos: [{ id: '  ', description: '', createdAt: '' }],
    });

    const item = screen.getByRole('listitem');
    const btn = within(item).getByRole('button');

    user.click(btn);

    expect(action).not.toHaveBeenCalled();
  });
});

type RenderListProps = {
  delay?: number;
  success?: boolean;
  todos?: Todo[];
};

function renderList({
  delay = 0,
  success = true,
  todos = mockTodos,
}: RenderListProps = {}) {
  const newTodos = [...todos];

  const actionSuccessResult = {
    success: true,
    todo: { id: 'id', description: 'description', createdAt: 'createdAt' },
  };

  const actionErrorResult = {
    success: false,
    errors: ['Error ao apagar todo'],
  };

  const actionResult = success ? actionSuccessResult : actionErrorResult;
  const actionNoDelay = vi.fn().mockResolvedValue(actionResult);
  const actionDelayed = vi.fn().mockImplementation(async () => {
    await new Promise(r => setTimeout(r, delay));
    return actionResult;
  });

  const action = delay > 0 ? actionDelayed : actionNoDelay;

  const renderResult = render(<TodoList action={action} todos={newTodos} />);

  return {
    action,
    renderResult,
    todos: newTodos,
  };
}
