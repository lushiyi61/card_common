import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import http = require("http");

export interface HttpReturn {
    code?: string,
    msg?: string,
    data?: any,
}

function http_return(res, ret: HttpReturn) {
    const httpReturn: HttpReturn = { code: "0", msg: "success" };
    Object.assign(httpReturn, ret);
    const str = JSON.stringify(httpReturn);
    // logger.debug(str);
    res.send(str);
}

function http_get(host: string, port: number, path: string, data: Object) {
    const opt = {
        host,
        port,
        path,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": JSON.stringify(data).length,
        },
    };
    const req = http.request(opt, function (res) {
        res.setEncoding("utf-8");
        // res.on("data", function (chunk) {
        //     console.log(chunk)
        // });
    });

    req.on("error", function (err) {
        logger.warn(err.message);
    });
    req.write(JSON.stringify(data));
    req.end();
};


export { http_return, http_get }
