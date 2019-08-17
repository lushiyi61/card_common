import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import RedisPool = require("sol-redis-pool")
let redis_pool = null;
const REDIS_KEY = {
    TOKEN: "token:",
    ACCOUNT: "account:"
}


function add_pool(redis_setting, redis_pool_setting) {
    redis_pool = RedisPool(redis_setting, redis_pool_setting);
}


/**
 * 同步获取redis中的值
 * @param {*} key 
 * @param {*} default_value 
 */
function get_value_async(key, default_value) {
    return new Promise((resolve, reject) => {
        redis_pool.acquire((err, client) => {
            if (err) {
                logger.error("REDIS ASYNC GET CONNECTION FAILED:", err);
                reject(default_value);
                return;
            }
            client.get(key, (gerr, rsp) => {
                redis_pool.release(client);
                if (gerr) {
                    logger.error("REDIS ASYNC GET KEY ERROR:", gerr);
                    reject(default_value);
                    return;
                }
                resolve(rsp);
            })
        })
    })
}


/**
 * 同步设置值
 * @param {*} key
 * @param {*} value 
 */
function set_value_async(key, value) {
    return new Promise((resolve, reject) => {
        redis_pool.acquire((err, client) => {
            if (err) {
                logger.error("REDIS SET GET CLIENT FAILED:", err);
                reject(null);
                return;
            }
            if (typeof value == 'object') {
                value = JSON.stringify(value);
            }
            client.set(key, value, (serr, rsp) => {
                redis_pool.release(client);
                if (serr) {
                    logger.error("REDIS SET VALUE FAILED:", serr);
                    reject(null);
                    return;
                }
                resolve(rsp);
            })
        })
    })
}


/**
 * 同步设置记录生命周期
 * @param {*} key 
 * @param {*} value
 * @param {*} time 
 */
function expire_async(key, value, time) {
    return new Promise((resolve, reject) => {
        redis_pool.acquire((err, client) => {
            if (err) {
                logger.error("REDIS SET GET CLIENT FAILED:", err);
                reject(null)
                return;
            }
            if (typeof value == 'object') {
                value = JSON.stringify(value)
            }
            client.expire(key, time, (serr, rsp) => {
                redis_pool.release(client);
                if (serr) {
                    logger.error("REDIS SET VALUE FAILED:", serr);
                    reject(null);
                    return;
                }
                resolve(rsp)
            })
        })
    });
}


/**
 * 同时设置时限记录
 * @param {*} key 
 * @param {*} value 
 * @param {*} time 
 */
function set_value_expire_async(key, value, time) {
    return new Promise((resolve, reject) => {
        redis_pool.acquire((err, client) => {
            if (err) {
                logger.error("REDIS SET GET CLIENT FAILED:", err);
                reject(null);
                return;
            }
            if (typeof value == 'object') {
                value = JSON.stringify(value)
            }
            client.set(key, value, (serr, rsp) => {
                if (serr) {
                    logger.error("REDIS SET VALUE FAILED:", serr);
                    reject(null);
                    redis_pool.release(client);
                    return;
                }
                client.expire(key, time, (eerr, rsp) => {
                    redis_pool.release(client);
                    if (eerr) {
                        logger.error("REDIS EXPIRE VALUE FAILED:", eerr);
                        reject(null);
                        return;
                    }
                    resolve(rsp);
                });
            });
        });
    });
}

export {
    add_pool,
    set_value_async,
    REDIS_KEY,
    set_value_expire_async,
    get_value_async, expire_async,
}
