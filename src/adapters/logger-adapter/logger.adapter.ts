import { v4 as uuidv4 } from 'uuid'
import winston from 'winston'
import ILoggerAdapter, { LoggerStatus, LoggerOrigin } from './logger.protocol'
import config from '../../config'
import esTransport from '../../helpers/logElasticSearch'

const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { date: new Date() },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
})

if (config.log.elasticIsActive) {
  logger.add(esTransport)
}

export default class LoggerAdapter implements ILoggerAdapter {
  private _transactionId: string
  private _startTime: Date
  private _origin: LoggerOrigin
  private _parentTransactionId: string

  constructor(origin: LoggerOrigin = 'API', parentTransactionId?: string) {
    this._origin = origin
    this._transactionId = uuidv4()
    this._startTime = new Date()
    this._parentTransactionId = parentTransactionId
    return this
  }

  get transactionId() {
    return this._transactionId
  }

  get startTime() {
    return this._startTime
  }

  private log(status: LoggerStatus, isFinish: boolean, message: string, data: unknown) {
    const loggerPayload = {
      level: status === 'ERROR' ? 'error' : 'info',
      status,
      message,
      data,
      metadata: {
        origin: this._origin,
        parentId: this._parentTransactionId,
        id: this._transactionId,
        startTime: this._startTime,
        duration: isFinish ? (new Date().getTime() - this._startTime.getTime()) / 1000 : undefined,
      },
    }
    logger.log(loggerPayload)
  }

  start(data: unknown): void {
    this.log('SUCCESS', false, 'Start transaction', data)
  }

  createChildTransaction(): ILoggerAdapter {
    return new LoggerAdapter(this._origin, this._parentTransactionId)
  }

  trace(message: string, status: LoggerStatus, data: unknown): void {
    this.log(status, false, message, data)
  }

  finish(status: LoggerStatus, data: unknown): void {
    this.log(status, true, 'Finish transaction', data)
  }
}
