/* eslint-disable @typescript-eslint/no-unused-vars */
import ILoggerAdapter from '../../adapters/logger-adapter/logger.protocol'

export default class MessengerConsumerPrototype {
  private _queueName: string
  private _prefetchCount: number

  constructor(queueName: string, prefetchCount: number) {
    this._queueName = queueName
    this._prefetchCount = prefetchCount
  }

  get queueName(): string {
    return this._queueName
  }
  get prefetchCount(): number {
    return this._prefetchCount
  }

  async consumer(msg: unknown, transaction: ILoggerAdapter) {
    throw new Error(
      'Method not implemented\ndefault declaration "async consumer(msg: unknown, transaction: ILoggerAdapter)"',
    )
  }
}
