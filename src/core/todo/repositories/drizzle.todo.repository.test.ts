import {
  insertTestTodos,
  makeTestTodoRepository,
} from '@/core/__test__/utils/make-test-todo-repository';

describe('Drizzle Todo Repository (integration)', () => {
  beforeEach(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  afterAll(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  describe('Find All', () => {
    test('Should return empty array if the table is empty', async () => {
      const { repository } = await makeTestTodoRepository();
      const result = await repository.findAll();
      expect(result).toStrictEqual([]);
      expect(result).toHaveLength(0);
    });

    test('Should return orderby decrescente if the table is population', async () => {
      const { repository } = await makeTestTodoRepository();
      await insertTestTodos();
      const result = await repository.findAll();
      expect(result[0].createdAt).toBe('Date 4');
      expect(result[1].createdAt).toBe('Date 3');
      expect(result[2].createdAt).toBe('Date 2');
      expect(result[3].createdAt).toBe('Date 1');
      expect(result[4].createdAt).toBe('Date 0');
    });
  });

  describe('Create', () => {
    test('Create a new Todo if the all data is valid', async () => {
      const { repository, todos } = await makeTestTodoRepository();
      const newTodo = await repository.create(todos[0]);
      expect(newTodo).toStrictEqual({ success: true, todo: todos[0] });
    });

    test('Fail if there is an equal equal description in the table', async () => {
      const { repository, todos } = await makeTestTodoRepository();

      await repository.create(todos[0]);

      const todoRepeatFail = {
        id: 'any id',
        description: todos[0].description,
        createdAt: 'any date',
      };

      const result = await repository.create(todoRepeatFail);

      expect(result).toStrictEqual({
        success: false,
        errors: ['Este todo com id ou descrição já existem.'],
      });
    });

    test('Fail if there an equal ID and DESCRIPTION in the table', async () => {
      const { repository, todos } = await makeTestTodoRepository();

      await repository.create(todos[0]);

      const todoRepeatIdFail = {
        id: todos[0].id,
        description: todos[0].description,
        createdAt: 'any date',
      };

      const result = await repository.create(todoRepeatIdFail);
      expect(result).toStrictEqual({
        success: false,
        errors: ['Este todo com id ou descrição já existem.'],
      });
    });
  });

  describe('Delete', () => {
    test('Shoud delete todo if exist in the table', async () => {
      const { repository, todos } = await makeTestTodoRepository();
      await insertTestTodos();

      const result = await repository.remove(todos[0].id);
      expect(result).toStrictEqual({ success: true, todo: todos[0] });
    });

    test('Fail if not exist todo in the table', async () => {
      const { repository } = await makeTestTodoRepository();
      const result = await repository.remove('any id');

      expect(result).toStrictEqual({
        success: false,
        errors: ['Todo não existe'],
      });
    });
  });
});
