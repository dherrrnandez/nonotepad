const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const fs = require('fs')

let win
let originalContent = ''
let unsavedChanges = false

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click: async () => {
          const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Text Files', extensions: ['txt'] }]
          })
          if (!result.canceled) {
            const filePath = result.filePaths[0]
            app.addRecentDocument(filePath)
            win.webContents.send('open-file', filePath)
            
            ipcMain.on('update-original-content', (event, data) => {
              originalContent = data
              unsavedChanges = false
            })
          }
        }
      },
      {
        label: 'Save',
        id: 'save button',
        click: () => {
          win.webContents.send('save-file')
        }
      },
      {
          label: 'Save as...',
          id: 'save as',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: async () => {
            win.webContents.send('get-data')

            await ipcMain.on('get-current-data', async (event, data) => {
              const { filePath } = await dialog.showSaveDialog({
                title: "Save file with Nonotepad",
              defaultPath : "C:\\Documents\\document.txt",
              buttonLabel : "Save File",
              filters :[
               {name: 'Text File', extensions: ['txt']},
               {name: 'All Files', extensions: ['*']}
              ],
              
              });
              if (!filePath.canceled) {
                fs.writeFileSync(filePath, data, 'utf-8');
                app.addRecentDocument(filePath)
                win.webContents.send('open-file', filePath)
              }
            })
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
