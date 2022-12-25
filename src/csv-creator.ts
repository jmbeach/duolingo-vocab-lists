import * as fs from 'fs';

export default class CsvCreator {
  jsonFilePath: string;
  constructor(jsonFilePath: string) {
    this.jsonFilePath = jsonFilePath;
  }
  create() {
    const downloadData = JSON.parse(
      fs.readFileSync(this.jsonFilePath, { encoding: 'utf-8' })
    );
    const outFileBase = this.jsonFilePath.replace('.json', '') + '-';
    for (let partName in downloadData) {
      const part = downloadData[partName];
      for (let skillName in part) {
        let csvText = '';
        const skill = part[skillName];
        let isFirst = true;
        for (let word in skill.words) {
          const data = skill.words[word];
          const beginning = isFirst ? '' : '\n';
          if (data.translations.length === 1) {
            csvText += `${beginning}${word},${data.translations.join(', ')}`;
          } else {
            csvText += `${beginning}${word},"${data.translations.join(', ')}"`;
          }

          isFirst = false;
        }

        const cleanedSkillName = skillName
          .replace(/[?!,'\n.:\\/*<>|]/g, '')
          .replace(/[&]/g, 'and')
          .replace(/\s\s+/g, ' ');
        const outFile = `${outFileBase}Part ${partName
          .replace(/[\n]/g, '')
          .trim()}-${cleanedSkillName}.csv`;
        fs.writeFileSync(outFile, csvText);
      }
    }
  }
}
