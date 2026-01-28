import { Combinator } from 'combinator-sdk'
import { Hono } from 'hono'
import * as dotenv from 'dotenv'

dotenv.config()
const app = new Hono()

const baseURL = () => {
  if (process.env.VITE_MODE === 'development') {
    return 'http://localhost:8899/'
  } else {
    return 'https://combinator.app238.com/'
  }
}

const combinator = new Combinator({
  baseURL: baseURL(),
})

const rdb = combinator.rdb('0')

app.get('/', (c) => {
  return c.html('<h1>Hello Combinator RDB!</h1>')
})

app.get('/init', async (c) => {
  try {
    await rdb.exec("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);")
  } catch (error) {
    return c.text('Error creating table: ' + (error as Error).message)
  }
  return c.text('Table initialized')
})

app.get('/incre', async (c) => {
  const timestamp = Date.now()
  await rdb.exec(`INSERT INTO test (name) VALUES ('Timestamp: ${timestamp}');`)
  return c.text('Inserted timestamp' + timestamp)
})

app.get('/data', async (c) => {
  const result = await rdb.query('SELECT * FROM test;')
  return c.json(result)
})

app.get('/mode', (c) => {
  return c.json({ message: process.env.VITE_MODE })
})

export default app
