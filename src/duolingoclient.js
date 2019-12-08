import axios from 'axios';
class DuolingoClient {
    getDefinition (fromLanguage, toLanguage, word) {
        return axios.get(`https://duolingo-lexicon-prod.duolingo.com/api/1/search?exactness=1&languageId=${fromLanguage}&query=${word}&uiLanguageId=${toLanguage}`)
            .then(/** @param {{results: Array<any>}} result */ result => {
                const exact = result.data.results.find(r => r.exactMatch === true);
                const desired = exact.translations[toLanguage];
                return desired;
            });
    }
}

export default DuolingoClient;