export interface HttpReturn {
    code?: string,
    msg?: string,
    data?: any,
}

export function http_return(res, ret: HttpReturn) {
    const httpReturn: HttpReturn = { code: "0", msg: "success" };
    Object.assign(httpReturn, ret);
    const str = JSON.stringify(httpReturn);
    // logger.debug(str);
    res.send(str);
}
