import express from 'express'
import { MessengerAdapter, RedisAdapter } from './adapters'
import DatabaseManager from './database'
import { jwtMiddleware, logMiddleware, transactionMiddleware } from './middleware'
import routes from './routes'
import Worker from './workers'

const app = express()

app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

app.use(transactionMiddleware)
app.use(logMiddleware)

app.use(jwtMiddleware)
app.use(routes())

const databaseManager = new DatabaseManager()
const workers = new Worker()

export default {
  async startServices() {
    await Promise.all([await databaseManager.connect(), await RedisAdapter.connect(), await MessengerAdapter.connect()])
  },
  async startWorkers() {
    await workers.startAllWorkers()
  },
  app,
  async stopServices() {
    await Promise.all([await databaseManager.close(), await RedisAdapter.close(), await MessengerAdapter.close()])
  },
}
