import ILoggerAdapter from '../../adapters/logger-adapter/logger.protocol'
import IUsers from '../../models/users/users-interface.models'

export {}

declare global {
  namespace Express {
    interface Request {
      user: IUsers
      isAuthenticated: boolean
      transaction: ILoggerAdapter
    }
  }
}
