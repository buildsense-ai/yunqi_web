// 全局变量
let currentData = {
  headers: [],
  rows: [],
}
let currentPage = 1
const rowsPerPage = 10
let filteredRows = []
let editingRowId = null

// DOM元素
const welcomeScreen = document.getElementById("welcomeScreen")
const dataManagement = document.getElementById("dataManagement")
const fileInfo = document.getElementById("fileInfo")
const currentFileName = document.getElementById("currentFileName")
const tableHeader = document.getElementById("tableHeader")
const tableBody = document.getElementById("tableBody")
const pagination = document.getElementById("pagination")
const searchInput = document.getElementById("searchInput")
const exportBtn = document.getElementById("exportBtn")

// 模态框
const dataFormModal = new bootstrap.Modal(document.getElementById("dataFormModal"))
const columnModal = new bootstrap.Modal(document.getElementById("columnModal"))
const deleteColumnModal = new bootstrap.Modal(document.getElementById("deleteColumnModal"))
const deleteRowModal = new bootstrap.Modal(document.getElementById("deleteRowModal"))

// 初始化应用
document.addEventListener("DOMContentLoaded", () => {
  // 绑定按钮事件
  document.getElementById("openFileBtn").addEventListener("click", openExcelFile)
  document.getElementById("welcomeOpenBtn").addEventListener("click", openExcelFile)
  document.getElementById("exportBtn").addEventListener("click", exportExcel)
  document.getElementById("addRowBtn").addEventListener("click", showAddRowForm)
  document.getElementById("addColumnBtn").addEventListener("click", showColumnModal)
  document.getElementById("saveDataBtn").addEventListener("click", saveRowData)
  document.getElementById("saveColumnBtn").addEventListener("click", saveColumn)
  document.getElementById("confirmDeleteColumnBtn").addEventListener("click", deleteColumn)
  document.getElementById("confirmDeleteRowBtn").addEventListener("click", confirmDeleteRow)
  document.getElementById("searchBtn").addEventListener("click", searchData)
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      searchData()
    }
  })

  // 监听Excel数据
  window.electronAPI.onExcelData((data) => {
    currentData = data
    filteredRows = [...currentData.rows]
    showDataManagement()
    renderTable()
    updateColumnDeleteOptions()
  })

  // 监听文件打开事件
  window.electronAPI.onFileOpened((filename) => {
    currentFileName.textContent = filename
    fileInfo.classList.remove("d-none")
    exportBtn.disabled = false
  })

  // 加载当前数据（如果有）
  loadCurrentData()
})

// 加载当前数据
async function loadCurrentData() {
  try {
    const data = await window.electronAPI.getCurrentData()
    if (data && data.headers && data.headers.length > 0) {
      currentData = data
      filteredRows = [...currentData.rows]
      showDataManagement()
      renderTable()
      updateColumnDeleteOptions()
      exportBtn.disabled = false
    }
  } catch (error) {
    console.error("加载当前数据时出错:", error)
  }
}

// 打开Excel文件
async function openExcelFile() {
  try {
    const result = await window.electronAPI.openExcelFile()
    if (result.success) {
      // 数据将通过onExcelData事件接收
    }
  } catch (error) {
    console.error("打开Excel文件时出错:", error)
    showErrorMessage("无法打开Excel文件")
  }
}

// 导出Excel文件
async function exportExcel() {
  try {
    const result = await window.electronAPI.exportExcel()
    if (!result.success) {
      showErrorMessage(result.error || "导出失败")
    }
  } catch (error) {
    console.error("导出Excel文件时出错:", error)
    showErrorMessage("无法导出Excel文件")
  }
}

// 显示数据管理界面
function showDataManagement() {
  welcomeScreen.classList.add("d-none")
  dataManagement.classList.remove("d-none")
}

// 渲染表格
function renderTable() {
  renderTableHeader()
  renderTableRows()
  renderPagination()
}

// 渲染表格头部
function renderTableHeader() {
  tableHeader.innerHTML = ""

  // 创建序号列
  const indexTh = document.createElement("th")
  indexTh.textContent = "#"
  indexTh.style.width = "50px"
  tableHeader.appendChild(indexTh)

  // 创建数据列
  currentData.headers.forEach((header) => {
    const th = document.createElement("th")
    th.textContent = header.name

    // 添加删除列按钮
    const deleteBtn = document.createElement("button")
    deleteBtn.className = "btn btn-sm btn-outline-danger ms-2"
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>'
    deleteBtn.title = "删除此列"
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      showDeleteColumnModal(header.name)
    })

    th.appendChild(deleteBtn)
    tableHeader.appendChild(th)
  })

  // 创建操作列
  const actionTh = document.createElement("th")
  actionTh.textContent = "操作"
  actionTh.style.width = "120px"
  tableHeader.appendChild(actionTh)
}

