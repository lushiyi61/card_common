import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import Express = require("express");
import { Server_info } from "./api_find";
import { http_return } from "./http_client"
import { create_server_info, update_server_info } from "../manager/server_mgr";
import bodyParser = require('body-parser')
const app = Express();
app.use(bodyParser.json());


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

app.get("/create", (req, res) => {
    const server_info: Server_info = req.body;
    create_server_info(server_info);
    http_return(res, {});
})

app.get("/update", (req, res) => {
    const server_info: Server_info = req.body;
    update_server_info(server_info);
    http_return(res, {});
})



export { start as find_serv_start }
