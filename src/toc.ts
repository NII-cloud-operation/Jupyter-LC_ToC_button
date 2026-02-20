import { JupyterFrontEnd } from '@jupyterlab/application';
import { INotebookTracker } from '@jupyterlab/notebook';

/**
 * Get TOC metadata from notebook
 */
export function getTocMetadata(
  tracker: INotebookTracker
): Record<string, unknown> | null {
  const model = tracker.currentWidget?.content.model;
  if (!model) {
    return null;
  }
  return model.getMetadata('toc') as Record<string, unknown> | null;
}

/**
 * Set TOC metadata to notebook
 */
export function setTocMetadata(
  tracker: INotebookTracker,
  tocMetadata: Record<string, unknown>
): void {
  const model = tracker.currentWidget?.content.model;
  if (!model) {
    return;
  }
  model.setMetadata('toc', tocMetadata);
}

/**
 * Check if TOC panel is currently visible (Notebook 7 only)
 */
export function isTocVisible(app: JupyterFrontEnd): boolean {
  return app.commands.isToggled('application:toggle-panel', {
    side: 'left',
    id: 'table-of-contents'
  });
}
