import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import config = require("../../config.json");
import { FindReq, SERVER_REQUEST, ServerRes } from "../findserv/readme/httpApi_find";
import { HttpReturn } from "../service/http_server";
import { http_post_async } from "../service/http_json";


/**
 * 定时更新其它依赖服务器
 */
const SERVER_MAP_INFO: Map<string, ServerRes> = new Map();

async function server_manager_start_async(server_types: string[]) {
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
    setTimeout(server_manager_start_async, config.find_server.tick_time);
}


function get_server_by_type(server_type: string): ServerRes {
    return SERVER_MAP_INFO.get(server_type);
}
