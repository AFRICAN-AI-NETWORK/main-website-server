import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_PROVIDER') private readonly redisClient: Redis) {}

  /**
   * Save data to Redis with an optional expiration time.
   *
   * @param {string} key - the key to save the data under
   * @param {string | number} value - the data to save
   * @param {number} expiration - optional expiration time in seconds
   * @return {Promise<void>} a Promise that resolves when the data is saved
   */
  async save(
    key: string,
    value: string | number,
    expiration?: number,
  ): Promise<void> {
    if (expiration) await this.redisClient.set(key, value, 'EX', expiration);
    else await this.redisClient.set(key, value);
  }

  /**
   * Return the value of a certain key.
   *
   * @param {string} key - the key to check existence for
   * @return {Promise<string | number>} The value of the key
   */
  async get(key: string): Promise<string | number | null> {
    return this.redisClient.get(key);
  }

  /**
   * Check if the given key exists in the Redis client.
   *
   * @param {string} key - the key to check existence for
   * @return {Promise<boolean>} a boolean indicating if the key exists
   */
  async checkExists(key: string): Promise<boolean> {
    return (await this.redisClient.get(key)) !== null;
  }

  /**
   * Deletes a key from the storage.
   *
   * @param {string} key - the key to be deleted
   * @return {Promise<void>} a Promise that resolves when the key is successfully deleted
   */
  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
