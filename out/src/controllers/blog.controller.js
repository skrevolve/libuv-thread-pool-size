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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const controllerAbstract_1 = require("../controllerAbstract");
const util_1 = require("../../services/util");
class BlogController extends controllerAbstract_1.ControllerAbstract {
    constructor() {
        super();
        this.router.get("/", this.test.bind(this));
    }
    test(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, util_1.goPbkdf2)();
                return res.status(200).send({
                    status: 200,
                });
            }
            catch (e) {
                return res.status(500).send({
                    status: 500,
                });
            }
        });
    }
}
exports.BlogController = BlogController;
//# sourceMappingURL=blog.controller.js.map