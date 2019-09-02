import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
/**
 * 数据库基本操作
 */
import mysql = require("mysql");
const pools = {};   // 连接池

//连接池索引
enum DB_AREA {
    ACCOUNT_DB,     // 账户，登陆数据库
    USER_DB,        // 用户其他信息数据库
    GAME_DB,
    MATCH_DB,
    // 具体游戏数据库
    GAME_DB_SANGUOZHAN,

    // 撮合系统数据库
    CARD_DB_QUICK,  // 快速开始
}


const DB_TYPE = {
    DB_FORK: 'fork',
    DB_CLUSTER: 'cluster'
}

const CLUSTER_CONFIG = {
    removeNodeErrorCount: 9,
    defaultSelector: 'ORDER'
}


function add_to_pool(area: number, config) {
    logger.info("database config ==>", area, config);
    let pool = null;
    if (config.dbtype == DB_TYPE.DB_FORK) {
        pool = mysql.createPool(config.config);
    }
    if (config.dbtype == DB_TYPE.DB_CLUSTER) {
        pool = mysql.createPoolCluster(CLUSTER_CONFIG);
        for (let name in config.config) {
            pool.add(name, config.config[name]);
        }
    }
    pools[area] = pool;
}


///////////////////////////////////////////内部接口封装////////////////////////////////////////////////////
/**
 * 不带参数promise查询
 * @param {*} area 
 * @param {*} sql 
 */
function query_async(area: number, sql: string): Promise<any> {
    logger.debug("SQL: ", sql);
    return new Promise((resolve, reject) => {
        pools[area].getConnection((err_conn, connection) => {
            if (err_conn) {
                logger.error("query_async get connection ERROR:", err_conn);
                resolve(false);
            } else {
                connection.query(sql, (err_query, rows: any) => {
                    connection.release();
                    if (err_query) {
                        logger.error("query_async query ERROR:", err_query);
                        resolve(false);
                    } else {
                        resolve(rows);
                    }
                });
            }
        });
    });
}

/**
 * promise调用存储过程
 * @param {*} area 
 * @param {*} proc_name 
 * @param {*} params 
 */
// exports.call_proc_async = function (area, proc_name, params) {
//     return new Promise((resolve, reject) => {
//         pools[area].getConnection(function (err_conn, connection) {
//             if (err_conn) {
//                 logger.error(err_conn);
//                 resolve(false);
//             } else {
//                 const sql = 'call ' + proc_name + '(';
//                 for (let a in params) {
//                     if (a == params.length - 1) {
//                         sql += '?';
//                     } else {
//                         sql += '?,';
//                     }
//                 }
//                 sql += ');';
//                 logger.debug("SQL: ", sql);
//                 connection.query(sql, params, (err, rows) => {
//                     connection.release();
//                     if (err) {
//                         logger.error(err);
//                         resolve(false);
//                     } else {
//                         resolve(rows);
//                     }
//                 });
//             }
//         });
//     });
// }
///////////////////////////////////////////内部接口封装结束/////////////////////////////////////////////////


export { query_async, add_to_pool, DB_AREA }
