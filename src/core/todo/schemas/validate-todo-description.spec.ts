import { validateTodoDescription } from './validate-todo-description';

describe('Validate Todo Description (unit)', () => {
  test('should return an error if the description has fewer than 3 characters', () => {
    const description = 'abc';
    const result = validateTodoDescription(description);

    expect(result.errors).toStrictEqual([
      'Descrição precisa ter mais que 3 caracteres',
    ]);

    expect(result.success).toBe(false);
  });

  test('should return succes if the description has largest than 3 characters', () => {
    const description = 'abcd';
    const result = validateTodoDescription(description);

    expect(result.errors).toStrictEqual([]);
    expect(result.success).toBe(true);
  });
});
