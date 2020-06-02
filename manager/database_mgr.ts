import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import { IUserInfo } from "../interface/IUserInfo";
import { getValue, REDIS_KEY } from "../database/DbRedis";

export async function get_user_info_async(token: string): Promise<IUserInfo> {
  const user_info = await getValue(REDIS_KEY.TOKEN + token);
  if (user_info) {
    return JSON.parse(user_info);
  }
  return null;
}
