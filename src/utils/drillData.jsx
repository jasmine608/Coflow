/**
 * drillData.jsx — 下钻模态框内容数据
 *
 * 提供以下类型的 JSX 内容：
 *  - task      任务详情
 *  - doc       文档详情
 *  - deadline  即将到期任务（工作链条 + 每个任务独立复制人名）
 *  - teamActivity 团队动态（配图上传 + 评论功能）
 *
 * 后期可改造为从 API 动态获取内容。
 */

import React from 'react'

// 当前登录用户名（用于工作链条中高亮"我"）
const ME = 'jasmine'

// ===== 即将到期任务 — 工作链条数据 =====
const DEADLINE_PROJECTS = [
  {
    id: 'p1',
    name: 'API 接口文档',
    deadline: '明天截止',
    urgency: 'high',
    chain: [
      { name: '李华', email: 'lihua@coflow.com', task: '需求分析', status: 'done' },
      { name: '王芳', email: 'wangfang@coflow.com', task: '接口设计', status: 'done' },
      { name: ME, email: 'jasmine@coflow.com', task: '文档编写', status: 'current' },
      { name: '陈磊', email: 'chenlei@coflow.com', task: '后端联调', status: 'next' },
      { name: '刘洋', email: 'liuyang@coflow.com', task: '集成测试', status: 'next' },
    ],
  },
  {
    id: 'p2',
    name: '用户测试报告',
    deadline: '后天截止',
    urgency: 'medium',
    chain: [
      { name: '赵雪', email: 'zhaoxue@coflow.com', task: '测试用例编写', status: 'done' },
      { name: ME, email: 'jasmine@coflow.com', task: '测试执行与记录', status: 'current' },
      { name: '张明', email: 'zhangming@coflow.com', task: '报告撰写', status: 'next' },
    ],
  },
  {
    id: 'p3',
    name: 'Q2 复盘',
    deadline: '周五截止',
    urgency: 'low',
    chain: [
      { name: '李华', email: 'lihua@coflow.com', task: '数据收集', status: 'done' },
      { name: '王芳', email: 'wangfang@coflow.com', task: '数据分析', status: 'done' },
      { name: ME, email: 'jasmine@coflow.com', task: 'PPT 制作', status: 'current' },
      { name: '陈磊', email: 'chenlei@coflow.com', task: '会议组织', status: 'next' },
      { name: '全体', email: '', task: '会议参与', status: 'next' },
    ],
  },
]

// ===== 预置 SVG 占位图（莫兰迪色系，不同主题）=====

// 数据库 ER 图风格占位
const IMG_ER = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="140" viewBox="0 0 200 140"><rect width="200" height="140" rx="8" fill="#E8E4DF"/><rect x="20" y="20" width="70" height="40" rx="6" fill="#C5CFC8" stroke="#8B9A8E" stroke-width="1"/><text x="55" y="44" text-anchor="middle" fill="#3A4A3A" font-size="9" font-family="sans-serif">User</text><rect x="110" y="20" width="70" height="40" rx="6" fill="#C5C8D0" stroke="#8FA0B0" stroke-width="1"/><text x="145" y="44" text-anchor="middle" fill="#3A4A5C" font-size="9" font-family="sans-serif">Order</text><rect x="60" y="85" width="80" height="40" rx="6" fill="#D5C5D0" stroke="#9A8AB5" stroke-width="1"/><text x="100" y="109" text-anchor="middle" fill="#4A3A5C" font-size="9" font-family="sans-serif">Product</text><line x1="90" y1="60" x2="80" y2="85" stroke="#8B9A8E" stroke-width="1"/><line x1="110" y1="60" x2="120" y2="85" stroke="#8FA0B0" stroke-width="1"/></svg>')}`

