/**
 * Todos.jsx — 便签看板页面
 *
 * 功能：
 *  - 展示莫兰迪色系手写风格便签
 *  - 支持全部/待办/已完成过滤
 *  - 点击勾选框切换完成状态
 *  - 点击"新建便签"按钮弹出输入框添加新便签
 *
 * 状态：
 *  todos      便签数组
 *  filter     当前过滤器（'all' | 'pending' | 'done'）
 */

import { useState } from 'react'

// 初始便签数据
const INITIAL_TODOS = [
  { id: 1, color: 'yellow', status: 'pending', title: '设计评审会议',   body: '下午 2 点与产品团队进行首页改版设计评审，准备好交互原型和视觉稿', tag: '高优先级', time: '今天 14:00' },
  { id: 2, color: 'pink',   status: 'pending', title: 'API 文档更新',   body: '更新用户模块和权限模块的接口文档，补充请求/响应示例',              tag: '中优先级', time: '明天截止' },
  { id: 3, color: 'blue',   status: 'pending', title: 'AI 审查配置',    body: '配置双模型审查参数，设置分歧阈值和审查维度权重',                  tag: '技术',    time: '5月15日' },
  { id: 4, color: 'green',  status: 'pending', title: '画板性能优化',   body: '优化大画布下的渲染性能，减少重绘次数，提升缩放流畅度',            tag: '优化',    time: '5月18日' },
  { id: 5, color: 'purple', status: 'pending', title: '头脑风暴总结',   body: '整理上周产品方向讨论的结论，输出决策文档并同步给全员',            tag: '文档',    time: '5月16日' },
  { id: 6, color: 'coral',  status: 'done',    title: '需求评审通过',   body: 'CoFlow v1.0 产品需求文档已通过评审，进入开发阶段',               tag: '已完成',  time: '昨天' },
  { id: 7, color: 'sage',   status: 'done',    title: '团队周会',       body: '周一上午团队周会，同步各模块进展和本周计划',                      tag: '已完成',  time: '周一' },
]

// 随机颜色池（新建便签时随机分配）
const COLORS = ['yellow', 'pink', 'blue', 'green', 'purple', 'coral', 'sage']

export default function Todos() {
  // 便签数组（初始从静态数据加载，后期可接入后端 API）
  const [todos, setTodos] = useState(INITIAL_TODOS)
  // 当前过滤状态
  const [filter, setFilter] = useState('all')

  // 切换便签完成状态
  function toggleTodo(id) {
    setTodos(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, status: t.status === 'done' ? 'pending' : 'done' }
          : t
      )
    )
  }

  // 新建便签（后期替换为弹窗组件，目前用 prompt 模拟）
  function addNewTodo() {
    const title = prompt('便签标题:')
    if (!title) return
    const body = prompt('便签内容:') || ''
    // 随机分配莫兰迪颜色
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    setTodos(prev => [
      ...prev,
      {
        id: Date.now(),    // 临时 ID，接入后端后改为服务端返回
        color,
        status: 'pending',
        title,
        body,
        tag: '新建',
        time: '刚刚',
      }
    ])
  }

  // 根据当前 filter 筛选要显示的便签
  const visibleTodos = todos.filter(t => {
    if (filter === 'all')     return true
    if (filter === 'pending') return t.status === 'pending'
    if (filter === 'done')    return t.status === 'done'
    return true
  })

  // 统计数量
  const pendingCount = todos.filter(t => t.status === 'pending').length
  const doneCount    = todos.filter(t => t.status === 'done').length

  return (
    <div className="page active" id="page-todos">
      <div className="todo-board">

        {/* 页面头部：标题 + 过滤按钮 */}
        <div className="todo-header">
          <div>
            <h1 className="page-title" style={{ marginBottom: '4px' }}>我的待办</h1>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>
              {pendingCount} 个待办 · {doneCount} 个已完成
            </p>
          </div>
          <div className="todo-filters">
            {/* 过滤按钮：全部 */}
            <button
              className={`todo-filter${filter === 'all' ? ' active' : ''}`}
              onClick={() => setFilter('all')}
            >全部</button>
            {/* 过滤按钮：待办 */}
            <button
              className={`todo-filter${filter === 'pending' ? ' active' : ''}`}
              onClick={() => setFilter('pending')}
            >待办</button>
            {/* 过滤按钮：已完成 */}
            <button
              className={`todo-filter${filter === 'done' ? ' active' : ''}`}
              onClick={() => setFilter('done')}
            >已完成</button>
          </div>
        </div>

        {/* 便签看板区域 */}
        <div className="todo-pinboard" id="todoPinboard">
          {/* 遍历渲染便签 */}
          {visibleTodos.map(todo => (
            <div
              key={todo.id}
              className={`sticky-todo sticky-todo-${todo.color}${todo.status === 'done' ? ' done' : ''}`}
              data-status={todo.status}
            >
              {/* 勾选框：点击切换完成状态 */}
              <div
                className={`sticky-todo-check${todo.status === 'done' ? ' done' : ''}`}
                onClick={() => toggleTodo(todo.id)}
              ></div>

              {/* 标题 */}
              <div className="sticky-todo-title">{todo.title}</div>
              {/* 正文 */}
              <div className="sticky-todo-body">{todo.body}</div>
              {/* 底部元数据 */}
              <div className="sticky-todo-meta">
                <span className="sticky-todo-tag">{todo.tag}</span>
                <span>{todo.time}</span>
              </div>
            </div>
          ))}

          {/* 新建便签按钮 */}
          <div className="todo-add-btn" onClick={addNewTodo}>
            + 新建便签
          </div>
        </div>

      </div>
    </div>
  )
}
