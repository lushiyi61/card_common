import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import { get_value_async, REDIS_KEY } from "../database/db_redis";
import { query_async } from "../database/db_mysql";

async function get_user_base_info_async(token: string) {
    return await get_value_async(REDIS_KEY + token);
}
