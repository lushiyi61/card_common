import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import { query_async, DB_AREA } from "../database/db_mysql";
import { get_value_async, set_value_expire_async, REDIS_KEY } from "../database/db_redis";


async function get_user_base_info_async(token: string) {
    return await get_value_async(REDIS_KEY + token);
}

