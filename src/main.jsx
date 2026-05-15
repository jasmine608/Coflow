/**
 * main.jsx — React 应用入口
 *
 * 将 App 组件挂载到 index.html 中 id="root" 的 div 上。
 * React 18 使用 createRoot API（替代旧版 ReactDOM.render）。
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// 获取 HTML 中的挂载节点
const rootEl = document.getElementById('root')

// 创建 React 18 并发模式根节点
const root = ReactDOM.createRoot(rootEl)

// 渲染应用
// StrictMode 会在开发模式下对组件进行双重渲染，帮助发现副作用问题
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
