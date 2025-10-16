import { makeTestTodoMocks } from '@/core/__test__/utils/make-test-todo-mocks';
import { createTodoAction } from './create-todo.action';

vi.mock('next/cache', () => {
  return {
    revalidatePath: vi.fn(),
  };
});

describe('Create Todo Action (unitário)', () => {
  test('Should be called CreateTodoUseCase with the correct params', async () => {
    const { createTodoUseCaseSpy } = makeTestTodoMocks();
    const param = 'Parametro usado em createTodoAction';

    await createTodoAction(param);

    expect(createTodoUseCaseSpy).toHaveBeenCalledExactlyOnceWith(param);
  });

  test('Should revalidate the path if the UseCase return the correct values', async () => {
    const { revalidatePathMocked } = makeTestTodoMocks();
    const param = 'Parametro usado em createTodoAction';

    await createTodoAction(param);

    expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith('/');
  });

  test('Should return the result valid if the use of useCase return sucess', async () => {
    const { resulValid } = makeTestTodoMocks();
    const param = 'Parametro usado em createTodoAction';

    const result = await createTodoAction(param);

    expect(result).toStrictEqual(resulValid);
  });

  test('Should return the result invalid if the use of useCase return error', async () => {
    const { resultInvalid, createTodoUseCaseSpy } = makeTestTodoMocks();
    const param = 'Parametro usado em createTodoAction';

    createTodoUseCaseSpy.mockResolvedValue(resultInvalid);

    const result = await createTodoAction(param);

    expect(result).toStrictEqual(resultInvalid);
  });
});