// 渲染表格行
function renderTableRows() {
  tableBody.innerHTML = ""

  if (filteredRows.length === 0) {
    const emptyRow = document.createElement("tr")
    const emptyCell = document.createElement("td")
    emptyCell.colSpan = currentData.headers.length + 2
    emptyCell.className = "text-center py-4"
    emptyCell.textContent = "没有数据"
    emptyRow.appendChild(emptyCell)
    tableBody.appendChild(emptyRow)
    return
  }

  // 计算当前页的行
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length)
  const currentRows = filteredRows.slice(startIndex, endIndex)

  // 创建行
  currentRows.forEach((row, index) => {
    const tr = document.createElement("tr")

    // 序号列
    const indexTd = document.createElement("td")
    indexTd.textContent = startIndex + index + 1
    tr.appendChild(indexTd)

    // 数据列
    currentData.headers.forEach((header) => {
      const td = document.createElement("td")
      td.textContent = row[header.name] !== undefined ? row[header.name] : ""
      tr.appendChild(td)
    })

    // 操作列
    const actionTd = document.createElement("td")
    actionTd.className = "action-buttons"

    // 编辑按钮
    const editBtn = document.createElement("button")
    editBtn.className = "btn btn-sm btn-primary table-action-btn"
    editBtn.innerHTML = '<i class="fas fa-edit"></i>'
    editBtn.title = "编辑"
    editBtn.addEventListener("click", () => showEditRowForm(row))

    // 删除按钮
    const deleteBtn = document.createElement("button")
    deleteBtn.className = "btn btn-sm btn-danger table-action-btn"
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'
    deleteBtn.title = "删除"
    deleteBtn.addEventListener("click", () => showDeleteRowModal(row.id))

    actionTd.appendChild(editBtn)
    actionTd.appendChild(deleteBtn)
    tr.appendChild(actionTd)

    tableBody.appendChild(tr)
  })
}

// 渲染分页
function renderPagination() {
  pagination.innerHTML = ""

  if (filteredRows.length <= rowsPerPage) {
    return
  }

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage)

  // 上一页按钮
  const prevLi = document.createElement("li")
  prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`
  const prevLink = document.createElement("a")
  prevLink.className = "page-link"
  prevLink.href = "#"
  prevLink.innerHTML = "&laquo;"
  prevLink.addEventListener("click", (e) => {
    e.preventDefault()
    if (currentPage > 1) {
      currentPage--
      renderTableRows()
      renderPagination()
    }
  })
  prevLi.appendChild(prevLink)
  pagination.appendChild(prevLi)

  // 页码按钮
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageLi = document.createElement("li")
    pageLi.className = `page-item ${i === currentPage ? "active" : ""}`
    const pageLink = document.createElement("a")
    pageLink.className = "page-link"
    pageLink.href = "#"
    pageLink.textContent = i
    pageLink.addEventListener("click", (e) => {
      e.preventDefault()
      currentPage = i
      renderTableRows()
      renderPagination()
    })
    pageLi.appendChild(pageLink)
    pagination.appendChild(pageLi)
  }

  // 下一页按钮
  const nextLi = document.createElement("li")
  nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`
  const nextLink = document.createElement("a")
  nextLink.className = "page-link"
  nextLink.href = "#"
  nextLink.innerHTML = "&raquo;"
  nextLink.addEventListener("click", (e) => {
    e.preventDefault()
    if (currentPage < totalPages) {
      currentPage++
      renderTableRows()
      renderPagination()
    }
  })
  nextLi.appendChild(nextLink)
  pagination.appendChild(nextLi)
}

// 显示添加行表单
function showAddRowForm() {
  editingRowId = null
  document.getElementById("dataFormModalLabel").textContent = "添加新数据"
  document.getElementById("rowId").value = ""

  const formFields = document.getElementById("formFields")
  formFields.innerHTML = ""

  currentData.headers.forEach((header) => {
    const col = document.createElement("div")
    col.className = "col-md-6 mb-3"

    const label = document.createElement("label")
    label.className = "form-label required-field"
    label.htmlFor = `field_${header.id}`
    label.textContent = header.name

    const input = document.createElement("input")
    input.type = "text"
    input.className = "form-control"
    input.id = `field_${header.id}`
    input.name = header.name
    input.required = true

    col.appendChild(label)
    col.appendChild(input)
    formFields.appendChild(col)
  })

  dataFormModal.show()
}

// 显示编辑行表单
function showEditRowForm(row) {
  editingRowId = row.id
  document.getElementById("dataFormModalLabel").textContent = "编辑数据"
  document.getElementById("rowId").value = row.id

  const formFields = document.getElementById("formFields")
  formFields.innerHTML = ""

  currentData.headers.forEach((header) => {
    const col = document.createElement("div")
    col.className = "col-md-6 mb-3"

    const label = document.createElement("label")
    label.className = "form-label required-field"
    label.htmlFor = `field_${header.id}`
    label.textContent = header.name

    const input = document.createElement("input")
    input.type = "text"
    input.className = "form-control"
    input.id = `field_${header.id}`
    input.name = header.name
    input.value = row[header.name] !== undefined ? row[header.name] : ""
    input.required = true

    col.appendChild(label)
    col.appendChild(input)
    formFields.appendChild(col)
  })

  dataFormModal.show()
}

