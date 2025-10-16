import { makeTestTodoRepository } from '@/core/__test__/utils/make-test-todo-repository';
import { deleteTodoUseCase } from './delete-todo.usecase';
import { InvalidTodo } from '../schemas/todo.contract';

describe('Delete Todo Use Case (integration)', () => {
  beforeEach(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  afterAll(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  test('Should return inválid result if do not have cleanId', async () => {
    const resultFail = (await deleteTodoUseCase('')) as InvalidTodo;

    expect(resultFail).toStrictEqual({
      success: false,
      errors: ['ID inválido'],
    });
  });

  test('Should return valid result if todo exist in the database', async () => {
    const { insertTodoDb, todos } = await makeTestTodoRepository();
    await insertTodoDb().values(todos);

    const result = await deleteTodoUseCase(todos[0].id);

    expect(result).toStrictEqual({
      success: true,
      todo: todos[0],
    });
  });

  test('Should return error if todo not exist in the database', async () => {
    const result = await deleteTodoUseCase('este-id-nao-tem-na-database');
    expect(result).toStrictEqual({
      errors: ['Todo não existe'],
      success: false,
    });
  });
});
