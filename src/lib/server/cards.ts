import type {CardData} from "$lib/types/card";

export default class Cards {
    public deck: CardData[];
    public hand: CardData[];
    public grave: CardData[];

    constructor(deck: CardData[]) {
        this.deck = deck;
        this.hand = [];
        this.grave = [];
    }

    static shuffle(cards: CardData[]): CardData[] {
        return cards
            .map((card) => ({
                card,
                sort: Math.random(),
            }))
            .sort((a, b) => a.sort - b.sort)
            .map(({card}) => card);
    }

    static isUnit({abilities, row}: CardData): boolean {
        return !abilities.includes("hero") && (row === "close" || row === "ranged" || row === "siege" || row === "agile");
    }

    static getRandom(cards: CardData[], amount: number): CardData[] {
        // TODO
    }

    private static filterCards(from: CardData[], ...cards: CardData[]): CardData[] {
        return from.filter((card) => {
            const playingCardIndex = cards.findIndex(({name}) => name === card.name);
            if (playingCardIndex !== -1) {
                cards.splice(playingCardIndex, 1);
                return false;
            }

            return true;
        });
    }

    draw(amount = 1): void {
        const affordableAmount = Math.min(this.deck.length, amount);

        const cards = this.deck.splice(-affordableAmount);
        this.hand.push(...cards);
    }

    drawCard(...card: CardData[]): void {

    }

    play(...cards: CardData[]): void {
        this.hand = Cards.filterCards(this.hand, ...cards);
    }

    discard(...cards: CardData[]): void {
        this.grave.push(...cards);
    }

    restore(...cards: CardData[]): void {
        this.grave = Cards.filterCards(this.grave, ...cards);
    }
}
