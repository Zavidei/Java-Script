const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  createTab: () => ipcRenderer.send('create-tab'),
  onNewTab: (callback) => ipcRenderer.on('new-tab', (event, url) => callback(url)),
});
