import { expect, test } from '@jupyterlab/galata';

/**
 * Don't load JupyterLab webpage before running the tests.
 * This is required to ensure we capture all log messages.
 */
test.use({ autoGoto: false });

test('should emit an activation console message', async ({ page }) => {
  const logs: string[] = [];

  page.on('console', message => {
    logs.push(message.text());
  });

  await page.goto();

  expect(
    logs.filter(
      s => s === 'JupyterLab extension table_of_contents is activated!'
    )
  ).toHaveLength(1);
});

test.use({ autoGoto: true });
test('should work Table of Contents button', async ({ page }) => {
  // create new notebook
  const fileName = "table_of_contents_test.ipynb";
  await page.notebook.createNew(fileName);
  await page.waitForSelector(`[role="main"] >> text=${fileName}`);
  // click Table of Contents button
  await page.locator('[data-command="table_of_contents:table-of-contents"]').click();
  // Table of Contents is visible
  const tableOfContents = page.locator('#jp-left-stack').locator('.jp-TableOfContents');
  await expect(tableOfContents).toBeVisible();
});
