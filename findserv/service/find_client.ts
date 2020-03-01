import log4js from "../../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
// import { get_user_amount } from "../../manager/user_mgr";
import { http_post_async } from "../../service/http_json";
import { SERVER_REQUEST, ServerReq } from "../readme/httpApi_find";

const SERVER_INFO: ServerReq = { server_type: "", server_id: "", tick_time: 0, http_ip: "", http_port: 0, ws_ip: "", ws_port: 0, load: 0, memory: "" };

export async function server_report_async(server_info: ServerReq, find_ip: string, find_port: number, find_tick_time: number) {
    Object.assign(SERVER_INFO, server_info);
    await create_async(find_ip, find_port, find_tick_time);
}

export async function server_update_load(load: number) {
    SERVER_INFO.load = load;
}

async function create_async(find_ip: string, find_port: number, find_tick_time: number) {
    const now = Date.now();
    if (now > SERVER_INFO.tick_time + find_tick_time) {
        SERVER_INFO.tick_time = now;
        const mem = process.memoryUsage();
        SERVER_INFO.memory = JSON.stringify({
            heapTotal: mem_format(mem.heapTotal),
            heapUsed: mem_format(mem.heapUsed),
            rss: mem_format(mem.rss)
        })
        // logger.debug("load:%s memory:%s", SERVER_INFO.load, SERVER_INFO.memory);
        try {
            await http_post_async(find_ip, find_port, SERVER_REQUEST.CREATE, SERVER_INFO);
        } catch (error) {
            logger.warn("cann't connect to find server. ip:[%s] port:[%s] ", find_ip, find_port);
        }
    }
    setTimeout(create_async, 2000, find_ip, find_port, find_tick_time);
}

function mem_format(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + 'MB';
};
