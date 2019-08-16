import { Log4js, configure } from "log4js";
import config = require("../../config.json");
const log4js: Log4js = configure(config.log4js_config);

export default log4js;

