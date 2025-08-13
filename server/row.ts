import Cards from "./cards";
import type {GameOptions} from "./types/game";
import type {CardData} from "../shared/types/card";
import {RowSpecial} from "../shared/types/game";

export default class Row {
    public units: CardData[];
    public special: RowSpecial;
    private hasWeather: boolean;
    private getOptions: () => GameOptions;

    constructor(getOptions: () => GameOptions) {
        this.units = [];
        this.special = {
            hasHorn: false,
            hasMardroeme: false,
        };
        this.hasWeather = false;
        this.getOptions = getOptions;
    }

    setWeather(hasWeather: boolean): void {
        this.hasWeather = hasWeather;
    }

    getCardScore(card: CardData): number {
        let total = card.strength;

        if (card.abilities.includes("hero")) {
            return total;
        }

        const {halfWeather, doubleSpyPower} = this.getOptions();

        if (this.hasWeather) {
            if (halfWeather) {
                total = Math.ceil(total / 2);
            } else {
                total = Math.min(1, total);
            }
        }

        if (doubleSpyPower && card.abilities.includes("spy")) {
            total *= 2;
        }

        const bond = this.getBond(card.id);
        if (bond > 1) {
            total *= Number(bond);
        }

        total += this.getMoraleBoost() - (card.abilities.includes("morale") ? 1 : 0);

        if (this.getHorn() - (card.abilities.includes("horn") ? 1 : 0)) {
            total *= 2;
        }

        return total;
    };

    getScore(): number {
        return this.units.reduce((acc, card) => acc + this.getCardScore(card), 0);
    }

    getBond(cardId: CardData["id"]): number {
        // TODO: card ids
        return this.units.filter((card) => card.id === cardId && card.abilities.includes("bond")).length;
    }

    getMoraleBoost(): number {
        return this.units.filter((card) => card.abilities.includes("morale")).length;
    }

    getHorn(): number {
        return Number(this.special.hasHorn) + this.units.reduce((acc, {abilities}) => acc + Number(abilities.includes("horn")), 0);
    }

    hasMardroeme(): boolean {
        return this.special.hasMardroeme || this.units.some(({abilities}) => abilities.includes("mardroeme"));
    }

    add(...cards: CardData[]): void {
        this.units.push(...cards);
    }

    remove(...cards: CardData[]): void {
        this.units = Cards.filterCards(this.units, cards);
    }

    getUnits(): CardData[] {
        return this.units;
    }

    horn(): void {
        this.special.hasHorn = true;
    }

    mardroeme(): void {
        this.special.hasMardroeme = true;
    }
};
