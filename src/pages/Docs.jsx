/**
 * Docs.jsx — 文档中心页面
 *
 * 展示文档列表，点击文档项可打开下钻详情模态框。
 * 后期接入后端后，文档列表从 API 获取。
 *
 * Props:
 *  openDrill {function} 打开模态框的回调，接受类型字符串 'doc'
 */

// 文档列表数据（后期从 API /docs 接口获取）
const DOCS = [
  {
    id: 1,
    title: 'CoFlow 产品需求文档 v2.1',
    desc: '包含协作编辑、AI 审查、画板等模块的完整需求定义',
    iconColor: 'rgba(165,181,197,0.15)',
    iconTextColor: 'var(--primary-700)',
    onlineCount: 2,    // 当前在线编辑人数
    time: '5 分钟前',
  },
  {
    id: 2,
    title: 'Q2 季度工作总结',
    desc: '2026 年第二季度团队工作成果汇总与下季度规划',
    iconColor: 'rgba(165,181,197,0.15)',
    iconTextColor: 'var(--primary-600)',
    onlineCount: 0,
    time: '1 小时前',
  },
  {
    id: 3,
    title: 'API 接口设计规范',
    desc: 'RESTful API 设计标准、命名规范、错误码体系',
    iconColor: 'rgba(184,169,201,0.15)',
    iconTextColor: 'var(--morandi-purple)',
    onlineCount: 0,
    deadline: '明天截止',
    time: '3 小时前',
  },
  {
    id: 4,
    title: '用户测试报告 — 首页改版',
    desc: '8 名用户参与可用性测试，包含任务完成率与满意度数据',
    iconColor: 'rgba(139,154,142,0.15)',
    iconTextColor: 'var(--success)',
    onlineCount: 0,
    time: '昨天',
  },
  {
    id: 5,
    title: '2026 技术架构升级方案',
    desc: '微服务架构迁移计划，含 Kubernetes 部署方案与监控体系',
    iconColor: 'rgba(196,167,167,0.15)',
    iconTextColor: 'var(--warning)',
    onlineCount: 0,
    time: '3 天前',
  },
]

export default function Docs({ openDrill }) {
  return (
    <div className="page active" id="page-docs">
      <h1 className="page-title">文档中心</h1>
      <p className="page-subtitle">协作编辑、评论批注、版本管理</p>

      <div className="doc-list">
        {/* 遍历渲染文档列表 */}
        {DOCS.map(doc => (
          <div
            key={doc.id}
            className="doc-item"
            onClick={() => openDrill('doc')}
          >
            {/* 文档类型图标 */}
            <div className="doc-icon" style={{ background: doc.iconColor, color: doc.iconTextColor }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <path d="M14 2v6h6"/>
              </svg>
            </div>

            {/* 文档标题与摘要 */}
            <div className="doc-info">
              <h4>{doc.title}</h4>
              <p>{doc.desc}</p>
            </div>

            {/* 右侧元数据：在线人数、截止时间、最后修改 */}
            <div className="doc-meta">
              {/* 有人在线时高亮显示 */}
              {doc.onlineCount > 0 && (
                <span style={{ color: 'var(--morandi-cyan)' }}>{doc.onlineCount}人在线</span>
              )}
              {/* 临近截止日期警告 */}
              {doc.deadline && (
                <span style={{ color: 'var(--warning)' }}>{doc.deadline}</span>
              )}
              <span>{doc.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
