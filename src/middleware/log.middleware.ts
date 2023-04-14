function captureResponseBody(res) {
  const originalSend = res.send
  res.send = function (body) {
    try {
      res.locals.responseBody = typeof body === 'string' ? JSON.parse(body) : body
    } catch (_) {
      res.locals.responseBody = body
    }
    originalSend.call(res, body)
  }
}

function logMiddleware(req, res, next) {
  let logProcessed = false

  if (req.url === '/favicon.ico') return next()

  captureResponseBody(res)

  req.transaction.start({
    method: req.method,
    host: req.hostname,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
  })

  res.on('finish', () => {
    if (logProcessed) return
    logProcessed = true

    req.transaction.trace('Request finished', 'SUCCESS', {})
    req.transaction.finish(res.statusCode >= 400 ? 'ERROR' : 'SUCCESS', {
      status: res.statusCode,
      body: res.locals.responseBody,
    })
  })

  res.on('close', () => {
    if (logProcessed) return
    logProcessed = true

    res.status = 499
    req.transaction.trace('Request closed', 'SUCCESS', {})
    req.transaction.finish('ERROR', {
      status: res.statusCode,
      body: res.locals.responseBody,
    })
  })

  res.on('timeout', () => {
    if (logProcessed) return
    logProcessed = true

    res.status = 504
    req.transaction.trace('Request timeout', 'SUCCESS', {})
    req.transaction.finish('ERROR', {
      status: res.statusCode,
      body: res.locals.responseBody,
    })
  })

  next()
}

export default logMiddleware