// UI 走查截图风格占位
const IMG_UI = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="140" viewBox="0 0 200 140"><rect width="200" height="140" rx="8" fill="#E4E0E8"/><rect x="15" y="12" width="170" height="24" rx="4" fill="#D0CCD8"/><circle cx="28" cy="24" r="5" fill="#C4A7A7"/><circle cx="42" cy="24" r="5" fill="#C4C7A7"/><rect x="15" y="44" width="80" height="50" rx="4" fill="#D5D8E0"/><rect x="105" y="44" width="80" height="24" rx="4" fill="#C8D0C8"/><rect x="105" y="74" width="80" height="20" rx="4" fill="#D8D0C8"/><circle cx="38" cy="108" r="8" fill="#B8A9C9"/><rect x="52" y="104" width="60" height="8" rx="2" fill="#C0B8C8"/><rect x="15" y="120" width="170" height="4" rx="2" fill="#C8C0C8"/></svg>')}`

// 接口文档风格占位
const IMG_API = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="140" viewBox="0 0 200 140"><rect width="200" height="140" rx="8" fill="#E0E4DF"/><rect x="15" y="12" width="170" height="20" rx="4" fill="#C8CCC8"/><text x="25" y="26" fill="#5A6A5A" font-size="9" font-family="monospace">GET /api/v1/users</text><rect x="15" y="40" width="170" height="36" rx="4" fill="#D0D4D0"/><text x="25" y="54" fill="#5A6A5A" font-size="8" font-family="monospace">200 OK · 42ms</text><text x="25" y="68" fill="#8A9A8A" font-size="8" font-family="monospace">{ "data": [...], "total": 156 }</text><rect x="15" y="84" width="170" height="20" rx="4" fill="#C8CCC8"/><text x="25" y="98" fill="#5A6A5A" font-size="9" font-family="monospace">POST /api/v1/orders</text><rect x="15" y="112" width="170" height="20" rx="4" fill="#D0D4D0"/><text x="25" y="126" fill="#8A9A8A" font-size="8" font-family="monospace">201 Created · 68ms</text></svg>')}`

// 性能图表风格占位
const IMG_PERF = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="140" viewBox="0 0 200 140"><rect width="200" height="140" rx="8" fill="#E4E8E8"/><rect x="15" y="12" width="170" height="20" rx="4" fill="#C0D0D0"/><text x="25" y="26" fill="#3A5A5A" font-size="9" font-family="sans-serif">Benchmark Results</text><rect x="25" y="45" width="30" height="70" rx="3" fill="#8B9A8E" opacity="0.7"/><rect x="65" y="60" width="30" height="55" rx="3" fill="#A5B5C5" opacity="0.7"/><rect x="105" y="40" width="30" height="75" rx="3" fill="#B8A9C9" opacity="0.7"/><rect x="145" y="55" width="30" height="60" rx="3" fill="#C4A7A7" opacity="0.7"/><text x="40" y="124" text-anchor="middle" fill="#6A7A7A" font-size="8" font-family="sans-serif">Read</text><text x="80" y="124" text-anchor="middle" fill="#6A7A7A" font-size="8" font-family="sans-serif">Write</text><text x="120" y="124" text-anchor="middle" fill="#6A7A7A" font-size="8" font-family="sans-serif">Sync</text><text x="160" y="124" text-anchor="middle" fill="#6A7A7A" font-size="8" font-family="sans-serif">Merge</text></svg>')}`

// 项目看板风格占位
const IMG_BOARD = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="140" viewBox="0 0 200 140"><rect width="200" height="140" rx="8" fill="#E8E4DF"/><rect x="15" y="12" width="50" height="116" rx="4" fill="#D5D0C8"/><text x="40" y="28" text-anchor="middle" fill="#6A5A4A" font-size="8" font-family="sans-serif">待办</text><rect x="22" y="36" width="36" height="14" rx="3" fill="#E0D8D0"/><rect x="22" y="56" width="36" height="14" rx="3" fill="#E0D8D0"/><rect x="75" y="12" width="50" height="116" rx="4" fill="#C8D0C8"/><text x="100" y="28" text-anchor="middle" fill="#4A5A3A" font-size="8" font-family="sans-serif">进行中</text><rect x="82" y="36" width="36" height="14" rx="3" fill="#D8E0D8"/><rect x="82" y="56" width="36" height="14" rx="3" fill="#D8E0D8"/><rect x="135" y="12" width="50" height="116" rx="4" fill="#D0C8C8"/><text x="160" y="28" text-anchor="middle" fill="#5A4A4A" font-size="8" font-family="sans-serif">完成</text><rect x="142" y="36" width="36" height="14" rx="3" fill="#E0D8D8"/></svg>')}`

