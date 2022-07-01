"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa_1 = __importDefault(require("Koa"));
const router_1 = __importDefault(require("@koa/router"));
const uuid_1 = require("uuid");
const app = new Koa_1.default();
const router = new router_1.default();
const players = {};
const playerQueue = [];
router.post('/register', ctx => {
    const newPlayerId = (0, uuid_1.v4)();
    playerQueue.push(newPlayerId);
    ctx.body = newPlayerId;
});
app.use(router.routes());
app.listen(3000);
