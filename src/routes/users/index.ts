import { Request, Response, Router } from 'express'
import httpStatusCodes from 'http-status-codes'

const router = Router().get('/', async function (request: Request, response: Response) {
  response.status(httpStatusCodes.OK).json({ status: httpStatusCodes.OK })
})
export default router
