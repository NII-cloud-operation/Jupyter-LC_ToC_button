import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import {
  INotebookTracker,
  NotebookPanel,
  INotebookModel
} from '@jupyterlab/notebook';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { tocIcon } from '@jupyterlab/ui-components';
import { getPlatform, PlatformType } from './platform';
import { getTocMetadata, setTocMetadata, isTocVisible } from './toc';

/**
 * Initialization data for the table_of_contents extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'table_of_contents:plugin',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, tracker: INotebookTracker) => {
    console.log('JupyterLab extension table_of_contents is activated!');

    const { commands } = app;
    const command = 'table_of_contents:table-of-contents';

    // Setup for Notebook 7: restore TOC and save state on save
    tracker.widgetAdded.connect(
      async (_sender: INotebookTracker, panel: NotebookPanel) => {
        await panel.context.ready;

        const platform = await getPlatform(app);
        if (platform.type !== PlatformType.JUPYTER_NOTEBOOK7_EDITOR) {
          return;
        }

        // Restore TOC visibility from metadata
        const tocMetadata = getTocMetadata(tracker);
        const shouldShow = tocMetadata?.toc_window_display === true;
        const currentlyVisible = isTocVisible(app);

        if (shouldShow && !currentlyVisible) {
          await commands.execute('application:toggle-panel', {
            side: 'left',
            id: 'table-of-contents'
          });
        }

        // Save TOC visibility to metadata when notebook is saved
        panel.context.saveState.connect(
          (
            _context: DocumentRegistry.IContext<INotebookModel>,
            state: DocumentRegistry.SaveState
          ) => {
            if (state === 'started') {
              const visible = isTocVisible(app);
              const metadata = getTocMetadata(tracker) || {};
              setTocMetadata(tracker, {
                ...metadata,
                toc_window_display: visible
              });
            }
          }
        );
      }
    );

    // Add a command
    commands.addCommand(command, {
      label: 'Table of Contents',
      icon: tocIcon,
      caption: 'Table of Contents',
      execute: async () => {
        const platform = await getPlatform(app);
        if (platform.type === PlatformType.JUPYTER_LAB) {
          // show table of contents panel.
          await commands.execute('toc:show-panel');
        } else if (platform.type === PlatformType.JUPYTER_NOTEBOOK7_EDITOR) {
          // toggle table of contents panel.
          await commands.execute('application:toggle-panel', {
            side: 'left',
            id: 'table-of-contents'
          });
        }
      }
    });
  }
};

export default plugin;