// ===== 团队动态数据（配图 + 分区）=====
const MY_RELATED_ACTIVITIES = [
  {
    id: 'ra1',
    author: '李华',
    avatar: 'L',
    avatarBg: 'linear-gradient(135deg,#A5B5C5,#8B9A8E)',
    action: '完成了「数据库设计」并提交评审',
    time: '2 分钟前',
    image: IMG_ER,
    imageDesc: '数据库 ER 图',
  },
  {
    id: 'ra2',
    author: '王芳',
    avatar: 'W',
    avatarBg: 'linear-gradient(135deg,#B8A9C9,#C4A7A7)',
    action: '提交了「UI 走查报告」待 AI 审查',
    time: '10 分钟前',
    image: IMG_UI,
    imageDesc: 'UI 走查截图',
  },
  {
    id: 'ra3',
    author: '陈磊',
    avatar: 'C',
    avatarBg: 'linear-gradient(135deg,#D4C4A8,#8B9A8E)',
    action: '在「API 接口文档」中 @了你：接口字段需要确认',
    time: '30 分钟前',
    image: IMG_API,
    imageDesc: '接口文档截图',
  },
]

const TEAM_ACTIVITIES = [
  {
    id: 'ta1',
    author: '刘洋',
    avatar: 'Y',
    avatarBg: 'linear-gradient(135deg,#A8C4C4,#A5B5C5)',
    action: '完成了「画板性能优化」基准测试',
    time: '1 小时前',
    image: IMG_PERF,
    imageDesc: '性能测试报告',
  },
  {
    id: 'ta2',
    author: '赵雪',
    avatar: 'Z',
    avatarBg: 'linear-gradient(135deg,#C4A7A7,#D4C4A8)',
    action: '创建了新项目「Q3 规划」',
    time: '2 小时前',
    image: IMG_BOARD,
    imageDesc: '项目看板',
  },
]

const COMPANY_NEWS = [
  {
    id: 'cn1',
    title: '公司全员大会：2026 下半年战略方向发布',
    time: '今天 14:00',
    image: null,
    imageDesc: '战略会议',
  },
  {
    id: 'cn2',
    title: '新办公区装修进度：预计 6 月中旬搬迁',
    time: '昨天',
    image: null,
    imageDesc: '新办公区效果图',
  },
]

