import {Hono} from "hono";
import {serve} from "@hono/node-server";
import {cors} from "hono/cors";
import {initSocketIO} from "./socket.js";
import {abort, matchmake} from "./matchmaking.js";

const clientURL = process.env.PUBLIC_CLIENT_URL;
if (!clientURL) {
    throw new Error("invalid client url");
}

const app = new Hono();

const server = serve({
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000,
}, ({port}) => console.log(`Server listening on port ${port}...`));

initSocketIO(server, clientURL);

app.use("*", cors({
    origin: clientURL,
}));

app.post("/matchmaking/:id", matchmake);
app.delete("/matchmaking/:id", abort);
