const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
  savePreset: (preset) => ipcRenderer.invoke('save-preset', preset),
});
