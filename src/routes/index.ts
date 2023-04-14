/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express'
import fs from 'fs'
import { ExceptionHelper } from '../helpers'

const base = '/api/v1'

const start = (router: Router) => (MODULE: string) => {
  try {
    const Route = require(`${__dirname}/${MODULE}`).default
    const path = `${base}/${MODULE}/`
    router.use(path, Route)
  } catch (error) {
    if (error instanceof ExceptionHelper || error instanceof Error) {
      console.error(error.message)
    }
  }
}

export default () => {
  const router = Router()
  const makeStart = start(router)

  const modules = fs.readdirSync(`${__dirname}`)
  modules.filter((module: string) => !module.includes('.ts')).forEach(makeStart)

  router.use(({ originalUrl }, response, next) => {
    if (!response.statusMessage)
      response.status(404).json({
        status: 404,
        message: 'Invalid Route.',
        route: originalUrl,
      })

    next()
  })

  return router
}
