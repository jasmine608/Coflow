/**
 * Whiteboard.jsx — 手绘风格在线协作画板
 * 模仿 Excalidraw 的设计风格：
 *  - 手绘风格线条（抖动效果）
 *  - 柔和的莫兰迪色系
 *  - 网格纸背景
 *  - 左侧工具栏布局
 *  - 支持多种图形绘制
 */

import { useState, useRef, useEffect, useCallback } from 'react'

// 工具栏按钮配置
const TOOLS = [
  {
    id: 'select',
    title: '选择',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
      </svg>
    ),
  },
  {
    id: 'pen',
    title: '画笔',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 19l7-7 3 3-7 7-3-3z"/>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
      </svg>
    ),
  },
  {
    id: 'rectangle',
    title: '矩形',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
      </svg>
    ),
  },
  {
    id: 'circle',
    title: '圆形',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
      </svg>
    ),
  },
  {
    id: 'arrow',
    title: '箭头',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    ),
  },
  {
    id: 'text',
    title: '文字',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="4 7 4 4 20 4 20 7"/>
        <line x1="9.5" y1="20" x2="14.5" y2="20"/>
        <line x1="12" y1="4" x2="12" y2="20"/>
      </svg>
    ),
  },
  {
    id: 'comment',
    title: '批注',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    id: 'eraser',
    title: '橡皮擦',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 20H7L3 16c-.8-.8-.8-2 0-2.8L13.6 2.6c.8-.8 2-.8 2.8 0L21 7.2c.8.8.8 2 0 2.8L11 20"/>
        <path d="M6 11l5 5"/>
      </svg>
    ),
  },
]

// 手绘风格颜色选项
const PEN_COLORS = [
  { id: 'slate',   color: '#5C6B7C' },
  { id: 'red',     color: '#B86B6B' },
  { id: 'green',   color: '#6B8B6B' },
  { id: 'purple',  color: '#7B6B9B' },
  { id: 'yellow',  color: '#B8A05B' },
  { id: 'cyan',    color: '#5B9B9B' },
  { id: 'pink',    color: '#B86B8B' },
  { id: 'dark',    color: '#3D3D3D' },
]

// 笔触粗细选项
const PEN_SIZES = [2, 4, 6, 10]

// 橡皮擦大小选项
const ERASER_SIZES = [10, 20, 30, 50]

// 预置批注数据
const INITIAL_ANNOTATIONS = [
  {
    id: 'a1', x: 280, y: 180,
    text: '这个按钮的位置建议往右移一点，和上方标题对齐更好',
    author: '李华', avatar: 'L', avatarBg: 'linear-gradient(135deg,#A5B5C5,#8B9A8E)',
    time: '10 分钟前', color: '#5C6B7C',
  },
]

// 预置图形数据
const INITIAL_SHAPES = [
  { id: 's1', type: 'rectangle', x: 100, y: 100, width: 120, height: 80, color: '#5C6B7C', strokeWidth: 2 },
  { id: 's2', type: 'circle', x: 300, y: 120, width: 80, height: 80, color: '#7B6B9B', strokeWidth: 2 },
  { id: 's3', type: 'arrow', x: 160, y: 140, endX: 260, endY: 120, color: '#6B8B6B', strokeWidth: 2 },
]

// 导入导出格式配置
const EXPORT_FORMATS = [
  { id: 'json', name: 'JSON', ext: '.json', mimeType: 'application/json' },
  { id: 'png', name: 'PNG 图片', ext: '.png', mimeType: 'image/png' },
  { id: 'svg', name: 'SVG', ext: '.svg', mimeType: 'image/svg+xml' },
]

// 手绘抖动效果函数
function applyHandDrawnOffset(base, variance = 2) {
  return base + (Math.random() - 0.5) * variance * 2
}

// 手绘风格绘制矩形
function drawHandDrawnRect(ctx, x, y, width, height, color, strokeWidth) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  
  const points = [
    { x: applyHandDrawnOffset(x), y: applyHandDrawnOffset(y) },
    { x: applyHandDrawnOffset(x + width), y: applyHandDrawnOffset(y) },
    { x: applyHandDrawnOffset(x + width), y: applyHandDrawnOffset(y + height) },
    { x: applyHandDrawnOffset(x), y: applyHandDrawnOffset(y + height) },
  ]
  
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }
  ctx.closePath()
  ctx.stroke()
}

// 手绘风格绘制圆形
function drawHandDrawnCircle(ctx, x, y, width, color, strokeWidth) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'round'
  
  const radius = width / 2
  const centerX = x + radius
  const centerY = y + radius
  
  // 用多段短线模拟手绘圆形
  const segments = 32
  for (let i = 0; i < segments; i++) {
    const angle1 = (i / segments) * Math.PI * 2
    const angle2 = ((i + 1) / segments) * Math.PI * 2
    const x1 = centerX + Math.cos(angle1) * radius + (Math.random() - 0.5) * 2
    const y1 = centerY + Math.sin(angle1) * radius + (Math.random() - 0.5) * 2
    const x2 = centerX + Math.cos(angle2) * radius + (Math.random() - 0.5) * 2
    const y2 = centerY + Math.sin(angle2) * radius + (Math.random() - 0.5) * 2
    
    if (i === 0) {
      ctx.moveTo(x1, y1)
    }
    ctx.lineTo(x2, y2)
  }
  ctx.closePath()
  ctx.stroke()
}

