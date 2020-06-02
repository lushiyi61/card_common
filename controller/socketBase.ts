import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import { guid } from "../utils/uuid";
import { get_user_info_async } from "../manager/database_mgr";
import { bindSocket } from "../manager/userMgr";
import { IUserInfo } from "../interface/IUserInfo";
import { SERVER_EVENT, AuthReq, CLIENT_EVENT } from "../readme/apiSocketBase";
import { setValueExpire, REDIS_KEY } from "../database/DbRedis";
import { random } from "lodash";

const WHITE_CMD_LIST = [SERVER_EVENT.AUTH_REQ, SERVER_EVENT.GUEST_REQ];

const isAuth = "isAuth";
const userId = "userId";

/**
 * 注册消息.
 */
export default function socketHandlerBase(socket: SocketIO.Socket) {
  logger.debug(`socket connection. socket id is [${socket.client.id}]`);
  // 10 秒钟后，未验证则断开
  setTimeout(
    (socket) => {
      if (!socket[isAuth]) socket.disconnect(true);
    },
    1000 * 10,
    socket
  );

  // 更新token
  socket.on(SERVER_EVENT.TOKEN_REQ, async (data) => {
    const token = data.token ? data.token : "";
    // 验证token，取玩家基本信息
    const user_info: IUserInfo = await get_user_info_async(token);
    if (!user_info) {
      // token 已失效
      logger.warn("token is expired");
      return;
    }
    const new_token = guid();
    await setValueExpire(
      REDIS_KEY.TOKEN + new_token,
      JSON.stringify(user_info),
      60 * 5
    );
    socket.emit(CLIENT_EVENT.TOKEN_RES, { token: new_token });
  });

  //错误
  socket.on("error", (err) => {
    logger.error("socket on error =======>", err);
  });

  // 消息中间件
  socket.use((data, next) => {
    if (data[0] != SERVER_EVENT.TOKEN_REQ) logger.debug(data); //  过滤心跳，打印输出
    if (WHITE_CMD_LIST.indexOf(data[0]) == -1 && !socket[isAuth]) {
      logger.warn(`event:${data[0]}    isAuth:${socket[isAuth]}`);
      socket.disconnect(true);
      return;
    } // 权限验证
    if (data.length > 1 && typeof data[1] != "string") {
      logger.warn("data[1] is not string :", data);
      socket.disconnect(true);
      return;
    }
    // 挂载user_id
    if (data[1]) {
      try {
        data[1] = JSON.parse(data[1]);
      } catch (error) {
        logger.warn("data[1] is not Json string :", data);
        socket.disconnect(true);
        return;
      }
      data[1][userId] = socket[userId];
    } else {
      data[1] = { user_id: socket[userId] };
    }
    return next();
  });
}
