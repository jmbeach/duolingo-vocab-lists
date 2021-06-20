import AnkiApiClient from "./anki-api-client";
import fs from 'fs';

export default class AnkiUpdater {
  constructor() {
    this.client = new AnkiApiClient();
  }
  async run() {
    const decks = (await this.client.getDecks()).data;
    const ankiDecks = Object.keys(decks.result).filter(x => x.indexOf('Duolingo') > -1 && x.split('::').length > 2);
    for (const deck of ankiDecks) {
      console.log('deck', deck)
      const deckParts = deck.split('::');
      const level = deckParts[1];
      const part = level.replace('Level', 'Part');
      const section = deckParts[2];
      const matchingCsv = `./english-spanish/${part}/english-spanish-${part}-${section}.csv`;
      const csvText = fs.readFileSync(matchingCsv, {encoding: 'utf-8'});
      const csvLines = csvText.split('\n');
      const csvCards = csvLines.map(x => ({ front: x.split(',')[0], back: x.split(',')[1] }))
      const cardIds = (await this.client.getCardsByDeck(deck)).data
      const cards = (await this.client.getCardsInfo(cardIds.result)).data;
      for (const card of cards.result) {
        let front = card.fields.Front.value;
        front = front.replace(/\[[^\]]+\]/, '').trim();
        const csvCardMatches = csvCards.filter(x => x.front === front)
        if (csvCardMatches.length < 1) {
          console.warn(`No match found for card: ${front}`)
          continue
        }

        const csvCard = csvCardMatches[0];
        if (csvCard.back !== card.fields.Back.value) {
          console.log(`replacing [${csvCard.front}, ${csvCard.back}] with [${front}, ${card.fields.Back.value}]`)
          csvCard.back = card.fields.Back.value;
        }
      }
      const newText = csvCards.reduce((a, b) => a + `\n${b.front},${b.back}`, '');
      fs.writeFileSync(matchingCsv, newText.trim());
    }
  }
}