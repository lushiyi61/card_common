import { createClient } from "redis";
import { promisifyAll } from "bluebird";
import config = require("../../config.json");

export const RedisClient = createClient(config.redisConfig);
promisifyAll(RedisClient);

export const REDIS_KEY = {
  TOKEN: "token:",
  ACCOUNT: "account:",
  USER_SERVER: "user:server:", // 用户所在服务器
  ROOM_ID: "room:id", // 房间ID
};

export async function delKey(key: string) {
  // RedisClient.del(key);
  await RedisClient["delAsync"](key);
}

export async function setValue(key: string, value: string) {
  // RedisClient.set(redisKey);
  await RedisClient["setAsync"](key, value);
}

export async function getValue(key: string): Promise<string> {
  // RedisClient.get(redisKey);
  return await RedisClient["getAsync"](key);
}

export async function setValueExpire(
  key: string,
  value: string,
  expire: number
) {
  // RedisClient.setex(key, expire, value);
  await RedisClient["setexAsync"](key, expire, value);
}

export async function hSetValue(key: string, field: string, value: string) {
  // RedisClient.hset(key, field, value);
  await RedisClient["hsetAsync"](key, field, value);
}

export async function hGetValue(key: string, field: string): Promise<string> {
  // RedisClient.hget(key, field);
  return await RedisClient["hgetAsync"](key, field);
}

export async function exists(key: string): Promise<boolean> {
  // RedisClient.exists()
  return await RedisClient["existsAsync"](key);
}
