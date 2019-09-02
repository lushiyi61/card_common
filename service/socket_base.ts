import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import { guid } from "../utils/uuid";
import { get_user_base_info_async } from "../manager/database_mgr";
import { bind_socket } from "../manager/user_mgr";
import { User_base_info } from "../interface/user_info";
import { set_value_expire_async, REDIS_KEY } from "../database/db_redis";

const white_cmd_list = ["challenge", "auth"];

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
    socket.on("auth", async data => {
        const token = data.token ? data.token : "";
        // 验证token，取玩家基本信息
        const user_base_info: User_base_info = await get_user_base_info_async(token);
        if (!user_base_info) {
            socket.disconnect(true);
            return;
        }

        //标记socket已经认证
        bind_socket(user_base_info.user_id, socket);
    });

    // 更新token
    socket.on("get_token", async data => {
        const token = data.token ? data.token : "";
        // 验证token，取玩家基本信息
        const user_base_info: User_base_info = await get_user_base_info_async(token);
        if (!user_base_info) {  // token 已失效
            return;
        }
        const new_token = guid();
        await set_value_expire_async(REDIS_KEY.TOKEN + new_token, user_base_info, 60 * 5);
        socket.emit("get_token", { token: new_token });
    })

    //错误
    socket.on("error", err => {
        logger.error("scoket on error =======>", err)
    })

    // 消息中间件
    socket.use((data, next) => {
        if (data[0] != "game_ping") logger.debug(data);     //  过滤心跳，打印输出
        if (white_cmd_list.indexOf(data[0]) == -1 || !socket["authed"]) {
            logger.warn(`EVENT:${data[0]} AUTHED:${socket["authed"]}`);
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
