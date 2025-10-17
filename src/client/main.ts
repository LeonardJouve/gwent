import {mount} from "svelte";
import App from "./app.svelte";

const target = document.getElementById("app");
if (!target) {
    throw new Error("could not find target element for svelte");
}

const app = mount(App, {target});

export default app;