// 保存行数据
async function saveRowData() {
  try {
    const form = document.getElementById("dataForm")
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const rowData = {}
    currentData.headers.forEach((header) => {
      const input = document.getElementById(`field_${header.id}`)
      rowData[header.name] = input.value
    })

    if (editingRowId) {
      // 更新现有行
      rowData.id = Number.parseInt(editingRowId)
      const result = await window.electronAPI.updateRow(rowData)
      if (result.success) {
        const index = currentData.rows.findIndex((row) => row.id === rowData.id)
        if (index !== -1) {
          currentData.rows[index] = rowData
        }

        // 更新过滤后的行
        const filteredIndex = filteredRows.findIndex((row) => row.id === rowData.id)
        if (filteredIndex !== -1) {
          filteredRows[filteredIndex] = rowData
        }

        showSuccessMessage("数据已成功更新")
      } else {
        showErrorMessage(result.error || "更新数据失败")
      }
    } else {
      // 添加新行
      const result = await window.electronAPI.addRow(rowData)
      if (result.success) {
        currentData.rows.push(result.newRow)
        filteredRows = [...currentData.rows]
        showSuccessMessage("数据已成功添加")
      } else {
        showErrorMessage(result.error || "添加数据失败")
      }
    }

    dataFormModal.hide()
    renderTable()
  } catch (error) {
    console.error("保存数据时出错:", error)
    showErrorMessage("保存数据时出错")
  }
}

// 显示添加列模态框
function showColumnModal() {
  document.getElementById("columnName").value = ""
  columnModal.show()
}

// 保存新列
async function saveColumn() {
  try {
    const columnName = document.getElementById("columnName").value.trim()
    if (!columnName) {
      showErrorMessage("请输入列名")
      return
    }

    const result = await window.electronAPI.addColumn(columnName)
    if (result.success) {
      currentData.headers = result.headers
      showSuccessMessage("新列已成功添加")
      columnModal.hide()
      renderTable()
      updateColumnDeleteOptions()
    } else {
      showErrorMessage(result.error || "添加列失败")
    }
  } catch (error) {
    console.error("添加列时出错:", error)
    showErrorMessage("添加列时出错")
  }
}

// 显示删除列模态框
function showDeleteColumnModal(columnName) {
  updateColumnDeleteOptions(columnName)
  deleteColumnModal.show()
}

// 更新列删除选项
function updateColumnDeleteOptions(selectedColumn = null) {
  const columnSelect = document.getElementById("columnToDelete")
  columnSelect.innerHTML = ""

  currentData.headers.forEach((header) => {
    const option = document.createElement("option")
    option.value = header.name
    option.textContent = header.name
    if (selectedColumn && header.name === selectedColumn) {
      option.selected = true
    }
    columnSelect.appendChild(option)
  })
}

// 删除列
async function deleteColumn() {
  try {
    const columnName = document.getElementById("columnToDelete").value
    if (!columnName) {
      showErrorMessage("请选择要删除的列")
      return
    }

    const result = await window.electronAPI.deleteColumn(columnName)
    if (result.success) {
      currentData.headers = result.headers
      showSuccessMessage("列已成功删除")
      deleteColumnModal.hide()
      renderTable()
    } else {
      showErrorMessage(result.error || "删除列失败")
    }
  } catch (error) {
    console.error("删除列时出错:", error)
    showErrorMessage("删除列时出错")
  }
}

// 显示删除行模态框
function showDeleteRowModal(rowId) {
  document.getElementById("confirmDeleteRowBtn").dataset.rowId = rowId
  deleteRowModal.show()
}

// 确认删除行
async function confirmDeleteRow() {
  try {
    const rowId = Number.parseInt(document.getElementById("confirmDeleteRowBtn").dataset.rowId)
    const result = await window.electronAPI.deleteRow(rowId)

    if (result.success) {
      // 从数据中移除行
      const index = currentData.rows.findIndex((row) => row.id === rowId)
      if (index !== -1) {
        currentData.rows.splice(index, 1)
      }

      // 从过滤后的行中移除
      const filteredIndex = filteredRows.findIndex((row) => row.id === rowId)
      if (filteredIndex !== -1) {
        filteredRows.splice(filteredIndex, 1)
      }

      showSuccessMessage("数据已成功删除")
      deleteRowModal.hide()
      renderTable()
    } else {
      showErrorMessage(result.error || "删除数据失败")
    }
  } catch (error) {
    console.error("删除行时出错:", error)
    showErrorMessage("删除行时出错")
  }
}

// 搜索数据
function searchData() {
  const searchTerm = searchInput.value.trim().toLowerCase()

  if (searchTerm === "") {
    filteredRows = [...currentData.rows]
  } else {
    filteredRows = currentData.rows.filter((row) => {
      return Object.keys(row).some((key) => {
        if (key === "id") return false
        const value = row[key]
        return value !== null && value !== undefined && value.toString().toLowerCase().includes(searchTerm)
      })
    })
  }

  currentPage = 1
  renderTable()
}

// 显示成功消息
function showSuccessMessage(message) {
  // 这里可以使用toast或其他通知组件
  alert(message)
}

// 显示错误消息
function showErrorMessage(message) {
  // 这里可以使用toast或其他通知组件
  alert("错误: " + message)
}
