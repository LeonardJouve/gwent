import {Hono} from "hono";
import {serve} from "@hono/node-server";
import {initSocketIO} from "./socket";
import {abort, matchmake} from "./matchmaking";

const app = new Hono();
const server = serve({
    fetch: app.fetch,
    port: Number(process.env.SOCKET_PORT) || 3000,
}, ({port}) => console.log(`Socket server listening on port ${port}...`));

initSocketIO(server);

app.get("/matchmaking/:id", matchmake);
app.delete("/matchmaking/:id", abort);
