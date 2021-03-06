const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;

const path = require('path');
const url = require('url');
const fs = require('fs');

let currentPath = '';
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });
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

/*******************************
 * IPCメインプロセスブロック
 * Renderプロセスからの通知を受信
 *******************************/
ipcMain.on('saveText', (event, content_json) => {
  saveFile(content_json);
});

//openFileボタンが押されたとき（ファイル名取得まで）
function openFile() {
  const win = BrowserWindow.getFocusedWindow();
  dialog.showOpenDialog(
    win, {
    properties: ['openFile'],
    filters: [{
      name: 'Document',
      extensions: ['csv', 'txt']
    }]
  },
    (fileNames) => {
      if (fileNames) {
        // alert(fileNames[0]);
        readFile(fileNames[0]); //複数選択の可能性もあるので配列となる。
      }
    }
  )
}

//指定したファイルを読み込む
function readFile(path) {
  fs.readFile(path, (error, data) => {
    if (error != null) {
      return;
    }
    preview.textContent = data.toString();
  })
}

//fileを保存（Pathと内容を指定）
function writeFile(path, data) {
  console.trace();
  fs.writeFile(path, data, (error) => {
    if (error != null) {
      return;
    }
  });
}

// saveFileボタンが押されたとき
// await/async を使ったPromise直列処理
async function saveFile(text) {
  const win = BrowserWindow.getFocusedWindow();
  // dialog.showSaveDialog() から filePath 返ってきてから後続の処理に続く
  const { filePath } = await dialog.showSaveDialog(
    win,
    {
      properties: ['openFile'],
      filters: [
        {
          name: 'Documents',
          extensions: ['json']
        }
      ]
    }
  );
  const data = text;
  writeFile(filePath, data);
}