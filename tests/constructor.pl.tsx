import path from 'node:path';

import { expect, test } from '@playwright/test';

const bun = { id: '643d69a5c3f7b9001cfa093c', name: 'Краторная булка N-200i' };
const main = {
  id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
};
const sauce = { id: '643d69a5c3f7b9001cfa0942', name: 'Соус Spicy-X' };

// Любой незаписанный запрос к API прерывается: реальный бэкенд не используется.
test.beforeEach(async ({ page }) => {
  await page.routeFromHAR(path.resolve('tests/hars/ingredients.har'), {
    url: '**/api/**',
    notFound: 'abort',
  });
  await page.routeFromHAR(path.resolve('tests/hars/user.har'), {
    url: '**/api/auth/user',
    notFound: 'abort',
  });
  await page.routeFromHAR(path.resolve('tests/hars/order.har'), {
    url: '**/api/orders',
    notFound: 'abort',
  });
});

test.describe('Добавление ингредиентов в конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('добавляет булку в верхнюю и нижнюю части конструктора', async ({ page }) => {
    const constructor = page.getByTestId('burger-constructor');
    await expect(constructor.getByText('Выберите булки', { exact: true })).toHaveCount(
      2
    );

    await page
      .getByTestId('ingredient-' + bun.id)
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(
      constructor.getByText(bun.name + ' (верх)', { exact: true })
    ).toBeVisible();
    await expect(
      constructor.getByText(bun.name + ' (низ)', { exact: true })
    ).toBeVisible();
    await expect(constructor.getByText('Выберите булки', { exact: true })).toHaveCount(
      0
    );
    await expect(page.getByTestId('constructor-price')).toHaveText('2510');
  });

  test('добавляет начинку и соус из списка в конструктор', async ({ page }) => {
    const constructor = page.getByTestId('burger-constructor');
    await expect(
      constructor.getByText('Выберите начинку', { exact: true })
    ).toBeVisible();

    await page
      .getByTestId('ingredient-' + main.id)
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page
      .getByTestId('ingredient-' + sauce.id)
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(constructor.getByText(main.name, { exact: true })).toBeVisible();
    await expect(constructor.getByText(sauce.name, { exact: true })).toBeVisible();
    await expect(constructor.getByText('Выберите начинку', { exact: true })).toHaveCount(
      0
    );
    await expect(page.getByTestId('constructor-price')).toHaveText('514');
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page
      .getByTestId('ingredient-' + sauce.id)
      .getByRole('link')
      .click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('открывается с названием, изображением и пищевой ценностью выбранного ингредиента', async ({
    page,
  }) => {
    const modal = page.getByRole('dialog');
    await expect(page).toHaveURL('/ingredients/' + sauce.id);
    await expect(
      modal.getByRole('heading', { name: sauce.name, exact: true })
    ).toBeVisible();
    await expect(
      modal.getByRole('img', { name: 'изображение ингредиента.', exact: true })
    ).toHaveAttribute('src', /^data:image\/svg\+xml/);
    await expect(modal.getByRole('listitem')).toHaveText([
      'Калории, ккал30',
      'Белки, г30',
      'Жиры, г20',
      'Углеводы, г40',
    ]);
    await expect(modal.getByText(main.name, { exact: true })).toHaveCount(0);
  });

  test('закрывается по нажатию на крестик и возвращает страницу конструктора', async ({
    page,
  }) => {
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Закрыть', exact: true })
      .click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByTestId('modal-overlay')).toHaveCount(0);
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('burger-constructor')).toBeVisible();
  });

  test('закрывается по нажатию на оверлей', async ({ page }) => {
    await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByTestId('modal-overlay')).toHaveCount(0);
    await expect(page).toHaveURL('/');
  });
});

test.describe('Создание заказа', () => {
  test('отправляет состав бургера, показывает номер заказа, очищает конструктор и закрывает окно', async ({
    page,
    context,
    baseURL,
  }) => {
    await context.addCookies([
      { name: 'accessToken', value: 'Bearer fake-access-token', url: baseURL! },
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    const userResponse = page.waitForResponse('**/api/auth/user');
    await page.goto('/');
    expect((await userResponse).status()).toBe(200);

    const constructor = page.getByTestId('burger-constructor');
    for (const ingredient of [bun, main, sauce]) {
      await page
        .getByTestId('ingredient-' + ingredient.id)
        .getByRole('button', { name: 'Добавить' })
        .click();
    }

    await expect(
      constructor.getByText(bun.name + ' (верх)', { exact: true })
    ).toBeVisible();
    await expect(
      constructor.getByText(bun.name + ' (низ)', { exact: true })
    ).toBeVisible();
    await expect(constructor.getByText(main.name, { exact: true })).toBeVisible();
    await expect(constructor.getByText(sauce.name, { exact: true })).toBeVisible();

    const orderResponse = page.waitForResponse('**/api/orders');
    await constructor
      .getByRole('button', { name: 'Оформить заказ', exact: true })
      .click();
    const response = await orderResponse;
    expect(response.status()).toBe(200);
    expect(response.request().method()).toBe('POST');
    expect(response.request().postDataJSON()).toEqual({
      ingredients: [bun.id, main.id, sauce.id, bun.id],
    });
    expect(response.request().headers().authorization).toBe('Bearer fake-access-token');

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(
      modal.getByRole('heading', { name: '12345', exact: true })
    ).toBeVisible();
    await expect(modal.getByText('идентификатор заказа', { exact: true })).toBeVisible();

    await expect(constructor.getByText('Выберите булки', { exact: true })).toHaveCount(
      2
    );
    await expect(
      constructor.getByText('Выберите начинку', { exact: true })
    ).toBeVisible();
    await expect(
      constructor.getByText(bun.name + ' (верх)', { exact: true })
    ).toHaveCount(0);
    await expect(
      constructor.getByText(bun.name + ' (низ)', { exact: true })
    ).toHaveCount(0);
    await expect(constructor.getByText(main.name, { exact: true })).toHaveCount(0);
    await expect(constructor.getByText(sauce.name, { exact: true })).toHaveCount(0);
    await expect(page.getByTestId('constructor-price')).toHaveText('0');

    await modal.getByRole('button', { name: 'Закрыть', exact: true }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByTestId('modal-overlay')).toHaveCount(0);
    await expect(page).toHaveURL('/');
  });
});
