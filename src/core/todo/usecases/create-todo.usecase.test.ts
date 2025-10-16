import { makeTestTodoRepository } from '@/core/__test__/utils/make-test-todo-repository';
import { createTodoUseCase } from './create-todo.usecase';
import { InvalidTodo, ValidTodo } from '../schemas/todo.contract';

describe('Create Todo Use Case (integration)', () => {
  beforeEach(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  afterAll(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  test('Should return erro if validate fail', async () => {
    const description = '';
    const resultFail = (await createTodoUseCase(description)) as InvalidTodo;

    expect(resultFail.success).toBe(false);
    expect(resultFail.errors).toHaveLength(1);
  });

  test('Should return todo if validate success', async () => {
    const description = 'Descrição do todo';
    const result = (await createTodoUseCase(description)) as ValidTodo;

    expect(result.success).toBe(true);
    expect(result.todo).toStrictEqual({
      createdAt: expect.any(String),
      description,
      id: expect.any(String),
    });
  });
});
