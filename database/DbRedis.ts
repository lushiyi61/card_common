import { createClient } from "redis";
import { promisifyAll } from "bluebird";
import config = require("../../config.json");

export const RedisClient = createClient(config.redisconfig);
promisifyAll(RedisClient);

export const REDIS_KEY = {
    TOKEN: "token:",
    ACCOUNT: "account:",
    USER_SERVER: "user:server:",      // 用户所在服务器
    ROOM_ID: "room:id",                 // 房间ID
}


export async function del_key_async(key: string) {
    // RedisClient.del(key);
    await RedisClient["delAsync"](key);
}

export async function set_value_async(key: string, value: string) {
    // RedisClient.set(redisKey);
    await RedisClient["setAsync"](key, value);
}

export async function get_value_async(key: string): Promise<string> {
    // RedisClient.get(redisKey);
    return await RedisClient["getAsync"](key);
}

export async function set_value_expire_async(key: string, value: string, expire: number) {
    // RedisClient.setex(key, expire, value);
    await RedisClient["setexAsync"](key, expire, value);
}

export async function hset_value_async(key: string, field: string, value: string) {
    // RedisClient.hset(key, field, value);
    await RedisClient["hsetAsync"](key, field, value);
}

export async function hget_value_async(key: string, field: string): Promise<string> {
    // RedisClient.hget(key, field);
    return await RedisClient["hgetAsync"](key, field);
}

export async function exists_async(key: string): Promise<boolean> {
    // RedisClient.exists()
    return await RedisClient["existsAsync"](key);
}
