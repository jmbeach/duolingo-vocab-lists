import {
  DOMParser,
  Element,
} from 'https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts';
import { ParsedCourse } from './interfaces.ts';
class WordParser {
  htmlString: string;
  courseData: ParsedCourse;
  constructor(htmlString: string, courseData: ParsedCourse) {
    this.htmlString = htmlString;
    this.courseData = courseData;
  }

  parse() {
    const dom = new DOMParser().parseFromString(this.htmlString, 'text/html')!;
    const skillElements = dom.querySelectorAll(
      '.plain.list.paddedSkills > li.shift'
    );
    const sections: Record<string, Record<string, any>> = {};
    for (const skillEl of skillElements) {
      const skill = this.parseSkill(skillEl as Element);
      if (!sections[skill.sectionNumber]) {
        sections[skill.sectionNumber] = {};
      }
      sections[skill.sectionNumber][skill.id] = {
        name: skill.name,
        words: skill.words,
      };
    }
    return sections;
  }

  parseSkill(skillEl: Element) {
    const skillLink = skillEl.querySelector('.sTI')!.parentElement;
    const skillUrl = skillLink!.getAttribute('href');
    const skillUrlParts = skillUrl!.split('/');
    let skillUrlEnd = skillUrlParts.pop()!;

    let parsed = this.courseData.skills.byUrl[skillUrlEnd!];
    if (!parsed) {
      /* Sometimes the last element of the url is a number.
       * If it's a 1, then just use the next to last element.
       * If it's greater, still try the next to last, but use "<skill>-<number>" if it still doesn't work. */
      if (skillUrlEnd === '1') skillUrlEnd = skillUrlParts.pop()!;
      else if (skillUrlEnd > '1' && skillUrlEnd <= '9') {
        const temp = skillUrlEnd;
        skillUrlEnd = skillUrlParts.pop()!;
        parsed = this.courseData.skills.byUrl[skillUrlEnd];
        if (!parsed) {
          skillUrlEnd += `-${temp}`;
        }
      }
      parsed = this.courseData.skills.byUrl[decodeURIComponent(skillUrlEnd)];
      if (!parsed) {
        throw new Error(
          `Could not find "${skillUrlEnd}" in course data skills"`
        );
      }
    }
    const words = skillEl
      .querySelector('.blue')!
      .textContent.trim()
      .split('·')
      .map(x => x.trim().replace(/\s*\d+ words\s*/, ''))
      .reduce((a, b) => ({ ...a, [b]: {} }), {});
    return {
      name: parsed.name,
      sectionNumber: parsed.sectionNumber,
      words,
      id: parsed.id,
    };
  }
}

export default WordParser;
