"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerAbstract = void 0;
const express_1 = __importDefault(require("express"));
class ControllerAbstract {
    constructor() {
        this.router = express_1.default.Router();
    }
}
exports.ControllerAbstract = ControllerAbstract;
//# sourceMappingURL=controllerAbstract.js.map