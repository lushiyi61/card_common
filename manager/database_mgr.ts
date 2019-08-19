import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import { query_async, DB_AREA } from "../database/db_mysql";
import { get_value_async, set_value_expire_async, REDIS_KEY } from "../database/db_redis";

// /**
//  * 验证用户是否存在
//  * @param {*} account 
//  */
// exports.get_user_id_exist_async = async function (account = "") {
//     const sql = `SELECT userid FROM users WHERE account = '${account}' and 'lock' = 0`;
//     const user = await query_async(DB_AREA.USER_DB, sql);
//     return user.length > 0 ? user[0].userid : null;
// }

/**
 * 同步-->根据用户account获取用户信息
 * @param {*} account 
 * @returns {user_info} 用户信息
 */
async function get_user_info_async(account: string) {
    const redis_key = REDIS_KEY.ACCOUNT + account;
    const redis_value: string = await get_value_async(redis_key);
    if (redis_value) {
        return JSON.parse(redis_value);
    } else {
        const sql = `select * from users,user_extro_info where users.userid = user_extro_info.user_id  and users.account =  '${account}'  limit 1`;
        const user_infos = await query_async(DB_AREA.USER_DB, sql);
        if (user_infos.length == 1) {
            await set_value_async(redis_key, user_infos[0]);
        }
        return user_infos[0];
    }
}

exports.update_user_login_time_async = async function (account = "") {
    const sql = `UPDATE users SET login_time = unix_timestamp(now())  WHERE account = '${account}' `;
    return await query_async(DB_AREA.USER_DB, sql);
}

exports.get_user_account_async = async function (token = "") {
    return await get_value_async(REDIS_KEY.TOKEN + token);
}
