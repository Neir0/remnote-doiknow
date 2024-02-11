import { AppEvents, declareIndexPlugin, ReactRNPlugin, useAPIEventListener, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';

async function onActivate(plugin: ReactRNPlugin) {

  // Register a sidebar widget.
  await plugin.app.registerWidget('sample_widget', WidgetLocation.RightSidebar, {
    widgetTabTitle: 'DoIknow',
    widgetTabIcon: 'https://doiknow.app/img/logoplugin.jpg',
    dimensions: { height: 'auto', width: '100%' },
  });

}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
