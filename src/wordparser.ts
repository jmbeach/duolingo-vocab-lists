import * as jsdom from 'jsdom';
const { JSDOM } = jsdom;
class WordParser {
    htmlString: string;
    skillTree: {[key: string]: { sectionNumber: number }};
    constructor (htmlString: string, skillTree: {[key: string]: { sectionNumber: number }}) {
        this.htmlString = htmlString;
        this.skillTree = skillTree;
    }

    parse() {
        const dom = JSDOM.fragment(this.htmlString);
        const skillElements = dom.querySelectorAll('.plain.list.paddedSkills > li.shift');
        const sections = {};
        skillElements.forEach(skillEl => {
            const skill = this.parseSkill(skillEl);
            if (!sections[skill.sectionNumber]) {
                sections[skill.sectionNumber] = {}
            }
            sections[skill.sectionNumber][skill.name] = {
                words: skill.words
            }
        })
        return sections;
    }

    parseSkill(skillEl: Element) {
        const name = skillEl.querySelector('.sTI').textContent.trim()
        if (!this.skillTree[name]) {
            throw new Error(`Could not find "${name}" in skill tree"`)
        }
        const sectionNumber = this.skillTree[name].sectionNumber;
        const words = skillEl.querySelector('.blue').textContent.trim()
            .split('·')
            .map(x => x.trim().replace(/\s*\d+ words\s*/, ''))
            .reduce((a, b) => ({...a, [b]: {}}),{})
        return {
            name,
            sectionNumber,
            words
        }
    }
}

export default WordParser;