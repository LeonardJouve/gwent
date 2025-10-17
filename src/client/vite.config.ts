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
        proxy: {
            "/": {
                target: "http://localhost:3000",
                changeOrigin: true,
                ws: true,
                bypass: ({url}) => {
                    if (url?.startsWith("/matchmaking") || url?.startsWith("/socket.io")) {
                        return;
                    }

                    return url;
                },
            },
        },
    },
    build: {
        outDir: "../../dist/client",
    },
});
