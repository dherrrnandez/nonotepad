const { ipcRenderer } = require('electron') 
const fs = require('fs')

const textArea = document.getElementById('text-area')

ipcRenderer.on('open-file', (event, filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8')
    textArea.value = content
})
