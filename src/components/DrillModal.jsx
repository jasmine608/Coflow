/**
 * DrillModal.jsx — 下钻详情模态框组件
 *
 * 功能：
 *  - 点击卡片时弹出任务/文档详情
 *  - 支持点击背景遮罩关闭
 *  - 支持 ESC 键关闭（由父组件 keydown 事件处理）
 *  - 弹性弹入动画（cubic-bezier 回弹效果）
 *
 * Props:
 *  show      {boolean}    是否显示模态框
 *  title     {string}     模态框标题
 *  content   {ReactNode}  模态框内容（JSX）
 *  onClose   {function}   关闭回调
 *  navigateTo {function}  内部跳转用（部分内容需要导航）
 */

export default function DrillModal({ show, title, content, onClose }) {
  // 点击遮罩层关闭：仅当点击遮罩本身时触发，防止点击面板内容冒泡关闭
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={`drill-overlay${show ? ' show' : ''}`}
      id="drillOverlay"
      onClick={handleOverlayClick}
    >
      <div className="drill-panel" id="drillPanel">
        {/* 模态头：标题 + 关闭按钮 */}
        <div className="drill-panel-header">
          <h3 id="drillTitle">{title}</h3>
          <button className="drill-close" onClick={onClose}>✕</button>
        </div>

        {/* 动态内容区 */}
        <div id="drillContent">
          {content}
        </div>
      </div>
    </div>
  )
}
