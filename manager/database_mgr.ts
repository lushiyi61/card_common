import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import { query_async, DB_AREA } from "../database/db_mysql";
import { get_value_async, set_value_expire_async, REDIS_KEY } from "../database/db_redis";
import { User_base_info, User_info } from "../interface/user_info";


async function get_user_base_info_async(token: string): Promise<User_base_info> {
    const user_base_info = await get_value_async(REDIS_KEY.TOKEN + token);
    if (user_base_info) {
        return JSON.parse(user_base_info);
    }
    return null;
}

async function get_user_info_async(user_id: number): Promise<User_info> {

    return null;
}

async function set_user_info_async() {

}

export {
    get_user_base_info_async,
}
