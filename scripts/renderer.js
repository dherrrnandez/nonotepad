const { ipcRenderer } = require('electron') 
const fs = require('fs')

const textArea = document.getElementById('text-area')
let file

ipcRenderer.on('open-file', (event, filePath) => {
    const data = fs.readFileSync(filePath, 'utf-8')
    file = filePath
    textArea.value = data
    ipcRenderer.send('update-original-content', data)
})

ipcRenderer.on('save-file', (event) => {
    const data = textArea.value
    fs.writeFileSync(file, data, 'utf-8')
})

ipcRenderer.on('get-data', (event) => {
    const data = textArea.value
    ipcRenderer.send('get-current-data', data)
})
