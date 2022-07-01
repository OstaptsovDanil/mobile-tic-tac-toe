import Koa from 'Koa';
import Router from '@koa/router';
import {v4 as uuidv4} from 'uuid';

const app = new Koa();
const router = new Router();

const players: Record<string, string> = {};

const playerQueue: string[] = [];

router.post('/register', ctx => {
    const newPlayerId = uuidv4();

    playerQueue.push(newPlayerId);

    ctx.body = newPlayerId;
})

app.use(router.routes());

app.listen(3000);