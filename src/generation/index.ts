import path from "node:path";
import type fs from "node:fs";
import type {ISize} from "image-size/types/interface";
import {generateSpritesheets} from "./spritesheet.js";
import cards from "@shared/cards.js";
import {generateCard} from "./cards.js";
import type {Canvas, Image} from "canvas";

const generateSMCard = (file: fs.Dirent<string>, imagePath: string, dimensions: ISize): Promise<Image|Canvas> => {
    const {name} = path.parse(file.name);
    const card = cards.find(({filename}) => filename === name);
    if (!card) {
        throw new Error(`could not find card with filename: ${name}`);
    }

    return generateCard({
        imagePath,
        dimensions,
        card,
        iconsFolder: "./src/client/public/assets/img/icons",
    });
};

generateSpritesheets({
    assetsFolder: "./src/generation/assets/lg",
    outputImageFolder: "./src/client/public/assets/img/generated/lg",
    outputCSSFolder: "./src/client/css/generated/lg",
    spritesheetURL: "/assets/img/generated/lg",
});
generateSpritesheets({
    assetsFolder: "./src/generation/assets/sm",
    outputImageFolder: "./src/client/public/assets/img/generated/sm",
    outputCSSFolder: "./src/client/css/generated/sm",
    spritesheetURL: "/assets/img/generated/sm",
    generateImage: generateSMCard,
});
