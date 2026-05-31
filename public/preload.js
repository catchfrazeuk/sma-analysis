const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  saveFileDialog: (filename) => ipcRenderer.invoke('save-file-dialog', filename),
  onFileSelected: (callback) => ipcRenderer.on('file-selected', (event, filePath) => callback(filePath)),
  onExportTriggered: (callback) => ipcRenderer.on('export-triggered', callback),
});
