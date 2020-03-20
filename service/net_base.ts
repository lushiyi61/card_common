import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import net = require("net");
import { NetMessage } from "../readme/net_api";


/**
 * 数据存储区域
 */
export const CLIENT_MAP_INFO = new Map<string, net.Socket>();
const SEPARATOR = "||";

export function send_msg_to_client(client_id: string, msg: NetMessage) {
    const socket = CLIENT_MAP_INFO.get(client_id);
    if (socket && socket.writable) {
        socket.write(JSON.stringify(msg) + SEPARATOR);
    } else {
        logger.warn("网络连接中断, ", client_id);
    }
}


export function send_msg_to_server(socket: net.Socket, msg: NetMessage) {
    socket.write(JSON.stringify(msg) + SEPARATOR);
}


export function unpack_msg(data: string): NetMessage[] {
    const params: NetMessage[] = [];
    data.split(SEPARATOR).map(value => {
        if (value.length > 0) {
            try {
                const param: NetMessage = JSON.parse(value);
                params.push(param);
            } catch (error) {
                logger.warn("unpack msg error. data[%s]", value);
            }
        }
    })
    return params;
}
