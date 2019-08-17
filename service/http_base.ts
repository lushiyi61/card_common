import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////

let LastTickTime = 0;


function start(app) {
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
}




// //向大厅服定时心跳
// function update(server_info: any, tick_time: number = 5000) {
//     const now = Date.now();
//     if (now > LastTickTime + tick_time) {
//         LastTickTime = now;
//         // gameServerInfo.load = user_mgr_base.get_user_amount();
//         const mem = process.memoryUsage();
//         server_info.memory = JSON.stringify({
//             heapTotal: mem_format(mem.heapTotal),
//             heapUsed: mem_format(mem.heapUsed),
//             rss: mem_format(mem.rss)
//         })
//         // logger.debug("load:%s memory:%s", gameServerInfo.load, gameServerInfo.memory);
//         // http_client.get(CONFIG.HALL_IP, CONFIG.HALL_PORT, "/register_gs", gameServerInfo, (ret, data) => {
//         //     if (ret && data.errcode != 0) {
//         //         logger.error(data.errmsg);
//         //     }
//         // });
//     }
// }

// function mem_format(bytes) {
//     return (bytes / 1024 / 1024).toFixed(2) + 'MB';
// };


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

export { start as http_base_start }