// ===== 即将到期任务内容 =====
const deadlineContent = () => {
  // 紧急度标签样式
  const urgencyMap = {
    high:   { label: '紧急', bg: 'rgba(184,128,128,0.15)', color: 'var(--error)' },
    medium: { label: '较急', bg: 'rgba(196,167,167,0.15)', color: 'var(--warning)' },
    low:    { label: '普通', bg: 'rgba(165,181,197,0.15)', color: 'var(--info)' },
  }

  // 复制指定项目的全部人员邮箱
  function copyProjectEmails(projId) {
    const proj = DEADLINE_PROJECTS.find(p => p.id === projId)
    if (!proj) return
    // 收集所有有邮箱的人员（排除"全体"）
    const emails = proj.chain
      .filter(node => node.email && node.name !== '全体')
      .map(node => node.email)
    const text = emails.join('; ')
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('copyBtn-' + projId)
      if (btn) {
        btn.textContent = '已复制 ✓'
        setTimeout(() => { btn.textContent = '复制邮件抄送' }, 2000)
      }
    }).catch(() => {
      // 降级方案
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      const btn = document.getElementById('copyBtn-' + projId)
      if (btn) {
        btn.textContent = '已复制 ✓'
        setTimeout(() => { btn.textContent = '复制邮件抄送' }, 2000)
      }
    })
  }

  return (
    <div>
      {/* 各项目工作链条 */}
      {DEADLINE_PROJECTS.map(proj => {
        return (
          <div
            key={proj.id}
            style={{
              background: 'var(--bg-deep)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '12px',
              border: '1px solid var(--border)',
            }}
          >
            {/* 项目名 + 截止时间 + 复制按钮 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {proj.name}
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: urgencyMap[proj.urgency].bg,
                  color: urgencyMap[proj.urgency].color,
                }}>
                  {urgencyMap[proj.urgency].label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--warning)' }}>{proj.deadline}</span>
              </div>
            </div>

            {/* 工作链条 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', overflowX: 'auto', paddingBottom: '4px' }}>
              {proj.chain.map((node, idx) => {
                // 节点样式：done=灰色, current=红色, next=绿色
                let nodeColor, nodeBg, borderStyle
                if (node.status === 'done') {
                  nodeColor = 'var(--text-weak)'
                  nodeBg = 'var(--bg-mid)'
                  borderStyle = '1px dashed var(--border)'
                } else if (node.status === 'current') {
                  nodeColor = '#fff'
                  nodeBg = 'var(--error)'
                  borderStyle = '1px solid var(--error)'
                } else {
                  nodeColor = '#fff'
                  nodeBg = 'var(--success)'
                  borderStyle = '1px solid var(--success)'
                }

                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    {/* 工作节点 */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      minWidth: '72px',
                    }}>
                      {/* 人名圆圈 */}
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: nodeBg,
                        color: nodeColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: borderStyle,
                        transition: 'all 0.15s',
                      }}>
                        {node.name === ME ? '我' : node.name.charAt(0)}
                      </div>
                      {/* 人名 */}
                      <span style={{
                        fontSize: '11px',
                        fontWeight: node.status === 'current' ? 700 : 400,
                        color: node.status === 'current' ? 'var(--error)' : node.status === 'next' ? 'var(--success)' : 'var(--text-weak)',
                      }}>
                        {node.name}
                      </span>
                      {/* 邮箱 */}
                      {node.email && (
                        <span style={{
                          fontSize: '8px',
                          color: 'var(--text-weak)',
                          maxWidth: '80px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block',
                          lineHeight: 1.2,
                        }}>
                          {node.email}
                        </span>
                      )}
                      {/* 任务名 */}
                      <span style={{
                        fontSize: '9px',
                        color: 'var(--text-weak)',
                        maxWidth: '72px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {node.task}
                      </span>
                    </div>

                    {/* 连接箭头 */}
                    {idx < proj.chain.length - 1 && (
                      <div style={{
                        width: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-weak)',
                        flexShrink: 0,
                      }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* 复制邮件抄送按钮 */}
            {(() => {
              const allMembers = proj.chain.filter(node => node.email && node.name !== '全体')
              return allMembers.length > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--text-weak)' }}>邮件抄送：</span>
                    {allMembers.map((node, i) => (
                      <span key={i}>
                        {node.name}
                        <span style={{ color: 'var(--text-weak)', fontSize: '10px' }}>（{node.email}）</span>
                        {i < allMembers.length - 1 ? '、' : ''}
                      </span>
                    ))}
                  </span>
                  <button
                    id={'copyBtn-' + proj.id}
                    className="btn btn-ghost"
                    style={{ fontSize: '10px', padding: '3px 10px', whiteSpace: 'nowrap' }}
                    onClick={() => copyProjectEmails(proj.id)}
                  >
                    复制邮件抄送
                  </button>
                </div>
              ) : null
            })()}

            {/* 图例 */}
            <div style={{ display: 'flex', gap: '14px', marginTop: '10px', fontSize: '10px', color: 'var(--text-weak)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--bg-mid)', border: '1px dashed var(--border)', display: 'inline-block' }}></span>
                已完成
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--error)', display: 'inline-block' }}></span>
                我（当前）
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}></span>
                后续人员
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ===== 团队动态内容 =====
const teamActivityContent = () => {
  // 这里返回一个包装组件，内部使用 state 管理图片和评论
  return <TeamActivityPanel />
}

// 团队动态面板（独立组件，支持上传图片和评论）
class TeamActivityPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 与我相关动态（增加 imageUrl 和 comments）
      myActivities: MY_RELATED_ACTIVITIES.map(item => ({
        ...item,
        // 使用预置图片作为默认 imageUrl（如果有的话）
        imageUrl: item.image || null,
        comments: item.id === 'ra1'
          ? [{ id: 'c1', author: '王芳', avatar: 'W', avatarBg: 'linear-gradient(135deg,#B8A9C9,#C4A7A7)', text: 'ER 图设计得很清晰，已同步到文档中心', time: '1 分钟前' }]
          : [],
      })),
      teamActivities: TEAM_ACTIVITIES.map(item => ({
        ...item,
        imageUrl: item.image || null,
        comments: [],
      })),
      companyNews: COMPANY_NEWS.map(item => ({
        ...item,
        imageUrl: item.image || null,
        comments: [],
      })),
      // 正在输入评论的动态 ID
      commentingId: null,
      commentText: '',
      // 上传图片的动态 ID
      uploadingId: null,
      // 发布新动态
      showNewPost: false,
      newPostText: '',
      newPostImageUrl: null,
    }
    this.fileInputRef = React.createRef()
    this.newPostImageRef = React.createRef()
  }

  // 上传图片
  handleUploadImage(id, e) {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      this.updateActivity(id, { imageUrl: ev.target.result })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // 更新动态数据（在三个分区中查找）
  updateActivity(id, updates) {
    this.setState(prev => ({
      myActivities: prev.myActivities.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
      teamActivities: prev.teamActivities.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
      companyNews: prev.companyNews.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }))
  }

  // 提交评论
  submitComment(id) {
    const { commentText } = this.state
    if (!commentText.trim()) return
    const newComment = {
      id: 'c' + Date.now(),
      author: 'jasmine',
      avatar: 'J',
      avatarBg: 'linear-gradient(135deg,#A5B5C5,#8FA0B0)',
      text: commentText.trim(),
      time: '刚刚',
    }
    this.setState(prev => ({
      myActivities: prev.myActivities.map(item =>
        item.id === id ? { ...item, comments: [...item.comments, newComment] } : item
      ),
      teamActivities: prev.teamActivities.map(item =>
        item.id === id ? { ...item, comments: [...item.comments, newComment] } : item
      ),
      companyNews: prev.companyNews.map(item =>
        item.id === id ? { ...item, comments: [...item.comments, newComment] } : item
      ),
      commentingId: null,
      commentText: '',
    }))
  }

  // 发布新动态
  submitNewPost() {
    const { newPostText, newPostImageUrl } = this.state
    if (!newPostText.trim()) return
    const newActivity = {
      id: 'new-' + Date.now(),
      author: 'jasmine',
      avatar: 'J',
      avatarBg: 'linear-gradient(135deg,#A5B5C5,#8FA0B0)',
      action: newPostText.trim(),
      time: '刚刚',
      imageUrl: newPostImageUrl,
      comments: [],
    }
    this.setState(prev => ({
      // 新动态插到"与我相关"最前面
      myActivities: [newActivity, ...prev.myActivities],
      showNewPost: false,
      newPostText: '',
      newPostImageUrl: null,
    }))
  }

  // 上传新动态的图片
  handleNewPostImage(e) {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      this.setState({ newPostImageUrl: ev.target.result })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // 动态卡片组件
  ActivityCard = ({ item, showAuthor }) => {
    const { commentingId, commentText } = this.state
    const isCommenting = commentingId === item.id
    return (
      <div style={{
        display: 'flex',
        gap: '12px',
        padding: '12px',
        borderRadius: '10px',
        background: 'var(--bg-mid)',
        border: '1px solid var(--border)',
        marginBottom: '8px',
        transition: 'all 0.15s',
        flexDirection: 'column',
      }}>
        {/* 主内容行 */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* 头像 */}
          {showAuthor && item.avatar && (
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: item.avatarBg,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 600,
              flexShrink: 0,
            }}>
              {item.avatar}
            </div>
          )}

          {/* 文字内容 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {showAuthor && (
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                {item.author}
              </div>
            )}
            {item.title && (
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {item.title}
              </div>
            )}
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {item.action}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-weak)', marginTop: '4px' }}>
              {item.time}
            </div>
          </div>

          {/* 配图区域 */}
          <div style={{
            width: '100px',
            height: '70px',
            borderRadius: '8px',
            background: item.imageUrl ? 'var(--bg-deep)' : 'linear-gradient(135deg, var(--bg-deep), var(--bg-mid))',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
          }} onClick={() => {
            // 点击配图区域触发上传（可替换已有图片）
            this.setState({ uploadingId: item.id }, () => {
              this.fileInputRef.current?.click()
            })
          }}>
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.imageDesc || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }} />
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-weak)" strokeWidth="1.5" width="24" height="24">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <div style={{
                  position: 'absolute', bottom: '2px', left: '0', right: '0',
                  textAlign: 'center', fontSize: '7px', color: 'var(--text-weak)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '0 2px',
                }}>
                  点击上传
                </div>
              </>
            )}
            {/* 图片右下角替换提示 */}
            {item.imageUrl && (
              <div style={{
                position: 'absolute', bottom: '2px', right: '2px',
                background: 'rgba(0,0,0,0.5)', color: '#fff',
                fontSize: '7px', padding: '1px 4px', borderRadius: '3px',
                opacity: 0.7,
              }}>
                换图
              </div>
            )}
          </div>
        </div>

        {/* 评论区域 */}
        {item.comments.length > 0 && (
          <div style={{ marginTop: '4px', paddingLeft: showAuthor ? '48px' : '0' }}>
            {item.comments.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: c.avatarBg, color: '#fff', fontSize: '9px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px',
                }}>
                  {c.avatar}
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', marginRight: '4px' }}>{c.author}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{c.text}</span>
                  <span style={{ fontSize: '9px', color: 'var(--text-weak)', marginLeft: '6px' }}>{c.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 评论输入行 */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', paddingLeft: showAuthor ? '48px' : '0' }}>
          {isCommenting ? (
            <>
              <input
                style={{
                  flex: 1, background: 'var(--bg-deep)', border: '1px solid var(--border)',
                  borderRadius: '6px', color: 'var(--text-primary)', fontSize: '11px',
                  padding: '4px 8px', outline: 'none', fontFamily: 'inherit',
                }}
                placeholder="输入评论..."
                value={commentText}
                onChange={(e) => this.setState({ commentText: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); this.submitComment(item.id) }
                  if (e.key === 'Escape') this.setState({ commentingId: null, commentText: '' })
                }}
                autoFocus
              />
              <button
                className="btn btn-primary"
                style={{ fontSize: '10px', padding: '3px 8px' }}
                onClick={() => this.submitComment(item.id)}
                disabled={!commentText.trim()}
              >
                发送
              </button>
              <button
                className="btn btn-ghost"
                style={{ fontSize: '10px', padding: '3px 8px' }}
                onClick={() => this.setState({ commentingId: null, commentText: '' })}
              >
                取消
              </button>
            </>
          ) : (
            <button
              style={{
                background: 'none', border: 'none', color: 'var(--text-weak)',
                fontSize: '11px', cursor: 'pointer', padding: '0', fontFamily: 'inherit',
              }}
              onClick={() => this.setState({ commentingId: item.id, commentText: '' })}
            >
              💬 评论
            </button>
          )}
        </div>
      </div>
    )
  }

  render() {
    const { myActivities, teamActivities, companyNews, uploadingId, showNewPost, newPostText, newPostImageUrl } = this.state
    return (
      <div>
        {/* 隐藏的文件上传 input（替换动态配图）*/}
        <input
          ref={this.fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (uploadingId) this.handleUploadImage(uploadingId, e)
          }}
        />
        {/* 隐藏的文件上传 input（新动态配图）*/}
        <input
          ref={this.newPostImageRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => this.handleNewPostImage(e)}
        />

        {/* 发布新动态入口 */}
        {!showNewPost ? (
          <button
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px dashed var(--border)',
              background: 'var(--bg-mid)',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
            onClick={() => this.setState({ showNewPost: true })}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-500)'; e.currentTarget.style.color = 'var(--primary-700)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            发布新动态...
          </button>
        ) : (
          <div style={{
            padding: '14px',
            borderRadius: '10px',
            background: 'var(--bg-mid)',
            border: '1px solid var(--primary-500)',
            marginBottom: '16px',
          }}>
            {/* 头像 + 输入框 */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#A5B5C5,#8FA0B0)',
                color: '#fff', fontSize: '13px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>J</div>
              <textarea
                style={{
                  flex: 1, background: 'var(--bg-deep)', border: '1px solid var(--border)',
                  borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px',
                  padding: '8px 10px', outline: 'none', fontFamily: 'inherit',
                  resize: 'none', minHeight: '48px', lineHeight: 1.5,
                }}
                placeholder="分享你的工作进展..."
                value={newPostText}
                onChange={(e) => this.setState({ newPostText: e.target.value })}
                autoFocus
              />
            </div>

            {/* 图片预览 */}
            {newPostImageUrl && (
              <div style={{ marginLeft: '42px', marginBottom: '10px', position: 'relative', display: 'inline-block' }}>
                <img src={newPostImageUrl} alt="" style={{ height: '60px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                <button
                  onClick={() => this.setState({ newPostImageUrl: null })}
                  style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: 'var(--error)', color: '#fff', border: 'none',
                    fontSize: '10px', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                  }}
                >×</button>
              </div>
            )}

            {/* 操作栏 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: '42px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {/* 上传图片按钮 */}
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--text-weak)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'inherit' }}
                  onClick={() => this.newPostImageRef.current?.click()}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                  图片
                </button>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button className="btn btn-ghost" style={{ fontSize: '11px', padding: '4px 12px' }} onClick={() => this.setState({ showNewPost: false, newPostText: '', newPostImageUrl: null })}>取消</button>
                <button className="btn btn-primary" style={{ fontSize: '11px', padding: '4px 12px' }} onClick={() => this.submitNewPost()} disabled={!newPostText.trim()}>发布</button>
              </div>
            </div>
          </div>
        )}

        {/* 第一区：与我相关的动态 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--primary-700)',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            与我相关
          </div>
          {myActivities.map(item => (
            <this.ActivityCard key={item.id} item={item} showAuthor />
          ))}
        </div>

        {/* 分隔线 */}
        <div style={{ borderTop: '1px solid var(--border)', margin: '16px 0' }}></div>

        {/* 第二区：团队动态 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            团队动态
          </div>
          {teamActivities.map(item => (
            <this.ActivityCard key={item.id} item={item} showAuthor />
          ))}
        </div>

        {/* 分隔线 */}
        <div style={{ borderTop: '1px solid var(--border)', margin: '16px 0' }}></div>

        {/* 第三区：公司新闻 */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            marginBottom: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-weak)',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
            </svg>
            公司新闻
          </div>
          {companyNews.map(item => (
            <this.ActivityCard key={item.id} item={item} showAuthor={false} />
          ))}
        </div>
      </div>
    )
  }
}

