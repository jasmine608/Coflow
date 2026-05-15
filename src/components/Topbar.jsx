/**
 * Topbar.jsx — 顶部导航栏组件
 *
 * 功能：
 *  - 展示 CoFlow Logo
 *  - 顶部页面切换导航按钮（工作台、文档、项目等）
 *  - 搜索框
 *  - 通知按钮（带红点）
 *  - 侧栏折叠切换按钮
 *  - 用户头像
 *  - 鼠标靠近顶部时自动显示（auto-hide 逻辑由父组件控制）
 *
 * Props:
 *  currentPage  {string}   当前激活的页面 ID
 *  navigateTo   {function} 切换页面的回调
 *  sidebarOpen  {boolean}  侧栏当前展开状态
 *  onToggleSidebar {function} 切换侧栏的回调
 *  topbarHidden {boolean}  顶栏是否收起
 */

import '../styles/Topbar.css'

// 导航配置：顺序决定按钮排列顺序
const NAV_ITEMS = [
  { page: 'dashboard',   label: '工作台' },
  { page: 'docs',        label: '文档'   },
  { page: 'projects',    label: '项目'   },
  { page: 'whiteboard',  label: '画板'   },
  { page: 'brainstorm',  label: '头脑风暴' },
  { page: 'review',      label: 'AI 审查' },
]

export default function Topbar({ currentPage, navigateTo, onToggleSidebar, topbarHidden }) {
  return (
    <header
      className={`topbar${topbarHidden ? ' hidden' : ''}`}
      id="topbar"
    >
      {/* Logo */}
      <div className="topbar-logo">
        <svg viewBox="0 0 28 28" fill="none">
          <rect x="2" y="2" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 14l4 4 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        CoFlow
      </div>

      {/* 页面导航按钮 */}
      <nav className="topbar-nav" id="topNav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.page}
            // 当前页面时添加 active 样式
            className={currentPage === item.page ? 'active' : ''}
            data-page={item.page}
            onClick={() => navigateTo(item.page)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* 搜索框 */}
      <div className="topbar-search">
        {/* 搜索放大镜图标 */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <input type="text" placeholder="搜索文档、任务、项目…" />
      </div>

      {/* 右侧操作区 */}
      <div className="topbar-actions">
        {/* 通知按钮（带红点徽标）*/}
        <button className="topbar-icon-btn" title="通知">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          {/* 未读通知红点 */}
          <span className="badge"></span>
        </button>

        {/* 切换侧栏按钮 */}
        <button
          className="topbar-icon-btn"
          id="sidebarToggle"
          title="切换侧栏"
          onClick={onToggleSidebar}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 3v18"/>
          </svg>
        </button>

        {/* 用户头像（展示当前用户名首字母）*/}
        <div className="topbar-avatar" title="张明">Z</div>
      </div>
    </header>
  )
}
