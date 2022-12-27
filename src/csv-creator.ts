import { DownloadResult } from './interfaces.ts';

export default class CsvCreator {
  translationFilePath: string;
  constructor(translationFilePath: string) {
    this.translationFilePath = translationFilePath;
  }
  create() {
    const downloadData: DownloadResult = JSON.parse(
      Deno.readTextFileSync(this.translationFilePath)
    );
    const outFileBase = this.translationFilePath.replace('.json', '') + '-';
    for (const sectionName in downloadData) {
      const section = downloadData.sections[sectionName];
      for (const skillId in section) {
        let csvText = '';
        const skill = downloadData.skills[skillId];
        let isFirst = true;
        for (const word in skill.words) {
          const data = skill.words[word];
          const beginning = isFirst ? '' : '\n';
          if (data.translations.length === 1) {
            csvText += `${beginning}${word},${data.translations.join(', ')}`;
          } else {
            csvText += `${beginning}${word},"${data.translations.join(', ')}"`;
          }

          isFirst = false;
        }

        const cleanedSkillName = skill.skillName
          .replace(/[?!,'\n.:\\/*<>|]/g, '')
          .replace(/[&]/g, 'and')
          .replace(/\s\s+/g, ' ');
        const outFile = `${outFileBase}Part ${sectionName
          .replace(/[\n]/g, '')
          .trim()}-${cleanedSkillName}.csv`;
        Deno.writeTextFileSync(outFile, csvText);
      }
    }
  }
}
