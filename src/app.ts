import express from "express"
import compression from "compression"
import cors from "cors"
import timeout from "connect-timeout"
import bodyParser from "body-parser"
import http from "http"
import { ControllerAbstract } from "./controllerAbstract"
import OS from "os"
import morgan from "morgan"
import { logger, stream } from "../utils/winston"

export class App {
    readonly app: express.Application
    readonly port: number
    private isDisableKeepAlive: boolean = false

    constructor(controllers: ControllerAbstract[], port: number) {
        this.app = express()
        this.port = port
        this.initMiddlewares()
        this.initControllers(controllers)
    }

    private initMiddlewares() {
        this.app.use(compression())
        this.app.use(cors())
        this.app.use(timeout("30s"))
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(morgan(
            '[:method][:url] :remote-addr "HTTP/:http-version" :status :res[content-length] ":user-agent" :response-time ms',
            {stream}
        ))
    }

    private async initControllers(controllers: ControllerAbstract[]) {

        this.app.use((req, res, next) => {
            if (this.isDisableKeepAlive) res.set('Connection', 'close')
            next()
        })

        controllers.forEach((controller) => {
            this.app.use("/", controller.router)
        })

        this.app.all("*", (req, res) => {
            res.status(404).send()
        })
    }

    public listen() {
        const app = http.createServer(this.app)

        app.listen(this.port, () => {
            if (process.send) process.send('ready')
            logger.info('OS cpu length : ' + OS.cpus().length)
            logger.info('UV_THREADPOOL_SIZE : ' + process.env.UV_THREADPOOL_SIZE)
            // console.log(OS.cpus())
            console.log('\x1b[32m%s\x1b[0m', `http App listening on the port ${this.port}`)
        })

        process.on('SIGINT', () => {
            this.isDisableKeepAlive = true
            app.close(() => {
                process.exit(0)
            })
        })
    }
}