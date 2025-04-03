import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { tocIcon } from '@jupyterlab/ui-components';
import { getPlatform, PlatformType } from './platform';

/**
 * Initialization data for the table_of_contents extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'table_of_contents:plugin',
  description: 'A JupyterLab extension.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension table_of_contents is activated!');
    
    const { commands } = app;
    const command = 'table_of_contents:table-of-contents';

    // Add a command
    commands.addCommand(command, {
      label: 'Table of Contents',
      icon: tocIcon,
      caption: 'Table of Contents',
      execute: async (args: any) => {
        const platform = await getPlatform(app);
        if (platform.type === PlatformType.JUPYTER_LAB) {
          // show table of contents panel.
          await app.commands.execute('toc:show-panel');
        } else if (platform.type === PlatformType.JUPYTER_NOTEBOOK7_EDITOR) {
          // toggle table of contents panel.
          await app.commands.execute('application:toggle-panel', {
            side: 'left',
            id: 'table-of-contents'
          });
        }
      }
    });
  }
};

export default plugin;
