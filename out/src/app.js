"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const connect_timeout_1 = __importDefault(require("connect-timeout"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const os_1 = __importDefault(require("os"));
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = require("../utils/winston");
class App {
    constructor(controllers, port) {
        this.isDisableKeepAlive = false;
        this.app = (0, express_1.default)();
        this.port = port;
        this.initMiddlewares();
        this.initControllers(controllers);
    }
    initMiddlewares() {
        this.app.use((0, compression_1.default)());
        this.app.use((0, cors_1.default)());
        this.app.use((0, connect_timeout_1.default)("120s"));
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use((0, morgan_1.default)('[:method][:url] :remote-addr "HTTP/:http-version" :status :res[content-length] ":user-agent" :response-time ms', { stream: winston_1.stream }));
    }
    initControllers(controllers) {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.use((req, res, next) => {
                if (this.isDisableKeepAlive)
                    res.set('Connection', 'close');
                next();
            });
            controllers.forEach((controller) => {
                this.app.use("/", controller.router);
            });
            this.app.all("*", (req, res) => {
                res.status(404).send();
            });
        });
    }
    listen() {
        const app = http_1.default.createServer(this.app);
        app.listen(this.port, () => {
            if (process.send)
                process.send('ready');
            winston_1.logger.info('OS cpu length : ' + os_1.default.cpus().length);
            winston_1.logger.info('UV_THREADPOOL_SIZE : ' + process.env.UV_THREADPOOL_SIZE);
            // console.log(OS.cpus())
            console.log('\x1b[32m%s\x1b[0m', `http App listening on the port ${this.port}`);
        });
        process.on('SIGINT', () => {
            this.isDisableKeepAlive = true;
            app.close(() => {
                process.exit(0);
            });
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map