import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import Express = require("express");
import bodyParser = require("body-parser");
export const app = Express();
app.use(bodyParser.json());

export async function http_serv_start_async(http_ip: string, http_port: number) {
    logger.info("Http Service Running At:: %s:%s", http_ip, http_port);
    app.listen(http_port, http_ip, () => {
        app._router.stack.map(item => {
            if (item.route) logger.info('path: %s', item.route.path);
        })
    });
}

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    req.body.client_ip = get_client_ip(req);
    logger.debug("[%s] %s => %s", req.method, req.path, JSON.stringify(req.body))
    next();
});


function get_client_ip(req): string {
    let ipAddress: string;
    const headers = req.headers;
    const forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
    forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    if (ipAddress.indexOf("::ffff:") != -1) {
        ipAddress = ipAddress.substr(7);
    }
    return ipAddress;
}
