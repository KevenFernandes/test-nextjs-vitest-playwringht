import {
  insertTestTodos,
  makeTestTodoRepository,
} from '@/core/__test__/utils/make-test-todo-repository';
import { expect, Page, test } from '@playwright/test';

const HOME_URL = '/';
const HEADING = 'Lista de tarefas';
const INPUT = 'Tarefa';
const BUTTON = 'Criar tarefa';
const BUTTON_BUSY = 'Criando tarefa...';
const NEW_TODO_TEXT = 'New Todo';

const getHeading = (p: Page) => p.getByRole('heading', { name: HEADING });
const getInput = (p: Page) => p.getByRole('textbox', { name: INPUT });
const getBtn = (p: Page) => p.getByRole('button', { name: BUTTON });
const getBtnBusy = (p: Page) => p.getByRole('button', { name: BUTTON_BUSY });

const getAll = (p: Page) => ({
  heading: getHeading(p),
  input: getInput(p),
  btn: getBtn(p),
  btnBusy: getBtnBusy(p),
});

test.beforeEach(async ({ page }) => {
  const { deleteTodoNoWhere } = await makeTestTodoRepository();
  await deleteTodoNoWhere();
  await page.goto(HOME_URL);
});

test.afterAll(async () => {
  const { deleteTodoNoWhere } = await makeTestTodoRepository();
  await deleteTodoNoWhere();
});

