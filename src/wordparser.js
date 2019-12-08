import xml2js from 'xml2js';
class WordParser {
    /**
     * @param {string} htmlString 
     */
    constructor (htmlString) {
        this.htmlString = htmlString;
    }

    async parse() {
        const dom = await xml2js.parseStringPromise(this.htmlString)
            .catch(reason => console.log(reason));
        console.log(dom);
    }
}

export default WordParser;