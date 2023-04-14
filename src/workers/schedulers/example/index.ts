import { ObjectId } from 'mongodb'
import ILoggerAdapter from '../../../adapters/logger-adapter/logger.protocol'
import { UsersController } from '../../../controllers'
import SchedulerPrototype from '../scheduler.prototype'

export default class ExampleSchedule extends SchedulerPrototype {
  constructor() {
    super('example-schedule-name', '0 0 * * *')
  }

  async schedule(transaction: ILoggerAdapter) {
    try {
      const userId = new ObjectId()
      const usersController = new UsersController()
      const user = await usersController.findById(userId)
      if (!user) throw new Error(`No user found ${userId}`)

      transaction.trace('Start Example Schedule', 'SUCCESS', {
        userId,
      })

      transaction.trace('Finish Example Schedule', 'SUCCESS', {})
    } catch (err) {
      transaction.trace('Failed Example Schedule', 'ERROR', err.data || { message: err.message, stack: err.stack })
      throw err
    }
  }
}
