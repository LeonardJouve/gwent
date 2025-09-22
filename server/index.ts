import {Hono} from "hono";
import {serve} from "@hono/node-server";
import {cors} from "hono/cors";
import {initSocketIO} from "./socket";
import {abort, matchmake} from "./matchmaking";

const app = new Hono();

const server = serve({
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000,
}, ({port}) => console.log(`Server listening on port ${port}...`));

initSocketIO(server);

app.use("*", cors({
    origin: "http://localhost:5173",
}));

app.post("/matchmaking/:id", matchmake);
app.delete("/matchmaking/:id", abort);
