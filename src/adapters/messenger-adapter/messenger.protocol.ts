import { Message } from 'amqplib/callback_api'

export default interface IMessengerAdapter {
  connect(): Promise<void>
  close(): Promise<void>
  publish(exchange: string, routingKey: string, message: unknown, options?: unknown): Promise<void>
  consume(queue: string, handler: (msg: Message) => void, prefetchCount?: number): Promise<void>
}
