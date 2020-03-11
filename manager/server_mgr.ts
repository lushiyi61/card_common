import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import config = require("../../config.json");
import { FindReq, SERVER_REQUEST, ServerRes } from "../findserv/readme/httpApi_find";
import { HttpReturn, ERROR_CODE } from "../service/http_server";
import { http_post_async } from "../service/http_json";


/**
 * 定时更新其它依赖服务器
 */
const SERVER_MAP_INFO: Map<string, ServerRes> = new Map();

export async function server_manager_start_async(server_types: string[]) {
    const find_server = config.find_server;
    await Promise.all(
        server_types.map(async server_type => {
            const findreq: FindReq = {
                server_type
            }

            const result: HttpReturn = await http_post_async(
                find_server.server_ip,
                find_server.server_port,
                SERVER_REQUEST.FIND,
                findreq
            )
            if (result.data) {
                SERVER_MAP_INFO.set(server_type, result.data);
            }
        })
    )
    setTimeout(server_manager_start_async, config.find_server.tick_time, server_types);
}


export function get_server_by_type(server_type: string): ServerRes {
    return SERVER_MAP_INFO.get(server_type);
}

export async function post_to_server_async(server_type: string, cmd: string, params: any): Promise<HttpReturn> {
    const server = SERVER_MAP_INFO.get(server_type);
    if (server) {
        try {
            const result: HttpReturn = await http_post_async(
                server.http_ip,
                server.http_port,
                cmd,
                params
            )
            return result;
        } catch (error) {
            logger.warn("服务器请求错误：[%s]", error);
            return { code: ERROR_CODE.SERVER_TIME_OUT }
        }
    }
    logger.warn("服务器不存在，类型[%s]", server_type);
    return { code: ERROR_CODE.SERVER_NOT_EXIST }
}
