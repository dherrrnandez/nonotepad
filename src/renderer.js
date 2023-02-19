const { ipcRenderer } = require("electron")
const fs = require("fs")

let file
let data
let editor

document.addEventListener("keypress", () => {
    data = document.getElementById("editor").value
})

ipcRenderer.on("file", (event, content) => {
    document.getElementById("editor").value = content.text

    file = content.file
})

ipcRenderer.on("saveFile", (event) => {
    editor = document.getElementById("editor")

    const currentText = editor.value

    fs.writeFileSync(file, currentText, "utf-8")
})


// Add in near future

// ipcRenderer.on("saveAs", (event) => {
//     let text = document.getElementById("editor").value
//     ipcRenderer.send("saveAsText", text)
// })
