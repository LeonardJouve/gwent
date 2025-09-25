import fs from "node:fs";
import {createCanvas, loadImage} from "canvas";

const generateCard = async (): Promise<void> => {
    const width = 600;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const background = await loadImage("./assets/background.jpg");
    const avatar = await loadImage("./assets/avatar.png");

    ctx.drawImage(background, 0, 0, width, height);
    ctx.drawImage(avatar, 50, 100, 150, 150);

    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Player Name", 250, 150);

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./output/card.png", buffer);
};

generateCard();
