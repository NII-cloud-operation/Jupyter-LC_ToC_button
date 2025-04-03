import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the table_of_contents extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'table_of_contents:plugin',
  description: 'A JupyterLab extension.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension table_of_contents is activated!');
  }
};

export default plugin;
