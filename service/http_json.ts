import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import http = require("http");

export function http_post_async(host: string, port: number, path: string, data: any) {
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

    return new Promise((resolve, reject) => {
        const req = http.request(opt, function (res) {
            res.setEncoding("utf-8");
            res.on("data", function (chunk) {
                resolve(JSON.parse(chunk));
            });
        });

        req.on("error", function (err) {
            logger.warn(err.message);
            reject({});
        });
        req.write(JSON.stringify(data));
        req.end();
    })
};
