import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { autoUpdater } from 'electron-updater';
import { Menu } from 'electron';

let mainWindow;
const isMac = process.platform === 'darwin';

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      contextIsolation: false
    }

  });

  const template = [
    { 
      label: 'File'
    }
  ];
  const newMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(newMenu);

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);

    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  autoUpdater.checkForUpdatesAndNotify();// 업데이트 체크

  app.on('activate', () => {
   
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/** 자동 업데이트 관련 코드 */

/* autoUpdater.requestHeaders = { 'PRIVATE-TOKEN': 'glpat-naYysMsS8Z1nsPd5ABvt' };
autoUpdater.autoDownload = true;

autoUpdater.setFeedURL({
  provider: 'generic',
  channel: 'latest',
  url: 'https://gitlab.com/api/v4/projects/20492020/jobs/artifacts/main/download?job=build' });

autoUpdater.on('update-downloaded', () => {
  console.log('Leaving and restarting');
});

autoUpdater.on('update-available', () => {
  dialog.showMessageBox(
    mainWindow,
    {
      message: 'Un update is available, do you want to download and restart the app ?',
      buttons: ['Update now', 'Remind me later'],
      defaultId: 0,
      cancelId: 1
    })
    .then(result => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
        console.log('업데이트함');
      } else if (result.response === 1) {
        // bound to buttons array
        console.log('Cancel button clicked.');
      }
    }
    );
}); */

/* 응용창 메뉴 */

ipcMain.on('hi',() => {console.log('hello');});