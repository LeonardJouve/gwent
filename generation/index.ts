import path from "node:path";
import type fs from "node:fs";
import type {ISize} from "image-size/types/interface";
import {generateSpritesheets} from "./spritesheet";
import cards from "../shared/cards";
import {generateCard} from "./cards";
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
        iconsFolder: "./static/assets/img/icons",
    });
};

generateSpritesheets({
    assetsFolder: "./static/assets/img/lg",
    outputImageFolder: "./static/assets/img/generated/lg",
    outputCSSFolder: "./src/lib/css/generated/lg",
    spritesheetURL: "/assets/img/generated/lg",
});
generateSpritesheets({
    assetsFolder: "./static/assets/img/sm",
    outputImageFolder: "./static/assets/img/generated/sm",
    outputCSSFolder: "./src/lib/css/generated/sm",
    spritesheetURL: "/assets/img/generated/sm",
    generateImage: generateSMCard,
});
