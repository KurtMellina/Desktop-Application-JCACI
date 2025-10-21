const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any electron-specific APIs here if needed
  platform: process.platform,
  versions: process.versions,
  db: {
    ping: async () => {
      return await ipcRenderer.invoke('db:ping');
    },
    findOne: async (collection, filter) => {
      return await ipcRenderer.invoke('db:findOne', { collection, filter });
    },
    insertOne: async (collection, document) => {
      return await ipcRenderer.invoke('db:insertOne', { collection, document });
    }
  }
});
