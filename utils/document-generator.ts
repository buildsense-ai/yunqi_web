import { Document, Packer, Paragraph, Table, TableRow, TableCell, BorderStyle } from "docx"
import { saveAs } from "file-saver"
import type { DocumentData } from "@/types/document-template"
import type { Event } from "@/types/event"

export async function generateDocument(documentData: DocumentData, events: Event[]): Promise<void> {
  // Create a new document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: createDocumentContent(documentData, events),
      },
    ],
  })

  // Generate and save the document
  const buffer = await Packer.toBlob(doc)
  saveAs(buffer, `${getDocumentTitle(documentData)}.docx`)
}

function getDocumentTitle(documentData: DocumentData): string {
  // Get title from template ID
  const titles: Record<string, string> = {
    "inspection-record": "巡视记录",
    "supervision-notification": "监理通知单",
  }

  return titles[documentData.templateId] || "文档"
}

function createDocumentContent(documentData: DocumentData, events: Event[]) {
  const { templateId, fields } = documentData

  // Different templates have different content structures
  switch (templateId) {
    case "inspection-record":
      return createInspectionRecord(fields, events)
    case "supervision-notification":
      return createSupervisionNotification(fields, events)
    default:
      return [new Paragraph("文档内容")]
  }
}

function createInspectionRecord(fields: DocumentData["fields"], events: Event[]) {
  const content = []

  // Title
  content.push(
    new Paragraph({
      text: "巡视记录",
      heading: "Heading1",
      alignment: "center",
    }),
  )

  // Project info table
  content.push(
    new Table({
      width: {
        size: 100,
        type: "pct",
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 20,
                type: "pct",
              },
              children: [new Paragraph("工程项目名称:")],
            }),
            new TableCell({
              width: {
                size: 30,
                type: "pct",
              },
              children: [new Paragraph((fields.projectName?.value as string) || "")],
            }),
            new TableCell({
              width: {
                size: 20,
                type: "pct",
              },
              children: [new Paragraph("编号:")],
            }),
            new TableCell({
              width: {
                size: 30,
                type: "pct",
              },
              children: [new Paragraph((fields.projectNumber?.value as string) || "")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 20,
                type: "pct",
              },
              children: [new Paragraph("巡视施工部位")],
            }),
            new TableCell({
              width: {
                size: 30,
                type: "pct",
              },
              children: [new Paragraph((fields.inspectionLocation?.value as string) || "")],
            }),
            new TableCell({
              width: {
                size: 20,
                type: "pct",
              },
              children: [new Paragraph("施工单位")],
            }),
            new TableCell({
              width: {
                size: 30,
                type: "pct",
              },
              children: [new Paragraph((fields.constructionUnit?.value as string) || "")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 20,
                type: "pct",
              },
              children: [new Paragraph("巡视时间")],
            }),
            new TableCell({
              columnSpan: 3,
              children: [
                new Paragraph(
                  fields.inspectionDate?.value
                    ? new Date(fields.inspectionDate.value as string).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "",
                ),
              ],
            }),
          ],
        }),
      ],
    }),
  )

  // Content from events
  if (events.length > 0) {
    content.push(
      new Paragraph({
        text: "巡视内容:",
        spacing: {
          before: 400,
          after: 200,
        },
      }),
    )

    events.forEach((event, index) => {
      content.push(
        new Paragraph({
          text: `${index + 1}. ${event.summary}`,
          spacing: {
            before: 200,
          },
        }),
      )

      if (event.messages && event.messages.length > 0) {
        event.messages.forEach((message) => {
          content.push(
            new Paragraph({
              text: message.content,
              indent: {
                left: 720, // 0.5 inch in twips
              },
              spacing: {
                before: 100,
              },
            }),
          )
        })
      }
    })
  }

  // Signature
  content.push(
    new Paragraph({
      text: "巡视监理人员（签名）:",
      alignment: "right",
      spacing: {
        before: 800,
      },
    }),
  )

  content.push(
    new Paragraph({
      text: (fields.responsiblePerson?.value as string) || "",
      alignment: "right",
      spacing: {
        before: 200,
      },
    }),
  )

  content.push(
    new Paragraph({
      text: fields.inspectionDate?.value
        ? new Date(fields.inspectionDate.value as string).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
      alignment: "right",
      spacing: {
        before: 200,
      },
    }),
  )

  return content
}

function createSupervisionNotification(fields: DocumentData["fields"], events: Event[]) {
  const content = []

  // Title
  content.push(
    new Paragraph({
      text: "监理通知单",
      heading: "Heading1",
      alignment: "center",
    }),
  )

  // Project info table
  content.push(
    new Table({
      width: {
        size: 100,
        type: "pct",
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 20,
                type: "pct",
              },
              children: [new Paragraph("工程项目名称:")],
            }),
            new TableCell({
              width: {
                size: 50,
                type: "pct",
              },
              children: [new Paragraph((fields.projectName?.value as string) || "")],
            }),
            new TableCell({
              width: {
                size: 10,
                type: "pct",
              },
              children: [new Paragraph("编号:")],
            }),
            new TableCell({
              width: {
                size: 20,
                type: "pct",
              },
              children: [new Paragraph((fields.projectNumber?.value as string) || "")],
            }),
          ],
        }),
      ],
    }),
  )

  // Content
  content.push(
    new Paragraph({
      text: "事由:",
      spacing: {
        before: 400,
        after: 200,
      },
    }),
  )

  // Event content
  if (events.length > 0) {
    events.forEach((event) => {
      content.push(
        new Paragraph({
          text: event.summary,
          spacing: {
            before: 200,
          },
        }),
      )
    })
  }

  content.push(
    new Paragraph({
      text: "内容:",
      spacing: {
        before: 400,
        after: 200,
      },
    }),
  )

  // Event messages
  if (events.length > 0) {
    events.forEach((event) => {
      if (event.messages && event.messages.length > 0) {
        event.messages.forEach((message) => {
          content.push(
            new Paragraph({
              text: message.content,
              spacing: {
                before: 100,
              },
            }),
          )
        })
      }
    })
  }

  // Signatures
  content.push(
    new Paragraph({
      text: "项目监理机构（项目章）:",
      alignment: "right",
      spacing: {
        before: 800,
      },
    }),
  )

  content.push(
    new Paragraph({
      text: (fields.projectManager?.value as string) || "",
      alignment: "right",
      spacing: {
        before: 200,
      },
    }),
  )

  content.push(
    new Paragraph({
      text: "总监理工程师（代表）/专业监理工程师（签名）:",
      alignment: "right",
      spacing: {
        before: 400,
      },
    }),
  )

  content.push(
    new Paragraph({
      text: (fields.chiefEngineer?.value as string) || "",
      alignment: "right",
      spacing: {
        before: 200,
      },
    }),
  )

  content.push(
    new Paragraph({
      text: fields.inspectionDate?.value
        ? new Date(fields.inspectionDate.value as string).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
      alignment: "right",
      spacing: {
        before: 200,
      },
    }),
  )

  return content
}
