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
    return 'https://jabber215052.combinator.app238.com'
  }
}

const combinator = new Combinator({
  baseURL: baseURL(),
})

const rdb = combinator.rdb('f36baf73')

app.get('/', (c) => {
  return c.html(indexHtml)
})

app.get('/.env', (c) => {
  return c.json(process.env)
})

app.get('/incre', async (c) => {
  const timestamp = Date.now()
  await rdb.exec(`INSERT INTO test (name) VALUES (?);`, [`Timestamp: ${timestamp}`])
  return c.text('Inserted timestamp' + timestamp)
})

app.get('/data', async (c) => {
  const limit = c.req.query('limit') || '10'
  const numberLimit = parseInt(limit, 10)
  const result = await rdb.query('SELECT * FROM test LIMIT ?;', [numberLimit])
  return c.json(result)
})

export default app
