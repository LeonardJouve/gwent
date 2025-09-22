import type {Context, Handler} from "hono";
import type {BlankInput} from "hono/types";
import Match from "./match";
import type {SocketData} from "../shared/types/socket";
import {type Deck, DeckSchema} from "../shared/types/deck";

type QueueItem = Deck & {
    id: string;
    resolve: (data: Response) => void;
    context: Context<never, "/matchmaking/:id", BlankInput>;
};

class Queue {
    private items: QueueItem[];

    constructor() {
        this.items = [];
    }

    enqueue(item: QueueItem): void {
        this.items.push(item);
    }

    dequeue(): QueueItem|null {
        return this.items.shift() ?? null;
    }

    size(): number {
        return this.items.length;
    }

    remove(id: QueueItem["id"]): void {
        this.items = this.items.filter((item) => id !== item.id);
    }

    contains(id: QueueItem["id"]): boolean {
        return this.items.find((item) => item.id === id) !== undefined;
    }
}

const queue = new Queue();

const tryStartGame = (): void => {
    if (queue.size() < 2) {
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const players = [queue.dequeue()!, queue.dequeue()!];
    const match = new Match(players.map(({resolve: _resolve, context: _context, ...data}) => data));
    Match.matches.set(match.id, match);

    players.forEach(({resolve, context, ...data}) => {
        resolve(context.json({
            matchId: match.id,
            id: data.id,
        } satisfies SocketData, {status: 200}));
    });
};


export const matchmake: Handler<never, "/matchmaking/:id"> = async (context) => {
    // TODO: get user id from account
    const id = context.req.param("id");

    if (queue.contains(id)) {
        return context.json({error: "already in the queue"}, {status: 400});
    }

    try {
        const body = await context.req.json();
        const deck = DeckSchema.parse(body);

        return await new Promise<Response>((resolve) => {
            const item: QueueItem = {
                id,
                resolve,
                context,
                ...deck,
            };

            queue.enqueue(item);

            tryStartGame();
        });
    } catch (_) {
        return context.json({error: "invalid body"}, 400);
    }
};

export const abort: Handler<never, "/matchmaking/:id"> = (context) => {
    const id = context.req.param("id");

    if (!queue.contains(id)) {
        return context.json({error: "not in the queue"}, {status: 400});
    }

    queue.remove(id);

    return context.json({message: "ok"}, {status: 200});
};

