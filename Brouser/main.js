const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: __dirname + '/preload.js', // Предзагрузка для IPC
    },
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Слушаем события для управления вкладками
ipcMain.on('create-tab', (event) => {
  event.sender.send('new-tab', 'https://www.google.ru/?hl=ru'); // URL по умолчанию
});
