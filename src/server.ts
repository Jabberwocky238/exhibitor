import { serve } from '@hono/node-server'
import app from './index'

const port = 10086

console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
