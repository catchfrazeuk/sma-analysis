const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'SMA Analysis',
      submenu: [
        {
          label: 'About SMA Analysis',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About SMA Analysis',
              message: 'SMA Analysis',
              detail: 'Professional Audio Analysis Tool\nVersion 1.0.0',
            });
          },
        },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      ],
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Audio File',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                {
                  name: 'Audio Files',
                  extensions: ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'],
                },
                { name: 'All Files', extensions: ['*'] },
              ],
            });
            if (!result.canceled && mainWindow) {
              mainWindow.webContents.send('file-selected', result.filePaths[0]);
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Export',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('export-triggered');
            }
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      {
        name: 'Audio Files',
        extensions: ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'],
      },
      { name: 'All Files', extensions: ['*'] },
    ],
  });
  return result;
});

ipcMain.handle('save-file-dialog', async (event, filename) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: filename,
    filters: [
      { name: 'WAV Audio', extensions: ['wav'] },
      { name: 'MP3 Audio', extensions: ['mp3'] },
    ],
  });
  return result;
});
