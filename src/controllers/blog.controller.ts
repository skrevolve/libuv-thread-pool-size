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

            for (let i=0; i<2; i++) {
                crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', (err) => {
                    if (err) throw err;
                    logger.info(`pbkdf2 done: ${Date.now() - start}`)
                })
            }

            return res.status(200).send("ok")

        } catch(e) {

            return res.status(500).send('err')
        }
    }
}