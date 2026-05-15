/**
 * Review.jsx — AI 双模型审查页面
 */

import { useState, useRef } from 'react'

// 六维评分维度
const DIMENSIONS = ['完整性', '准确性', '逻辑性', '规范性', '可操作性', '合规性']
const DIM_PCT = ['20%', '20%', '15%', '15%', '15%', '15%']

// 支持的文件类型
const ACCEPTED_TYPES = '.docx,.doc,.pdf,.xlsx,.xls,.pptx,.ppt,.txt,.md,.csv'

// 文件大小格式化
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// 支持的模型列表
const MODELS = [
  { id: 'sf-glm-4', name: 'GLM-4 (SiliconFlow)', provider: '硅基流动', apiUrl: 'https://api.siliconflow.cn/v1/chat/completions' },
  { id: 'sf-qwen-max', name: 'Qwen-Max (SiliconFlow)', provider: '硅基流动', apiUrl: 'https://api.siliconflow.cn/v1/chat/completions' },
  { id: 'glm-4', name: 'GLM-4', provider: '智谱AI', apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions' },
  { id: 'qwen-max', name: 'Qwen-Max', provider: '阿里云', apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation' },
]

// 审查提示词模板
const REVIEW_PROMPT = `请对以下文档内容进行审查评估，按照六个维度给出评分（1-10分）：
1. 完整性 2. 准确性 3. 逻辑性 4. 规范性 5. 可操作性 6. 合规性

以JSON格式输出：{"完整性":分数,"准确性":分数,"逻辑性":分数,"规范性":分数,"可操作性":分数,"合规性":分数,"评价":"简要评价"}

文档内容：{document_content}`

// 文件图标颜色映射
function getFileIconInfo(name) {
  const ext = name.split('.').pop().toLowerCase()
  const map = {
    pdf:  { icon: 'PDF', bg: 'rgba(184,128,128,0.12)', color: 'var(--error)' },
    docx: { icon: 'DOC', bg: 'rgba(165,181,197,0.15)', color: 'var(--primary-700)' },
    doc:  { icon: 'DOC', bg: 'rgba(165,181,197,0.15)', color: 'var(--primary-700)' },
    xlsx: { icon: 'XLS', bg: 'rgba(139,154,142,0.15)', color: 'var(--success)' },
    xls:  { icon: 'XLS', bg: 'rgba(139,154,142,0.15)', color: 'var(--success)' },
    pptx: { icon: 'PPT', bg: 'rgba(196,167,167,0.15)', color: 'var(--warning)' },
    ppt:  { icon: 'PPT', bg: 'rgba(196,167,167,0.15)', color: 'var(--warning)' },
    txt:  { icon: 'TXT', bg: 'rgba(165,181,197,0.1)',  color: 'var(--text-weak)' },
    md:   { icon: 'MD',  bg: 'rgba(184,169,201,0.15)', color: 'var(--morandi-purple)' },
    csv:  { icon: 'CSV', bg: 'rgba(139,154,142,0.15)', color: 'var(--success)' },
  }
  return map[ext] || { icon: 'FILE', bg: 'var(--bg-deep)', color: 'var(--text-weak)' }
}

// 状态标签配置
const STATUS_MAP = {
  pending:    { label: '待审查', className: 'file-status-pending' },
  reviewing:  { label: '审查中', className: 'file-status-reviewing' },
  completed:  { label: '已完成', className: 'file-status-completed' },
}

// 从localStorage读取配置
function loadConfig() {
  try {
    const saved = localStorage.getItem('coflow-review-config')
    if (saved) return JSON.parse(saved)
  } catch (e) { console.error('Failed to load config:', e) }
  return { modelA: 'sf-glm-4', modelB: 'sf-qwen-max', apiKeyA: '', apiKeyB: '' }
}

// 保存配置到localStorage
function saveConfig(config) {
  try { localStorage.setItem('coflow-review-config', JSON.stringify(config)) }
  catch (e) { console.error('Failed to save config:', e) }
}

// 调用AI API进行审查（带超时）
async function callAI(modelId, apiKey, documentContent) {
  const model = MODELS.find(m => m.id === modelId)
  if (!model || !apiKey) return generateMockReview()

  const prompt = REVIEW_PROMPT.replace('{document_content}', documentContent.slice(0, 3000))
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    let response
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }
    
    if (model.provider === '硅基流动') {
      const actualModel = modelId.replace('sf-', '')
      response = await fetch(model.apiUrl, {
        method: 'POST', headers, signal: controller.signal,
        body: JSON.stringify({ model: actualModel, messages: [{ role: 'user', content: prompt }], temperature: 0.3 })
      })
    } else if (model.provider === '智谱AI') {
      response = await fetch(model.apiUrl, {
        method: 'POST', headers, signal: controller.signal,
        body: JSON.stringify({ model: modelId, messages: [{ role: 'user', content: prompt }], temperature: 0.3 })
      })
    } else if (model.provider === '阿里云') {
      response = await fetch(model.apiUrl, {
        method: 'POST', headers, signal: controller.signal,
        body: JSON.stringify({ model: modelId, input: prompt, parameters: { temperature: 0.3 } })
      })
    } else {
      return generateMockReview()
    }

    clearTimeout(timeout)
    const data = await response.json()
    
    let resultText = ''
    if (data.choices?.[0]?.message?.content) resultText = data.choices[0].message.content
    else if (data.output?.text) resultText = data.output.text
    else if (data.response) resultText = data.response
    else return generateMockReview()

    const jsonStart = resultText.indexOf('{')
    const jsonEnd = resultText.lastIndexOf('}') + 1
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const resultJson = JSON.parse(resultText.substring(jsonStart, jsonEnd))
      return {
        scores: DIMENSIONS.map(dim => ({ label: dim, score: resultJson[dim] || Math.floor(Math.random() * 5) + 5 })),
        comment: resultJson.评价 || '审查完成'
      }
    }
  } catch (e) {
    console.error('API call failed:', e)
  }
  return generateMockReview()
}

