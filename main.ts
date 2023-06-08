import { App } from "./src/app"
import { BlogController } from "./src/controllers/blog.controller"

const app = new App(
    [
        new BlogController(),
    ],
    8080
);

app.listen()