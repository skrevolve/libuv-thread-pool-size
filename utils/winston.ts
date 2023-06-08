import winston, { format } from "winston"
import winstonDaily from "winston-daily-rotate-file"

const { combine, timestamp, printf } = format

const customFormat = printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`
})

export const logger = winston.createLogger({
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), customFormat),
    transports: [
        new winston.transports.Console(),

        new winstonDaily({
            level: "info",
            datePattern: "YYYY-MM-DD",
            dirname: "./logs",
            filename: `%DATE%.info.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),

        new winstonDaily({
            level: "error",
            datePattern: "YYYY-MM-DD",
            dirname: "./logs",
            filename: `%DATE%.error.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
})

export const stream = {
    write: (message: string) => {
        if(
            message.includes("/")
        ) {
            logger.info(message.substring(0, message.lastIndexOf("\n")))
        }
    }
}