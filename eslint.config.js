import {includeIgnoreFile} from "@eslint/compat";
import js from "@eslint/js";
import personal from "eslint-config-leonardjouve";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import {fileURLToPath} from "node:url";
import ts from "typescript-eslint";
import svelteConfig from "./svelte.config.js";

export default ts.config(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    includeIgnoreFile(fileURLToPath(new URL("./.gitignore", import.meta.url))),
    js.configs.recommended,
    ...ts.configs.recommended,
    personal.configs.recommended,
    ...svelte.configs.recommended,
    {
        languageOptions: {
            globals: {...globals.browser, ...globals.node},
        },
        rules: {
            // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
            // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
            "no-undef": "off",
        },
    },
    {
        files: [
            "**/*.svelte",
            "**/*.svelte.ts",
            "**/*.svelte.js",
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
                extraFileExtensions: [".svelte"],
                parser: ts.parser,
                svelteConfig,
            },
        },
    },
);
