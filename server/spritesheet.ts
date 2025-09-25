import fs from "node:fs";
import path from "node:path";
import Spritesmith from "spritesmith";

Spritesmith.run(
    {
        src: [
            "./public/1.jpg",
            "./public/2.jpg",
            "./public/3.jpg",
            "./public/4.jpg",
        ],
    },
    (err, result): void => {
        // If there was an error, throw it
        if (err) {
            throw err;
        }

        // Output the image
        fs.writeFileSync("./public/spritesheet.png", result.image);
        generateCSS(result.coordinates); // Coordinates and properties
    },
);

type Coordinate = {
    x: number;
    y: number;
    width: number;
    height: number;
};

const getCSS = (name: string, coordinate: Coordinate): string => `
.icon-${path.parse(name).name} {
    background-image: url("/spritesheet.png");
    background-position: ${coordinate.x}px ${coordinate.y}px;
    width: ${coordinate.width}px;
    height: ${coordinate.height}px;
}`;

const generateCSS = (coordinates: Record<string, Coordinate>): void => {
    fs.writeFileSync(
        "./public/style.css",
        Object.entries(coordinates)
            .map(([name, coordinate]) => getCSS(name, coordinate))
            .join("\n"),
    );
};