test.describe('Home (e2e)', () => {
  test.describe('Render', () => {
    test('Should have the html title correct', async ({ page }) => {
      await expect(page).toHaveTitle('Create Next App');
    });

    test('Should render heading, input and button for create TODOs', async ({
      page,
    }) => {
      await expect(getHeading(page)).toBeVisible();
      await expect(getInput(page)).toBeVisible();
      await expect(getBtn(page)).toBeVisible();
    });
  });

  test.describe('Create', () => {
    test('Should allows create one TODO', async ({ page }) => {
      const { input, btn } = getAll(page);

      await input.fill(NEW_TODO_TEXT);
      await btn.click();

      const createdTodo = page
        .getByRole('listitem')
        .filter({ hasText: NEW_TODO_TEXT });

      await expect(createdTodo).toBeVisible();
    });

    test('Should trim the input description when creating the TODO', async ({
      page,
    }) => {
      const { input, btn } = getAll(page);

      const textWithoutTrim = '  no space here  ';
      const textWithTrim = textWithoutTrim.trim();

      await input.fill(textWithoutTrim);
      await btn.click();

      const createdTodo = page
        .getByRole('listitem')
        .filter({ hasText: textWithTrim });

      const createdTodoText = await createdTodo.textContent();

      await expect(createdTodoText).toBe(textWithTrim);
    });

    test('Should allow me to create more than one TODO', async ({ page }) => {
      const { input, btn } = getAll(page);

      const todo1 = 'Todo 1';
      const todo2 = 'Todo 2';

      await input.fill(todo1);
      await btn.click();

      const createdTodo1 = page
        .getByRole('listitem')
        .filter({ hasText: todo1 });

      await expect(createdTodo1).toBeVisible();

      await input.fill(todo2);
      await btn.click();

      const createdTodo2 = page
        .getByRole('listitem')
        .filter({ hasText: todo2 });
      await expect(createdTodo2).toBeVisible();
    });

    test('Should disable the bunto while creted TODO', async ({ page }) => {
      const { input, btn } = getAll(page);

      await input.fill(NEW_TODO_TEXT);
      await btn.click();

      await expect(getBtnBusy(page)).toBeVisible;
      await expect(getBtnBusy(page)).toBeDisabled;

      const cretedTodo = page
        .getByRole('listitem')
        .filter({ hasText: NEW_TODO_TEXT });
      await expect(cretedTodo).toBeVisible();

      await expect(btn).toBeVisible();
      await expect(btn).toBeEnabled();
    });

    test('Should disable the input while creted TODO', async ({ page }) => {
      const { input, btn } = getAll(page);

      await input.fill(NEW_TODO_TEXT);
      await btn.click();

      await expect(input).toBeDisabled;

      const cretedTodo = page
        .getByRole('listitem')
        .filter({ hasText: NEW_TODO_TEXT });
      await expect(cretedTodo).toBeVisible();

      await expect(input).toBeEnabled;
    });

    test('Should clear the input after creating TODO', async ({ page }) => {
      const { input, btn } = getAll(page);

      await input.fill(NEW_TODO_TEXT);
      await btn.click();

      await expect(input).toHaveValue('');
    });
  });

  test.describe('Deleting', () => {
    test('Should allow deleting a TODO', async ({ page }) => {
      const todos = await insertTestTodos();
      await page.reload();

      const deletedTodo = page
        .getByRole('listitem')
        .filter({ hasText: todos[1].description });
      await expect(deletedTodo).toBeVisible();

      const btnDeletedTodo = deletedTodo.getByRole('button');
      await btnDeletedTodo.click();

      await deletedTodo.waitFor({ state: 'detached' });
      await expect(deletedTodo).not.toBeVisible();
    });

    test("Should all clear all TODO's", async ({ page }) => {
      await insertTestTodos();
      await page.reload();

      while (true) {
        const item = await page.getByRole('listitem').first();
        const isVisible = await item.isVisible().catch(() => false);
        if (!isVisible) break;

        const text = await item.textContent();
        if (!text) {
          throw Error('Item texto not found');
        }

        const btnDelete = item.getByRole('button');
        await btnDelete.click();

        const renewedItem = page
          .getByRole('listitem')
          .filter({ hasText: text });
        await renewedItem.waitFor({ state: 'detached' });
        await expect(renewedItem).not.toBeVisible();
      }
    });

    test('Should disable list items while sending the action', async ({
      page,
    }) => {
      await insertTestTodos();
      await page.reload();

      const deletedItem = page.getByRole('listitem').first();
      const deletedItemText = await deletedItem.textContent();

      if (!deletedItemText) {
        throw new Error('Item text is empty');
      }

      const deletedItemButton = deletedItem.getByRole('button');
      await deletedItemButton.click();

      const allButtonsItems = await page
        .getByRole('button', { name: /^apagar:/i })
        .all();

      for (const buttonItem of allButtonsItems) {
        await expect(buttonItem).toBeDisabled();
      }

      const deletedItemNotVisible = await page
        .getByRole('listitem')
        .filter({ hasText: deletedItemText });
      await deletedItemNotVisible.waitFor({ state: 'detached' });
      await expect(deletedItemNotVisible).not.toBeVisible();

      const renewedButtonItems = await page
        .getByRole('button', { name: /^apagar:/i })
        .all();

      for (const renewedButton of renewedButtonItems) {
        await expect(renewedButton).toBeEnabled();
      }
    });
  });

  test.describe('Errors', () => {
    test('Should show error if the description have 3 or less caracter', async ({
      page,
    }) => {
      const { input, btn } = getAll(page);

      await input.fill('abc');
      await btn.click();

      const errorMessage = 'Descrição precisa ter mais que 3 caracteres';
      const error = page.getByText(errorMessage);

      await error.waitFor({ state: 'attached', timeout: 10000 });
      await expect(error).toBeVisible();
    });

    test('Should show an error if a TODO already exists with the same description', async ({
      page,
    }) => {
      const { input, btn } = getAll(page);

      await input.fill('description already exists');
      await btn.click();
      await input.fill('description already exists');
      await btn.click();

      const errorMessage = 'Este todo com id ou descrição já existem';
      const error = page.getByText(errorMessage);

      await error.waitFor({ state: 'attached', timeout: 5000 });
      await expect(error).toBeVisible();
    });

    test('Should remove an error from display when the user correct the error', async ({
      page,
    }) => {
      const { input, btn } = getAll(page);

      await input.fill('abc');
      await btn.click();

      const errorMessage = 'Descrição precisa ter mais que 3 caracteres';
      const error = await page.getByText(errorMessage);

      await error.waitFor({ state: 'attached', timeout: 10000 });
      await expect(error).toBeVisible();

      await input.fill('Description with more caracter');
      await btn.click();

      await error.waitFor({ state: 'detached', timeout: 10000 });
      await expect(error).not.toBeVisible();
    });
  });
});
