const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { ipcMain } = require('electron');

const path = require('path');
const url = require('url');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 1000, height: 800, webPreferences: {
        nodeIntegration: true
    }});
    mainWindow.setMenu(null);
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });    
    mainWindow.loadURL(startUrl);
    mainWindow.on('closed', function () {
        mainWindow = null
    })
    mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});

/**
 * Renderプロセスからの通知を受信
 */
ipcMain.on('notifyText', (event, args) => {
  //TODO: データ受信時の処理
  alert('通信成功！');
});