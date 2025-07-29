import { redisClient } from '../db/redis.js';

export class CacheService {
  private readonly client: typeof redisClient;

  constructor(_redisClient: typeof redisClient) {
    this.client = _redisClient;
  }

  public async set(key: string, value: any, ttl: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  }

  public async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  public async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
