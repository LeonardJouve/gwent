import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import {svelte} from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
    root: "src/client",
    plugins: [
        tsconfigPaths(),
        svelte(),
    ],
    server: {
        fs: {
            allow: ["./", "../shared"],
        },
    },
    build: {
        outDir: "../../dist/client",
    },
});
