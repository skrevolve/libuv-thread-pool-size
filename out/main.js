"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
const blog_controller_1 = require("./src/controllers/blog.controller");
const app = new app_1.App([
    new blog_controller_1.BlogController(),
], 8080);
app.listen();
//# sourceMappingURL=main.js.map