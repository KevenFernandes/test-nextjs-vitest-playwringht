import { DrizzleDatabase } from '@/db';
import { TodoRepository } from './todo.contract.repository';
import { Todo, TodoPresenter } from '../schemas/todo.contract';
import { todoTable } from '../schemas/drizzle-todo-table.schema';
import { eq } from 'drizzle-orm';

export class DrizzleTodoRepository implements TodoRepository {
  private readonly db: DrizzleDatabase;

  constructor(db: DrizzleDatabase) {
    this.db = db;
  }

  async findAll(): Promise<Todo[]> {
    const todos = await this.db.query.todo.findMany({
      orderBy: (todo, { desc }) => [
        desc(todo.createdAt),
        desc(todo.description),
      ],
    });

    return todos;
  }

  async create(todoData: Todo): Promise<TodoPresenter> {
    const existTodo = await this.db.query.todo.findFirst({
      where: (todoTable, { eq, or }) =>
        or(
          eq(todoTable.id, todoData.id),
          eq(todoTable.description, todoData.description),
        ),
    });

    if (!!existTodo) {
      return {
        success: false,
        errors: ['Este todo com id ou descrição já existem.'],
      };
    }

    await this.db.insert(todoTable).values(todoData);

    return { success: true, todo: todoData };
  }

  async remove(id: string): Promise<TodoPresenter> {
    const existTodo = await this.db.query.todo.findFirst({
      where: (todoTable, { eq }) => eq(todoTable.id, id),
    });

    if (!existTodo) {
      return {
        success: false,
        errors: ['Todo não existe'],
      };
    }

    await this.db.delete(todoTable).where(eq(todoTable.id, id));

    return {
      success: true,
      todo: existTodo,
    };
  }
}
