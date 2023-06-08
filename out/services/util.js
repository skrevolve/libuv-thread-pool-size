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
exports.goPbkdf2 = void 0;
const crypto_1 = require("crypto");
const winston_1 = require("../utils/winston");
const goPbkdf2 = () => __awaiter(void 0, void 0, void 0, function* () {
    const start = Date.now();
    for (let i = 0; i < 10; i++) {
        (0, crypto_1.pbkdf2)('a', 'b', 100000, 512, 'sha512', () => __awaiter(void 0, void 0, void 0, function* () {
            const time = Date.now() - start;
            winston_1.logger.info(time);
        }));
    }
    return true;
});
exports.goPbkdf2 = goPbkdf2;
//# sourceMappingURL=util.js.map