// 手绘风格绘制箭头
function drawHandDrawnArrow(ctx, x1, y1, x2, y2, color, strokeWidth) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  
  // 手绘线条效果
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2
  const cpX = midX + (Math.random() - 0.5) * 10
  const cpY = midY + (Math.random() - 0.5) * 10
  
  ctx.moveTo(x1 + (Math.random() - 0.5) * 2, y1 + (Math.random() - 0.5) * 2)
  ctx.quadraticCurveTo(
    cpX, cpY,
    x2 + (Math.random() - 0.5) * 2, y2 + (Math.random() - 0.5) * 2
  )
  ctx.stroke()
  
  // 箭头头部
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const arrowLength = 12
  const arrowAngle = Math.PI / 6
  
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(
    x2 - arrowLength * Math.cos(angle - arrowAngle),
    y2 - arrowLength * Math.sin(angle - arrowAngle)
  )
  ctx.moveTo(x2, y2)
  ctx.lineTo(
    x2 - arrowLength * Math.cos(angle + arrowAngle),
    y2 - arrowLength * Math.sin(angle + arrowAngle)
  )
  ctx.stroke()
}

// 手绘风格绘制线条
function drawHandDrawnLine(ctx, points, color, strokeWidth) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i++) {
    // 添加微小抖动
    const jitterX = (Math.random() - 0.5) * 1.5
    const jitterY = (Math.random() - 0.5) * 1.5
    ctx.lineTo(points[i].x + jitterX, points[i].y + jitterY)
  }
  ctx.stroke()
}

