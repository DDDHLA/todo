const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// 数据存储路径
const userDataPath = app.getPath('userData');
const dataFilePath = path.join(userDataPath, 'todos.json');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#f5f5f5'
  });

  mainWindow.loadFile('renderer.html');
  
  // 开发模式下打开开发者工具
  // mainWindow.webContents.openDevTools();
}

// 读取待办事项
function loadTodos() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('读取数据失败:', error);
  }
  return [];
}

// 保存待办事项
function saveTodos(todos) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('保存数据失败:', error);
    return false;
  }
}

// IPC 通信处理
ipcMain.handle('get-todos', () => {
  return loadTodos();
});

ipcMain.handle('save-todos', (event, todos) => {
  return saveTodos(todos);
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
