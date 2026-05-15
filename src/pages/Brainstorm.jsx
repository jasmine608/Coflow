/**
 * Brainstorm.jsx — 头脑风暴页面
 *
 * 功能：
 *  - 展示想法卡片网格
 *  - 为想法点赞投票
 *  - 底部输入框提交新想法（Enter 或点击按钮）
 *  - 三阶段切换（发散 / 收敛 / 决策）
 *
 * 后期扩展：
 *  - 接入 Socket.IO 实时广播其他人的新想法和投票
 *  - 阶段切换同步给所有参与者
 */

import { useState } from 'react'

// 初始想法数据（后期从 API /brainstorm/:roomId/ideas 获取）
const INITIAL_IDEAS = [
  { id: 1, text: '引入 AI Agent 自动化工作流，让重复性任务自动执行', author: '张明', votes: 12 },
  { id: 2, text: '支持离线模式，网络恢复后自动同步',                    author: '李华', votes: 9  },
  { id: 3, text: '画板集成 AI 绘图生成，文字描述自动出图',              author: '王芳', votes: 11 },
  { id: 4, text: '跨项目知识库沉淀，避免重复造轮子',                    author: '陈磊', votes: 8  },
  { id: 5, text: '移动端手势优化，双指缩放画板三指切换工具',            author: '刘洋', votes: 7  },
  { id: 6, text: '实时视频通话集成，边讨论边协作',                      author: '赵雪', votes: 6  },
  { id: 7, text: '数据看板：团队效率、任务完成趋势可视化',              author: '张明', votes: 5  },
  { id: 8, text: '智能日程：自动识别文档中的时间节点创建日程',          author: '李华', votes: 4  },
]

// 阶段配置
const PHASES = [
  { id: 'diverge',  label: '发散', status: 'done'   },
  { id: 'converge', label: '收敛', status: 'active' },
  { id: 'decide',   label: '决策', status: ''       },
]

export default function Brainstorm() {
  // 想法列表
  const [ideas, setIdeas] = useState(INITIAL_IDEAS)
  // 输入框内容
  const [inputText, setInputText] = useState('')
  // 当前阶段
  const [activePhase, setActivePhase] = useState('converge')

  // 提交新想法
  function submitIdea() {
    const text = inputText.trim()
    if (!text) return

    // 新想法插入到列表最前
    setIdeas(prev => [
      { id: Date.now(), text, author: '张明', votes: 0 },
      ...prev,
    ])
    // 清空输入框
    setInputText('')
  }

  // 为某个想法投票（+1）
  function voteIdea(id) {
    setIdeas(prev =>
      prev.map(idea =>
        idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
      )
    )
  }

  // 处理 Enter 键提交
  function handleKeyDown(e) {
    if (e.key === 'Enter') submitIdea()
  }

  return (
    <div className="page active" id="page-brainstorm" style={{ position: 'relative' }}>
      <div className="brainstorm-room">

        {/* 页面头部 */}
        <div className="brainstorm-header">
          <div>
            <h1 className="page-title" style={{ marginBottom: '4px' }}>2026 产品方向讨论</h1>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>
              8 位成员 · {ideas.length} 个想法 · 收敛阶段
            </p>
          </div>

          {/* 阶段步骤导航 */}
          <div className="brainstorm-phase">
            {PHASES.map(phase => (
              <span
                key={phase.id}
                className={`phase-step${activePhase === phase.id ? ' active' : ''}${phase.status === 'done' ? ' done' : ''}`}
                onClick={() => setActivePhase(phase.id)}
              >
                {phase.label}
              </span>
            ))}
          </div>
        </div>

        {/* 想法卡片网格 */}
        <div className="idea-grid" id="ideaGrid">
          {ideas.map(idea => (
            <div className="idea-card" key={idea.id}>
              <div className="idea-card-text">{idea.text}</div>
              <div className="idea-card-footer">
                <span>{idea.author}</span>
                {/* 投票按钮（点击 +1）*/}
                <span
                  className="idea-votes"
                  onClick={() => voteIdea(idea.id)}
                  title="为这个想法投票"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/>
                  </svg>
                  {idea.votes}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 底部输入框（绝对定位悬浮在内容上方）*/}
      <div className="brainstorm-input">
        <input
          type="text"
          id="ideaInput"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入你的想法，按 Enter 提交…"
        />
        <button className="btn btn-primary" onClick={submitIdea}>
          提交
        </button>
      </div>
    </div>
  )
}
