/* eslint-disable @typescript-eslint/no-unused-vars */
import ILoggerAdapter from '../../adapters/logger-adapter/logger.protocol'

export default class SchedulerPrototype {
  private _executionName: string
  private _cronExpression: string

  constructor(executionName: string, cronExpression: string) {
    this._executionName = executionName
    this._cronExpression = cronExpression
  }

  get executionName(): string {
    return this._executionName
  }

  get cronExpression(): string {
    return this._cronExpression
  }

  async schedule(transaction: ILoggerAdapter) {
    throw new Error('Method not implemented\ndefault declaration "async schedule(transaction: ILoggerAdapter)"')
  }
}
