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
    return process.env.COMBINATOR_API_ENDPOINT ?? 'https://jabber147008.combinator.app238.com'
  }
}

const combinator = new Combinator({
  baseURL: baseURL(),
})

const rdb = combinator.rdb('303737e93eb57281')

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
  const timestamp = Date.now()
  await rdb.exec(`INSERT INTO test (name) VALUES (?);`, [`Timestamp: ${timestamp}`])
  return c.text('Inserted timestamp' + timestamp)
})

app.get('/data', async (c) => {
  const limit = c.req.query('limit') || '10'
  const numberLimit = parseInt(limit, 10)
  // 从大到小排序，获取最新的记录
  const result = await rdb.query('SELECT * FROM test ORDER BY id DESC LIMIT ?;', [numberLimit])
  return c.json(result)
})

export default app
