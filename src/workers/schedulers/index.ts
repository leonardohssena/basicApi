/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs'
import cron from 'node-cron'
import SchedulerPrototype from './scheduler.prototype'
import { LoggerAdapter } from '../../adapters'
import ILoggerAdapter from '../../adapters/logger-adapter/logger.protocol'
import { ExceptionHelper } from '../../helpers'

class WorkerScheduler {
  private async startWorker(
    executionName: string,
    cronExpression: string,
    callback: (transaction: ILoggerAdapter) => Promise<void>,
  ) {
    let isRunning = false
    cron.schedule(cronExpression, async () => {
      if (isRunning) return
      const transaction = new LoggerAdapter('SCHEDULE')
      try {
        transaction.start({
          executionName,
          cronExpression,
        })
        isRunning = true
        await callback(transaction)
        isRunning = false
        transaction.finish('SUCCESS', {})
      } catch (error) {
        isRunning = false
        transaction.finish('ERROR', {
          message: error.message,
        })
      }
    })

    console.info(`Worker scheduler service ${executionName} with cron ${cronExpression}...`)
  }

  private start(SCHEDULER: string) {
    try {
      const scheduler: SchedulerPrototype = new (require(`${__dirname}/${SCHEDULER}`).default)()
      this.startWorker.bind(this)(scheduler.executionName, scheduler.cronExpression, scheduler.schedule)
    } catch (error) {
      if (error instanceof ExceptionHelper || error instanceof Error) {
        console.error(SCHEDULER, error.message)
      }
    }
  }

  public startAllWorkers(): void {
    const modules = fs.readdirSync(`${__dirname}`)
    modules.filter((module: string) => !module.includes('.ts')).forEach(this.start.bind(this))

    console.info('Scheduler workers started')
  }
}

export default WorkerScheduler
