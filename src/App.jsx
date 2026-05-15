/**
 * App.jsx — 应用根组件
 *
 * 负责：
 *  1. 全局页面路由状态（currentPage）
 *  2. 侧栏折叠状态（sidebarCollapsed）
 *  3. 顶栏自动隐藏（topbarHidden）
 *  4. 画布缩放（zoomPercent）
 *  5. 下钻模态框状态（drillType / drillShow）
 *  6. 渲染布局骨架（Topbar + Sidebar + 主画布 + StatusBar + DrillModal）
 *  7. 按需渲染当前激活页面
 *
 * 页面组件放在 src/pages/ 下，布局组件放在 src/components/ 下。
 * 所有样式由各自的 CSS 文件负责，通过 import 引入。
 */

import { useState, useEffect, useCallback } from 'react'

// 布局组件
import Topbar    from './components/Topbar'
import Sidebar   from './components/Sidebar'
import StatusBar from './components/StatusBar'
import DrillModal from './components/DrillModal'

// 页面组件
import Dashboard  from './pages/Dashboard'
import Todos      from './pages/Todos'
import Docs       from './pages/Docs'
import Projects   from './pages/Projects'
import Whiteboard from './pages/Whiteboard'
import Brainstorm from './pages/Brainstorm'
import Review     from './pages/Review'

// 下钻内容数据生成器
import { getDrillData } from './utils/drillData'

// 样式
import './styles/global.css'
import './styles/Topbar.css'
import './styles/Sidebar.css'
import './styles/Layout.css'
import './styles/Pages.css'

// 页面 ID 与中文名的映射（用于状态栏显示）
const PAGE_NAMES = {
  dashboard:  '工作台',
  todos:      '我的待办',
  docs:       '文档中心',
  projects:   '项目管理',
  whiteboard: '在线画板',
  brainstorm: '头脑风暴',
  review:     'AI 审查',
}

export default function App() {
  // 当前激活的页面 ID（默认工作台）
  const [currentPage, setCurrentPage] = useState('dashboard')

  // 侧栏是否折叠
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // 顶栏是否隐藏（鼠标远离顶部时收起）
  const [topbarHidden, setTopbarHidden] = useState(false)

  // 画布缩放比例（百分比，范围 10~400）
  const [zoomPercent, setZoomPercent] = useState(100)

  // 下钻模态框：是否显示 + 当前类型（'task' | 'doc' | null）
  const [drillShow, setDrillShow]   = useState(false)
  const [drillType, setDrillType]   = useState(null)

  // ===== 导航 =====
  // 切换页面：更新 currentPage，同时关闭已打开的模态框
  const navigateTo = useCallback((page) => {
    setCurrentPage(page)
  }, [])

  // ===== 缩放 =====
  // 调整缩放比例，限制在 10~400 之间
  function handleZoom(delta) {
    setZoomPercent(prev => Math.max(10, Math.min(400, prev + delta)))
  }

  // 重置缩放为 100%
  function handleResetZoom() {
    setZoomPercent(100)
  }

  // ===== 下钻模态框 =====
  // 打开指定类型的模态框
  function openDrill(type) {
    setDrillType(type)
    setDrillShow(true)
  }

  // 关闭模态框
  function closeDrill() {
    setDrillShow(false)
    setDrillType(null)
  }

  // ===== 鼠标滚轮缩放 =====
  useEffect(() => {
    const canvasArea = document.getElementById('canvasArea')
    if (!canvasArea) return

    function handleWheel(e) {
      // 仅当按住 Ctrl 或 Meta（Mac Command）时缩放
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -5 : 5
        handleZoom(delta)
      }
    }

    canvasArea.addEventListener('wheel', handleWheel, { passive: false })
    return () => canvasArea.removeEventListener('wheel', handleWheel)
  }, [])

  // ===== 顶栏自动隐藏 =====
  // 鼠标靠近页面顶部 10px 时显示顶栏
  useEffect(() => {
    function handleMouseMove(e) {
      if (e.clientY < 10) {
        setTopbarHidden(false)
      }
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // ===== ESC 关闭模态框 =====
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') closeDrill()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // ===== 缩放应用到画布 =====
  useEffect(() => {
    const content = document.getElementById('canvasContent')
    if (content) {
      content.style.transform = `scale(${zoomPercent / 100})`
    }
  }, [zoomPercent])

  // ===== 下钻内容 =====
  // 根据 drillType 生成对应模态框内容（含导航和关闭回调）
  const drillData = drillType ? getDrillData(drillType, navigateTo, closeDrill) : null

  return (
    <>
      {/* 顶栏 */}
      <Topbar
        currentPage={currentPage}
        navigateTo={navigateTo}
        topbarHidden={topbarHidden}
        onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
      />

      {/* 侧栏 */}
      <Sidebar
        currentPage={currentPage}
        navigateTo={navigateTo}
        collapsed={sidebarCollapsed}
      />

      {/* 主画布区域 */}
      <main
        className={`canvas-area${sidebarCollapsed ? ' expanded' : ''}`}
        id="canvasArea"
      >
        {/* 背景点阵 */}
        <div className="canvas-grid"></div>

        {/* 可缩放内容容器 */}
        <div className="canvas-content" id="canvasContent">

          {/* 工作台（始终渲染，通过 CSS active 类控制显隐）*/}
          {currentPage === 'dashboard' && (
            <Dashboard navigateTo={navigateTo} openDrill={openDrill} />
          )}
          {currentPage === 'todos' && <Todos />}
          {currentPage === 'docs' && <Docs openDrill={openDrill} />}
          {currentPage === 'projects' && <Projects openDrill={openDrill} />}
          {currentPage === 'whiteboard' && <Whiteboard />}
          {currentPage === 'brainstorm' && <Brainstorm />}
          {currentPage === 'review' && <Review navigateTo={navigateTo} />}

        </div>

        {/* 小地图（固定在右下角）*/}
        <div className="minimap" id="minimap">
          <div className="minimap-viewport" style={{ left: '20%', top: '10%', width: '40%', height: '50%' }}></div>
          <div className="minimap-dot" style={{ left: '30%', top: '25%' }}></div>
          <div className="minimap-dot" style={{ left: '55%', top: '40%' }}></div>
          <div className="minimap-dot" style={{ left: '70%', top: '20%' }}></div>
          <div className="minimap-dot" style={{ left: '40%', top: '65%' }}></div>
        </div>
      </main>

      {/* 底部状态栏 */}
      <StatusBar
        currentPageName={PAGE_NAMES[currentPage] || currentPage}
        zoomPercent={zoomPercent}
        onZoom={handleZoom}
        onResetZoom={handleResetZoom}
      />

      {/* 下钻模态框 */}
      <DrillModal
        show={drillShow}
        title={drillData?.title || ''}
        content={drillData?.content}
        onClose={closeDrill}
      />
    </>
  )
}
