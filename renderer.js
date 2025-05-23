// 渲染进程的脚本
const { ipcRenderer } = require("electron")

document.addEventListener("DOMContentLoaded", () => {
  const messageInput = document.getElementById("message-input")
  const sendButton = document.getElementById("send-button")
  const responseDiv = document.getElementById("response")

  // 发送消息到主进程
  sendButton.addEventListener("click", () => {
    const message = messageInput.value
    if (message) {
      ipcRenderer.send("message-from-renderer", message)
      messageInput.value = ""
    }
  })

  // 监听来自主进程的消息
  ipcRenderer.on("message-from-main", (event, arg) => {
    responseDiv.textContent = arg
  })
})
