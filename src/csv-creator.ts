export default class CsvCreator {
  jsonFilePath: string;
  constructor(jsonFilePath: string) {
    this.jsonFilePath = jsonFilePath;
  }
  create() {
    const downloadData = JSON.parse(Deno.readTextFileSync(this.jsonFilePath));
    const outFileBase = this.jsonFilePath.replace('.json', '') + '-';
    for (const partName in downloadData) {
      const part = downloadData[partName];
      for (const skillName in part) {
        let csvText = '';
        const skill = part[skillName];
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

        const cleanedSkillName = skillName
          .replace(/[?!,'\n.:\\/*<>|]/g, '')
          .replace(/[&]/g, 'and')
          .replace(/\s\s+/g, ' ');
        const outFile = `${outFileBase}Part ${partName
          .replace(/[\n]/g, '')
          .trim()}-${cleanedSkillName}.csv`;
        Deno.writeTextFileSync(outFile, csvText);
      }
    }
  }
}
