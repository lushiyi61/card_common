import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import { gen_key, secret, rc4encryption } from "../utils/dhrc4";
import crypto = require("crypto")
import { } from "../manager/user_mgr";
const b64_reg = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/
const white_cmd_list = ["challenge", "auth"];

/**
 * 注册消息.
 */
function handler(socket: SocketIO.Socket) {
    logger.debug("socket connection");
    const keys = gen_key();
    socket["challenge"] = {};
    socket["challenge"].private_key = keys.private_key;
    socket.emit("key", { public_key: keys.public_key });

    //握手认证
    socket.on("challenge", data => {
        if (!b64_reg.test(data.key)) {
            logger.error("challenge:B64 failed.");
            socket.disconnect(true);
            return;
        }
        socket["challenge"].secret = secret(socket["challenge"].private_key, data.key)
        const rd_str = crypto.randomBytes(16).toString("base64");
        socket["challenge"].rd_str = rd_str;
        const cy_str = rc4encryption(rd_str, socket["challenge"].secret)
        socket.emit("challenge", { cy_str: cy_str });
    });

    //认证
    socket.on("auth", async (data) => {
        const rd_text = data.rd_text;
        const token = data.token;

        if (!rd_text || !token          // 参数校验
            // || (rd_text != socket["challenge"].rd_str) //验证rd_text
        ) {
            socket.disconnect(true);
            return;
        }

        // 验证token，取玩家基本信息
        // const user_info = await database_mgr_base.get_user_account_async(token);
        // const user_id = await user_mgr_base.load_user_info_async(account);
        // if (!user_id) {
        //     socket.disconnect(true);
        //     return;
        // }

        //标记socket已经认证
        // user_mgr_base.bind_socket(user_id, socket);
        socket.emit("auth_finish");
    });

    //心跳
    socket.on("game_ping", (data) => {
        socket.emit("game_pong")
    })

    //错误
    socket.on("error", (err) => {
        logger.error("scoket on error =======>", err)
    })

    // 消息中间件
    socket.use((data, next) => {
        if (data[0] != "game_ping") logger.debug(data);     //  过滤心跳，打印输出
        if (white_cmd_list.indexOf(data[0]) != -1 && socket["authed"] == false) return;    // 权限验证
        if (data.length > 1 && typeof data[1] != "object") {
            logger.warn("data[1] is not object :", data);
            socket.disconnect(true);
            return;
        }
        return next();
    });
}

export { handler as socket_base_handler }
