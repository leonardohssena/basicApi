/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs'
import MessengerConsumerPrototype from './messenger-consumer.prototype'
import { LoggerAdapter, MessengerAdapter } from '../../adapters'
import ILoggerAdapter from '../../adapters/logger-adapter/logger.protocol'
import IMessengerAdapter from '../../adapters/messenger-adapter/messenger.protocol'
import { ExceptionHelper } from '../../helpers'

class WorkerMessenger {
  private messengerAdapter: IMessengerAdapter

  constructor() {
    this.messengerAdapter = MessengerAdapter
  }

  private async startWorker(
    queueName: string,
    callback: (msg: unknown, transaction: ILoggerAdapter) => Promise<void>,
    prefetchCount?: number,
  ) {
    await this.messengerAdapter.consume(
      queueName,
      async (msg) => {
        if (msg !== null) {
          const transaction = new LoggerAdapter('CONSUMER')
          try {
            transaction.start(msg)
            await callback(msg, transaction)
            transaction.finish('SUCCESS', {})
          } catch (error) {
            transaction.finish('ERROR', {
              message: error.message,
            })
            throw error
          }
        }
      },
      prefetchCount,
    )

    console.info(`Worker listening to queue ${queueName}...`)
  }

  private start(CONSUMER: string) {
    try {
      const messengerConsumer: MessengerConsumerPrototype = new (require(`${__dirname}/${CONSUMER}`).default)()
      this.startWorker.bind(this)(
        messengerConsumer.queueName,
        messengerConsumer.consumer,
        messengerConsumer.prefetchCount,
      )
    } catch (error) {
      if (error instanceof ExceptionHelper || error instanceof Error) {
        console.error(CONSUMER, error.message)
      }
    }
  }

  public startAllWorkers(): void {
    const modules = fs.readdirSync(`${__dirname}`)
    modules.filter((module: string) => !module.includes('.ts')).forEach(this.start.bind(this))

    console.info('Messenger workers started')
  }
}

export default WorkerMessenger
