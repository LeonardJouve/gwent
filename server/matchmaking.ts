import type {Context, Handler} from "hono";
import type {BlankInput} from "hono/types";
import Match, {matches} from "./match";
import type {SocketData} from "../shared/types/socket";

interface QueueItem {
    id: string;
    resolve: (data: Response) => void;
    context: Context<never, "/matchmaking/:id", BlankInput>;
}

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

    const players = [queue.dequeue()!, queue.dequeue()!]; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    const match = new Match(players.map(({id}) => id));
    matches[match.id] = match;

    players.forEach((item) => {
        item.resolve(item.context.json({
            id: item.id,
            matchId: match.id,
        } satisfies SocketData, {status: 200}));
    });
};

export const matchmake: Handler<never, "/matchmaking/:id"> = async (context) => {
    const id = context.req.param("id");

    // TODO
    // name: string;
    // faction: FactionName;
    // leader: CardData;
    // deck: CardData[];

    if (queue.contains(id)) {
        return context.json({error: "already in the queue"}, {status: 400});
    }

    return await new Promise<Response>((resolve) => {
        const item: QueueItem = {
            id,
            resolve,
            context,
        };

        queue.enqueue(item);

        tryStartGame();
    });
};

export const abort: Handler<never, "/matchmaking/:id"> = (context) => {
    const id = context.req.param("id");

    if (!queue.contains(id)) {
        return context.json({error: "not in the queue"}, {status: 400});
    }

    queue.remove(id);

    return context.json({message: "ok"}, {status: 200});
};

