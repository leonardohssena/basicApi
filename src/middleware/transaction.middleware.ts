import { LoggerAdapter } from '../adapters'

const transactionInfo = (req, res, next) => {
  req.transaction = new LoggerAdapter('API')

  next()
}

export default transactionInfo
