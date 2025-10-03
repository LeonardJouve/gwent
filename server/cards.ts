import type {CardData} from "../shared/types/card.js";

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

    static isNormalUnit({abilities, type}: CardData): boolean {
        return !abilities.includes("hero") && type === "unit";
    }

    static getRandom(cards: CardData[], amount: number): CardData[] {
        const indices: number[] = [];
        const affordableAmount = Math.min(cards.length, amount);
        for (let i = 0; i < affordableAmount; ++i) {
            let index = -1;
            while (index === -1 || indices.includes(index)) {
                index = Math.floor(Math.random() * cards.length);
            }
            indices.push(index);
        }

        return indices.map((index) => cards[index]);
    }

    static filterCards<T extends CardData>(from: T[], cards: T[]): T[] {
        return from.filter((card) => {
            const playingCardIndex = cards.findIndex(({filename}) => filename === card.filename);
            if (playingCardIndex !== -1) {
                cards.splice(playingCardIndex, 1);
                return false;
            }

            return true;
        });
    }

    redraw(card: CardData): void {
        const cardIndex = this.hand.findIndex(({filename}) => filename === card.filename);
        if (cardIndex === -1) {
            return;
        }

        this.hand.splice(cardIndex, 1);

        const [newCard] = Cards.getRandom(this.deck, 1);
        const newCardIndex = this.deck.findIndex(({filename}) => filename === newCard.filename);
        if (newCardIndex !== -1) {
            this.deck.splice(newCardIndex, 1);
            this.hand.push(newCard);
        }

        this.deck.splice(Math.floor(Math.random() * this.deck.length), 0, card);
    }

    draw(amount = 1): void {
        const affordableAmount = Math.min(this.deck.length, amount);

        const cards = this.deck.splice(-affordableAmount);
        this.hand.push(...cards);
    }

    drawCard(...cards: CardData[]): void {
        this.deck = Cards.filterCards(this.deck, cards);
        this.hand.push(...cards);
    }

    play(...cards: CardData[]): void {
        this.hand = Cards.filterCards(this.hand, cards);
    }

    discard(...cards: CardData[]): void {
        this.grave.push(...cards);
    }

    restore(...cards: CardData[]): void {
        this.grave = Cards.filterCards(this.grave, cards);
    }
}
