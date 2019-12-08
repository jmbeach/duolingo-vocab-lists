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
        const comment2 = dom.querySelector('._3e8fY._2povu');
        const parts = {};
        this.parseComment(comment, parts);
        this.parseComment(comment2, parts);
        return parts;
    }

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
                    const skillName = innerChild.innerHTML;
                    parts[partTitle][skillName] = {
                        words: []
                    };
                    i = this.parseSkill(skillName, partTitle, parts, comment, i + 1);
                }
            }

            i++;
        }
    }

    parseSkill (skillName, partTitle, parts, comment, i) {
        const child = comment.children[i];
        if (child.tagName === 'UL') {
            for (let bullet of child.children) {
                /** @type {string} */
                let bulletText = bullet.innerHTML;
                if (bulletText.indexOf('Words') === 0) {
                    bulletText = bulletText.replace('Words: ', '');
                    const words = bulletText.split(',');
                    for (let word of words) {
                        parts[partTitle][skillName].words.push(word.replace('\n', '').trim());
                    }
                }
            }
        }

        return i;
    }
}

export default WordParser;