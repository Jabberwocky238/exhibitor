import { Combinator } from 'combinator-sdk'
import { Hono } from 'hono'
import * as dotenv from 'dotenv'
// @ts-ignore
import indexHtml from './index.html?raw'

dotenv.config()
const app = new Hono()

const baseURL = () => {
  if (process.env.VITE_MODE === 'development') {
    return 'http://localhost:8899'
  } else {
    return process.env.COMBINATOR_API_ENDPOINT ?? 'https://combinator.app238.com'
  }
}

//

const combinator = new Combinator({})

const rdb = combinator.rdb('4f710875efe061a7')

app.get('/', (c) => {
  return c.html(indexHtml)
})

app.get('/.env', (c) => {
  return c.json({ ...process.env, "baseURL": baseURL() })
})

app.get('/init', async (c) => {
  // 获取查询参数
  const mode = c.req.query('mode') || 'exec'
  if (mode === 'exec') {
    await rdb.exec(`
      CREATE TABLE IF NOT EXISTS test (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
    `, [])
  } else if (mode === 'batch') {
    await rdb.batch([`
    CREATE TABLE IF NOT EXISTS test (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `], [])
  } else {
    return c.text('Invalid mode. Use "exec" or "batch".')
  }
  return c.text('Database initialized')
})

app.get('/incre', async (c) => {
  try {
    const timestamp = Date.now()
    await rdb.exec(`INSERT INTO test (name) VALUES (?);`, [`Timestamp: ${timestamp}`])
    return c.text('Inserted timestamp' + timestamp)
  } catch (error: any) {
    console.error('Error in /incre:', error)
    return c.json({ error: error.message || String(error) }, 500)
  }
})

app.get('/data', async (c) => {
  try {
    const limit = c.req.query('limit') || '10'
    const numberLimit = parseInt(limit, 10)
    // 从大到小排序，获取最新的记录
    const result = await rdb.query('SELECT * FROM test ORDER BY id DESC LIMIT ?;', [numberLimit])
    return c.json(result)
  } catch (error: any) {
    console.error('Error in /data:', error)
    return c.json({ error: error.message || String(error) }, 500)
  }
})

app.get('/headers', async (c) => {
  // 返回所有请求头
  const headers: Record<string, string> = {}
  c.req.raw.headers.forEach((value, key) => {
    headers[key] = value
  })
  return c.json({ headers })
})

export default app
