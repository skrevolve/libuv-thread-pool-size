"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = exports.logger = void 0;
const winston_1 = __importStar(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const { combine, timestamp, printf } = winston_1.format;
const customFormat = printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});
exports.logger = winston_1.default.createLogger({
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), customFormat),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_daily_rotate_file_1.default({
            level: "info",
            datePattern: "YYYY-MM-DD",
            dirname: "./logs",
            filename: `%DATE%.info.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
        new winston_daily_rotate_file_1.default({
            level: "error",
            datePattern: "YYYY-MM-DD",
            dirname: "./logs",
            filename: `%DATE%.error.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
});
exports.stream = {
    write: (message) => {
        if (message.includes("/")) {
            exports.logger.info(message.substring(0, message.lastIndexOf("\n")));
        }
    }
};
//# sourceMappingURL=winston.js.map