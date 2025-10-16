import * as sanitizeStrMod from '@/utils/sanitize-str';
import * as validateTodoDescriptionMod from '../schemas/validate-todo-description';
import { makeValidatedTodo } from './make-validated-todo';
import * as makeNewTodoMod from './make-new-todo';
import { InvalidTodo, ValidTodo } from '../schemas/todo.contract';

describe('Make Validated Todo (unit)', () => {
  test('Should called the sanitizeStr function with the correct value', () => {
    const description = 'abcd';

    const sanitizeSpy = vi
      .spyOn(sanitizeStrMod, 'sanitizeStr')
      .mockReturnValue(description);

    makeValidatedTodo(description);

    expect(sanitizeSpy).toHaveBeenCalledExactlyOnceWith(description);
  });

  test('Should called the validateTodoDescription with the clean description (sanitizeStr)', () => {
    const { sanitizeSpy, description, validatedTodoDescriptionSpy } =
      makeMock();

    const sanitizeReturn = 'return of sanitize';
    sanitizeSpy.mockReturnValue(sanitizeReturn);

    makeValidatedTodo(description);

    expect(validatedTodoDescriptionSpy).toHaveBeenCalledExactlyOnceWith(
      sanitizeReturn,
    );
  });

  test('Should be called the makeNewTodo if the return of validatedTodoDescription is true', () => {
    const { description } = makeMock();

    const result = makeValidatedTodo(description) as ValidTodo;

    expect(result.success).toBe(true);
    expect(result.todo.id).toBe('any-id');
    expect(result.todo.description).toBe(description);
    expect(result.todo.createdAt).toBe('any-date');
  });

  test('Should be return validatedTodoDescription.erro if validation fail', () => {
    const { validatedTodoDescriptionSpy, description, errors } = makeMock();
    validatedTodoDescriptionSpy.mockReturnValue({ errors, success: false });

    const result = makeValidatedTodo(description) as InvalidTodo;

    expect(result).toStrictEqual({ errors, success: false });
  });
});

const makeMock = (description: string = 'abcd') => {
  const errors = ['any', 'error'];

  const todo = {
    id: 'any-id',
    description,
    createdAt: 'any-date',
  };

  const sanitizeSpy = vi
    .spyOn(sanitizeStrMod, 'sanitizeStr')
    .mockReturnValue(description);

  const validatedTodoDescriptionSpy = vi.spyOn(
    validateTodoDescriptionMod,
    'validateTodoDescription',
  );

  const makeNewTodoSpy = vi
    .spyOn(makeNewTodoMod, 'makeNewTodo')
    .mockReturnValue(todo);

  return {
    sanitizeSpy,
    description,
    validatedTodoDescriptionSpy,
    makeNewTodoSpy,
    errors,
  };
};
