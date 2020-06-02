import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
const USER_MAP_SOCKET: Map<number, SocketIO.Socket> = new Map(); // K:userId V:socket
const USER_MAP_ROOM: Map<number, string> = new Map(); //K:userId V:roomId

/**
 * 释放掉玩家所有数据
 */
export function freeUser(userId) {
  freeSocket(userId);
  // freeRoom(userId);
}

/**
 * 绑定玩家和socket关系
 */
export function bindSocket(userId: number, socket: SocketIO.Socket) {
  if (USER_MAP_SOCKET.has(userId)) {
    const old_socket: SocketIO.Socket = USER_MAP_SOCKET.get(userId);
    if (old_socket.id != socket.id) {
      old_socket.disconnect(true);
      USER_MAP_SOCKET.delete(userId);
      USER_MAP_SOCKET.set(userId, socket);
    }
  } else {
    USER_MAP_SOCKET.set(userId, socket);
  }
}

function freeSocket(userId, delay: number = 0) {
  if (delay != 0) {
    return setTimeout(freeSocket, delay, userId);
  }
  if (USER_MAP_SOCKET.has(userId)) {
    USER_MAP_SOCKET.get(userId).disconnect(true);
    USER_MAP_SOCKET.delete(userId);
  }
}

function bindRoom(userId: number, roomId: string) {
  if (USER_MAP_SOCKET.has(userId)) {
    USER_MAP_SOCKET.get(userId).join(roomId);
  }
  USER_MAP_ROOM.set(userId, roomId);
}

export function sendUserMsg(userId: number, event: string, msgData?: Object) {
  if (!USER_MAP_SOCKET.has(userId)) {
    logger.warn("用户socket丢失，userId:%s", userId);
    return;
  }
  const socket: SocketIO.Socket = USER_MAP_SOCKET.get(userId);
  // logger.debug("用户消息推送，USER:%s  EVENT:%s  MSG:%s", userId, event, JSON.stringify(msgData));
  socket.emit(event, msgData);
}

function getUserRoomId(userId: number): string | undefined {
  return USER_MAP_ROOM.get(userId);
}

async function get_user_info_async(token: string) {
  // return await database_mgr_base.get_user_info_async(user_map_account[userId]);
}

async function load_user_info_async(account = "") {
  // const user_info = await database_mgr_base.get_user_info_async(account);
  // if (user_info) {
  //     user_map_account[user_info.userId] = account
  //     return user_info.userId;
  // }
  // return null;
}

export function getUserAmount(): number {
  return USER_MAP_SOCKET.size;
}