export default function Whiteboard() {
  // 当前选中工具
  const [activeTool, setActiveTool] = useState('select')
  // 画笔颜色
  const [penColor, setPenColor] = useState('#5C6B7C')
  // 画笔粗细
  const [penSize, setPenSize] = useState(4)
  // 上传的图片列表
  const [uploadedImages, setUploadedImages] = useState([])
  // 批注列表
  const [annotations, setAnnotations] = useState(INITIAL_ANNOTATIONS)
  // 当前展开的批注 ID
  const [expandedAnnotation, setExpandedAnnotation] = useState(null)
  // 新批注输入状态
  const [newAnnotation, setNewAnnotation] = useState(null)
  // 新批注文字
  const [newAnnotationText, setNewAnnotationText] = useState('')
  // 文字标注列表
  const [textLabels, setTextLabels] = useState([])
  // 正在输入的文字标注
  const [activeTextInput, setActiveTextInput] = useState(null)
  // 文字输入内容
  const [textInputValue, setTextInputValue] = useState('')
  // 图形列表
  const [shapes, setShapes] = useState(INITIAL_SHAPES)
  // 正在绘制的图形
  const [drawingShape, setDrawingShape] = useState(null)
  // 画笔路径点
  const [penPoints, setPenPoints] = useState([])
  // 正在拖拽的元素
  const [draggingItem, setDraggingItem] = useState(null)
  // 拖拽偏移量
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  // 是否显示便利贴
  const [showStickies, setShowStickies] = useState(false)
  // 是否显示菜单
  const [showMenu, setShowMenu] = useState(false)
  // 画笔路径列表（持久化）
  const [strokes, setStrokes] = useState([])
  // 当前导出格式
  const [exportFormat, setExportFormat] = useState('json')
  // 橡皮擦大小
  const [eraserSize, setEraserSize] = useState(20)
  // 文档列表（用于显示txt、代码等文本文件）
  const [documents, setDocuments] = useState([])

  // Canvas 引用
  const canvasRef = useRef(null)
  // 是否正在绘制
  const isDrawingRef = useRef(false)
  // 文件上传 input 引用
  const fileInputRef = useRef(null)
  // 文件导入 input 引用
  const fileImportRef = useRef(null)
  // 新批注 input 引用
  const annotationInputRef = useRef(null)
  // 文字输入 input 引用
  const textInputRef = useRef(null)

  // Canvas 尺寸同步
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const container = canvas.parentElement
    function resize() {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // 重绘画布
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 绘制网格背景
    drawGrid(ctx, canvas.width, canvas.height)
    
    // 绘制所有已保存的画笔路径
    strokes.forEach(stroke => {
      if (stroke.points && stroke.points.length > 1) {
        drawHandDrawnLine(ctx, stroke.points, stroke.color, stroke.strokeWidth)
      }
    })
    
    // 绘制所有图形
    shapes.forEach(shape => {
      if (shape.type === 'rectangle') {
        drawHandDrawnRect(ctx, shape.x, shape.y, shape.width, shape.height, shape.color, shape.strokeWidth)
      } else if (shape.type === 'circle') {
        drawHandDrawnCircle(ctx, shape.x, shape.y, shape.width, shape.color, shape.strokeWidth)
      } else if (shape.type === 'arrow') {
        drawHandDrawnArrow(ctx, shape.x, shape.y, shape.endX, shape.endY, shape.color, shape.strokeWidth)
      }
    })
    
    // 绘制当前正在绘制的画笔路径
    if (penPoints.length > 1) {
      drawHandDrawnLine(ctx, penPoints, penColor, penSize)
    }
    
  }, [strokes, shapes, penPoints, penColor, penSize])

  // 绘制网格背景
  function drawGrid(ctx, width, height) {
    const gridSize = 20
    ctx.strokeStyle = 'rgba(165, 181, 197, 0.15)'
    ctx.lineWidth = 1
    
    // 垂直网格线
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    
    // 水平网格线
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }

  // 获取鼠标在 Canvas 上的坐标
  const getCanvasPoint = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  // Canvas 鼠标按下
  function handleCanvasMouseDown(e) {
    const point = getCanvasPoint(e)
    
    // 选择工具：检查是否点击了图形
    if (activeTool === 'select') {
      // 检查图形
      for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i]
        if (isPointInShape(point, shape)) {
          setDraggingItem({ type: 'shape', id: shape.id })
          setDragOffset({ x: point.x - shape.x, y: point.y - shape.y })
          return
        }
      }
      return
    }

    // 画笔工具：开始绘制
    if (activeTool === 'pen') {
      isDrawingRef.current = true
      setPenPoints([point])
      return
    }

    // 矩形工具：开始绘制
    if (activeTool === 'rectangle') {
      setDrawingShape({ type: 'rectangle', startX: point.x, startY: point.y })
      return
    }

    // 圆形工具：开始绘制
    if (activeTool === 'circle') {
      setDrawingShape({ type: 'circle', startX: point.x, startY: point.y })
      return
    }

    // 箭头工具：开始绘制
    if (activeTool === 'arrow') {
      setDrawingShape({ type: 'arrow', startX: point.x, startY: point.y })
      return
    }

    // 批注工具：添加新批注
    if (activeTool === 'comment') {
      setNewAnnotation({ x: point.x, y: point.y })
      setNewAnnotationText('')
      return
    }

    // 文字工具：添加文字输入框
    if (activeTool === 'text') {
      setActiveTextInput({ x: point.x, y: point.y })
      setTextInputValue('')
      return
    }

    // 橡皮擦工具：开始擦除
    if (activeTool === 'eraser') {
      isDrawingRef.current = true
      eraseAtPoint(point)
      return
    }
  }

  // 在指定点执行擦除
  function eraseAtPoint(point) {
    const eraseRadius = eraserSize
    
    // 检查并删除与橡皮擦轨迹相交的画笔路径
    setStrokes(prev => prev.filter(stroke => {
      if (!stroke.points || stroke.points.length === 0) return true
      for (const p of stroke.points) {
        const dx = p.x - point.x
        const dy = p.y - point.y
        if (dx * dx + dy * dy <= eraseRadius * eraseRadius) {
          return false
        }
      }
      return true
    }))
    
    // 检查并删除与橡皮擦轨迹相交的图形
    setShapes(prev => prev.filter(shape => {
      if (shape.type === 'rectangle') {
        const cx = shape.x + shape.width / 2
        const cy = shape.y + shape.height / 2
        const dx = cx - point.x
        const dy = cy - point.y
        return dx * dx + dy * dy > eraseRadius * eraseRadius
      }
      if (shape.type === 'circle') {
        const cx = shape.x + shape.width / 2
        const cy = shape.y + shape.height / 2
        const dx = cx - point.x
        const dy = cy - point.y
        return dx * dx + dy * dy > (shape.width / 2 + eraseRadius) * (shape.width / 2 + eraseRadius)
      }
      if (shape.type === 'arrow') {
        const midX = (shape.x + shape.endX) / 2
        const midY = (shape.y + shape.endY) / 2
        const dx = midX - point.x
        const dy = midY - point.y
        return dx * dx + dy * dy > eraseRadius * eraseRadius
      }
      return true
    }))
  }

  // 判断点是否在图形内
  function isPointInShape(point, shape) {
    if (shape.type === 'rectangle') {
      return point.x >= shape.x && point.x <= shape.x + shape.width &&
             point.y >= shape.y && point.y <= shape.y + shape.height
    }
    if (shape.type === 'circle') {
      const centerX = shape.x + shape.width / 2
      const centerY = shape.y + shape.height / 2
      const radius = shape.width / 2
      const dx = point.x - centerX
      const dy = point.y - centerY
      return dx * dx + dy * dy <= radius * radius
    }
    return false
  }

  // Canvas 鼠标移动
  function handleCanvasMouseMove(e) {
    const point = getCanvasPoint(e)
    
    // 画笔工具：继续绘制
    if (isDrawingRef.current && activeTool === 'pen') {
      setPenPoints(prev => [...prev, point])
      return
    }

    // 矩形/圆形/箭头：正在绘制
    if (drawingShape) {
      const newShape = { ...drawingShape, currentX: point.x, currentY: point.y }
      setDrawingShape(newShape)
      return
    }

    // 拖拽图形
    if (draggingItem && draggingItem.type === 'shape') {
      setShapes(prev => prev.map(shape => {
        if (shape.id !== draggingItem.id) return shape
        return { ...shape, x: point.x - dragOffset.x, y: point.y - dragOffset.y }
      }))
      return
    }

    // 橡皮擦工具：持续擦除
    if (isDrawingRef.current && activeTool === 'eraser') {
      eraseAtPoint(point)
      return
    }
  }

  // Canvas 鼠标松开
  function handleCanvasMouseUp() {
    // 画笔工具：结束绘制，保存路径
    if (isDrawingRef.current && activeTool === 'pen') {
      isDrawingRef.current = false
      if (penPoints.length > 1) {
        setStrokes(prev => [...prev, {
          id: 'stroke_' + Date.now(),
          type: 'stroke',
          points: [...penPoints],
          color: penColor,
          strokeWidth: penSize,
        }])
      }
      setPenPoints([])
      return
    }

    // 矩形/圆形/箭头：完成绘制
    if (drawingShape) {
      const { type, startX, startY, currentX, currentY } = drawingShape
      
      if (type === 'rectangle') {
        const width = Math.abs(currentX - startX)
        const height = Math.abs(currentY - startY)
        const x = Math.min(startX, currentX)
        const y = Math.min(startY, currentY)
        
        if (width > 5 && height > 5) {
          setShapes(prev => [...prev, {
            id: Date.now().toString(),
            type: 'rectangle',
            x, y, width, height,
            color: penColor,
            strokeWidth: penSize,
          }])
        }
      } else if (type === 'circle') {
        const width = Math.abs(currentX - startX)
        const height = Math.abs(currentY - startY)
        const size = Math.max(width, height)
        const x = Math.min(startX, currentX)
        const y = Math.min(startY, currentY)
        
        if (size > 5) {
          setShapes(prev => [...prev, {
            id: Date.now().toString(),
            type: 'circle',
            x, y, width: size, height: size,
            color: penColor,
            strokeWidth: penSize,
          }])
        }
      } else if (type === 'arrow') {
        setShapes(prev => [...prev, {
          id: Date.now().toString(),
          type: 'arrow',
          x: startX, y: startY,
          endX: currentX, endY: currentY,
          color: penColor,
          strokeWidth: penSize,
        }])
      }
      
      setDrawingShape(null)
      return
    }

    // 结束拖拽
    if (draggingItem) {
      setDraggingItem(null)
    }

    // 橡皮擦工具：结束擦除
    if (isDrawingRef.current && activeTool === 'eraser') {
      isDrawingRef.current = false
    }
  }

  // 上传图片
  function handleImageUpload(e) {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const img = new Image()
        img.onload = () => {
          const maxW = 360
          let w = img.width
          let h = img.height
          if (w > maxW) { h = h * (maxW / w); w = maxW }
          setUploadedImages(prev => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              src: ev.target.result,
              name: file.name,
              x: 80 + Math.random() * 100,
              y: 80 + Math.random() * 100,
              width: w,
              height: h,
              scale: 1,
            },
          ])
        }
        img.src = ev.target.result
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  // 图片缩放
  function scaleImage(id, delta) {
    setUploadedImages(prev => prev.map(img => {
      if (img.id !== id) return img
      const newScale = Math.max(0.2, Math.min(3, img.scale + delta))
      return { ...img, scale: newScale }
    }))
  }

  // 图片拖拽开始
  function handleImageDragStart(e, imgId) {
    if (activeTool !== 'select') return
    e.preventDefault()
    const img = uploadedImages.find(i => i.id === imgId)
    if (!img) return
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setDraggingItem({ type: 'image', id: imgId })
  }

  // 图片/文档拖拽移动
  function handleImageDrag(e) {
    if (!draggingItem) return
    const container = canvasRef.current?.parentElement
    if (!container) return
    const containerRect = container.getBoundingClientRect()
    const newX = e.clientX - containerRect.left - dragOffset.x
    const newY = e.clientY - containerRect.top - dragOffset.y
    
    if (draggingItem.type === 'image') {
      setUploadedImages(prev => prev.map(img =>
        img.id === draggingItem.id ? { ...img, x: newX, y: newY } : img
      ))
    } else if (draggingItem.type === 'document') {
      setDocuments(prev => prev.map(doc =>
        doc.id === draggingItem.id ? { ...doc, x: newX, y: newY } : doc
      ))
    }
  }

  // 图片/文档拖拽结束
  function handleImageDragEnd() {
    if (draggingItem) {
      setDraggingItem(null)
    }
  }

  // 提交新批注
  function submitAnnotation() {
    if (!newAnnotationText.trim() || !newAnnotation) return
    const ann = {
      id: 'a' + Date.now(),
      x: newAnnotation.x, y: newAnnotation.y,
      text: newAnnotationText.trim(),
      author: 'jasmine', avatar: 'J',
      avatarBg: 'linear-gradient(135deg,#A5B5C5,#8FA0B0)',
      time: '刚刚', color: penColor,
    }
    setAnnotations(prev => [...prev, ann])
    setNewAnnotation(null)
    setNewAnnotationText('')
  }

  function cancelAnnotation() {
    setNewAnnotation(null)
    setNewAnnotationText('')
  }

  function deleteAnnotation(id) {
    setAnnotations(prev => prev.filter(a => a.id !== id))
    setExpandedAnnotation(null)
  }

  // 提交文字标注
  function submitTextLabel() {
    if (!textInputValue.trim() || !activeTextInput) return
    setTextLabels(prev => [...prev, {
      id: 't' + Date.now(),
      x: activeTextInput.x,
      y: activeTextInput.y,
      text: textInputValue.trim(),
      color: penColor,
    }])
    setActiveTextInput(null)
    setTextInputValue('')
  }

  function cancelTextLabel() {
    setActiveTextInput(null)
    setTextInputValue('')
  }

  // 清空画布
  function clearCanvas() {
    setShapes([])
    setStrokes([])
    setPenPoints([])
    setUploadedImages([])
    setTextLabels([])
    setDocuments([])
  }

  // 删除选中图形
  function deleteSelectedShape() {
    if (draggingItem && draggingItem.type === 'shape') {
      setShapes(prev => prev.filter(s => s.id !== draggingItem.id))
      setDraggingItem(null)
    }
  }

  // 导入文件
  function handleFileImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    
    const ext = file.name.split('.').pop().toLowerCase()
    const canvas = canvasRef.current
    const centerX = canvas ? canvas.width / 2 : 500
    const centerY = canvas ? canvas.height / 2 : 300
    const canvasWidth = canvas ? canvas.width : 1000
    const canvasHeight = canvas ? canvas.height : 600
    
    // 1/2 到 2/3 的画布大小
    const targetWidth = canvasWidth * 0.6
    const targetHeight = canvasHeight * 0.6
    
    if (ext === 'json') {
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          if (data.shapes) setShapes(data.shapes)
          if (data.strokes) setStrokes(data.strokes)
          if (data.textLabels) setTextLabels(data.textLabels)
          if (data.annotations) setAnnotations(data.annotations)
          if (data.uploadedImages) setUploadedImages(data.uploadedImages)
          if (data.documents) setDocuments(data.documents)
          alert('JSON 文件导入成功！')
        } catch {
          alert('无效的 JSON 文件格式')
        }
      }
      reader.readAsText(file)
    } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'webp') {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const img = new Image()
        img.onload = () => {
          let w = img.width
          let h = img.height
          
          // 计算缩放比例，让图片占据画布的 1/2 到 2/3
          const scaleW = targetWidth / w
          const scaleH = targetHeight / h
          const scale = Math.min(scaleW, scaleH, 1.5) // 最多放大1.5倍
          
          w = w * scale
          h = h * scale
          
          setUploadedImages(prev => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              src: ev.target.result,
              name: file.name,
              x: centerX - w / 2,
              y: centerY - h / 2,
              width: w,
              height: h,
              scale: 1,
              type: 'image',
            },
          ])
          alert('图片导入成功！')
        }
        img.src = ev.target.result
      }
      reader.readAsDataURL(file)
    } else if (ext === 'pdf') {
      const reader = new FileReader()
      reader.onload = (ev) => {
        // 使用 iframe 显示 PDF
        const docWidth = targetWidth
        const docHeight = targetHeight
        
        setDocuments(prev => [
          ...prev,
          {
            id: 'doc_' + Date.now(),
            name: file.name,
            content: ev.target.result,
            language: 'pdf',
            x: centerX - docWidth / 2,
            y: centerY - docHeight / 2,
            width: docWidth,
            height: docHeight,
            isPdf: true,
          },
        ])
        alert('PDF 导入成功！')
      }
      reader.readAsDataURL(file)
    } else if (['txt', 'md', 'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'h', 'hpp', 'cs', 'go', 'rs', 'rb', 'php', 'html', 'htm', 'css', 'scss', 'less', 'json', 'xml', 'yaml', 'yml', 'sql', 'sh', 'bash', 'zsh', 'ps1', 'bat', 'cmd'].includes(ext)) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const content = ev.target.result
        
        setDocuments(prev => [
          ...prev,
          {
            id: 'doc_' + Date.now(),
            name: file.name,
            content: content,
            language: getLanguageFromExt(ext),
            x: centerX - targetWidth / 2,
            y: centerY - targetHeight / 2,
            width: targetWidth,
            height: targetHeight,
          },
        ])
        alert(`${ext.toUpperCase()} 文件导入成功！`)
      }
      reader.readAsText(file)
    } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        // 尝试创建一个更好的预览
        const officeIcon = getOfficeIcon(ext)
        const docContent = `
📄 ${file.name}

格式: ${ext.toUpperCase()}
大小: ${formatFileSize(file.size)}
导入时间: ${new Date().toLocaleString()}

📌 提示：
• Office 文档可在上方进行标注和绘制
• 如需编辑原始文档，请在本地 Office 软件中打开
• 使用画笔和批注工具协作讨论

${officeIcon}
        `.trim()
        
        setDocuments(prev => [
          ...prev,
          {
            id: 'doc_' + Date.now(),
            name: file.name,
            content: docContent,
            language: 'text',
            x: centerX - targetWidth / 2,
            y: centerY - targetHeight / 2,
            width: targetWidth,
            height: targetHeight,
            isOfficeDoc: true,
            officeType: ext,
            fileSize: file.size,
          },
        ])
        alert(`${ext.toUpperCase()} 文件导入成功！`)
      }
      reader.readAsArrayBuffer(file)
    } else {
      alert(`暂不支持 ${ext} 格式的文件`)
    }
    
    e.target.value = ''
    setShowMenu(false)
  }
  
  // 获取Office图标
  function getOfficeIcon(ext) {
    const icons = {
      doc: '📝', docx: '📝',
      xls: '📊', xlsx: '📊',
      ppt: '📽️', pptx: '📽️',
    }
    return icons[ext] || '📄'
  }
  
  // 格式化文件大小
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // 根据扩展名获取语言
  function getLanguageFromExt(ext) {
    const langMap = {
      'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
      'py': 'python', 'java': 'java', 'cpp': 'cpp', 'c': 'c', 'h': 'c', 'hpp': 'cpp',
      'cs': 'csharp', 'go': 'go', 'rs': 'rust', 'rb': 'ruby', 'php': 'php',
      'html': 'html', 'htm': 'html', 'css': 'css', 'scss': 'scss', 'less': 'less',
      'json': 'json', 'xml': 'xml', 'yaml': 'yaml', 'yml': 'yaml', 'sql': 'sql',
      'sh': 'bash', 'bash': 'bash', 'zsh': 'bash', 'ps1': 'powershell', 'bat': 'batch', 'cmd': 'batch',
      'md': 'markdown', 'txt': 'text',
    }
    return langMap[ext] || 'text'
  }

  // 导出文件
  function handleFileExport() {
    const format = EXPORT_FORMATS.find(f => f.id === exportFormat)
    if (!format) return
    
    if (format.id === 'json') {
      const data = {
        shapes,
        strokes,
        textLabels,
        annotations,
        uploadedImages,
        documents,
        exportTime: new Date().toISOString(),
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: format.mimeType })
      downloadFile(blob, `coflow-whiteboard-${Date.now()}${format.ext}`)
    } else if (format.id === 'png') {
      const canvas = canvasRef.current
      if (!canvas) return
      
      // 创建一个新画布用于导出
      const exportCanvas = document.createElement('canvas')
      exportCanvas.width = canvas.width
      exportCanvas.height = canvas.height
      const ctx = exportCanvas.getContext('2d')
      
      // 绘制白色背景
      ctx.fillStyle = '#F7F5F0'
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
      
      // 绘制网格
      drawGrid(ctx, exportCanvas.width, exportCanvas.height)
      
      // 绘制画笔路径
      strokes.forEach(stroke => {
        if (stroke.points && stroke.points.length > 1) {
          drawHandDrawnLine(ctx, stroke.points, stroke.color, stroke.strokeWidth)
        }
      })
      
      // 绘制图形
      shapes.forEach(shape => {
        if (shape.type === 'rectangle') {
          drawHandDrawnRect(ctx, shape.x, shape.y, shape.width, shape.height, shape.color, shape.strokeWidth)
        } else if (shape.type === 'circle') {
          drawHandDrawnCircle(ctx, shape.x, shape.y, shape.width, shape.color, shape.strokeWidth)
        } else if (shape.type === 'arrow') {
          drawHandDrawnArrow(ctx, shape.x, shape.y, shape.endX, shape.endY, shape.color, shape.strokeWidth)
        }
      })
      
      // 绘制文字标注
      textLabels.forEach(label => {
        ctx.font = '15px sans-serif'
        ctx.fillStyle = label.color
        ctx.fillText(label.text, label.x, label.y)
      })
      
      exportCanvas.toBlob(blob => {
        downloadFile(blob, `coflow-whiteboard-${Date.now()}${format.ext}`)
      }, format.mimeType)
    } else if (format.id === 'svg') {
      const canvas = canvasRef.current
      if (!canvas) return
      
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" background="#F7F5F0">`
      svg += `<rect width="100%" height="100%" fill="#F7F5F0"/>`
      
      // 绘制网格
      svg += `<defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(165,181,197,0.15)" stroke-width="1"/></pattern></defs>`
      svg += `<rect width="100%" height="100%" fill="url(#grid)"/>`
      
      // 绘制画笔路径
      strokes.forEach(stroke => {
        if (stroke.points && stroke.points.length > 1) {
          const d = stroke.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
          svg += `<path d="${d}" stroke="${stroke.color}" stroke-width="${stroke.strokeWidth}" fill="none" stroke-linecap="round"/>`
        }
      })
      
      // 绘制图形
      shapes.forEach(shape => {
        if (shape.type === 'rectangle') {
          svg += `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" fill="none" stroke="${shape.color}" stroke-width="${shape.strokeWidth}" rx="2"/>`
        } else if (shape.type === 'circle') {
          const r = shape.width / 2
          svg += `<circle cx="${shape.x + r}" cy="${shape.y + r}" r="${r}" fill="none" stroke="${shape.color}" stroke-width="${shape.strokeWidth}"/>`
        } else if (shape.type === 'arrow') {
          const angle = Math.atan2(shape.endY - shape.y, shape.endX - shape.x)
          const arrowLength = 12
          svg += `<line x1="${shape.x}" y1="${shape.y}" x2="${shape.endX}" y2="${shape.endY}" stroke="${shape.color}" stroke-width="${shape.strokeWidth}"/>`
          svg += `<polygon points="${shape.endX},${shape.endY} ${shape.endX - arrowLength * Math.cos(angle - 0.5)},${shape.endY - arrowLength * Math.sin(angle - 0.5)} ${shape.endX - arrowLength * Math.cos(angle + 0.5)},${shape.endY - arrowLength * Math.sin(angle + 0.5)}" fill="${shape.color}"/>`
        }
      })
      
      // 绘制文字标注
      textLabels.forEach(label => {
        svg += `<text x="${label.x}" y="${label.y}" fill="${label.color}" font-size="15" font-family="sans-serif">${label.text}</text>`
      })
      
      svg += '</svg>'
      
      const blob = new Blob([svg], { type: format.mimeType })
      downloadFile(blob, `coflow-whiteboard-${Date.now()}${format.ext}`)
    }
    
    setShowMenu(false)
  }

  // 下载文件辅助函数
  function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // 打开空白画布
  function handleNewCanvas() {
    if (shapes.length > 0 || textLabels.length > 0 || annotations.length > 0 || uploadedImages.length > 0 || documents.length > 0) {
      if (!confirm('确定要创建新画布吗？当前内容将被清空。')) return
    }
    setShapes([])
    setStrokes([])
    setTextLabels([])
    setAnnotations([])
    setUploadedImages([])
    setDocuments([])
    setShowMenu(false)
  }

  // 点击外部关闭菜单
  useEffect(() => {
    function handleClickOutside(e) {
      const menu = document.querySelector('.wb-menu')
      const menuBtn = document.querySelector('.wb-menu-btn')
      if (menu && menuBtn && !menu.contains(e.target) && !menuBtn.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="page active" id="page-whiteboard" style={{ padding: '0' }}>
      <div
        className="whiteboard-container"
        onMouseMove={(e) => { handleCanvasMouseMove(e); handleImageDrag(e) }}
        onMouseUp={() => { handleCanvasMouseUp(); handleImageDragEnd() }}
        onMouseLeave={() => { handleCanvasMouseUp(); handleImageDragEnd() }}
      >

        {/* 顶部菜单按钮 */}
        <button
          className="wb-menu-btn"
          onClick={() => setShowMenu(!showMenu)}
          title="菜单"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        {/* 菜单面板 */}
        {showMenu && (
          <div className="wb-menu">
            <button className="wb-menu-item" onClick={handleNewCanvas}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M4 4h16v16H4zM2 2v4h4M18 2v4h4M2 18v4h4M18 18v4h4"/>
              </svg>
              <span>新建画布</span>
            </button>
            <button className="wb-menu-item" onClick={() => fileImportRef.current?.click()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <span>打开</span>
              <span className="wb-menu-shortcut">Ctrl+O</span>
            </button>
            <div className="wb-menu-submenu">
              <button className="wb-menu-item wb-menu-submenu-trigger">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>导出</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{ transform: 'rotate(90deg)' }}>
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <div className="wb-menu-submenu-content">
                {EXPORT_FORMATS.map(format => (
                  <button
                    key={format.id}
                    className={`wb-menu-item ${exportFormat === format.id ? 'active' : ''}`}
                    onClick={() => { setExportFormat(format.id); handleFileExport(); }}
                  >
                    <span>{format.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="wb-menu-divider"></div>
            <button className="wb-menu-item" onClick={() => { setShowMenu(false); alert('实时协作功能即将上线！') }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              <span>实时协作...</span>
            </button>
            <div className="wb-menu-divider"></div>
            <button className="wb-menu-item" onClick={() => { setShowMenu(false); alert('帮助文档：https://docs.coflow.app') }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                <path d="M12 17h.01"/>
              </svg>
              <span>帮助</span>
              <span className="wb-menu-shortcut">?</span>
            </button>
          </div>
        )}

        {/* 左侧工具栏 */}
        <div className="whiteboard-toolbar">
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              className={`wb-tool${activeTool === tool.id ? ' active' : ''}`}
              title={tool.title}
              onClick={() => {
                setActiveTool(tool.id)
                if (tool.id !== 'comment') setNewAnnotation(null)
                if (tool.id !== 'text') setActiveTextInput(null)
              }}
            >
              {tool.icon}
            </button>
          ))}

          {/* 分隔线 */}
          <div className="wb-tool-divider"></div>

          {/* 上传图片按钮 */}
          <button className="wb-tool" title="上传图片" onClick={() => fileInputRef.current?.click()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </button>

          {/* 分隔线 */}
          <div className="wb-tool-divider"></div>

          {/* 清空画布 */}
          <button className="wb-tool" title="清空画布" onClick={clearCanvas}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>

          {/* 删除按钮 */}
          <button className="wb-tool" title="删除选中" onClick={deleteSelectedShape}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>

          {/* 分隔线 */}
          <div className="wb-tool-divider"></div>

          {/* 便利贴开关 */}
          <button
            className={`wb-tool${showStickies ? ' active' : ''}`}
            title={showStickies ? '隐藏便利贴' : '显示便利贴'}
            onClick={() => setShowStickies(prev => !prev)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </button>
        </div>

        {/* 画笔属性面板 */}
        <div className="wb-props-panel">
          {activeTool !== 'eraser' && (
            <div className="wb-props-section">
              <div className="wb-props-label">颜色</div>
              <div className="wb-color-row">
                {PEN_COLORS.map(c => (
                  <button
                    key={c.id}
                    className={`wb-color-btn${penColor === c.color ? ' active' : ''}`}
                    style={{ background: c.color }}
                    onClick={() => setPenColor(c.color)}
                    title={c.id}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="wb-props-section">
            <div className="wb-props-label">{activeTool === 'eraser' ? '橡皮大小' : '粗细'}</div>
            <div className="wb-size-row">
              {(activeTool === 'eraser' ? ERASER_SIZES : PEN_SIZES).map(size => (
                <button
                  key={size}
                  className={`wb-size-btn${activeTool === 'eraser' ? eraserSize === size : penSize === size ? ' active' : ''}`}
                  onClick={() => activeTool === 'eraser' ? setEraserSize(size) : setPenSize(size)}
                >
                  <span style={{
                    width: `${size + 4}px`, height: `${size + 4}px`,
                    borderRadius: '50%', background: activeTool === 'eraser' ? '#B8B8B8' : penColor, display: 'block',
                  }}></span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas 绘制层 */}
        <canvas
          ref={canvasRef}
          className="whiteboard-canvas"
          style={{
            cursor: getCursorStyle(),
            zIndex: 2,
          }}
          onMouseDown={handleCanvasMouseDown}
        />

        {/* 上传的图片层 */}
        {uploadedImages.map(img => (
          <div
            key={img.id}
            className="wb-uploaded-image"
            style={{
              left: img.x,
              top: img.y,
              zIndex: draggingItem?.type === 'image' && draggingItem?.id === img.id ? 15 : 3,
              transform: `scale(${img.scale})`,
              transformOrigin: 'top left',
              cursor: activeTool === 'select' ? 'grab' : 'default',
            }}
            onMouseDown={(e) => handleImageDragStart(e, img.id)}
          >
            <img src={img.src} alt={img.name} draggable={false} style={{ width: img.width, height: img.height, display: 'block' }} />
            <div className="wb-image-controls">
              <span className="wb-image-label">{img.name}</span>
              <div className="wb-image-scale-btns">
                <button onClick={(e) => { e.stopPropagation(); scaleImage(img.id, -0.1) }} title="缩小">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <span style={{ fontSize: '10px', color: 'var(--text-weak)', minWidth: '32px', textAlign: 'center' }}>
                  {Math.round(img.scale * 100)}%
                </span>
                <button onClick={(e) => { e.stopPropagation(); scaleImage(img.id, 0.1) }} title="放大">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* 文档/代码层 */}
        {documents.map(doc => (
          <div
            key={doc.id}
            className="wb-document"
            style={{
              left: doc.x,
              top: doc.y,
              width: doc.width,
              height: doc.height,
              zIndex: draggingItem?.type === 'document' && draggingItem?.id === doc.id ? 15 : 3,
            }}
            onMouseDown={(e) => {
              if (activeTool !== 'select') return
              e.preventDefault()
              setDragOffset({ x: e.clientX - doc.x, y: e.clientY - doc.y })
              setDraggingItem({ type: 'document', id: doc.id })
            }}
          >
            <div className="wb-document-header">
              <span className="wb-document-name">{doc.name}</span>
              <div className="wb-document-actions">
                <button onClick={(e) => { e.stopPropagation(); setDocuments(prev => prev.filter(d => d.id !== doc.id)) }} title="关闭">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="wb-document-content">
              {doc.isPdf ? (
                <iframe 
                  src={doc.content} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    border: 'none',
                    backgroundColor: '#fff'
                  }}
                  title={doc.name}
                />
              ) : doc.isOfficeDoc ? (
                <div style={{ 
                  height: '100%', 
                  overflow: 'auto',
                  padding: '16px',
                  fontSize: '14px',
                  lineHeight: '1.8',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: '#4a5568'
                }}>
                  {doc.content}
                </div>
              ) : (
                <pre><code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{doc.content}</code></pre>
              )}
            </div>
          </div>
        ))}

        {/* 文字标注层 */}
        {textLabels.map(label => (
          <div
            key={label.id}
            className="wb-text-label"
            style={{ left: label.x, top: label.y, color: label.color, zIndex: 8 }}
          >
            {label.text}
          </div>
        ))}

        {/* 正在输入的文字标注 */}
        {activeTextInput && (
          <div
            className="wb-text-input-wrap"
            style={{ left: activeTextInput.x, top: activeTextInput.y, zIndex: 20 }}
          >
            <input
              ref={textInputRef}
              className="wb-text-input"
              style={{ color: penColor }}
              placeholder="输入文字..."
              value={textInputValue}
              onChange={(e) => setTextInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); submitTextLabel() }
                if (e.key === 'Escape') cancelTextLabel()
              }}
            />
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              <button className="btn btn-ghost" style={{ fontSize: '10px', padding: '2px 8px' }} onClick={cancelTextLabel}>取消</button>
              <button className="btn btn-primary" style={{ fontSize: '10px', padding: '2px 8px' }} onClick={submitTextLabel} disabled={!textInputValue.trim()}>确认</button>
            </div>
          </div>
        )}

        {/* 便利贴层 */}
        {showStickies && [
          { id: 's1', x: 100, y: 100, color: 'sticky-yellow', title: '用户旅程', text: '首页 → 注册 → 引导 → 协作' },
          { id: 's2', x: 300, y: 80, color: 'sticky-pink', title: '核心功能', text: '文档 · 看板 · 画板 · 头脑风暴' },
          { id: 's3', x: 500, y: 120, color: 'sticky-blue', title: 'AI 审查', text: '双模型交叉验证 → 一致性报告' },
          { id: 's4', x: 200, y: 280, color: 'sticky-green', title: '技术栈', text: 'React + Yjs + Canvas' },
          { id: 's5', x: 450, y: 300, color: 'sticky-purple', title: '视觉风格', text: '莫兰迪色系 + 便签手账风' },
        ].map(note => (
          <div
            key={note.id}
            className={`sticky-note ${note.color}`}
            style={{ left: note.x, top: note.y, zIndex: 3, pointerEvents: 'auto' }}
          >
            <strong>{note.title}</strong><br/>{note.text}
          </div>
        ))}

        {/* 批注气泡层 */}
        {annotations.map(ann => (
          <div
            key={ann.id}
            className="wb-annotation"
            style={{ left: ann.x, top: ann.y, zIndex: 10 }}
          >
            <div
              className="wb-annotation-dot"
              style={{ background: ann.color }}
              onClick={() => setExpandedAnnotation(expandedAnnotation === ann.id ? null : ann.id)}
            >
              {ann.author.charAt(0)}
            </div>
            {expandedAnnotation === ann.id && (
              <div className="wb-annotation-popup">
                <div className="wb-annotation-header">
                  <div className="wb-annotation-author">
                    <div className="wb-annotation-avatar" style={{ background: ann.avatarBg }}>{ann.avatar}</div>
                    <span className="wb-annotation-name">{ann.author}</span>
                  </div>
                  <span className="wb-annotation-time">{ann.time}</span>
                  <button className="wb-annotation-delete" onClick={() => deleteAnnotation(ann.id)} title="删除批注">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                <div className="wb-annotation-text">{ann.text}</div>
              </div>
            )}
          </div>
        ))}

        {/* 新批注输入气泡 */}
        {newAnnotation && (
          <div className="wb-annotation" style={{ left: newAnnotation.x, top: newAnnotation.y, zIndex: 20 }}>
            <div className="wb-annotation-dot" style={{ background: penColor }}>J</div>
            <div className="wb-annotation-popup wb-annotation-input-popup">
              <div className="wb-annotation-input-header">
                <div className="wb-annotation-author">
                  <div className="wb-annotation-avatar" style={{ background: 'linear-gradient(135deg,#A5B5C5,#8FA0B0)' }}>J</div>
                  <span className="wb-annotation-name">jasmine</span>
                </div>
              </div>
              <textarea
                ref={annotationInputRef}
                className="wb-annotation-input"
                placeholder="输入批注..."
                value={newAnnotationText}
                onChange={(e) => setNewAnnotationText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitAnnotation() }
                  if (e.key === 'Escape') cancelAnnotation()
                }}
                rows={3}
              />
              <div className="wb-annotation-input-actions">
                <button className="btn btn-ghost" style={{ fontSize: '11px', padding: '3px 10px' }} onClick={cancelAnnotation}>取消</button>
                <button className="btn btn-primary" style={{ fontSize: '11px', padding: '3px 10px' }} onClick={submitAnnotation} disabled={!newAnnotationText.trim()}>发送</button>
              </div>
            </div>
          </div>
        )}

        {/* 模拟他人光标 */}
        <div style={{ position: 'absolute', left: '420px', top: '220px', pointerEvents: 'none', zIndex: 5, opacity: 0.6 }}>
          <svg width="14" height="18" viewBox="0 0 16 20" fill="#5C6B7C"><path d="M0 0L16 12L8 12L4 20L0 0Z"/></svg>
          <span style={{ fontSize: '10px', background: 'rgba(165,181,197,0.2)', color: '#5C6B7C', padding: '2px 6px', borderRadius: '4px', marginLeft: '3px' }}>李华</span>
        </div>
        <div style={{ position: 'absolute', left: '600px', top: '260px', pointerEvents: 'none', zIndex: 5, opacity: 0.6 }}>
          <svg width="14" height="18" viewBox="0 0 16 20" fill="#7B6B9B"><path d="M0 0L16 12L8 12L4 20L0 0Z"/></svg>
          <span style={{ fontSize: '10px', background: 'rgba(123,107,155,0.2)', color: '#7B6B9B', padding: '2px 6px', borderRadius: '4px', marginLeft: '3px' }}>王芳</span>
        </div>

        {/* 文件上传隐藏 input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />

        {/* 文件导入隐藏 input */}
        <input
          ref={fileImportRef}
          type="file"
          accept=".json,.png,.jpg,.jpeg,.gif,.webp,.pdf,.txt,.md,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.h,.hpp,.cs,.go,.rs,.rb,.php,.html,.htm,.css,.scss,.less,.xml,.yaml,.yml,.sql,.sh,.bash,.ps1,.bat,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          onChange={handleFileImport}
          style={{ display: 'none' }}
        />

        {/* 右下角缩放控制 */}
        <div className="wb-zoom-control">
          <button className="wb-zoom-btn" title="缩小" onClick={() => alert('缩小功能开发中')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          <span className="wb-zoom-value">100%</span>
          <button className="wb-zoom-btn" title="放大" onClick={() => alert('放大功能开发中')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          <div className="wb-zoom-separator"></div>
          <button className="wb-zoom-btn" title="重置视图" onClick={() => alert('重置视图功能开发中')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )

  // 获取光标样式
  function getCursorStyle() {
    switch (activeTool) {
      case 'pen': return 'crosshair'
      case 'rectangle':
      case 'circle':
      case 'arrow':
      case 'eraser': return 'crosshair'
      case 'comment': return 'cell'
      case 'text': return 'text'
      case 'select': return 'default'
      default: return 'default'
    }
  }
}
