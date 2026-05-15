import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 构建配置
// 使用 @vitejs/plugin-react 支持 React JSX 转换与 Fast Refresh 热更新
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,      // 本地开发服务端口
    open: true       // 启动时自动打开浏览器
  }
})
