import dotenv from 'dotenv'

dotenv.config()

export { default as getUnlessPath } from './unlessPath'

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  activedWorkers: (process.env.ACTIVED_WORKERS || '').split(',').map((text) => text.trim()),
  auth: {
    audience: process.env.AUTH_AUDIENCE,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
  },
  log: {
    elasticIsActive: process.env.LOG_ELASTIC_SEARCH_ENABLED === 'true',
    elasticsearchUrl: process.env.LOG_ELASTIC_SEARCH_URL,
  },
  mongoDB: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME,
  },
  redis: {
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    tls: {
      caCertificate: process.env.REDIS_TLS_CA_CERT,
    },
  },
  amqp: {
    url: process.env.AMQP_URL,
  },
  example: {
    baseURL: process.env.EXAMPLE_BASE_URL,
    apiKey: process.env.EXAMPLE_API_KEY,
  },
}
