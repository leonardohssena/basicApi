import main from './app'
import config from './config'

main
  .startServices()
  .then(() => {
    main.startWorkers()
    main.app.listen(config.port, () => console.info(`Server running on port ${config.port} in ${config.env} mode.`))
  })
  .catch((error: Error) => {
    console.error(error)
  })

process.on('exit', async (code) => {
  console.info('Exiting process with code: ' + code)
  await main.stopServices()
  console.info('Process finalized successfully')
})

process.on('SIGINT', () => {
  console.info('Application interrupted by user.')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.info('Application interrupted by command.')
  process.exit(0)
})

process.on('uncaughtException', (error) => {
  console.info('Application interrupted by error.', error)
  process.exit(1)
})
