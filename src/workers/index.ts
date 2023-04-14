/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs'
import config from '../config'
import { ExceptionHelper } from '../helpers'

class Worker {
  private start(WORKER: string) {
    try {
      new (require(`${__dirname}/${WORKER}`).default)().startAllWorkers()
    } catch (error) {
      if (error instanceof ExceptionHelper || error instanceof Error) {
        console.error(WORKER, error.message)
      }
    }
  }

  public startAllWorkers(): void {
    const modules = fs.readdirSync(`${__dirname}`)
    modules
      .filter((module: string) => !module.includes('.ts') && config.activedWorkers.includes(module))
      .forEach(this.start.bind(this))

    console.info('Workers started')
  }
}

export default Worker
