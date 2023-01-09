import axiod from 'https://deno.land/x/axiod@0.26.2/mod.ts';

export default class AnkiApiClient {
  axios: typeof axiod;
  constructor() {
    this.axios = axiod.create({
      baseURL: 'http://localhost:8765',
    });
  }

  /**
   *
   * @returns {AxiosPromise<{ result: any }>}
   */
  getDecks() {
    return this.axios.post('', {
      action: 'deckNamesAndIds',
      version: 6,
    });
  }

  getCardsByDeck(deck: string) {
    return this.axios.post('', {
      action: 'findCards',
      version: 6,
      params: {
        query: `"deck:${deck}"`,
      },
    });
  }

  /**
   *
   * @param {number[]} cardIds
   * @returns {AxiosPromise<{
   * result: {
   *   cardId: number,
   *   fields: {
   *      Front: {
   *        value: string
   *      },
   *      Back: {
   *        value: string
   *      }
   *   }
   * }[]}>}
   */
  getCardsInfo(cardIds: string[]) {
    return this.axios.post('', {
      action: 'cardsInfo',
      version: 6,
      params: {
        cards: cardIds,
      },
    });
  }

  updateNoteFields(note: any) {
    return this.axios.post('', {
      action: 'updateNoteFields',
      version: 6,
      params: {
        note: note,
      },
    });
  }
}
