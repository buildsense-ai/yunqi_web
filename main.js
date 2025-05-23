const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron")
const path = require("path")
const ExcelJS = require("exceljs")
const fs = require("fs")

// 保持对window对象的全局引用，避免JavaScript对象被垃圾回收时窗口关闭
let mainWindow
// 存储当前打开的Excel文件路径
let currentFilePath = null
// 存储当前的数据
let currentData = {
  headers: [],
  rows: [],
}

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "assets/icon.png"),
  })

  // 加载应用的index.html
  mainWindow.loadFile("renderer/index.html")

  // 创建菜单
  const template = [
    {
      label: "文件",
      submenu: [
        {
          label: "打开Excel文件",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            openExcelFile()
          },
        },
        {
          label: "导出为新Excel文件",
          accelerator: "CmdOrCtrl+S",
          click: async () => {
            if (currentData.headers.length > 0) {
              exportToExcel()
            } else {
              dialog.showMessageBox(mainWindow, {
                type: "info",
                title: "提示",
                message: "没有数据可导出，请先打开Excel文件",
              })
            }
          },
        },
        { type: "separator" },
        {
          label: "退出",
          accelerator: "CmdOrCtrl+Q",
          click: () => {
            app.quit()
          },
        },
      ],
    },
    {
      label: "编辑",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
      ],
    },
    {
      label: "视图",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "帮助",
      submenu: [
        {
          label: "关于",
          click: async () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "关于",
              message: "Excel数据管理工具 v1.0.0\n一个简单易用的Excel数据管理应用",
            })
          },
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // 当window被关闭时触发
  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

// 当Electron完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(createWindow)

// 当所有窗口关闭时退出应用
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})

app.on("activate", () => {
  if (mainWindow === null) createWindow()
})

// 打开Excel文件
async function openExcelFile() {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: "选择Excel文件",
      filters: [{ name: "Excel文件", extensions: ["xlsx", "xls"] }],
      properties: ["openFile"],
    })

    if (!canceled && filePaths.length > 0) {
      const filePath = filePaths[0]
      currentFilePath = filePath

      // 读取Excel文件
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.readFile(filePath)

      // 获取第一个工作表
      const worksheet = workbook.getWorksheet(1)

      // 提取表头和数据
      const headers = []
      const rows = []

      // 获取表头（第一行）
      worksheet.getRow(1).eachCell((cell, colNumber) => {
        headers.push({
          id: colNumber,
          name: cell.value ? cell.value.toString() : `列${colNumber}`,
        })
      })

      // 获取数据行
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // 跳过表头行
          const rowData = {}
          row.eachCell((cell, colNumber) => {
            rowData[headers[colNumber - 1].name] = cell.value
          })
          rowData.id = rowNumber - 1 // 为每行添加唯一ID
          rows.push(rowData)
        }
      })

      currentData = { headers, rows }

      // 发送数据到渲染进程
      mainWindow.webContents.send("excel-data", currentData)
      mainWindow.webContents.send("file-opened", path.basename(filePath))
    }
  } catch (error) {
    console.error("打开Excel文件时出错:", error)
    dialog.showErrorBox("错误", `无法打开Excel文件: ${error.message}`)
  }
}

// 导出为新Excel文件
async function exportToExcel() {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: "导出为新Excel文件",
      defaultPath: currentFilePath ? path.dirname(currentFilePath) : app.getPath("documents"),
      filters: [{ name: "Excel文件", extensions: ["xlsx"] }],
    })

    if (!canceled && filePath) {
      // 创建新的工作簿和工作表
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet("Sheet1")

      // 添加表头
      const headerRow = worksheet.addRow(currentData.headers.map((header) => header.name))
      headerRow.font = { bold: true }

      // 添加数据行
      currentData.rows.forEach((row) => {
        const rowValues = currentData.headers.map((header) => row[header.name])
        worksheet.addRow(rowValues)
      })

      // 保存文件
      await workbook.xlsx.writeFile(filePath)

      dialog.showMessageBox(mainWindow, {
        type: "info",
        title: "成功",
        message: "数据已成功导出为Excel文件",
      })
    }
  } catch (error) {
    console.error("导出Excel文件时出错:", error)
    dialog.showErrorBox("错误", `无法导出Excel文件: ${error.message}`)
  }
}

// 处理IPC消息

// 添加新行数据
ipcMain.handle("add-row", async (event, rowData) => {
  try {
    // 为新行生成ID
    const newId = currentData.rows.length > 0 ? Math.max(...currentData.rows.map((row) => row.id)) + 1 : 1

    const newRow = { ...rowData, id: newId }
    currentData.rows.push(newRow)

    return { success: true, newRow }
  } catch (error) {
    console.error("添加数据行时出错:", error)
    return { success: false, error: error.message }
  }
})

// 更新行数据
ipcMain.handle("update-row", async (event, rowData) => {
  try {
    const index = currentData.rows.findIndex((row) => row.id === rowData.id)
    if (index !== -1) {
      currentData.rows[index] = rowData
      return { success: true }
    } else {
      return { success: false, error: "找不到要更新的数据行" }
    }
  } catch (error) {
    console.error("更新数据行时出错:", error)
    return { success: false, error: error.message }
  }
})

// 删除行数据
ipcMain.handle("delete-row", async (event, rowId) => {
  try {
    const index = currentData.rows.findIndex((row) => row.id === rowId)
    if (index !== -1) {
      currentData.rows.splice(index, 1)
      return { success: true }
    } else {
      return { success: false, error: "找不到要删除的数据行" }
    }
  } catch (error) {
    console.error("删除数据行时出错:", error)
    return { success: false, error: error.message }
  }
})

// 添加新列
ipcMain.handle("add-column", async (event, columnName) => {
  try {
    // 检查列名是否已存在
    if (currentData.headers.some((header) => header.name === columnName)) {
      return { success: false, error: "列名已存在" }
    }

    // 为新列生成ID
    const newId = currentData.headers.length > 0 ? Math.max(...currentData.headers.map((header) => header.id)) + 1 : 1

    // 添加新列到表头
    currentData.headers.push({ id: newId, name: columnName })

    // 为所有现有行添加新列（初始值为空）
    currentData.rows.forEach((row) => {
      row[columnName] = ""
    })

    return { success: true, headers: currentData.headers }
  } catch (error) {
    console.error("添加列时出错:", error)
    return { success: false, error: error.message }
  }
})

// 删除列
ipcMain.handle("delete-column", async (event, columnName) => {
  try {
    // 检查列是否存在
    const columnIndex = currentData.headers.findIndex((header) => header.name === columnName)
    if (columnIndex === -1) {
      return { success: false, error: "找不到要删除的列" }
    }

    // 从表头中删除列
    currentData.headers.splice(columnIndex, 1)

    // 从所有行中删除该列的数据
    currentData.rows.forEach((row) => {
      delete row[columnName]
    })

    return { success: true, headers: currentData.headers }
  } catch (error) {
    console.error("删除列时出错:", error)
    return { success: false, error: error.message }
  }
})

// 打开Excel文件（从渲染进程触发）
ipcMain.handle("open-excel-file", async () => {
  await openExcelFile()
  return { success: true }
})

// 导出Excel文件（从渲染进程触发）
ipcMain.handle("export-excel", async () => {
  if (currentData.headers.length > 0) {
    await exportToExcel()
    return { success: true }
  } else {
    return { success: false, error: "没有数据可导出" }
  }
})

// 获取当前数据
ipcMain.handle("get-current-data", () => {
  return currentData
})
