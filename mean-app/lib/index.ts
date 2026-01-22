import App from './app';
import PostController from './modules/controllers/post.controller';
import UserController from './modules/controllers/user.controller';

const app = new App([
    new PostController(),
    new UserController(),
]);

app.listen();