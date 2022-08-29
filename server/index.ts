import Koa from 'koa';
import Router from '@koa/router';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();

interface MessageMove {
  type: 'move';
  move: [number, number];
};

interface MessageFirstMove {
  type: 'first-move';
}

interface MessageError {
  type: 'error';
  error: string;
}

type Message = MessageMove | MessageFirstMove | MessageError;

interface ServerPlayer {
  opponent: string;
  pendingMessages: Message[];
};

export interface ServerState {
  status: 'pending' | 'started',
  message: Message[];
};

const playersQueue: string[] = [];

/**
 * {
 *   'player1': { opponent: 'player2', pendingMessages: [] },
 *   'player2': { opponent: 'player1', pendingMessages: [] },
 * }
 */
const players: Record<string, ServerPlayer> = {};

function pairPlayers() {
  if (playersQueue.length < 2) {
    return;
  }

  const player1 = playersQueue.shift();
  const player2 = playersQueue.shift();
  if (!player1 || !player2) {
    throw new Error('Invalid players queue');
  }

  players[player1] = {
    opponent: player2,
    pendingMessages: [],
  };
  players[player2] = {
    opponent: player1,
    pendingMessages: [],
  };

  const firstPlayer = Math.random() > 0.5 ? player1 : player2;
  players[firstPlayer].pendingMessages.push({ type: 'first-move' });
}

const PAIR_PLAYERS_EVERY_MS = 250;

setInterval(pairPlayers, PAIR_PLAYERS_EVERY_MS);

// POST /register - регистрирует на сервере
router.post('/register', ctx => {
  const newPlayerId = uuidv4();
  playersQueue.push(newPlayerId);
  ctx.body = newPlayerId;
});

// GET /:playerId/state - возвращает сообщения от противника
router.get('/:playerId/state', ctx => {
  const serverPlayer = players[ctx.params.playerId];
  if (!serverPlayer) {
    ctx.body = { status: 'pending' };
    return;
  }

  ctx.body = {
    status: 'started',
    messages: serverPlayer.pendingMessages.splice(0),
  };
});

// POST /:playerId/message - отправляет сообщение противнику
router.post('/:playerId/message', ctx => {
  const serverPlayer = players[ctx.params.playerId];
  const message: Message = ctx.request.body;
  players[serverPlayer.opponent].pendingMessages.push(message);
  ctx.status = 200;
});

app.use(bodyParser());
app.use(router.routes());
app.listen(3000);