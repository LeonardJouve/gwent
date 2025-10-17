import fs from "node:fs";
import path from "node:path";
import type {ISize} from "image-size/types/interface";

type GenerateCSSOptions = {
    spritesheetDimensions: ISize;
    cardDimensions: ISize;
    names: string[];
    output: string;
    spritesheetURL: string;
    prefix: string;
};
export const generateCSS = async ({spritesheetDimensions, cardDimensions, names, output, spritesheetURL, prefix}: GenerateCSSOptions): Promise<void> => {
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
    border-radius: 4%;

    &.width {
        width: 100%;
    }

    &.height {
        height: 100%;
    }
}
`;

const getCardCSS = (prefix: string, name: string, i: number): string => `
.${getClassName(prefix, name)} {
    background-position: calc(${-i} * 100%) 0px;
}`;

const getClassName = (prefix: string, name: string): string => `${prefix}-${path.parse(name).name.replaceAll("_", "-")}`;
