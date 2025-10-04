import {createCanvas, loadImage, type Canvas} from "canvas";
import type {ISize} from "image-size/types/interface";
import type {CardData, UnitCardData} from "../shared/types/card";
import path from "node:path";
import fs from "node:fs";
import imageSize from "image-size";

type GenerateCardOptions = {
    imagePath: string;
    iconsFolder: string;
    dimensions: ISize;
    card: CardData;
};
export const generateCard = async ({imagePath, dimensions, iconsFolder, card}: GenerateCardOptions): Promise<Canvas> => {
    const canvas = createCanvas(dimensions.width, dimensions.height);
    const ctx = canvas.getContext("2d");

    const image = await loadImage(imagePath);
    ctx.drawImage(image, 0, 0, dimensions.width, dimensions.height);

    const padding = 5;

    const power = getPower(card);
    if (power) {
        const powerPath = path.join(iconsFolder, `${power}.png`);

        const buffer = await fs.promises.readFile(powerPath);
        const powerDimensions = imageSize(buffer);

        const scale = 0.7;
        const width = dimensions.width * scale;
        const height = powerDimensions.height / powerDimensions.width * width;
        const x = dimensions.width * -0.04;
        const y = dimensions.height * -0.022;

        const powerImage = await loadImage(powerPath);
        ctx.drawImage(powerImage, x, y, width, height);
    }

    const isUnit = card.type === "unit" && !card.abilities.includes("decoy");
    if (isUnit) {
        const rowPath = path.join(iconsFolder, `card_row_${getRow(card)}.png`);

        const buffer = await fs.promises.readFile(rowPath);
        const rowDimensions = imageSize(buffer);

        const scale = 0.33;
        const width = dimensions.width * scale;
        const height = rowDimensions.height / rowDimensions.width * width;
        const x = dimensions.width - width - padding;
        const y = dimensions.height - height - padding;

        const rowImage = await loadImage(rowPath);
        ctx.drawImage(rowImage, x, y, width, height);
    }

    const ability = getAbility(card);
    if (ability) {
        const abilityPath = path.join(iconsFolder, `${ability}.png`);

        const buffer = await fs.promises.readFile(abilityPath);
        const abilityDimensions = imageSize(buffer);

        const scale = 0.33;
        const width = dimensions.width * scale;
        const height = abilityDimensions.height / abilityDimensions.width * width;
        let x = dimensions.width - width - padding;
        if (isUnit) {
            x -= width + padding;
        }
        const y = dimensions.height - height - padding;

        const abilityImage = await loadImage(abilityPath);
        ctx.drawImage(abilityImage, x, y, width, height);
    }

    return canvas;
};

const getPower = (card: CardData): string|null => {
    if (card.type === "leader") {
        return null;
    }

    if (card.abilities.includes("hero")) {
        return "power_hero";
    }

    if (card.type !== "unit") {
        return "power_" + card.abilities[0];
    }

    return "power_normal";
};

const getAbility = (card: CardData): string|null => {
    if (card.type !== "unit" || !card.abilities.filter((ability) => ability !== "hero").length) {
        return null;
    }

    let abilityName = card.abilities[card.abilities.length - 1];
    if (abilityName.startsWith("avenger")) {
        abilityName = "avenger";
    } else if (abilityName.startsWith("scorch")) {
        abilityName = "scorch";
    }

    return "card_ability_" + abilityName;
};

const getRow = (card: UnitCardData): string => {
    if (card.abilities.includes("agile")) {
        return "agile";
    }

    if (!card.rows.length) {
        throw new Error(`card ${card.name} has no row`);
    }

    return card.rows[0];
};
