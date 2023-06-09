import * as crypto from 'crypto'
import { ControllerAbstract } from '../controllerAbstract'
import { Request, Response } from "express"
import { logger } from '../../utils/winston'

export class BlogController extends ControllerAbstract {

    constructor() {
        super()
        this.router.get("/test", this.doAsyncIO.bind(this))
    }

    private async doAsyncIO(req: Request, res: Response) {
        try {

            const start = Date.now()

            for (let i=0; i<10; i++) {
                crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
                    const time = Date.now() - start
                    logger.info(time)
                })
            }

            return res.status(200).send("done")

        } catch(e) {

            return res.status(500).send()
        }
    }
}