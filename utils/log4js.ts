import { Log4js, configure } from "log4js";
const logId = process.env.NODE_APP_INSTANCE ? process.env.NODE_APP_INSTANCE : "0";
const log4js: Log4js = configure({
    pm2: true,
    disableClustering: true,
    appenders: {
        out: {
            type: "stdout"
        },
        server: {
            type: "dateFile",
            filename: `logs/${process.env.NODE_ENV}/${logId}`,
            pattern: "yyyy-MM-dd.log",
            category: "default",
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: {
            appenders: [
                "server",
                "out"
            ],
            level: "DEBUG"
        }
    }
});

export default log4js;

