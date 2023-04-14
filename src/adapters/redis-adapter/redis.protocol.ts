import { Redis as RedisClient } from 'ioredis'

export default interface IRedisAdapter {
  getClient(): RedisClient
  connect(): Promise<void>
  close(): Promise<void>
  get(key: string): Promise<string | null>
  set(key: string, value: string, expiration?: number): Promise<void>
  delete(key: string): Promise<void>
}