// ===== 任务详情 JSX 内容 =====
const taskContent = (navigateTo) => (
  <div>
    {/* 状态标签 */}
    <div style={{ marginBottom: '16px' }}>
      <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(165,181,197,0.15)', color: 'var(--primary-700)' }}>
        进行中
      </span>
      <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(184,128,128,0.15)', color: 'var(--error)', marginLeft: '6px' }}>
        高优先级
      </span>
    </div>

    <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>CRDT 文档协同核心实现</h4>

    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
      基于 Yjs 实现 CRDT 协同编辑核心模块，支持多人同时编辑文档，光标与选区实时同步。
      需要集成 ProseMirror/Tiptap 编辑器框架，实现增量同步与断线重连自动合并。
    </p>

    {/* 负责人 + 截止日期 */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
      <div style={{ padding: '12px', background: 'var(--bg-deep)', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-weak)', marginBottom: '4px' }}>负责人</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className="mini-avatar" style={{ background: 'linear-gradient(135deg,#A5B5C5,#8B9A8E)', margin: 0 }}>J</div>
          <span style={{ fontSize: '13px' }}>jasmine</span>
        </div>
      </div>
      <div style={{ padding: '12px', background: 'var(--bg-deep)', borderRadius: '8px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-weak)', marginBottom: '4px' }}>截止日期</div>
        <span style={{ fontSize: '13px', color: 'var(--warning)' }}>5月14日（今天）</span>
      </div>
    </div>

    {/* AI 自动分配建议 */}
    <div style={{ padding: '12px', background: 'var(--bg-deep)', borderRadius: '8px', marginBottom: '16px' }}>
      <div style={{ fontSize: '11px', color: 'var(--text-weak)', marginBottom: '8px' }}>AI 自动分配建议</div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        基于技能匹配（权重 0.4）、负载空闲度（0.3）、历史完成率（0.2）、同类经验（0.1），推荐：<br/>
        <span style={{ color: 'var(--primary-700)' }}>1. jasmine（综合分 0.87）</span> ·{' '}
        <span style={{ color: 'var(--primary-500)' }}>2. 李华（综合分 0.72）</span> ·{' '}
        <span style={{ color: 'var(--morandi-purple)' }}>3. 王芳（综合分 0.65）</span>
      </div>
    </div>

    {/* 操作按钮 */}
    <div style={{ display: 'flex', gap: '8px' }}>
      <button className="btn btn-primary">确认分配</button>
      <button className="btn btn-ghost">查看关联文档</button>
    </div>
  </div>
)

// ===== 文档详情 JSX 内容 =====
const docContent = (navigateTo, closeModal) => (
  <div>
    {/* 文档状态标签 */}
    <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(168,196,196,0.15)', color: 'var(--morandi-cyan)' }}>
        2 人在线编辑
      </span>
      <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(165,181,197,0.15)', color: 'var(--primary-700)' }}>
        拥有者
      </span>
    </div>

    <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>CoFlow 产品需求文档 v2.1</h4>

    {/* 文档摘要 */}
    <div style={{ background: 'var(--bg-deep)', borderRadius: '8px', padding: '16px', marginBottom: '16px', border: '1px solid var(--border)' }}>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        CoFlow 是一款面向企业客户的
        <strong style={{ color: 'var(--text-primary)' }}>一站式团队协作平台</strong>，
        将文档协作、项目管理、在线画板、头脑风暴四大核心能力整合于统一界面，支持跨设备无缝访问……
      </p>
      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
        <div style={{ background: 'rgba(165,181,197,0.1)', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', color: 'var(--primary-700)' }}>
          📋 评论 3
        </div>
        <div style={{ background: 'rgba(184,169,201,0.1)', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', color: 'var(--morandi-purple)' }}>
          📌 批注 1
        </div>
      </div>
    </div>

    {/* 文档元数据 */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
      <div style={{ padding: '10px', background: 'var(--bg-deep)', borderRadius: '8px', textAlign: 'center' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-weak)' }}>版本</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary-700)' }}>v2.1</div>
      </div>
      <div style={{ padding: '10px', background: 'var(--bg-deep)', borderRadius: '8px', textAlign: 'center' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-weak)' }}>字数</div>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>8,432</div>
      </div>
      <div style={{ padding: '10px', background: 'var(--bg-deep)', borderRadius: '8px', textAlign: 'center' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-weak)' }}>权限</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--success)' }}>可编辑</div>
      </div>
    </div>

    {/* 操作按钮 */}
    <div style={{ display: 'flex', gap: '8px' }}>
      <button className="btn btn-primary">进入编辑</button>
      {/* 点击时先跳转再关闭模态框 */}
      <button
        className="btn btn-ghost"
        onClick={() => { navigateTo('review'); closeModal(); }}
      >
        查看 AI 审查结果
      </button>
    </div>
  </div>
)

/**
 * 生成下钻内容
 * @param {string}   type       'task' | 'doc' | 'deadline' | 'teamActivity'
 * @param {function} navigateTo 跳转页面的回调
 * @param {function} closeModal 关闭模态框的回调
 * @returns {{ title: string, content: JSX.Element } | null}
 */
export function getDrillData(type, navigateTo, closeModal) {
  if (type === 'task') {
    return { title: '任务详情', content: taskContent(navigateTo) }
  }
  if (type === 'doc') {
    return { title: '文档详情', content: docContent(navigateTo, closeModal) }
  }
  if (type === 'deadline') {
    return { title: '即将到期任务', content: deadlineContent() }
  }
  if (type === 'teamActivity') {
    return { title: '团队动态', content: teamActivityContent() }
  }
  return null
}
