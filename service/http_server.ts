export interface HttpReturn {
    code?: string,
    msg?: string,
    data?: any,
}

export const ERROR_CODE = {
    SUCCESS: "0",               // 执行成功
    ERROR: "E5001",             // 客户端非法操作
    SERVER_NOT_EXIST: "E5002",  // 服务器不存在
    SERVER_TIME_OUT: "E5003",   // 服务器超时
}

export function http_return(res, ret: HttpReturn) {
    const httpReturn: HttpReturn = { code: "0", msg: "success" };
    Object.assign(httpReturn, ret);
    // const str = JSON.stringify(httpReturn);
    // logger.debug(str);
    res.send(httpReturn);
}
