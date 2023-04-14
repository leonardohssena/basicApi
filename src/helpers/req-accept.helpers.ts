import { Request, Response, NextFunction } from 'express'

const matchFields =
  (fields: string[], condition: boolean) =>
  ([key]: any[]) =>
    fields.includes(key) === condition

const reducer = (acc: object, [key, value]: any[]) => ({ ...acc, [key]: value })

export default (instance: keyof Request, fields: string[]) =>
  (request: Request, _response: Response, next: NextFunction) => {
    if (instance === 'body' || instance === 'headers' || instance === 'params' || instance === 'query') {
      const reqInstance = request[instance as keyof object]

      const matcher = matchFields(fields, true)

      const newInstance: object = Object.entries(reqInstance).filter(matcher).reduce(reducer, {})

      request[instance] = newInstance
    }
    next()
  }
