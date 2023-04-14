import ILoggerAdapter from '../../../adapters/logger-adapter/logger.protocol'
import { UsersController } from '../../../controllers'
import MessengerConsumerPrototype from '../messenger-consumer.prototype'

export default class ExampleConsumer extends MessengerConsumerPrototype {
  constructor() {
    super('example-queue-name', 1)
  }

  async consumer({ userId }, transaction: ILoggerAdapter) {
    try {
      const usersController = new UsersController()
      const user = await usersController.findById(userId)
      if (!user) throw new Error(`No user found ${userId}`)

      transaction.trace('Start Example Consumer', 'SUCCESS', {
        userId,
      })

      transaction.trace('Finish Example Consumer', 'SUCCESS', {})
    } catch (err) {
      transaction.trace('Failed Example Consumer', 'ERROR', err.data || { message: err.message, stack: err.stack })
      throw err
    }
  }
}
