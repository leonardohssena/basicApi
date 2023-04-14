import axios from 'axios'
import { auth } from 'express-oauth2-jwt-bearer'
import config, { getUnlessPath } from '../config'
import { UsersController } from '../controllers'
import { httpStatusCodes } from '../utils'

const authMiddleware = auth({
  issuerBaseURL: config.auth.issuerBaseURL,
  audience: config.auth.audience,
  tokenSigningAlg: 'RS256',
  jwksUri: `${config.auth.issuerBaseURL}/.well-known/jwks.json`,
})

export default async function (req, res, next) {
  authMiddleware(req, res, async () => {
    try {
      req.isAuthenticated = false
      if (!req.auth) {
        const isExcluded = getUnlessPath.some(({ url, methods }) => {
          const urlMatches = req.originalUrl.match(url)
          const methodMatches = methods.includes(req.method)

          return urlMatches && methodMatches
        })
        if (isExcluded) return next()
        throw new Error('Invalid token')
      }
      const {
        token,
        payload: { sub },
      } = req.auth

      const usersController = new UsersController()
      let user = await usersController.findByAuthSub(sub)
      if (!user) {
        const { data: userAuth } = await axios.get(`${config.auth.issuerBaseURL}/userinfo`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        user = await usersController.createUser({
          nickname: userAuth.nickname,
          name: userAuth.name,
          picture: userAuth.picture,
          updated_at: userAuth.updated_at,
          email: userAuth.email,
          email_verified: userAuth.email_verified,
          sub: userAuth.sub,
          sid: userAuth.sid,
        })
      }
      req.isAuthenticated = true
      req.user = user
      next()
    } catch (err) {
      req.transaction.trace(err.message || 'Failed to decode JWT', 'ERROR', err.data || { stack: err.stack })
      res.sendStatus(httpStatusCodes.UNAUTHORIZED, 'Invalid token')
    }
  })
}
