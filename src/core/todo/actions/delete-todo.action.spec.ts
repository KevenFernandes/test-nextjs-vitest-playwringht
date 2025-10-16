import { makeTestTodoMocks } from '@/core/__test__/utils/make-test-todo-mocks';
import { deleteTodoAction } from './delete-todo.action';

vi.mock('next/cache', () => {
  return {
    revalidatePath: vi.fn(),
  };
});

describe('Delete Todo Action (unit)', () => {
  test('Should be called DeleteTodoUseCaseSpy with the correct params', async () => {
    const { deleteTodoUseCaseSpy } = makeTestTodoMocks();
    const fakeId = 'any-id';

    await deleteTodoAction(fakeId);

    expect(deleteTodoUseCaseSpy).toHaveBeenCalledExactlyOnceWith(fakeId);
  });

  test('Should revalidate the path if the deleteUseCase return the correct values', async () => {
    const { revalidatePathMocked } = makeTestTodoMocks();
    const fakeId = 'any';

    await deleteTodoAction(fakeId);

    expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith('/');
  });

  test('Should return the result valid if the use of deleteUseCase return sucess', async () => {
    const { resulValid } = makeTestTodoMocks();
    const fakeId = 'any';

    const result = await deleteTodoAction(fakeId);

    expect(result).toStrictEqual(resulValid);
  });

  test('Should return the result invalid if the use of deleteUseCase return error', async () => {
    const { resultInvalid, deleteTodoUseCaseSpy } = makeTestTodoMocks();
    const param = 'any';

    deleteTodoUseCaseSpy.mockResolvedValue(resultInvalid);

    const result = await deleteTodoAction(param);

    expect(result).toStrictEqual(resultInvalid);
  });
});
