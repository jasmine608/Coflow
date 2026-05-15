/**
 * StatusBar.jsx — 底部状态栏组件
 *
 * 功能：
 *  - 显示当前在线人数（绿点 + 跳动动画）
 *  - 显示应用版本号
 *  - 显示当前页面名称
 *  - 缩放控件（缩小 / 重置 / 放大）
 *
 * Props:
 *  currentPageName {string}   当前页面的中文名称
 *  zoomPercent     {number}   当前缩放百分比（10~400）
 *  onZoom          {function} 缩放回调，接受 delta 参数（正数放大，负数缩小）
 *  onResetZoom     {function} 重置缩放为 100% 的回调
 */

export default function StatusBar({ currentPageName, zoomPercent, onZoom, onResetZoom }) {
  return (
    <footer className="statusbar">
      {/* 在线人数指示 */}
      <div className="statusbar-online">
        {/* 跳动绿点 */}
        <span className="dot dot-blink"></span>
        <span>3 人在线</span>
      </div>

      <div className="sep"></div>

      {/* 版本号 */}
      <span>CoFlow v1.0</span>

      <div className="sep"></div>

      {/* 当前页面名称（由父组件根据路由传入）*/}
      <span id="currentPage">{currentPageName}</span>

      {/* 缩放控件，推到最右侧 */}
      <div className="zoom-controls">
        {/* 缩小：每次 -10% */}
        <button onClick={() => onZoom(-10)}>−</button>

        {/* 当前缩放比，点击重置为 100% */}
        <span
          className="zoom-level"
          id="zoomLevel"
          onClick={onResetZoom}
          title="点击重置为 100%"
        >
          {zoomPercent}%
        </span>

        {/* 放大：每次 +10% */}
        <button onClick={() => onZoom(10)}>+</button>
      </div>
    </footer>
  )
}
