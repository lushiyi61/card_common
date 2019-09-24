import { createClient } from "redis";
import { promisifyAll } from "bluebird";
import config = require("../../config.json");

export const RedisClient = createClient(config.redisconfig);
promisifyAll(RedisClient);

export const REDIS_KEY = {
    TOKEN: "token:",
    ACCOUNT: "account:",
    USER_SERVER: "user:server:",      // 用户所在服务器
}



export async function set_value_async(key: string, value: string) {
    // let tmp = RedisClient.set(redisKey);
    const result = await RedisClient["setAsync"](key, value);
}

export async function get_value_async(key: string): Promise<string> {
    // let tmp = RedisClient.get(redisKey);
    return await RedisClient["getAsync"](key);
}

export async function set_value_expire_async(key: string, value: string, expire: number) {
    // RedisClient.setex(key, expire, value);
    await RedisClient["setexAsync"](key, expire, value);
}
