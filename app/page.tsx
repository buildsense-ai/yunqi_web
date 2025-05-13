"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Slide from "@/components/slide"
import SlideContent from "@/components/slide-content"
import { Button } from "@/components/ui/button"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"
import ProgressIndicator from "@/components/progress-indicator"

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right

  // 更新后的幻灯片内容 - 更紧凑的版本
  const slides = [
    // 第一部分：旁站系统介绍
    {
      id: 1,
      title: "智慧旁站系统解决方案",
      subtitle: "建筑工程旁站管理：核心理念与价值",
      type: "cover",
    },
    {
      id: 2,
      title: '什么是"旁站"与核心目的',
      definition:
        "旁站是在建筑施工过程中，由监理人员或特定系统在关键部位或关键工序施工时，于现场进行的巡视、监督、检查、记录和数据采集，以确保施工质量、安全和进度的重要管理手段。",
      purposes: [
        "实时监控施工过程，确保施工质量",
        "全面追踪质量指标，建立可追溯体系",
        "提供安全预警机制，降低施工风险",
        "数据存证与分析，支持决策优化",
        "提升多方协同效率，优化沟通流程",
      ],
      keyPoints: ["关键工序实时监控", "质量安全双重保障", "数据采集与分析", "规范遵循与合规性"],
      image: "/placeholder.svg?key=du565",
      type: "definition-and-purpose",
    },
    {
      id: 3,
      title: "AI赋能与核心功能优势",
      aiImportance: {
        intro: "在数字化转型的浪潮中，旁站系统与AI技术的深度融合为建筑行业带来了革命性变革。",
        points: [
          "赋能数字化转型，推动建筑行业技术升级",
          "智能风险识别，大幅降低施工安全隐患",
          "优化资源配置，提高施工效率与质量",
        ],
      },
      features: [
        {
          title: "图数据库技术融合",
          description: "深度融合图数据库技术，实现施工现场复杂关系的可视化分析、风险溯源与智能预警。",
          icon: "database",
        },
        {
          title: "专业知识库集成",
          description:
            "集成定制化建筑行业专业知识库，AI能够模拟经验丰富的从业者视角，提供精准、专业的现场决策支持与问题指导。",
          icon: "brain",
        },
        {
          title: "自动化报告生成",
          description:
            "具备自动化报告生成能力，可一键输出符合规范的DOCX格式文档（如：旁站记录、质量检查报告、安全整改通知单等）。",
          icon: "file-text",
        },
      ],
      type: "ai-and-features",
    },
    {
      id: 4,
      title: "旁站系统工作流程",
      description:
        "智能旁站系统通过多个关键步骤，实现从用户输入到专业指导输出的全流程智能化处理。系统集成了Coze对话平台、FastAPI后端服务和NanoGraph图数据库，形成完整的技术闭环。",
      flowSteps: [
        {
          id: "step1",
          title: "用户发起旁站对话",
          description: "现场工程师或监理人员通过移动设备与旁站AI助手发起对话，提出问题或记录现场情况。",
          icon: "message-square",
          color: "bg-primary-600",
        },
        {
          id: "step2",
          title: "Coze平台处理请求",
          description: "Coze平台接收用户输入，进行自然语言理解，识别用户意图和关键信息，并调用相应的工作流。",
          icon: "brain-circuit",
          color: "bg-accent-500",
        },
        {
          id: "step3",
          title: "FastAPI后端查询图数据库",
          description: "系统通过FastAPI后端向NanoGraph图数据库发送查询请求，获取相关的规范、标准、历史案例等信息。",
          icon: "database",
          color: "bg-green-600",
        },
        {
          id: "step4",
          title: "AI分析与专业指导",
          description: "系统结合图数据库返回的专业知识和上下文信息，生成专业、准确的指导建议和解决方案。",
          icon: "brain-circuit",
          color: "bg-blue-600",
        },
        {
          id: "step5",
          title: "生成标准化文档",
          description: "根据用户需求，系统可自动生成符合行业规范的DOCX格式文档，如旁站记录、质量检查报告等。",
          icon: "file-text",
          color: "bg-purple-600",
        },
        {
          id: "step6",
          title: "完成旁站流程",
          description: "用户确认信息无误后，系统将记录存入数据库，完成本次旁站流程，并可提供后续跟踪服务。",
          icon: "check-circle",
          color: "bg-green-700",
        },
      ],
      type: "flow-chart",
    },
    {
      id: 5,
      title: "传统旁站 vs AI辅助旁站对比",
      description: "传统旁站监理与AI辅助旁站系统在效率、准确性、成本和专业支持等方面的全面对比。",
      comparisonData: {
        traditional: {
          title: "传统旁站流程",
          points: [
            "人工记录，纸质文档为主，效率较低",
            "依赖监理人员个人经验和知识，专业性参差不齐",
            "信息孤岛，难以实现数据共享和分析",
            "事后补记现象普遍，真实性和时效性存疑",
            "问题处理依赖人工查阅规范，耗时且易遗漏",
            "文档管理繁琐，检索困难，追溯链条不完整",
            "沟通效率低，多方协作困难",
            "数据价值挖掘有限，难以形成经验沉淀",
          ],
        },
        aiAssisted: {
          title: "AI辅助旁站系统",
          points: [
            "智能化记录，实时数字化，提升工作效率",
            "集成专业知识库，提供标准化专业指导",
            "基于图数据库的关联分析，实现数据互联",
            "实时记录与验证，提高数据真实性和时效性",
            "智能规范查询与匹配，快速响应专业问题",
            "自动化文档生成与管理，完善追溯链条",
            "多方实时协作平台，提升沟通效率",
            "数据智能分析，持续学习优化，形成经验闭环",
          ],
        },
      },
      type: "comparison",
    },
    {
      id: 6,
      title: "案例对比：混凝土裂缝问题处理流程",
      caseStudy: {
        problem: "混凝土结构出现裂缝问题",
        description:
          "在某高层住宅项目中，监理人员发现地下室外墙混凝土出现裂缝，需要进行原因分析、处理方案制定和执行监督。以下对比展示了传统旁站与AI辅助旁站在处理同一问题时的流程差异。",
        traditional: {
          title: "传统旁站处理流程",
          steps: [
            {
              icon: "file-question",
              title: "现场记录与初步分析",
              description: "监理人员手工记录裂缝位置、长度、宽度等信息，拍照存档，初步判断可能原因",
              time: "1小时",
            },
            {
              icon: "phone",
              title: "电话咨询专家",
              description: "联系公司资深专家或设计单位，描述问题情况，等待回复",
              time: "2-4小时",
            },
            {
              icon: "search",
              title: "查阅规范与案例",
              description: "查找相关规范文件和历史案例，寻找类似问题的处理方法",
              time: "3-5小时",
            },
            {
              icon: "clipboard-check",
              title: "制定处理方案",
              description: "根据专家意见和规范要求，手工编写处理方案",
              time: "2小时",
            },
            {
              icon: "file-text",
              title: "编写问题报告",
              description: "整理问题记录、分析过程和处理方案，编写正式报告",
              time: "2小时",
            },
          ],
          totalTime: "10-14小时",
          outcome: "方案质量依赖个人经验，处理时间长，文档不易追溯",
        },
        aiAssisted: {
          title: "AI辅助旁站处理流程",
          steps: [
            {
              icon: "message-square",
              title: "AI对话记录与分析",
              description: "通过移动端与AI助手对话，描述裂缝情况，上传照片，AI自动分析可能原因",
              time: "15分钟",
            },
            {
              icon: "database",
              title: "图数据库智能匹配",
              description: "系统自动查询图数据库，匹配相关规范条款、类似案例和处理方法",
              time: "30秒",
            },
            {
              icon: "book-open",
              title: "专业知识推荐",
              description: "AI根据裂缝特征，推荐相关专业文献、处理方法和注意事项",
              time: "2分钟",
            },
            {
              icon: "clipboard-check",
              title: "智能生成处理方案",
              description: "系统根据分析结果，自动生成处理方案建议，包含材料、工艺和验收标准",
              time: "5分钟",
            },
            {
              icon: "file-check",
              title: "一键生成标准报告",
              description: "系统自动整合所有信息，生成符合规范的问题报告，包含完整追溯链",
              time: "1分钟",
            },
          ],
          totalTime: "25分钟左右",
          outcome: "处理方案专业规范，效率大幅提升，完整记录可追溯",
        },
      },
      type: "case-comparison",
    },
    {
      id: 7,
      title: "旁站系统核心交互流程：现场问题上报与处理",
      description:
        "以下是实习生在现场进行旁站记录并通过专业旁站助手获取指导的典型交互流程。AI助手基于公司自建图数据库提供专业指导，通过Coze平台发送HTTP请求至FastAPI后端获取分析结果。",
      chatMessages: [
        {
          isUser: false,
          name: "专业旁站助手",
          content: "您好！我是您的专业旁站记录助手，可以帮助您完成规范的旁站记录。请问有什么可以帮您的吗？",
          timestamp: "09:15",
        },
        {
          isUser: true,
          name: "小李（实习生）",
          content: "我今天负责3号楼基础施工旁站，需要做记录",
          timestamp: "10:32",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content:
            "我将帮助您完成专业的旁站记录。作为实习生，详细记录现场情况对您的专业成长非常重要。我会引导您一步步完成规范的旁站记录。",
          timestamp: "10:32",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content: "请问工程项目名称是什么？",
          timestamp: "10:32",
        },
        {
          isUser: true,
          name: "小李（实习生）",
          content: "滨江花园三期工程",
          timestamp: "10:35",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content: "请问工程地点在哪里？",
          timestamp: "10:35",
        },
        {
          isUser: true,
          name: "小李（实习生）",
          content: "杭州市滨江区江南大道与滨兴路交叉口东北角",
          timestamp: "11:20",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content: "请问现场监理人员是谁？",
          timestamp: "11:20",
        },
        {
          isUser: true,
          name: "小李（实习生）",
          content: "张工和我小李",
          timestamp: "11:22",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content: "请问旁站日期是什么时候？",
          timestamp: "11:22",
        },
        {
          isUser: true,
          name: "小李（实习生）",
          content: "今天5月8日",
          timestamp: "11:23",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content:
            "请详细描述混凝土的质量情况（包括坍落度、强度等级、浇筑过程等）：\n\n【专业指导】检查混凝土的坍落度、强度等级、配合比是否符合设计要求。观察混凝土运输、浇筑过程是否规范，有无离析现象。",
          timestamp: "11:23",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content:
            "提醒\n\n您好，我注意到您还没有回答关于混凝土质量情况的问题。当您有时间时，请提供相关信息，以便我们完成旁站记录。",
          timestamp: "13:23",
        },
        {
          isUser: true,
          name: "小李（实习生）",
          content:
            "抱歉刚才在现场忙，混凝土是C30，坍落度测试结果为18cm，符合要求。搅拌站出厂到现场时间约30分钟，浇筑时分层振捣，每层厚度控制在50cm以内。未发现离析现象。",
          timestamp: "14:05",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content: "感谢您的详细记录，这样的专业描述对旁站记录非常重要。",
          timestamp: "14:05",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content:
            "请详细描述钢筋布置情况（包括规格、间距、保护层厚度等）：\n\n【专业指导】检查钢筋的规格、间距、保护层厚度是否符合设计图纸要求。观察钢筋的连接方式、搭接长度是否符合规范。",
          timestamp: "14:05",
        },
        {
          isUser: true,
          name: "小李（实习生）",
          content:
            "基础底板主筋为HRB400级Φ20@200，箍筋为HPB300级Φ8@150。钢筋间距经抽查符合设计要求，误差在±10mm以内。保护层采用5cm混凝土垫块控制，实测保护层厚度符合规范要求。钢筋连接采用绑扎搭接，搭接长度不小于35d。",
          timestamp: "15:10",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content: "感谢您的详细记录，这样的专业描述对旁站记录非常重要。",
          timestamp: "15:10",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content:
            "请详细描述模板状况（包括支撑系统、表面情况等）：\n\n【专业指导】检查模板的支撑系统是否稳固，模板表面是否平整、清洁。观察模板的刚度、密封性是否良好，有无漏浆现象。",
          timestamp: "15:10",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content:
            "提醒\n\n您好，我注意到您还没有回答关于模板状况的问题。当您有时间时，请提供相关信息，以便我们完成旁站记录。",
          timestamp: "17:10",
        },
        {
          isUser: true,
          name: "小李（实习生）",
          content:
            "基础模板采用钢模，支撑系统使用可调钢管支撑，间距600mm。模板表面已清理干净，无杂物。接缝处采用密封胶带处理，未发现明显缝隙。支撑系统加固牢固，水平撑和立杆连接稳定。模板刚度满足要求，未见明显变形。",
          timestamp: "17:45",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content: "感谢您的详细记录，这样的专业描述对旁站记录非常重要。",
          timestamp: "17:45",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content:
            "请详细描述安全措施落实情况（包括临边防护、高处作业防护等）：\n\n【专业指导】检查施工现场的安全防护措施是否到位，如临边防护、高处作业防护、用电安全等。观察工人是否佩戴安全帽等防护装备。",
          timestamp: "17:45",
        },
        {
          isUser: true,
          name: "小李（实习生）",
          content:
            "现场工人均佩戴安全帽，基坑周边设置了1.2m高的防护栏杆，并有明显的警示标志。临时用电设备有漏电保护装置，电线架空敷设。现场配备了灭火器，安全通道畅通。高处作业人员系安全带，脚手架搭设规范，设置了安全网。",
          timestamp: "18:30",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content: "感谢您的详细记录，这样的专业描述对旁站记录非常重要。",
          timestamp: "18:30",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content:
            "请描述发现的质量问题及处理方法（如无问题，请详细说明检查过程和结果）：\n\n【专业指导】记录施工过程中发现的任何质量问题，如混凝土蜂窝麻面、钢筋锈蚀、模板变形等，并注明处理方法。",
          timestamp: "18:30",
        },
        {
          isUser: true,
          name: "小李（实习生）",
          content:
            "在检查过程中发现基础西北角有少量钢筋保护层垫块脱落，已要求施工单位立即补充设置垫块。另外，局部模板接缝处有轻微渗漏迹象，已要求加强密封处理。检查了钢筋绑扎、混凝土浇筑准备工作，其余部分符合设计和规范要求。",
          timestamp: "19:35",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content: "感谢您的详细记录，这样的专业描述对旁站记录非常重要。",
          timestamp: "19:35",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content: "正在生成专业旁站记录文档，请稍候...",
          timestamp: "19:35",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content: "[文件] 旁站记录.docx",
          timestamp: "19:36",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content:
            "已为您生成专业的旁站记录文档{链接}，包含了您提供的详细信息。这份记录将有助于工程质量控制和您的专业成长。您可以点击查看或下载。如需修改，请告诉我。",
          timestamp: "19:36",
        },
        {
          isUser: true,
          name: "小李（实习生）",
          content: "谢谢，这个文档很详细，明天我还要继续旁站，到时候再找你",
          timestamp: "19:40",
        },
        {
          isUser: false,
          name: "专业旁站助手",
          content:
            "不客气！您今天的记录非常专业。明天旁站时，建议您特别关注以下几点：\n\n1. 混凝土浇筑过程中的振捣是否充分\n2. 后浇带处理是否规范\n3. 施工缝处理方法是否符合要求\n4. 混凝土养护措施是否到位\n\n\n期待明天继续协助您完成旁站记录。如有任何问题，随时可以咨询我。祝您工作顺利！",
          timestamp: "19:40",
        },
      ],
      type: "chat-simulation",
    },
    // 第二部分：项目技术栈
    {
      id: 8,
      title: "本旁站项目采用的关键技术",
      subtitle: "技术栈概述",
      technologies: [
        {
          name: "Coze",
          description: "字节跳动推出的AI Bot与富应用开发平台，能够快速集成各类插件和工作流，创建功能强大的AI应用。",
          role: "用于构建旁站系统的智能交互界面，处理现场人员的自然语言查询、语音指令，并驱动后续的业务流程。例如，工程师可以通过语音提问获取项目数据，或上报现场情况。",
          icon: "bot",
          color: "bg-gradient-to-r from-blue-500 to-purple-600",
        },
        {
          name: "NanoGraph",
          description: "一款高性能、分布式的图数据库，专为处理复杂关联数据和实时查询而设计。",
          role: "作为旁站系统的核心数据存储引擎，用于存储施工现场的人、机、料、法、环等各类实体及其复杂的相互关系、事件流转、问题追溯等，支持高效的关联分析和风险预警。",
          icon: "network",
          color: "bg-gradient-to-r from-green-500 to-teal-600",
        },
        {
          name: "FastAPI",
          description: "一个现代、快速（高性能）的Python Web框架，用于构建API接口。",
          role: "负责开发旁站系统的后端API服务，连接前端用户界面、Coze智能交互模块以及NanoGraph数据存储，处理业务逻辑、数据校验和对外提供服务接口。",
          icon: "server",
          color: "bg-gradient-to-r from-accent-500 to-orange-600",
        },
      ],
      type: "tech-stack",
    },
    {
      id: 9,
      title: "NanoGraph 图数据可视化",
      description:
        "NanoGraph不仅作为海量旁站数据的核心存储，更是构建旁站系统动态知识图谱、实现多维度关联分析、隐患智能识别和辅助决策的关键引擎。通过图谱分析，系统能够快速定位施工现场与相关法规、条例之间的关系，实现合规性检查和风险预警。",
      graphData: {
        nodes: [
          // 施工现场节点
          { id: "site1", label: "高层住宅工程A", group: "site" },
          { id: "site2", label: "桥梁工程B", group: "site" },
          { id: "site3", label: "地铁站工程C", group: "site" },

          // 法规节点
          { id: "reg1", label: "《建筑工程施工质量验收统一标准》", group: "regulation" },
          { id: "reg2", label: "《混凝土结构工程施工规范》", group: "regulation" },
          { id: "reg3", label: "《建筑地基基础工程施工质量验收规范》", group: "regulation" },
          { id: "reg4", label: "《建筑工程施工安全技术统一规范》", group: "regulation" },
          { id: "reg5", label: "《钢结构工程施工规范》", group: "regulation" },

          // 工序节点
          { id: "proc1", label: "混凝土浇筑", group: "process" },
          { id: "proc2", label: "钢筋绑扎", group: "process" },
          { id: "proc3", label: "地基处理", group: "process" },
          { id: "proc4", label: "模板安装", group: "process" },
          { id: "proc5", label: "钢结构安装", group: "process" },

          // 风险节点
          { id: "risk1", label: "混凝土强度不足", group: "risk" },
          { id: "risk2", label: "钢筋间距不合规", group: "risk" },
          { id: "risk3", label: "地基沉降异常", group: "risk" },
          { id: "risk4", label: "高空坠落风险", group: "risk" },
        ],
        edges: [
          // 施工现场与工序的关系
          { from: "site1", to: "proc1", label: "包含工序" },
          { from: "site1", to: "proc2", label: "包含工序" },
          { from: "site1", to: "proc4", label: "包含工序" },
          { from: "site2", to: "proc5", label: "包含工序" },
          { from: "site2", to: "proc1", label: "包含工序" },
          { from: "site3", to: "proc3", label: "包含工序" },
          { from: "site3", to: "proc2", label: "包含工序" },

          // 工序与法规的关系
          { from: "proc1", to: "reg1", label: "受规范约束" },
          { from: "proc1", to: "reg2", label: "受规范约束" },
          { from: "proc2", to: "reg1", label: "受规范约束" },
          { from: "proc2", to: "reg2", label: "受规范约束" },
          { from: "proc3", to: "reg3", label: "受规范约束" },
          { from: "proc4", to: "reg1", label: "受规范约束" },
          { from: "proc4", to: "reg4", label: "受规范约束" },
          { from: "proc5", to: "reg5", label: "受规范约束" },

          // 工序与风险的关系
          { from: "proc1", to: "risk1", label: "潜在风险" },
          { from: "proc2", to: "risk2", label: "潜在风险" },
          { from: "proc3", to: "risk3", label: "潜在风险" },
          { from: "proc4", to: "risk4", label: "潜在风险" },
          { from: "proc5", to: "risk4", label: "潜在风险" },

          // 法规与风险的关系
          { from: "reg2", to: "risk1", label: "规避风险" },
          { from: "reg1", to: "risk2", label: "规避风险" },
          { from: "reg3", to: "risk3", label: "规避风险" },
          { from: "reg4", to: "risk4", label: "规避风险" },
        ],
      },
      type: "graph-visualization",
    },
    {
      id: 10,
      title: "谢谢观看",
      type: "end",
    },
  ]

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1)
      setCurrentSlide(currentSlide + 1)
    }
  }

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1)
      setCurrentSlide(currentSlide - 1)
    }
  }

  // 使用键盘导航钩子
  useKeyboardNavigation({
    onNext: goToNextSlide,
    onPrevious: goToPrevSlide,
  })

  // 页面变体
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  // 过渡配置
  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-secondary-50 to-secondary-100">
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="absolute"
          >
            <Slide>
              <SlideContent slide={slides[currentSlide]} />
            </Slide>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 导航按钮 */}
      <ProgressIndicator currentSlide={currentSlide} totalSlides={slides.length} />
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevSlide}
          disabled={currentSlide === 0}
          className="h-12 w-12 rounded-full bg-white/80 backdrop-blur-sm border-secondary-200 hover:bg-white hover:border-primary-300 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <ChevronLeft className="h-6 w-6 text-secondary-700 group-hover:text-primary-600" />
          <span className="sr-only">上一页</span>
        </Button>
        <div className="flex h-12 items-center justify-center rounded-full bg-white/80 px-6 backdrop-blur-sm border border-secondary-200 shadow-md">
          <span className="text-sm font-medium text-secondary-700">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNextSlide}
          disabled={currentSlide === slides.length - 1}
          className="h-12 w-12 rounded-full bg-white/80 backdrop-blur-sm border-secondary-200 hover:bg-white hover:border-primary-300 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <ChevronRight className="h-6 w-6 text-secondary-700 group-hover:text-primary-600" />
          <span className="sr-only">下一页</span>
        </Button>
      </div>
    </div>
  )
}
