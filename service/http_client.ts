import log4js from "../utils/log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////


function http_return(res, ret) {
    const str = JSON.stringify(ret);
    res.send(str);
}


export { http_return }
