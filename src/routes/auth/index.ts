import { Router } from 'express'

const router = Router().get('/', async (req, res) => {
  res.send(req.isAuthenticated ? 'Logged in' : 'Logged out')
})
export default router
