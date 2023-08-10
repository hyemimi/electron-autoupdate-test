import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { autoUpdater } from 'electron-updater';
import { Menu } from 'electron';
import ProgressBar from 'electron-progressbar';

let mainWindow;
const isMac = process.platform === 'darwin';
autoUpdater.autoDownload = false;

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

  autoUpdater.checkForUpdates(); // autoUpdater에서 업데이트를 감지함

  autoUpdater.on('update-available', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update available',
        message:
          '새로운 버전으로 업데이트가 가능합니다. 업데이트 하시겠습니까?',
        buttons: ['Update', 'Later']
      })
      .then((result) => {
        const buttonIndex = result.response;

        if (buttonIndex === 0) autoUpdater.downloadUpdate();
      });
  });

  autoUpdater.on('download-progress', (progressObj) => { console.log('다운로드 진행중'); });
  /*  autoUpdater.on('download-progress', (progressObj) => {
    progressBar
      .on('completed', function() {
        progressBar.value = progressObj.percent;
        progressBar.detail = 'Task completed. Exiting...';
      })
      .on('aborted', function(value) {
      })
      .on('progress', function(value) {
        progressBar.value = progressObj.percent;
        progressBar.detail = `Downloading...  ${(progressObj.bytesPerSecond / 1000).toFixed(2)} 
        KB/s (${(progressObj.transferred / 1000000).toFixed(2)} MB / ${(progressObj.total / 1000000).toFixed(2)} MB)`;
      });
    /* progressBar.value = progressObj.percent;
    progressBar.detail = `Downloading...  ${(progressObj.bytesPerSecond / 1000).toFixed(2)} 
    KB/s (${(progressObj.transferred / 1000000).toFixed(2)} MB / ${(progressObj.total / 1000000).toFixed(2)} MB)`; 
  });
  */

  autoUpdater.on('update-downloaded', (info) => {

    //progressBar.setCompleted();
    //progressBar.close();
    
    /*  const selectBox = {
      type: 'info',
      defaultId: 0,
      title: 'electron-updater',
      message: '설치 후 재시작합니다'
    };
    const btnIndex = dialog.showMessageBoxSync(mainWindow, selectBox);
    if (btnIndex === 0) { */
    autoUpdater.quitAndInstall();
    
  });

  /*  autoUpdater.on('error', (err) => {
    console.error('Error in auto-updater:', err);
  }); */

  /*   const Box = {
      type: 'info',
      title: 'electron-updater',
      message: '다운로드가 완료되었습니다!'
    };
    dialog.showMessageBoxSync(mainWindow, Box);// 업데이트를 설치하고 재시작한다 update-downloaded가 끝난 뒤 발생
  }); */

  /* autoUpdater.on('download-progress', (progressObj) => {
    let log_message;
    log_message = log_message + ` - Downloaded ${progressObj.percent}%`;
    log_message = log_message + `Total downloaded: ${progressObj.transferred}/${progressObj.total}`;
    
    const progress = {
      type: ''
    }
  }); */ // 커스텀 가능한지?

  /* autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded:', info);

    const selectBox = {
      type: 'question',
      buttons: ['업데이트','취소'],
      defaultId: 0,
      title: 'electron-updater',
      message: '새로운 버전으로 업데이트 할 수 있습니다. 업데이트 하시겠습니까?'
    };
    const btnIndex = dialog.showMessageBoxSync(mainWindow, selectBox);

    if (btnIndex === 0) {
      autoUpdater.downloadUpdate();
    }

    mainWindow?.webContents.send('message','두둥~');
  }); */

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