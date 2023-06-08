import express from "express"

export abstract class ControllerAbstract {
    public readonly path
    public readonly router = express.Router()
}
