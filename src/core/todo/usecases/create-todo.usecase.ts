import { makeValidatedTodo } from '../factories/make-validated-todo';
import { todoRepository } from '../repositories/default.repository';

export async function createTodoUseCase(description: string) {
  const validateTodo = makeValidatedTodo(description);

  if (!validateTodo.success) {
    return validateTodo;
  }

  const created = await todoRepository.create(validateTodo.todo);

  return created;
}
