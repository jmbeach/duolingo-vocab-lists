import jsdom from 'jsdom';
const { JSDOM } = jsdom;
class WordParser {
    /**
     * @param {string} htmlString 
     */
    constructor (htmlString) {
        this.htmlString = htmlString;
    }

    parse() {
        const dom = JSDOM.fragment(this.htmlString);
        const comment = dom.querySelector('._2povu');
        const comment2 = dom.querySelectorAll('._3e8fY._2povu');
        const parts = {};
        this.parseComment(comment, parts);
        for (const comment of comment2) {
            this.parseComment(comment, parts);
        }
        return parts;
    }

    /**
     * @param {Element} comment
     * @param {any} parts
     */
    parseComment (comment, parts) {
        for (let i = 0; i < comment.children.length; i++) {
            const child = comment.children[i];
            if (child.tagName === 'H2')
            {
                const innerChild = child.children[0];

                // if this is a new "part"
                if (innerChild.tagName === 'STRONG')
                {
                    const partTitle = innerChild.innerHTML;
                    parts[partTitle] = {};
                    i = this.parseSkills(partTitle, parts, comment, i + 1) - 1;
                }
            }
        }
    }

    parseSkills (partTitle, parts, comment, i) {
        while (i < comment.children.length) {
            const child = comment.children[i];
            if (child.tagName === 'H2')
            {
                const innerChild = child.children[0];

                // if this is a new "part"
                if (innerChild.tagName === 'STRONG')
                {
                    return i;
                }

                // if this is a skill header
                if (innerChild.tagName === 'A')
                {
                    const skillName = innerChild.textContent;
                    parts[partTitle][skillName] = {
                        words: {}
                    };
                    i = this.parseSkill(skillName, partTitle, parts, comment, i + 1);
                }
            }

            i++;
        }
    }

    /**
     * @param {string | number} skillName
     * @param {string | number} partTitle
     * @param {Element} comment
     * @param {string | number} i
     */
    parseSkill (skillName, partTitle, parts, comment, i) {
        /** @type {Element} */
        let ul = comment.children[i];
        if (ul.tagName === 'UL') {
            let ol = ul.children[ul.children.length - 1];
            while (ol.tagName !== 'OL') {
                ol = ol.children[ol.children.length - 1];
            }

            for (let bullet of ol.children) {
                /** @type {string} */
                let bulletText = bullet.textContent;
                if (bulletText.indexOf(',') > -1) {
                    bulletText = bulletText.replace('Words: ', '');
                    const words = bulletText.split(',');
                    for (let word of words) {
                        parts[partTitle][skillName].words[word.replace('\n', '').trim().replace(/\s\s+/g, ' ')] = {translations: []};
                    }
                }
            }
        }

        return i;
    }
}

export default WordParser;