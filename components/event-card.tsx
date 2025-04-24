import { format } from "date-fns"
import type { Event } from "@/types/event"
import Image from "next/image"

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  // 格式化日期
  const formattedDate = format(new Date(event.create_time), "MM月dd日 HH:mm")

  // 获取状态文本和颜色
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "0":
        return { text: "未处理", color: "bg-yellow-500" }
      case "1":
        return { text: "处理中", color: "bg-blue-500" }
      case "2":
        return { text: "已完成", color: "bg-green-500" }
      default:
        return { text: "未知", color: "bg-gray-500" }
    }
  }

  const statusInfo = getStatusInfo(event.status)

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
      {/* 卡片头部 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{event.summary}</h3>
            <p className="text-sm text-gray-500 mt-1">{event.category}</p>
          </div>
          <div className={`${statusInfo.color} text-white text-xs px-2 py-1 rounded-full`}>{statusInfo.text}</div>
        </div>
      </div>

      {/* 卡片内容 */}
      <div className="p-4">
        {/* 消息内容 */}
        {event.messages.map((message) => (
          <div key={message.message_id} className="mb-3">
            <p className="text-sm text-gray-700">{message.content}</p>
            <p className="text-xs text-gray-500 mt-1">{format(new Date(message.timestamp), "HH:mm")}</p>
          </div>
        ))}

        {/* 图片内容 */}
        {event.candidate_images.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {event.candidate_images.map((image) => (
              <div key={image.image_key} className="relative h-32 rounded-md overflow-hidden">
                <Image src={image.image_data || "/placeholder.svg"} alt="Event image" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 卡片底部 */}
      <div className="bg-gray-50 px-4 py-3 text-xs text-gray-500 flex justify-between">
        <span>ID: {event.id}</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  )
}
