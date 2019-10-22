import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import http = require("http");
import { post } from "request";
import { make_sign_string, encrypt_sign_string } from "../utils/sign";

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

export function http_get(host: string, port: number, path: string, data: Object) {
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

export function http_post(host: string, port: number, path: string, data: Object) {
    // logger.debug(JSON.stringify(data).length);
    const opt = {
        host,
        port,
        path,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // "Content-Length": JSON.stringify(data).length,
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


/**
 * 定制的接口
 * @param url 
 * @param data 
 */
export function http_post_form_async(url: string, data: object, secret: string) {
    const time = Math.floor(Date.now() / 1000);
    const signStr = `${make_sign_string(data)}${time}${secret}`;
    const sign = encrypt_sign_string(signStr);
    const opt = {
        form: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "api-game-sign": `${sign},${time}`,
        },
    };

    return new Promise((resolve, reject) => {
        post(url, opt, function (error, response, body) {
            if (error) reject({});
            resolve(body);
        });
    })
};