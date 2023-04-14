import mongoose, { ConnectOptions } from 'mongoose'
import config from '../config'

export default class DatabaseManager {
  public async connect() {
    const { uri, dbName } = config.mongoDB
    try {
      const connectionOptions = {
        dbName,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
        autoCreate: true,
      } as ConnectOptions
      await mongoose.connect(uri, connectionOptions)
      console.info(`Connected to database ${dbName}`)
    } catch (error) {
      console.error(`Unable to connect to database ${dbName}: ${error}`)
      throw error
    }
  }

  public async close() {
    if (mongoose.connection.readyState) {
      await mongoose.connection.close()
      console.info('Database connection closed')
    }
  }
}