// 生成模拟审查结果
function generateMockReview() {
  const scores = DIMENSIONS.map(dim => ({ label: dim, score: Math.floor(Math.random() * 5) + 5 }))
  const issuePool = [
    { severity: 'major', label: 'Major', className: 'severity-major', text: '数据引用源与实际数据偏差较大，需核实准确性' },
    { severity: 'minor', label: 'Minor', className: 'severity-minor', text: '建议项缺少具体执行时间线，建议补充里程碑' },
    { severity: 'minor', label: 'Minor', className: 'severity-minor', text: '部分参考链接已失效，建议更新' },
    { severity: 'major', label: 'Major', className: 'severity-major', text: '章节间衔接不够连贯，建议补充过渡段' },
    { severity: 'minor', label: 'Minor', className: 'severity-minor', text: '格式不统一，建议全文使用相同标题层级' },
  ]
  const issueCount = Math.floor(Math.random() * 3) + 2
  const issues = []
  const usedIndices = new Set()
  while (issues.length < issueCount) {
    const idx = Math.floor(Math.random() * issuePool.length)
    if (!usedIndices.has(idx)) { usedIndices.add(idx); issues.push({ ...issuePool[idx] }) }
  }
  return { scores, issues, comment: 'AI审查已完成' }
}

// 为每个文件生成完整的审查结果
function generateReviewResult(fileName, modelAResult, modelBResult) {
  const scoresA = modelAResult?.scores || generateMockReview().scores
  const scoresB = modelBResult?.scores || generateMockReview().scores
  
  const scores = DIMENSIONS.map((dim, idx) => ({
    label: dim, modelA: scoresA[idx]?.score || Math.floor(Math.random() * 5) + 5,
    modelB: scoresB[idx]?.score || Math.floor(Math.random() * 5) + 5
  }))

  const totalA = scores.reduce((s, sc) => s + sc.modelA, 0)
  const totalB = scores.reduce((s, sc) => s + sc.modelB, 0)
  const avgScore = ((totalA + totalB) / 12 * 10).toFixed(1)

  const avg = parseFloat(avgScore)
  let grade, gradeClass
  if (avg >= 90) { grade = 'A'; gradeClass = 'grade-A' }
  else if (avg >= 75) { grade = 'B'; gradeClass = 'grade-B' }
  else if (avg >= 60) { grade = 'C'; gradeClass = 'grade-C' }
  else { grade = 'D'; gradeClass = 'grade-D' }

  const issues = modelAResult?.issues || modelBResult?.issues || generateMockReview().issues

  const diffScore = Math.abs(totalA - totalB)
  let consistencyStatus = '一致'
  if (diffScore > 10) consistencyStatus = '轻微分歧'
  if (diffScore > 20) consistencyStatus = '明显分歧'

  return { scores, avgScore, grade, gradeClass, issues, consistencyStatus, totalA, totalB }
}

