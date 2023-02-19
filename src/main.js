const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron")
const path = require("path")
const fs = require("fs")

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#252525",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'renderer.js'),
    }
  })

  win.loadURL(`file://${path.join(__dirname, 'index.html')}`);

  let file
  let content

  const menu = Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [
        {
          label: "Open...",
          id: "open file",
          accelerator: "Ctrl+O",
          enabled: true,
          click: async () => {
            await dialog.showOpenDialog(win, {
              properties: ['openFile']
            }).then(result => {
              file = result.filePaths[0]
            }).catch(err => {
              console.log(err)
            })

            text = fs.readFileSync(file).toString()

            content = {
              text: text,
              file: file
            }

            if (text !== "") {
              openItem = menu.getMenuItemById("open file")
              openItem.enabled = false
            }

            saveItem = menu.getMenuItemById("save file")
            saveItem.enabled = true

            win.webContents.send("file", content)
          }
        },
        {
          label: "Save",
          id: "save file",
          enabled: false,
          accelerator: "Ctrl+S",
          click: async () => {
            win.webContents.send("saveFile")
          }
        }

        // Add in near future

        // {
        //   label: "Save as...",
        //   id: "save as",
        //   accelerator: "Ctrl+Shift+S",
        //   click: () => {
        //     win.webContents.send("saveAs")

        //     const dialogOptions = {
        //       defaultPath: "c:/",
        //       filters: [
        //         { name: "Text", extensions: ["txt"] },
        //         { name: "All Files", extensions: ["*"] }
        //       ]
        //     }

        //     ipcMain.on("saveAsText", (text) => {
        //       dialog.showSaveDialog(dialogOptions).then(({ filePath }) => {
        //         fs.writeFileSync(filePath, text, 'utf-8');
        //       });
        //     })
        //   }
        // }
      ]

    }
  ])

  Menu.setApplicationMenu(menu)
  win.loadFile("index.html")

}


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})

// app.whenReady().then(() => {
//   createWindow()

//   app.on("activate", () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow()
//   })
// })

app.on('ready', () => {
  app.setAsDefaultProtocolClient('myapp', process.execPath, [path.resolve(process.argv[1])]);

  if (process.argv.length >= 2) {
    const file = process.argv[1];
    createWindow();

    win.webContents.on('did-finish-load', () => {
      text = fs.readFileSync(file).toString()

            content = {
              text: text,
              file: file
            }
      win.webContents.send('file', file);
    });
  } else {
    createWindow();
  }
});