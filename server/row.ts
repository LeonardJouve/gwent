import Cards from "./cards.js";
import type {GameOptions} from "./types/game.js";
import type {CardData, SpecialCardData, UnitCardData} from "../shared/types/card.js";

export default class Row {
    public units: UnitCardData[];
    public special: SpecialCardData[];
    private getWeather: () => boolean;
    private getOptions: () => GameOptions;

    constructor(getOptions: () => GameOptions, getWeather: () => boolean) {
        this.units = [];
        this.special = [];
        this.getWeather = getWeather;
        this.getOptions = getOptions;
    }

    getCardScore(card: CardData): number {
        if (card.type !== "unit") {
            return 0;
        }

        let total = card.strength;

        if (card.abilities.includes("hero")) {
            return total;
        }

        const {halfWeather, doubleSpyPower} = this.getOptions();

        if (this.getWeather()) {
            if (halfWeather) {
                total = Math.ceil(total / 2);
            } else {
                total = Math.min(1, total);
            }
        }

        if (doubleSpyPower && card.abilities.includes("spy")) {
            total *= 2;
        }

        const bond = this.getBond(card);
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

    getBond(card: CardData): number {
        return this.units.filter(({name, abilities}) => name === card.name && abilities.includes("bond")).length;
    }

    getMoraleBoost(): number {
        return this.units.filter((card) => card.abilities.includes("morale")).length;
    }

    getHorn(): number {
        return Number(this.special.filter(({abilities}) => abilities.includes("horn")).length + this.units.reduce((acc, {abilities}) => acc + Number(abilities.includes("horn")), 0));
    }

    hasMardroeme(): boolean {
        return this.special.some(({abilities}) => abilities.includes("mardroeme")) || this.units.some(({abilities}) => abilities.includes("mardroeme"));
    }

    add(...cards: UnitCardData[]): void {
        this.units.push(...cards);
    }

    remove(...cards: UnitCardData[]): void {
        this.units = Cards.filterCards(this.units, cards);
    }

    getUnits(): UnitCardData[] {
        return this.units;
    }

    getSpecial(): SpecialCardData[] {
        return this.special;
    }

    addSpecial(card: SpecialCardData): void {
        this.special.push(card);
    }
};
