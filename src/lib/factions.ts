interface Faction {
    id: string;
    name: string;
    description: string;
}

const factions: Record<string, Faction> = {
    realms: {
        id: "realms",
        name: "Northern Realms",
        description: "Draw a card from your deck whenever you win a round.",
    },
    nilfgaard: {
        id: "nilfgaard",
        name: "Nilfgaardian Empire",
        description: "Wins any round that ends in a draw.",
    },
    monsters: {
        id: "monsters",
        name: "Monsters",
        description: "Keeps a random Unit Card out after each round.",
    },
    scoiatael: {
        id: "scoiatael",
        name: "Scoia'tael",
        description: "Decides who takes first turn.",
    },
    skellige: {
        id: "skellige",
        name: "Skellige",
        description: "2 random cards from the graveyard are placed on the battlefield at the start of the third round.",
    },
};

export default factions;