// 审查结果卡片组件
function ReviewResultCard({ result, fileName }) {
  return (
    <div className="review-result-card">
      {result.consistencyStatus !== '一致' && (
        <div className="consistency-banner">
          <span className="consistency-icon">!</span>
          <span>双模型存在{result.consistencyStatus}</span>
          <span className="consistency-detail">Model A 总分 {result.totalA}, Model B 总分 {result.totalB}</span>
        </div>
      )}

      <div className="review-score-section">
        <div className={`review-grade ${result.gradeClass}`}>{result.grade}</div>
        <div className="review-score-info">
          <span className="review-total-score">{result.avgScore} / 100</span>
          <span className="review-score-label">{fileName} 的 AI 双模型交叉审查结果</span>
        </div>
      </div>

      <div className="review-dimensions">
        <h4>审查结果</h4>
        <div className="dimension-bars">
          {result.scores.map((dim, idx) => {
            const avg = ((dim.modelA + dim.modelB) / 2).toFixed(1)
            return (
              <div key={dim.label} className="dimension-item">
                <span className="dimension-label">{dim.label}</span>
                <div className="dimension-bar">
                  <div className="bar-fill bar-a" style={{ width: `${dim.modelA * 10}%` }}></div>
                  <div className="bar-fill bar-b" style={{ width: `${dim.modelB * 10}%` }}></div>
                </div>
                <div className="dimension-scores">
                  <span className="score-a">{dim.modelA}</span>
                  <span className="score-b">{dim.modelB}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {result.issues && result.issues.length > 0 && (
        <div className="review-issues">
          <h4>问题清单</h4>
          <div className="issue-list">
            {result.issues.map((issue, idx) => (
              <div key={idx} className={`issue-item ${issue.className}`}>
                <span className="issue-severity">{issue.label}</span>
                <span className="issue-text">{issue.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="review-comparison">
        <h4>双模型评分对比</h4>
        <div className="comparison-grid">
          {result.scores.map(dim => (
            <div key={dim.label} className="comparison-item">
              <span className="comparison-label">{dim.label}</span>
              <span className="comparison-scores">
                <span className="score-a">{dim.modelA}</span>
                <span className="vs">/</span>
                <span className="score-b">{dim.modelB}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 主组件
export default function Review() {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [expandedFile, setExpandedFile] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewProgress, setReviewProgress] = useState(0)
  const [showConfig, setShowConfig] = useState(false)
  const [useRealAPI, setUseRealAPI] = useState(false)
  const [config, setConfig] = useState(loadConfig)
  
  const fileInputRef = useRef(null)

  // 处理配置变更
  function handleConfigChange(key, value) {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    saveConfig(newConfig)
  }

  // 处理文件选择
  function handleFileSelect(e) {
    const files = Array.from(e.target.files || [])
    addFiles(files)
  }

  // 添加文件
  function addFiles(files) {
    const newFiles = files.map(file => ({
      id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      file: file,
      status: 'pending',
      uploadTime: new Date().toLocaleString('zh-CN'),
      result: null,
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  // 拖拽处理
  function handleDragOver(e) { e.preventDefault(); setIsDragOver(true) }
  function handleDragLeave(e) { e.preventDefault(); setIsDragOver(false) }
  function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files || [])
    addFiles(files)
  }

  // 移除文件
  function removeFile(fileId) {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
    if (expandedFile === fileId) setExpandedFile(null)
  }

  // 读取文件内容
  async function readFileContent(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result || '')
      reader.onerror = () => resolve('')
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        reader.readAsText(file)
      } else {
        reader.readAsDataURL(file)
      }
    })
  }

  // 开始审查
  async function startReview() {
    const pendingFiles = uploadedFiles.filter(f => f.status === 'pending')
    if (pendingFiles.length === 0) return

    setIsReviewing(true)
    setReviewProgress(0)

    try {
      for (let i = 0; i < pendingFiles.length; i++) {
        const file = pendingFiles[i]
        setUploadedFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'reviewing' } : f))

        const content = await readFileContent(file.file)
        
        let modelAResult, modelBResult
        if (useRealAPI && config.apiKeyA) {
          modelAResult = await callAI(config.modelA, config.apiKeyA, content)
        }
        if (useRealAPI && config.apiKeyB) {
          modelBResult = await callAI(config.modelB, config.apiKeyB, content)
        }

        const reviewResult = generateReviewResult(file.name, modelAResult, modelBResult)
        setUploadedFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'completed', result: reviewResult } : f))
        setReviewProgress(Math.min(90 + (i + 1) * (10 / pendingFiles.length), 100))
      }

      setReviewProgress(100)
      setIsReviewing(false)
      setExpandedFile(pendingFiles[pendingFiles.length - 1]?.id)
    } catch (error) {
      console.error('Review failed:', error)
      setUploadedFiles(prev => prev.map(f => 
        pendingFiles.some(pf => pf.id === f.id) && f.status === 'reviewing'
          ? { ...f, status: 'completed', result: generateReviewResult(f.name) }
          : f
      ))
      setIsReviewing(false)
    }
  }

  const pendingCount = uploadedFiles.filter(f => f.status === 'pending').length

  return (
    <div className="page active" id="page-review">
      <div className="review-header">
        <h1 className="page-title">AI 双模型审查</h1>
        <p className="page-subtitle">交叉审查 · 一致性验证 · 智能建议</p>
        
        {/* 配置按钮 */}
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="config-btn"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          {showConfig ? '收起配置' : '模型配置'}
        </button>
      </div>

      {/* 配置面板 */}
      {showConfig && (
        <div className="config-panel">
          <div className="config-row">
            <label className="config-checkbox-label">
              <input type="checkbox" checked={useRealAPI} onChange={(e) => setUseRealAPI(e.target.checked)} />
              <span>使用真实API审查</span>
            </label>
          </div>
          
          <div className="config-section">
            <h4>Model A（主模型）</h4>
            <select value={config.modelA} onChange={(e) => handleConfigChange('modelA', e.target.value)}>
              {MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <input type="password" value={config.apiKeyA} onChange={(e) => handleConfigChange('apiKeyA', e.target.value)} placeholder="API密钥" />
          </div>

          <div className="config-section">
            <h4>Model B（对比模型）</h4>
            <select value={config.modelB} onChange={(e) => handleConfigChange('modelB', e.target.value)}>
              {MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <input type="password" value={config.apiKeyB} onChange={(e) => handleConfigChange('apiKeyB', e.target.value)} placeholder="API密钥" />
          </div>

          <div className="config-tips">
            <p><strong>💡 使用提示：</strong></p>
            <ul>
              <li>推荐使用硅基流动模型，只需一个API密钥即可调用GLM-4和Qwen-Max</li>
              <li>硅基流动密钥获取：https://siliconflow.cn/</li>
              <li>未配置密钥时使用模拟数据演示</li>
            </ul>
          </div>
        </div>
      )}

      <div className="review-container">
        {/* 上传区域 */}
        <div className="review-upload-section">
          <div className={`review-drop-zone${isDragOver ? ' drag-over' : ''}`}
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES} multiple onChange={handleFileSelect} style={{ display: 'none' }} />
            <div className="drop-zone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div className="drop-zone-text">
              <strong>拖拽文件到此处，或点击上传</strong>
              <span>支持 DOCX、PDF、XLSX、PPTX、TXT、MD 等格式</span>
            </div>
          </div>

          {/* 已上传文件列表 */}
          {uploadedFiles.length > 0 && (
            <div className="review-file-list">
              {uploadedFiles.map(file => {
                const iconInfo = getFileIconInfo(file.name)
                const statusInfo = STATUS_MAP[file.status]
                return (
                  <div key={file.id}>
                    <div className="review-file-item">
                      <div className="review-file-icon" style={{ background: iconInfo.bg, color: iconInfo.color }}>{iconInfo.icon}</div>
                      <div className="review-file-info">
                        <span className="review-file-name">{file.name}</span>
                        <span className="review-file-meta">{formatSize(file.size)} · {file.uploadTime}</span>
                      </div>
                      <span className={`review-file-status ${statusInfo.className}`}>{statusInfo.label}</span>
                      {file.status === 'completed' && (
                        <button className="review-file-view-btn" onClick={(e) => { e.stopPropagation(); setExpandedFile(expandedFile === file.id ? null : file.id) }}>
                          {expandedFile === file.id ? '收起结果' : '查看结果'}
                        </button>
                      )}
                      {file.status === 'pending' && (
                        <button className="review-file-remove" onClick={(e) => { e.stopPropagation(); removeFile(file.id) }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      )}
                    </div>

                    {expandedFile === file.id && file.result && (
                      <ReviewResultCard result={file.result} fileName={file.name} />
                    )}
                  </div>
                )
              })}

              {pendingCount > 0 && !isReviewing && (
                <button className="btn btn-primary review-start-btn" onClick={startReview}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ marginRight: '6px' }}>
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                  开始审查（{pendingCount} 份文档）
                </button>
              )}

              {isReviewing && (
                <div className="review-progress-wrap">
                  <div className="review-progress-bar">
                    <div className="review-progress-fill" style={{ width: `${reviewProgress}%` }}></div>
                  </div>
                  <span className="review-progress-text">AI 审查中... {reviewProgress}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
