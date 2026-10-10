import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

function apiDevServerPlugin() {
  return {
    name: 'api-dev-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/chat' && req.method === 'POST') {
          // Load env vars into process.env for local dev server context
          const env = loadEnv(server.config.mode, process.cwd(), '')
          process.env.GROQ_API_KEY = env.GROQ_API_KEY || process.env.GROQ_API_KEY

          let bodyStr = ''
          req.on('data', (chunk) => {
            bodyStr += chunk
          })
          req.on('end', async () => {
            try {
              let parsedBody = {}
              if (bodyStr) {
                try {
                  parsedBody = JSON.parse(bodyStr)
                } catch {
                  // ignore JSON parse error
                }
              }

              const chatModule = await server.ssrLoadModule('/api/chat.js')
              const handler = chatModule.default

              const mockRes = {
                status(statusCode) {
                  res.statusCode = statusCode
                  return this
                },
                json(data) {
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                  return this
                },
              }
              const mockReq = {
                method: req.method,
                body: parsedBody,
              }

              await handler(mockReq, mockRes)
            } catch (err) {
              console.error('Local Vite Dev API Error:', err)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else {
          next()
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    apiDevServerPlugin(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
          }
        },
      },
    },
  },
})
