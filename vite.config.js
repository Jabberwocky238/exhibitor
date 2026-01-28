import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
        rollupOptions: {
          input: './src/client.ts',
          output: { entryFileNames: 'static/client.js' }
        }
      }
    }
  }
  return {
    plugins: [
      devServer({
        entry: 'src/index.ts'
      })
    ],
    build: {
      ssr: 'src/server.ts',
      outDir: 'dist'
    }
  }
})
