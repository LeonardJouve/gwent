import fs from "node:fs";
import path from "node:path";
import {createCanvas, loadImage} from "canvas";
import imageSize from "image-size";
import type {ISize} from "image-size/types/interface";

type GenerateSpritesheetsOptions = {
    assetsFolder: string;
    outputImageFolder: string;
    outputCSSFolder: string;
    spritesheetURL: string;
};
export const generateSpritesheets = async ({assetsFolder, outputImageFolder, outputCSSFolder, spritesheetURL}: GenerateSpritesheetsOptions): Promise<void> => {
    const assets = await fs.promises.readdir(assetsFolder, {withFileTypes: true});
    const folders = assets.filter((asset) => asset.isDirectory());

    for (const folder of folders) {
        generateSpritesheet({
            folder,
            outputImage: path.join(outputImageFolder, `${folder.name}.png`),
            outputCSS: path.join(outputCSSFolder, `${folder.name}.css`),
            spritesheetURL: `${spritesheetURL}/${folder.name}.png`,
        });
    }
};

type GenerateSpritesheetOptions = {
    folder: fs.Dirent<string>;
    outputImage: string;
    outputCSS: string;
    spritesheetURL: string;
};
const generateSpritesheet = async ({folder, outputImage, outputCSS, spritesheetURL}: GenerateSpritesheetOptions): Promise<void> => {
    const parentPath = path.join(folder.parentPath, folder.name);

    console.log(`reading folder ${folder.name}`);
    const entries = await fs.promises.readdir(parentPath, {withFileTypes: true});
    const files = entries.filter((entry) => entry.isFile() && path.parse(entry.name).ext === ".jpg");

    if (!files.length) {
        return;
    }

    const buffer = await fs.promises.readFile(path.join(parentPath, files[0].name));
    const dimensions = imageSize(buffer);

    const canvas = createCanvas(dimensions.width * files.length, dimensions.height);
    const ctx = canvas.getContext("2d");

    for (let i = 0; i < files.length; ++i) {
        const image = await loadImage(path.join(parentPath, files[i].name));
        ctx.drawImage(image, dimensions.width * i, 0, dimensions.width, dimensions.height);
    }

    console.log("generating spritesheet image from canvas");
    const canvasImage = canvas.toBuffer("image/png");

    console.log("creating spritesheet");
    await fs.promises.mkdir(path.dirname(outputImage), {recursive: true});
    await fs.promises.writeFile(outputImage, canvasImage);

    const spritesheetDimensions = {
        width: dimensions.width * files.length,
        height: dimensions.height,
    };
    const imageNames = files.map((file) => path.parse(file.name).name);

    console.log("generating css");
    generateCSS({
        spritesheetDimensions,
        cardDimensions: dimensions,
        names: imageNames,
        output: outputCSS,
        spritesheetURL,
        prefix: folder.name,
    });
};

type GenerateCSSOptions = {
    spritesheetDimensions: ISize;
    cardDimensions: ISize;
    names: string[];
    output: string;
    spritesheetURL: string;
    prefix: string;
};
const generateCSS = async ({spritesheetDimensions, cardDimensions, names, output, spritesheetURL, prefix}: GenerateCSSOptions): Promise<void> => {
    await fs.promises.mkdir(path.dirname(output), {recursive: true});
    return fs.promises.writeFile(
        output,
        getDefaultCSS(prefix, spritesheetDimensions, cardDimensions, spritesheetURL)
            .concat(names
                .map((name, i) => getCardCSS(prefix, name, i))
                .join("\n")),
    );
};

const getDefaultCSS = (prefix: string, spritesheetDimensions: ISize, cardDimensions: ISize, spritesheetURL: string): string => `
[class^="${prefix}-"] {
    background-image: url(${spritesheetURL});
    background-size:
        calc(100% * ${spritesheetDimensions.width} / ${cardDimensions.width})
        calc(100% * ${spritesheetDimensions.height} / ${cardDimensions.height});
    aspect-ratio: calc(${cardDimensions.width} / ${cardDimensions.height});

    &.width {
        width: 100%;
    }

    &.height {
        height: 100%;
    }
}
`;

const getCardCSS = (prefix: string, name: string, i: number): string => `
.${prefix}-${path.parse(name).name.replaceAll("_", "-")} {
    background-position: calc(${-i} * 100%) 0px;
}`;

generateSpritesheets({
    assetsFolder: "./static/assets/img/lg",
    outputImageFolder: "./static/assets/img/lg",
    outputCSSFolder: "./static/assets/css/lg",
    spritesheetURL: "/assets/img/lg",
});
generateSpritesheets({
    assetsFolder: "./static/assets/img/sm",
    outputImageFolder: "./static/assets/img/sm",
    outputCSSFolder: "./static/assets/css/sm",
    spritesheetURL: "/assets/img/lg",
});
