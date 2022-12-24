import * as jsdom from 'jsdom';
const { JSDOM } = jsdom;
import * as fs from 'fs';

class SkillTreeParser {
  htmlString: string;
  constructor(htmlPath: string) {
    const htmlString = fs.readFileSync(htmlPath, 'utf-8');
    this.htmlString = htmlString;
  }

  parse() {
    const dom = JSDOM.fragment(this.htmlString);
    const sectionElements = dom.querySelectorAll(
      '[data-test="skill-tree"] ._3uC-w'
    );
    const skills = {};
    for (let i = 0; i < sectionElements.length; i++) {
      const sectionEl = sectionElements[i];
      const sectionSkills = this.parseSection(sectionEl, i + 1);
      for (const sectionSkill of sectionSkills) {
        skills[sectionSkill.name] = sectionSkill;
      }
    }
    fs.writeFileSync('skill-tree.json', JSON.stringify(skills));
  }

  parseSection(sectionEl: Element, sectionNumber: number) {
    const skills = sectionEl.querySelectorAll('[data-test="skill"]');
    const result = [];
    skills.forEach(skill => {
      let name = skill.querySelector('._2OhdT').textContent;
      let r = /\s\s+/g;
      name = name.replace(r, '');
      result.push({
        name,
        sectionNumber,
      });
    });
    return result;
  }
}

export default SkillTreeParser;
