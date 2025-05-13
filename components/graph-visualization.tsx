"use client"

import { useEffect, useRef, useState } from "react"
import ForceGraph2D from "react-force-graph-2d"

interface GraphVisualizationProps {
  graphData: {
    nodes: {
      id: string
      label: string
      group: string
    }[]
    edges: {
      from: string
      to: string
      label: string
    }[]
  }
}

export default function GraphVisualization({ graphData }: GraphVisualizationProps) {
  // 转换数据格式以适应ForceGraph
  const [graphDataFormatted, setGraphDataFormatted] = useState<any>({ nodes: [], links: [] })
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })
  const containerRef = useRef<HTMLDivElement>(null)

  // 节点颜色映射
  const nodeColors: Record<string, string> = {
    site: "#4f46e5", // 施工现场 - 蓝色
    regulation: "#10b981", // 法规 - 绿色
    process: "#f97316", // 工序 - 橙色
    risk: "#ef4444", // 风险 - 红色
  }

  // 格式化图数据
  useEffect(() => {
    if (graphData) {
      const nodes = graphData.nodes.map((node) => ({
        id: node.id,
        name: node.label,
        group: node.group,
        color: nodeColors[node.group] || "#64748b",
      }))

      const links = graphData.edges.map((edge) => ({
        source: edge.from,
        target: edge.to,
        label: edge.label,
      }))

      setGraphDataFormatted({ nodes, links })
    }
  }, [graphData])

  // 获取容器尺寸
  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        if (containerRef.current) {
          const { width, height } = containerRef.current.getBoundingClientRect()
          setDimensions({ width, height })
        }
      }

      updateDimensions()
      window.addEventListener("resize", updateDimensions)
      return () => window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full">
      {dimensions.width > 0 && (
        <ForceGraph2D
          graphData={graphDataFormatted}
          nodeLabel="name"
          nodeColor={(node) => node.color}
          nodeRelSize={6}
          linkDirectionalArrowLength={3}
          linkDirectionalArrowRelPos={1}
          linkCurvature={0.25}
          linkLabel={(link) => link.label}
          width={dimensions.width}
          height={dimensions.height}
          cooldownTicks={100}
          linkWidth={1.5}
          linkColor={() => "#94a3b8"}
          nodeCanvasObject={(node, ctx, globalScale) => {
            // 绘制节点
            const { x, y, color, name } = node as any
            const size = 6

            // 绘制圆形节点
            ctx.beginPath()
            ctx.arc(x, y, size, 0, 2 * Math.PI)
            ctx.fillStyle = color
            ctx.fill()
            ctx.strokeStyle = "#ffffff"
            ctx.lineWidth = 1.5
            ctx.stroke()

            // 绘制标签
            const fontSize = 10 / globalScale
            ctx.font = `${fontSize}px Sans-Serif`
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillStyle = "#1e293b"

            // 截断长文本
            let displayName = name
            if (name.length > 20) {
              displayName = name.substring(0, 17) + "..."
            }

            ctx.fillText(displayName, x, y + size + fontSize)
          }}
          d3AlphaDecay={0.01}
          d3VelocityDecay={0.1}
          warmupTicks={100}
        />
      )}
    </div>
  )
}
