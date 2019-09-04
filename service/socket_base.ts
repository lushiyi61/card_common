import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import { guid } from "../utils/uuid";
import { get_user_base_info_async } from "../manager/database_mgr";
import { bind_socket } from "../manager/user_mgr";
import { User_base_info } from "../interface/user_info";
import { set_value_expire_async, REDIS_KEY } from "../database/db_redis";
import { SERVER_EVENT, AuthReq, CLIENT_EVENT } from "../readme/socket_api";

const white_cmd_list = [SERVER_EVENT.AUTH_REQ];

/**
 * 注册消息.
 */
function handler(socket: SocketIO.Socket) {
    logger.debug(`socket connection. socket id is [${socket.client.id}]`);
    // 10 秒钟后，未验证则断开
    setTimeout(socket => {
        if (!socket["authed"]) socket.disconnect(true);
    }, 1000 * 10, socket);

    //认证
    socket.on(SERVER_EVENT.AUTH_REQ, async data => {
        const params: AuthReq = data;
        if (typeof params.token != "string") {
            logger.warn("验证参数错误");
            socket.disconnect(true);
            return;
        }
        // 验证token，取玩家基本信息
        const user_base_info: User_base_info = await get_user_base_info_async(params.token);
        if (!user_base_info) {
            logger.warn("拉取玩家信息失败");
            socket.disconnect(true);
            return;
        }

        //标记socket已经认证
        bind_socket(user_base_info.user_id, socket);
    });

    // 更新token
    socket.on(SERVER_EVENT.TOKEN_REQ, async data => {
        const token = data.token ? data.token : "";
        // 验证token，取玩家基本信息
        const user_base_info: User_base_info = await get_user_base_info_async(token);
        if (!user_base_info) {  // token 已失效
            logger.warn("token is expired");
            return;
        }
        const new_token = guid();
        await set_value_expire_async(REDIS_KEY.TOKEN + new_token, user_base_info, 60 * 5);
        socket.emit(CLIENT_EVENT.TOKEN_RES, { token: new_token });
    })

    //错误
    socket.on("error", err => {
        logger.error("scoket on error =======>", err)
    })

    // 消息中间件
    socket.use((data, next) => {
        if (data[0] != SERVER_EVENT.TOKEN_REQ) logger.debug(data);     //  过滤心跳，打印输出
        if (white_cmd_list.indexOf(data[0]) == -1 && !socket["authed"]) {
            logger.warn(`EVENT:${data[0]}    AUTHED:${socket["authed"]}`);
            socket.disconnect(true);
            return
        };    // 权限验证
        if (data.length > 1 && typeof data[1] != "object") {
            logger.warn("data[1] is not object :", data);
            socket.disconnect(true);
            return;
        }
        return next();
    });
}

export { handler as socket_base_handler }
