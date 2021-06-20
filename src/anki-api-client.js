import axios, { AxiosPromise } from "axios";

export default class AnkiApiClient {
  constructor() {
    this.axios = axios.create({
      baseURL: 'http://localhost:8765'
    })
  }

  /**
   * 
   * @returns {AxiosPromise<{ result: any }>}
   */
  getDecks() {
    return this.axios.post('', {
      action: 'deckNamesAndIds',
      version: 6
    })
  }

  /**
   * 
   * @param {string} deck 
   * @returns {AxiosPromise<{
   *  result: number[],
   *  error: any
   * }>}
   */
  getCardsByDeck(deck) {
    return this.axios.post('', {
      action: 'findCards',
      version: 6,
      params: {
        query: `"deck:${deck}"`
      }
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
  getCardsInfo(cardIds) {
    return this.axios.post('', {
      action: 'cardsInfo',
      version: 6,
      params: {
        cards: cardIds
      }
    });
  }
}