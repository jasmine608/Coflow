/**
 * Dashboard.jsx — 工作台总览页面
 *
 * 展示 6 张 Dash Card，分别对应：
 *  - 项目进度概览（跳转项目管理）
 *  - 待 AI 审查文档（跳转 AI 审查）
 *  - 头脑风暴状态（跳转头脑风暴）
 *  - 在线画板协作（跳转画板）
 *  - 即将到期任务
 *  - 团队动态
 *
 * Props:
 *  navigateTo {function} 跳转到其他页面的回调
 *  openDrill  {function} 打开下钻模态框的回调
 */

export default function Dashboard({ navigateTo, openDrill }) {
  return (
    <div className="page active" id="page-dashboard">
      <h1 className="page-title">工作台</h1>
      <p className="page-subtitle">欢迎回来，jasmine。今天有 5 项待办任务等待处理。</p>

      <div className="dashboard-grid">

        {/* 卡片：项目进度概览 */}
        <div className="dash-card" onClick={() => navigateTo('projects')}>
          <div className="dash-card-header">
            <div className="dash-card-icon" style={{ background: 'rgba(165,181,197,0.2)', color: 'var(--primary-700)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <span className="dash-card-tag" style={{ background: 'rgba(165,181,197,0.15)', color: 'var(--primary-700)' }}>进行中</span>
          </div>
          <h3>核心项目</h3>
          <p>核心协作平台开发项目，当前 Sprint 3 进行中，完成率 68%</p>
          <div className="dash-card-footer">
            <span>截止: 2026-06-30</span>
            <div className="avatars">
              <div className="mini-avatar" style={{ background: 'linear-gradient(135deg,#A5B5C5,#8B9A8E)' }}>Z</div>
              <div className="mini-avatar" style={{ background: 'linear-gradient(135deg,#A8C4C4,#B8A9C9)' }}>L</div>
              <div className="mini-avatar" style={{ background: 'linear-gradient(135deg,#C4A7A7,#D4C4A8)' }}>W</div>
            </div>
          </div>
        </div>

        {/* 卡片：待 AI 审查文档 */}
        <div className="dash-card" onClick={() => navigateTo('review')}>
          <div className="dash-card-header">
            <div className="dash-card-icon" style={{ background: 'rgba(165,181,197,0.15)', color: 'var(--primary-600)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <path d="M14 2v6h6"/>
              </svg>
            </div>
            <span className="dash-card-tag" style={{ background: 'rgba(165,181,197,0.15)', color: 'var(--primary-700)' }}>AI 审查</span>
          </div>
          <h3>双模型审查</h3>
          <p>Q2 季度报告、产品需求文档 v2.1 已提交，双模型审查结果已就绪。</p>
          <div className="dash-card-footer">
            <span>刚刚</span>
            <div className="avatars">
              <div className="mini-avatar" style={{ background: 'linear-gradient(135deg,#A5B5C5,#8FA0B0)' }}>A</div>
              <div className="mini-avatar" style={{ background: 'linear-gradient(135deg,#B8A9C9,#C4A7A7)' }}>B</div>
            </div>
          </div>
        </div>

        {/* 卡片：头脑风暴 */}
        <div className="dash-card" onClick={() => navigateTo('brainstorm')}>
          <div className="dash-card-header">
            <div className="dash-card-icon" style={{ background: 'rgba(184,169,201,0.15)', color: 'var(--morandi-purple)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <span className="dash-card-tag" style={{ background: 'rgba(184,169,201,0.15)', color: 'var(--morandi-purple)' }}>进行中</span>
          </div>
          <h3>产品方向讨论</h3>
          <p>8 位成员已参与，已产生 23 个想法，当前收敛阶段。</p>
          <div className="dash-card-footer">
            <span>5 分钟前活跃</span>
            <div className="avatars">
              <div className="mini-avatar" style={{ background: 'linear-gradient(135deg,#B8A9C9,#C4A7A7)' }}>K</div>
              <div className="mini-avatar" style={{ background: 'linear-gradient(135deg,#D4C4A8,#8B9A8E)' }}>J</div>
              <div className="mini-avatar" style={{ background: 'linear-gradient(135deg,#A5B5C5,#A8C4C4)' }}>M</div>
            </div>
          </div>
        </div>

        {/* 卡片：在线画板 */}
        <div className="dash-card" onClick={() => navigateTo('whiteboard')}>
          <div className="dash-card-header">
            <div className="dash-card-icon" style={{ background: 'rgba(168,196,196,0.15)', color: 'var(--morandi-cyan)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <span className="dash-card-tag" style={{ background: 'rgba(168,196,196,0.15)', color: 'var(--morandi-cyan)' }}>协作中</span>
          </div>
          <h3>协作画板</h3>
          <p>3 人正在画板上协作，讨论新版首页的交互流程。</p>
          <div className="dash-card-footer">
            <span>实时在线</span>
            <div className="avatars">
              <div className="mini-avatar" style={{ background: 'linear-gradient(135deg,#A8C4C4,#A5B5C5)' }}>D</div>
              <div className="mini-avatar" style={{ background: 'linear-gradient(135deg,#C4A7A7,#B8A9C9)' }}>S</div>
            </div>
          </div>
        </div>

        {/* 卡片：即将到期任务（点击打开工作链条下钻）*/}
        <div className="dash-card" onClick={() => openDrill('deadline')}>
          <div className="dash-card-header">
            <div className="dash-card-icon" style={{ background: 'rgba(196,167,167,0.15)', color: 'var(--warning)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <span className="dash-card-tag" style={{ background: 'rgba(196,167,167,0.15)', color: 'var(--warning)' }}>即将到期</span>
          </div>
          <h3>3 项任务临近截止</h3>
          <p>API 接口文档（明天）、用户测试报告（后天）、Q2 复盘（周五）</p>
          <div className="dash-card-footer">
            <span>需尽快处理</span>
          </div>
        </div>

        {/* 卡片：团队动态（点击打开动态下钻）*/}
        <div className="dash-card" onClick={() => openDrill('teamActivity')}>
          <div className="dash-card-header">
            <div className="dash-card-icon" style={{ background: 'rgba(139,154,142,0.15)', color: 'var(--success)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
          </div>
          <h3>团队动态</h3>
          <p>李华完成了「数据库设计」，王芳提交了「UI 走查报告」待 AI 审查。</p>
          <div className="dash-card-footer">
            <span>2 分钟前</span>
          </div>
        </div>

      </div>
    </div>
  )
}
