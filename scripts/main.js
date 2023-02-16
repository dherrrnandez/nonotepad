const { app, BrowserWindow, Menu, dialog } = require('electron')

let win

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        click: async () => {
          const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Text Files', extensions: ['txt'] }]
          })
          if (!result.canceled) {
            const filePath = result.filePaths[0]
            app.addRecentDocument(filePath)
            win.webContents.send('open-file', filePath)
          }
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  win.webContents.openDevTools();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
