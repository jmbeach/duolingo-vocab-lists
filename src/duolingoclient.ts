import axiod from 'https://deno.land/x/axiod@0.26.2/mod.ts';
class DuolingoClient {
  getDefinition(fromLanguage: string, toLanguage: string, word: string) {
    return axiod
      .get(
        `https://duolingo-lexicon-prod.duolingo.com/api/1/search?exactness=1&languageId=${fromLanguage}&query=${word}&uiLanguageId=${toLanguage}`
      )
      .then(
        /** @param {{results: Array<any>}} result */ result => {
          let translation = result.data.results.find(
            (r: any) => r.exactMatch === true
          );
          if (
            !translation &&
            result.data.results.length &&
            word.indexOf('%20') < 0
          ) {
            translation = result.data.results[0];
          }

          const desired = translation.translations[toLanguage];
          return desired;
        }
      );
  }
}

export default DuolingoClient;
