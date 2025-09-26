import fs from "node:fs";
import path from "node:path";
import imageSize from "image-size";
import {createCanvas, loadImage} from "canvas";

const generateSpritesheet = async (folder: string): Promise<void> => {
    const folders = await fs.promises.readdir(folder, {withFileTypes: true});

    console.log(folders.filter((f) => f.isDirectory()));

    folders
        .filter((f) => f.isDirectory())
        .map(async (directory) => {
            const parentPath = path.join(folder, directory.name);
            const entries = await fs.promises.readdir(parentPath, {withFileTypes: true});
            const files = entries.filter(({isFile}) => isFile());

            if (!files.length) {
                return;
            }

            const buffer = await fs.promises.readFile(path.join(parentPath, files[0].name));
            const dimensions = imageSize(buffer);
            const canvas = createCanvas(dimensions.width * files.length, dimensions.height);
            const ctx = canvas.getContext("2d");

            await Promise.all(files.map(async (file, i) => {
                const image = await loadImage(path.join(parentPath, file.name));
                ctx.drawImage(image, dimensions.width * i, 0, dimensions.width, dimensions.height);
            }));

            await fs.promises.writeFile("./output/card.png", canvas.toBuffer("image/png"), {encoding: "utf-8"});
        });
};

generateSpritesheet("./static/assets/img/lg");


// Spritesmith.run(
//     {
//         src: [
//             "./public/1.jpg",
//             "./public/2.jpg",
//             "./public/3.jpg",
//             "./public/4.jpg",
//         ],
//     },
//     (err, result): void => {
//         // If there was an error, throw it
//         if (err) {
//             throw err;
//         }

//         // Output the image
//         fs.writeFileSync("./public/spritesheet.png", result.image);
//         generateCSS(result.coordinates); // Coordinates and properties
//     },
// );

// type Coordinate = {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
// };

// const getCSS = (name: string, coordinate: Coordinate): string => `
// .icon-${path.parse(name).name} {
//     background-image: url("/spritesheet.png");
//     background-position: ${coordinate.x}px ${coordinate.y}px;
//     width: ${coordinate.width}px;
//     height: ${coordinate.height}px;
// }`;

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
