import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 代理所有以 /api/proxy 开头的请求
      '/api/proxy': {
        target: 'http://39.105.52.62:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy/, ''),   
        // 去掉 /api/proxy 前缀，实际请求是 http://39.105.52.62:8080/announce
      },
    },
  },
})
