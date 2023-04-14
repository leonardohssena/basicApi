import { LoggerAdapter } from './adapters'
import main from './app'

const localExec = async () => {
  try {
    await main.startServices()
    const transaction = new LoggerAdapter('TEST')
    transaction.start('TEST')

    transaction.finish('SUCCESS', {})
  } catch (error) {
    console.log(error)
  } finally {
    await main.stopServices()
  }
}

localExec()
