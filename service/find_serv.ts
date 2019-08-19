import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import Express = require("express");
import { Server_info } from "./api_find";
import { http_return, http_get } from "./http_client"
import { create_server_info } from "../manager/server_mgr";
import { get_user_amount } from "../manager/user_mgr";
import bodyParser = require('body-parser')
const app = Express();
app.use(bodyParser.json());
const SERVER_INFO: Server_info = { server_type: "", server_id: "", tick_time: 0, http_ip: "", http_port: 0, ws_ip: "", ws_port: 0, load: 0, memory: "" };

function start(http_ip: string, http_port: number) {
    //设置跨域访问
    app.all('*', (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", ' 3.2.1')
        res.header("Content-Type", "application/json;charset=utf-8");
        logger.debug("[%s] %s => %s", req.method, req.path, JSON.stringify(req.body));
        next();
    });

    app.listen(http_port, http_ip);
    logger.info("Find Server Running at %s:%s", http_ip, http_port);
}

function report(server_info: Server_info, find_ip: string, find_port: number, find_tick_time: number) {
    Object.assign(SERVER_INFO, server_info);
    create(find_ip, find_port, find_tick_time);
}

function create(find_ip: string, find_port: number, find_tick_time: number) {
    const now = Date.now();
    if (now > SERVER_INFO.tick_time + find_tick_time) {
        SERVER_INFO.tick_time = now;
        SERVER_INFO.load = get_user_amount();
        const mem = process.memoryUsage();
        SERVER_INFO.memory = JSON.stringify({
            heapTotal: mem_format(mem.heapTotal),
            heapUsed: mem_format(mem.heapUsed),
            rss: mem_format(mem.rss)
        })
        // logger.debug("load:%s memory:%s", SERVER_INFO.load, SERVER_INFO.memory);
        http_get(find_ip, find_port, "/create", SERVER_INFO);
    }
    setTimeout(create, 2000, find_ip, find_port, find_tick_time);
}

app.get("/create", (req, res) => {
    const server_info: Server_info = req.body;
    create_server_info(server_info);
    http_return(res, {});
})

function mem_format(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + 'MB';
};

export { start as find_serv_start, report as serv_report }
