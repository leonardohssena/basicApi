export type LoggerStatus = 'SUCCESS' | 'EMPTY' | 'ALERT' | 'REJECTED' | 'ERROR'
export type LoggerOrigin = 'API' | 'SCHEDULE' | 'CONSUMER' | 'TEST'

export default interface ILoggerAdapter {
  createChildTransaction(): ILoggerAdapter
  start(data: unknown): void
  trace(message: string, status: LoggerStatus, data: unknown): void
  finish(status: LoggerStatus, data: unknown): void
}
