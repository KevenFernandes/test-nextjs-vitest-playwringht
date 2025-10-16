import { DrizzleDatabase } from '@/db';
import { TodoRepository } from './todo.contract.repository';
import { DrizzleTodoRepository } from './drizzle-todo.repository';

export const todoRepository: TodoRepository = new DrizzleTodoRepository(
  DrizzleDatabase.db,
);
