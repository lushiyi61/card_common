import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import { get_user_base_info_async } from "./database_mgr";
const user_map_socket: Map<number, SocketIO.Socket> = new Map() // K:user_id V:socket
const user_map_table: Map<number, string> = new Map(); //K:user_id V:table_id


/**
 * 释放掉玩家所有数据
 */
function free_user(user_id) {
    free_socket(user_id);
    free_table(user_id);
}

/**
 * 绑定玩家和socket关系
 */
function bind_socket(user_id: number, socket: SocketIO.Socket) {
    const old_socket: SocketIO.Socket = user_map_socket[user_id];
    if (old_socket) {
        if (old_socket.id != socket.id) {
            user_map_socket[user_id].disconnect(true);
            delete user_map_socket[user_id];
            user_map_socket[user_id] = socket;
        }
    } else {
        user_map_socket[user_id] = socket;
    }
    socket["user_id"] = user_id;
    socket["authed"] = true;
}

function free_socket(user_id) {
    if (user_map_socket[user_id]) {
        user_map_socket[user_id].disconnect(true);
        delete user_map_socket[user_id];
    }
}

function bind_table(user_id: number, table_id: string) {
    user_map_socket[user_id].join(table_id);
    user_map_table[user_id] = table_id;
}

function free_table(user_id: string) {
    if (user_map_socket[user_id]) {
        user_map_socket[user_id].leave(user_map_socket[user_id].table_id);
    }
    delete user_map_table[user_id];
}

function send_user_msg(user_id: number, event: string, msgdata?: Object) {
    const socket: SocketIO.Socket = user_map_socket[user_id];
    if (socket == null) {
        logger.warn("用户socket丢失，user_id:%s", user_id);
        return;
    }
    logger.debug("用户消息推送，USER:%s  EVENT:%s  MSG:%s", user_id, event, JSON.stringify(msgdata));
    socket.emit(event, msgdata);
};

function get_user_table_id(user_id: number) {
    return user_map_table[user_id];
}

async function get_user_info_async(token: string) {
    // return await database_mgr_base.get_user_info_async(user_map_account[user_id]);
}

async function load_user_info_async(account = "") {
    // const user_info = await database_mgr_base.get_user_info_async(account);
    // if (user_info) {
    //     user_map_account[user_info.userid] = account
    //     return user_info.user_id;
    // }
    // return null;
}

function get_user_amount() {
    return Object.keys(user_map_socket).length;
}


export {
    get_user_amount,
    bind_socket,
    bind_table,
}
