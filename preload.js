const { contextBridge, ipcRenderer } = require("electron")

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld("electronAPI", {
  // 数据操作
  openExcelFile: () => ipcRenderer.invoke("open-excel-file"),
  exportExcel: () => ipcRenderer.invoke("export-excel"),
  addRow: (rowData) => ipcRenderer.invoke("add-row", rowData),
  updateRow: (rowData) => ipcRenderer.invoke("update-row", rowData),
  deleteRow: (rowId) => ipcRenderer.invoke("delete-row", rowId),
  addColumn: (columnName) => ipcRenderer.invoke("add-column", columnName),
  deleteColumn: (columnName) => ipcRenderer.invoke("delete-column", columnName),
  getCurrentData: () => ipcRenderer.invoke("get-current-data"),

  // 事件监听
  onExcelData: (callback) => {
    ipcRenderer.on("excel-data", (event, data) => callback(data))
    return () => {
      ipcRenderer.removeAllListeners("excel-data")
    }
  },
  onFileOpened: (callback) => {
    ipcRenderer.on("file-opened", (event, filename) => callback(filename))
    return () => {
      ipcRenderer.removeAllListeners("file-opened")
    }
  },
})
