import Redis, { Redis as RedisClient } from 'ioredis'
import IRedisAdapter from './redis.protocol'
import config from '../../config'

class RedisSingleton implements IRedisAdapter {
  private static instance: RedisSingleton
  private redisClient: RedisClient

  public static getInstance(): RedisSingleton {
    if (!RedisSingleton.instance) {
      RedisSingleton.instance = new RedisSingleton()
    }
    return RedisSingleton.instance
  }

  public getClient(): RedisClient {
    return this.redisClient
  }

  public async connect() {
    this.redisClient = new Redis(config.redis.port, config.redis.host, {
      password: config.redis.password,
      tls: config.redis.tls?.caCertificate
        ? {
            ca: Buffer.from(config.redis.tls.caCertificate),
          }
        : undefined,
    })
    console.info('Redis connection started')
  }

  public async close() {
    if (this.redisClient) {
      await this.redisClient.disconnect()
      console.info('Redis connection closed')
    }
  }

  public async get(key: string): Promise<string | null> {
    return this.redisClient.get(key)
  }

  public async set(key: string, value: string, expiration?: number): Promise<void> {
    if (expiration) {
      await this.redisClient.set(key, value, 'EX', expiration)
    } else {
      await this.redisClient.set(key, value)
    }
  }

  public async delete(key: string): Promise<void> {
    await this.redisClient.del(key)
  }
}

export default RedisSingleton.getInstance()
