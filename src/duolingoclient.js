import axios from 'axios';
class DuolingoClient {
    getDefinition (fromLanguage, toLanguage, word) {
        return axios.get(`https://duolingo-lexicon-prod.duolingo.com/api/1/search?exactness=1&languageId=${fromLanguage}&query=${word}&uiLanguageId=${toLanguage}`)
            .then(/** @param {{results: Array<any>}} result */ result => {
                let translation = result.data.results.find(r => r.exactMatch === true);
                if (!translation && result.data.results.length && word.indexOf('%20') < 0) {
                    translation = result.data.results[0];
                }
                
                const desired = translation.translations[toLanguage];
                return desired;
            });
    }
}

export default DuolingoClient;