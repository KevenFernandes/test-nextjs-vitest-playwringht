import { DrizzleTodoRepository } from '@/core/todo/repositories/drizzle-todo.repository';
import { DrizzleDatabase } from '@/db';
import { eq } from 'drizzle-orm';

export async function makeTestTodoRepository() {
  const { db, todoTable } = DrizzleDatabase;
  const repository = new DrizzleTodoRepository(db);
  const todos = makeTestTodo();

  const insertTodoDb = () => db.insert(todoTable);
  const deleteTodoNoWhere = () => db.delete(todoTable);
  const deleteTodoDb = (id: string) =>
    db.delete(todoTable).where(eq(todoTable.id, id));

  return {
    todos,
    repository,
    insertTodoDb,
    deleteTodoDb,
    deleteTodoNoWhere,
  };
}

export const insertTestTodos = async () => {
  const { insertTodoDb } = await makeTestTodoRepository();
  const todos = makeTestTodo();

  await insertTodoDb().values(todos);

  return todos;
};

export const makeTestTodo = () => {
  return Array.from({ length: 5 }).map((_, index) => {
    const newTodo = {
      id: index.toString(),
      description: `Todo ${index} `,
      createdAt: `Date ${index}`,
    };
    return newTodo;
  });
};
