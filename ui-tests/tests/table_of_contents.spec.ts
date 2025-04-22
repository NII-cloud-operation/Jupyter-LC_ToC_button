import { IJupyterLabPage, expect, test } from '@jupyterlab/galata';
import { Page, test as treeTest } from '@playwright/test';

// https://github.com/jupyterlab/jupyterlab/blob/9844a6fdb680aeae28a4d6238433f751ce5a6204/galata/src/fixtures.ts#L319-L336
async function waitForLabApplication({ baseURL }, use) {
  const waitIsReady = async (
    page: Page,
    helpers: IJupyterLabPage
  ): Promise<void> => {
    await page.waitForSelector('#jupyterlab-splash', {
      state: 'detached'
    });
    await helpers.waitForCondition(() => {
      return helpers.activity.isTabActive('Launcher');
    });
    // Oddly current tab is not always set to active
    if (!(await helpers.isInSimpleMode())) {
      await helpers.activity.activateTab('Launcher');
    }
  };
  await use(waitIsReady);
}

async function waitForTreeApplication(page: Page) {
  await page.waitForSelector('.jp-FileBrowser-Panel', {
    state: 'visible'
  });
}

async function waitForNotebookApplication(page: Page) {
  await page.waitForSelector('.jp-NotebookPanel:not(.lm-DockPanel-widget)', {
    state: 'visible'
  });
}

/**
 * Don't load JupyterLab webpage before running the tests.
 * This is required to ensure we capture all log messages.
 */
test.use({
  autoGoto: false,
  waitForApplication: waitForLabApplication
});
test('should emit an activation console message on JupyterLab', async ({
  page
}) => {
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

treeTest(
  'should emit an activation console message on Jupyter Notebook 7',
  async ({ page }) => {
    const logs: string[] = [];

    page.on('console', message => {
      logs.push(message.text());
    });

    await page.goto('http://localhost:8888/tree');
    await waitForTreeApplication(page);

    expect(
      logs.filter(
        s => s === 'JupyterLab extension table_of_contents is activated!'
      )
    ).toHaveLength(1);
  }
);

test.use({
  autoGoto: true,
  waitForApplication: waitForLabApplication
});
test('should work Table of Contents button on JupyterLab', async ({ page }) => {
  // create new notebook
  const fileName = 'table_of_contents_test1.ipynb';
  await page.notebook.createNew(fileName);
  await page.waitForSelector(`[role="main"] >> text=${fileName}`);
  // click Table of Contents button
  const tocButton = page.locator(
    '[data-command="table_of_contents:table-of-contents"]'
  );
  await tocButton.click();
  // Table of Contents is visible
  const tableOfContents = page.locator('#table-of-contents');
  await expect(tableOfContents).toBeVisible();
});

treeTest(
  'should work Table of Contents button on Jupyter Notebook 7',
  async ({ page }) => {
    await page.goto('http://localhost:8888/tree');
    await waitForTreeApplication(page);

    // create new notebook and open new page in browser
    const newButton = page.locator('div[data-jp-item-name="new-dropdown"]');
    await newButton.click();
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator('li[data-command="notebook:create-new"]').click()
    ]);
    await waitForNotebookApplication(newPage);

    // click Table of Contents button
    const tocButton = newPage.locator(
      '[data-command="table_of_contents:table-of-contents"]'
    );
    await tocButton.click();

    // Table of Contents is visible
    const tableOfContents = newPage.locator('#table-of-contents');
    await expect(tableOfContents).toBeVisible();

    // click Table of Contents button again
    await tocButton.click();

    // Table of Contents is hidden
    await expect(tableOfContents).toBeHidden();
  }
);
