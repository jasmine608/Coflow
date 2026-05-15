/**
 * Sidebar.jsx — 侧边导航栏组件
 *
 * 功能：
 *  - 分组展示导航项（工作台、文档、项目、AI 审查）
 *  - 高亮当前激活的页面
 *  - 支持折叠/展开
 *
 * Props:
 *  currentPage {string}   当前激活页面 ID
 *  navigateTo  {function} 切换页面的回调
 *  collapsed   {boolean}  是否折叠
 */

import '../styles/Sidebar.css'

// 侧栏导航分组配置
const SIDEBAR_SECTIONS = [
  {
    title: '工作台',
    items: [
      {
        page: 'dashboard',
        label: '总览',
        // SVG 路径定义（四宫格图标）
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        ),
      },
      {
        page: 'todos',
        label: '我的待办',
        count: 5,  // 待办数量徽标
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
        ),
      },
    ],
  },
  {
    title: '文档',
    items: [
      {
        page: 'docs',
        label: '最近编辑',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
          </svg>
        ),
      },
      {
        page: 'docs',
        label: '收藏文档',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ),
      },
    ],
  },
  {
    title: '项目',
    items: [
      {
        page: 'projects',
        label: '我参与的',
        count: 3,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
          </svg>
        ),
      },
      {
        page: 'projects',
        label: '我负责的',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
          </svg>
        ),
      },
    ],
  },
  {
    title: 'AI 审查',
    items: [
      {
        page: 'review',
        label: '审查报告',
        count: 2,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.48 0 2.88.36 4.11.99"/>
          </svg>
        ),
      },
      {
        page: 'review',
        label: '审查标准',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        ),
      },
    ],
  },
]

export default function Sidebar({ currentPage, navigateTo, collapsed }) {
  return (
    <aside
      className={`sidebar${collapsed ? ' collapsed' : ''}`}
      id="sidebar"
    >
      {/* 遍历渲染各分组 */}
      {SIDEBAR_SECTIONS.map(section => (
        <div className="sidebar-section" key={section.title}>
          {/* 分组标题 */}
          <div className="sidebar-section-title">{section.title}</div>

          {/* 分组内导航项 */}
          {section.items.map((item, idx) => (
            <div
              key={`${item.page}-${idx}`}
              // 当前页面对应项高亮
              className={`sidebar-item${currentPage === item.page ? ' active' : ''}`}
              data-page={item.page}
              onClick={() => navigateTo(item.page)}
            >
              {item.icon}
              {item.label}
              {/* 仅在有数量时渲染徽标 */}
              {item.count && <span className="count">{item.count}</span>}
            </div>
          ))}
        </div>
      ))}
    </aside>
  )
}
