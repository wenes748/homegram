const { app, BrowserWindow, screen } = require('electron');

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const winWidth = Math.max(380, Math.min(width - 80, 1200));
  const winHeight = Math.max(600, Math.min(height - 80, 820));

  const win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    minWidth: 360,
    minHeight: 520,
    title: 'Homegram',
    backgroundColor: '#17212b',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL('https://homegram.onrender.com/'); // ПОТОМ ЗАМЕНИШЬ НА СВОЙ АДРЕС С RENDER
}

app.whenReady().then(() => setTimeout(createWindow, 500));
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});