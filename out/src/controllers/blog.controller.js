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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const crypto = __importStar(require("crypto"));
const controllerAbstract_1 = require("../controllerAbstract");
const winston_1 = require("../../utils/winston");
class BlogController extends controllerAbstract_1.ControllerAbstract {
    constructor() {
        super();
        this.router.get("/test", this.doAsyncIO.bind(this));
    }
    doAsyncIO(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const start = Date.now();
                for (let i = 0; i < 10; i++) {
                    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
                        const time = Date.now() - start;
                        winston_1.logger.info(time);
                    });
                }
                return res.status(200).send("server: ok");
            }
            catch (e) {
                return res.status(500).send();
            }
        });
    }
}
exports.BlogController = BlogController;
//# sourceMappingURL=blog.controller.js.map