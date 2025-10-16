import { makeNewTodo } from './make-new-todo';

describe('Make New Todo (unit)', () => {
  test('Should return new valid todo', () => {
    const expectTodo = {
      id: expect.any(String),
      description: 'primeiro todo test',
      createdAt: expect.any(String),
    };

    const newTodo = makeNewTodo('primeiro todo test');

    expect(expectTodo.description).toBe(newTodo.description);
    expect(expectTodo).toStrictEqual(newTodo);
  });
});
