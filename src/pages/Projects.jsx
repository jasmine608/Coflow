/**
 * Projects.jsx — 项目看板页面（Kanban Board）
 *
 * 四列看板：待办 / 进行中 / 审核 / 完成
 * 每列包含若干任务卡片，点击可打开下钻详情。
 * 后期可接入拖拽排序（推荐 dnd-kit）。
 *
 * Props:
 *  openDrill {function} 打开任务详情模态框的回调
 */

// 看板列配置（列名、状态圆点颜色、任务列表）
const KANBAN_COLUMNS = [
  {
    id: 'todo',
    label: '待办',
    dotColor: 'var(--text-weak)',
    cards: [
      { id: 't1', title: 'AI 审查模块前端页面',   priority: 'high',   deadline: '5月15日', tags: ['前端', 'AI'] },
      { id: 't2', title: '画板多人协同光标显示',   priority: 'medium', deadline: '5月18日', tags: ['画板'] },
      { id: 't3', title: '头脑风暴计时器功能',     priority: 'low',    deadline: '5月20日', tags: ['功能'] },
      { id: 't4', title: '文档导入 Word 格式支持', priority: 'low',    deadline: '5月22日', tags: ['文档'] },
    ],
  },
  {
    id: 'inprogress',
    label: '进行中',
    dotColor: 'var(--primary-500)',
    cards: [
      { id: 'p1', title: 'CRDT 文档协同核心实现', priority: 'high',   deadline: '5月14日', tags: ['核心', 'CRDT'], glow: true },
      { id: 'p2', title: '无限画布缩放交互',       priority: 'high',   deadline: '5月16日', tags: ['画板', '交互'] },
      { id: 'p3', title: '任务自动分配算法 v1',    priority: 'medium', deadline: '5月19日', tags: ['算法'] },
    ],
  },
  {
    id: 'review',
    label: '审核',
    dotColor: 'var(--warning)',
    cards: [
      { id: 'r1', title: '用户权限 RBAC 模块', priority: 'high',   deadline: 'AI 审查中',  tags: ['安全', '后端'] },
      { id: 'r2', title: '通知推送系统',        priority: 'medium', deadline: '待人工确认', tags: ['通知'] },
    ],
  },
  {
    id: 'done',
    label: '完成',
    dotColor: 'var(--success)',
    cards: [
      { id: 'd1', title: '项目脚手架搭建',     done: true },
      { id: 'd2', title: 'UI 组件库暗色主题',  done: true },
      { id: 'd3', title: '登录注册 + SSO',      done: true },
    ],
  },
]

// 优先级标签配置（颜色映射）
const PRIORITY_MAP = {
  high:   { label: '高', className: 'priority-high' },
  medium: { label: '中', className: 'priority-medium' },
  low:    { label: '低', className: 'priority-low' },
}

export default function Projects({ openDrill }) {
  return (
    <div className="page active" id="page-projects">
      <h1 className="page-title">项目管理</h1>
      <p className="page-subtitle">CoFlow 核心功能开发 · 冲刺第 3 周</p>

      {/* 看板容器（横向滚动）*/}
      <div className="kanban-board">
        {KANBAN_COLUMNS.map(col => (
          <div className="kanban-column" key={col.id}>
            {/* 列标题：状态点 + 列名 + 数量 */}
            <div className="kanban-column-header">
              <span className="col-dot" style={{ background: col.dotColor }}></span>
              {col.label}
              <span className="col-count">{col.cards.length}</span>
            </div>

            {/* 列卡片列表 */}
            <div className="kanban-column-body">
              {col.cards.map(card => (
                <div
                  key={card.id}
                  // 进行中的卡片添加光晕动画
                  className={`kanban-card${card.glow ? ' glow-pulse' : ''}`}
                  // 完成态半透明
                  style={card.done ? { opacity: 0.7 } : undefined}
                  onClick={() => openDrill('task')}
                >
                  <div className="kanban-card-title">{card.title}</div>

                  {card.done ? (
                    // 完成态只显示完成标记
                    <div className="kanban-card-meta">
                      <span style={{ color: 'var(--success)' }}>已完成</span>
                    </div>
                  ) : (
                    <>
                      {/* 优先级 + 截止时间 */}
                      <div className="kanban-card-meta">
                        <span className={`priority ${PRIORITY_MAP[card.priority]?.className}`}>
                          {PRIORITY_MAP[card.priority]?.label}
                        </span>
                        <span>{card.deadline}</span>
                      </div>
                      {/* 标签 */}
                      <div className="kanban-card-tags">
                        {card.tags?.map(tag => (
                          <span className="kanban-tag" key={tag}>{tag}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
