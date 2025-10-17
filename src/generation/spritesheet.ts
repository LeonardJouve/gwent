import fs from "node:fs";
import path from "node:path";
import {createCanvas, loadImage, type Canvas, type Image} from "canvas";
import {imageSize} from "image-size";
import type {ISize} from "image-size/types/interface";
import {generateCSS} from "./css.js";

type ImageGenerator = (file: fs.Dirent<string>, imagePath: string, dimensions: ISize) => Promise<Image|Canvas>;

type GenerateSpritesheetsOptions = {
    assetsFolder: string;
    outputImageFolder: string;
    outputCSSFolder: string;
    spritesheetURL: string;
    generateImage?: ImageGenerator;
};
export const generateSpritesheets = async ({assetsFolder, outputImageFolder, outputCSSFolder, spritesheetURL, generateImage}: GenerateSpritesheetsOptions): Promise<void> => {
    const assets = await fs.promises.readdir(assetsFolder, {withFileTypes: true});
    const folders = assets.filter((asset) => asset.isDirectory());

    for (const folder of folders) {
        generateSpritesheet({
            folder,
            outputImage: path.join(outputImageFolder, `${folder.name}.png`),
            outputCSS: path.join(outputCSSFolder, `${folder.name}.css`),
            spritesheetURL: `${spritesheetURL}/${folder.name}.png`,
            generateImage,
        });
    }
};

type GenerateSpritesheetOptions = {
    folder: fs.Dirent<string>;
    outputImage: string;
    outputCSS: string;
    spritesheetURL: string;
    generateImage?: ImageGenerator;
};
const generateSpritesheet = async ({folder, outputImage, outputCSS, spritesheetURL, generateImage = generateDefaultImage}: GenerateSpritesheetOptions): Promise<void> => {
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
        const file = files[i];
        const imagePath = path.join(parentPath, file.name);

        const image = await generateImage(file, imagePath, dimensions);
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

    const parent = path.parse(folder.parentPath).name;

    console.log("generating css");
    generateCSS({
        spritesheetDimensions,
        cardDimensions: dimensions,
        names: imageNames,
        output: outputCSS,
        spritesheetURL,
        prefix: `${parent}-${folder.name}`,
    });
};

const generateDefaultImage = (_file: fs.Dirent<string>, imagePath: string): Promise<Image|Canvas> => loadImage(imagePath);
