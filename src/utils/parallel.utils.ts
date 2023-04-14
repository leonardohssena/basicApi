import _ from 'lodash'
import sleep from './sleep.utils'

export type ParallelOptions = {
  parallelExecutions: number
  interval?: number
}

export default class Parallel {
  static async executeInParallel<T>(
    array: T[],
    { parallelExecutions, interval = 100 }: ParallelOptions,
    execute: (item: T) => Promise<void>,
  ): Promise<void> {
    if (array.length <= parallelExecutions) {
      await this.executeFunction(array, execute)
      return
    }

    const chunks = _.chunk(array, parallelExecutions)

    for (const chunk of chunks) {
      await this.executeFunction(chunk, execute)
      await sleep(interval)
    }
  }

  private static async executeFunction(array, callback) {
    try {
      await Promise.all(
        array.map(async (item) => {
          await callback(item)
        }),
      )
    } catch (error) {
      console.error(error)
    }
  }
}
