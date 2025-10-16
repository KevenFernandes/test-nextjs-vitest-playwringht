import { revalidatePath } from 'next/cache';
import * as createTodoUseCaseMod from '@/core/todo/usecases/create-todo.usecase';
import * as deleteTodoUseCaseMod from '@/core/todo/usecases/delete-todo.usecase';
import { InvalidTodo, ValidTodo } from '@/core/todo/schemas/todo.contract';

export const makeTestTodoMocks = () => {
  const resulValid = {
    success: true,
    todo: {
      id: 'any',
      description: 'any',
      createdAt: 'any',
    },
  } as ValidTodo;

  const resultInvalid = {
    success: false,
    errors: ['any', 'error'],
  } as InvalidTodo;

  const createTodoUseCaseSpy = vi
    .spyOn(createTodoUseCaseMod, 'createTodoUseCase')
    .mockResolvedValue(resulValid);

  const deleteTodoUseCaseSpy = vi
    .spyOn(deleteTodoUseCaseMod, 'deleteTodoUseCase')
    .mockResolvedValue(resulValid);

  const revalidatePathMocked = vi.mocked(revalidatePath);

  return {
    resulValid,
    resultInvalid,
    createTodoUseCaseSpy,
    deleteTodoUseCaseSpy,
    revalidatePathMocked,
  };
};
