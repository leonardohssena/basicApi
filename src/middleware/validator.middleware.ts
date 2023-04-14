/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import Schema, { SchemaDefinition } from 'validate'
import { ExceptionHelper } from '../helpers'

export default (templateSchema: SchemaDefinition) => {
  const middleware = (request: Request, _response: Response, next: NextFunction) => {
    const getFromBodyRequest = ['PATCH', 'PUT', 'POST'].includes(request.method)
    const params = getFromBodyRequest ? { ...request.body, ...request.params } : { ...request.query, ...request.params }

    const schema = new Schema({ ...templateSchema })
    schema.typecaster({
      Number: (value: any) => {
        if (String(Number(value)) !== 'NaN') {
          return Number(value)
        }
        return false
      },
      Object: (value: any) => value,
    })

    const errors = schema.validate(params, { strict: true, strip: true, typecast: true })
    if (errors.length) {
      const errorsMapped = errors.map((error: { path: string; toString: () => any }) => ({
        [error.path.split(/\.\d/).join('')]: error.toString(),
      }))
      const errorsParsed = Object.assign({}, ...errorsMapped)

      throw new ExceptionHelper('Invalid parameters', {
        statusCode: StatusCodes.BAD_REQUEST,
        data: errorsParsed,
      })
    }

    next()
  }

  return middleware
}
