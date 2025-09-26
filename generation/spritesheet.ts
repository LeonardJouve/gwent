import fs from "node:fs";
import path from "node:path";
import imageSize from "image-size";
import {createCanvas, loadImage} from "canvas";

const generateSpritesheet = async (assetsFolder: string): Promise<void> => {
    const assets = await fs.promises.readdir(assetsFolder, {withFileTypes: true});
    const folders = assets.filter((asset) => asset.isDirectory());

    for (const folder of folders) {
        console.log(`reading folder ${folder.name}`);

        const parentPath = path.join(assetsFolder, folder.name);
        const entries = await fs.promises.readdir(parentPath, {withFileTypes: true});
        const files = entries.filter((entry) => entry.isFile());

        if (!files.length) {
            continue;
        }

        const buffer = await fs.promises.readFile(path.join(parentPath, files[0].name));
        const dimensions = imageSize(buffer);

        const canvas = createCanvas(dimensions.width * files.length, dimensions.height);
        const ctx = canvas.getContext("2d");

        for (let i = 0; i < files.length; ++i) {
            const file = files[i];

            console.log(`reading image ${file.name}`);

            const image = await loadImage(path.join(parentPath, file.name));
            ctx.drawImage(image, dimensions.width * i, 0, dimensions.width, dimensions.height);
        }

        await fs.promises.writeFile(path.join(assetsFolder, `${folder.name}.png`), canvas.toBuffer("image/png"));

        console.log(`created spritesheet for ${folder.name}`);
    }
};

generateSpritesheet("./static/assets/img/lg");

const getDefaultCSS = (spritesheetWidth: number, spritesheetHeight: number, cardWidth: number, cardHeight: number): string => `
[class^="icon-"] {
    background-image: url("/spritesheet.png");
    background-size: calc(100% * ${spritesheetWidth} / ${cardWidth}) calc(100% * ${spritesheetHeight} / ${cardHeight});
    aspect-ratio: calc(${cardWidth} / ${cardHeight});
}`;

const getCardCSS = (name: string, i: number): string => `
.icon-${path.parse(name).name} {
    background-position: calc(${i + 1} * 100%) 0px;
}`;

// const generateCSS = (coordinates: Record<string, Coordinate>): void => {
//     fs.writeFileSync(
//         "./public/style.css",
//         Object.entries(coordinates)
//             .map(([name, coordinate]) => getCSS(name, coordinate))
//             .join("\n"),
//     );
// };

// import fs from "node:fs";
// import path from "node:path";
// import Spritesmith from "spritesmith";

// Spritesmith.run(
//   {
//     src: [
//       "./public/1.jpg",
//       "./public/2.jpg",
//       "./public/3.jpg",
//       "./public/4.jpg",
//     ],
//     algorithm: "left-right",
//   },
//   function handleResult(err, result) {
//     if (err) {
//       throw err;
//     }

//     fs.writeFileSync("./public/spritesheet.png", result.image);
//     generateCSS(result);
//   }
// );

// const generateCSS = (result: Spritesmith.SpritesmithResult<Buffer>) => {
//   fs.writeFileSync(
//     "./" + "public/style.css",
//     [
//       `
// [class^="icon-"] {
//     --spritesheet_width: ${result.properties.width};
//     --spritesheet_height: ${result.properties.height};
//     --card_width: ${Object.values(result.coordinates)[0]?.width ?? 0};
//     --card_height: ${Object.values(result.coordinates)[0]?.height ?? 0};
//     background-image: url("/spritesheet.png");
//     background-size: calc(100% * var(--spritesheet_width) / var(--card_width)) calc(100% * var(--spritesheet_height) / var(--card_height));
//     aspect-ratio: calc(var(--card_width) / var(--card_height));
// }`,
//     ]
//       .concat(
//         Object.entries(result.coordinates).map(
//           ([name], i) => `
// .icon-${path.parse(name).name} {
//     background-position: calc(${i + 1} * 100%) 0px;
// }`
//         )
//       )
//       .join("\n")
//   );
// };
