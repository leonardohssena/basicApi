import amqp, { Connection, Channel, Message } from 'amqplib'
import IMessengerAdapter from './messenger.protocol'
import config from '../../config'

class MessengerSingleton implements IMessengerAdapter {
  private static instance: MessengerSingleton
  private connection: Connection
  private channel: Channel

  public static getInstance(): MessengerSingleton {
    if (!MessengerSingleton.instance) {
      MessengerSingleton.instance = new MessengerSingleton()
    }
    return MessengerSingleton.instance
  }

  public async connect(): Promise<void> {
    this.connection = await amqp.connect(config.amqp.url)
    this.channel = await this.connection.createChannel()
    console.info('Messenger connection started')
  }

  public async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close()
      console.info('Messenger channel closed')
    }
    if (this.connection) {
      await this.connection.close()
      console.info('Messenger connection closed')
    }
  }

  async publish(exchange: string, routingKey: string, message: unknown, options?: unknown): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not available')
    }
    const msg = JSON.stringify(message)
    this.channel.publish(exchange, routingKey, Buffer.from(msg, 'utf-8'), options)
  }

  async consume(queue: string, handler: (msg: Message) => void, prefetchCount = 1): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true })
    await this.channel.prefetch(prefetchCount)
    await this.channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          await handler(JSON.parse(msg.content.toString()))
          this.channel.ack(msg)
        } catch (error) {
          console.error(error)
          const redeliveredCount = (msg.properties.headers['x-redelivered-count'] || 0) + 1
          if (redeliveredCount > 10) {
            this.channel.nack(msg, false, false)
          } else {
            this.channel.nack(msg, false, true)
          }
        }
      }
    })
  }
}

export default MessengerSingleton.getInstance()
