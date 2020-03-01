import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import { User_info } from "../interface/user_info";
import { get_value_async, REDIS_KEY } from "../database/DbRedis";


export async function get_user_info_async(token: string): Promise<User_info> {
    const user_info = await get_value_async(REDIS_KEY.TOKEN + token);
    if (user_info) {
        return JSON.parse(user_info);
    }
    return null;
}
