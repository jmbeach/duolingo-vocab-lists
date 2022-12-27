import { DownloadedSkillTranslations, DownloadResult } from './interfaces.ts';

export default class CsvCreator {
  translationFilePath: string;
  constructor(translationFilePath: string) {
    this.translationFilePath = translationFilePath;
  }
  private static getCsvText(skill: DownloadedSkillTranslations) {
    let csvText = '';
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
    return csvText;
  }
  private static cleanSkillName(skillName: string) {
    return skillName
      .replace(/[?!,'\n.:\\/*<>|]/g, '')
      .replace(/[&]/g, 'and')
      .replace(/\s\s+/g, ' ');
  }
  private static cleanSectionName(sectionName: string) {
    return sectionName.replace(/[\n]/g, '').trim();
  }
  create() {
    const downloadData: DownloadResult = JSON.parse(
      Deno.readTextFileSync(this.translationFilePath)
    );
    const outFileBase = this.translationFilePath.replace('.json', '') + '-';
    for (const sectionName in downloadData.sections) {
      const section = downloadData.sections[sectionName];
      for (const skillId in section) {
        const skill = downloadData.skills[skillId];
        const csvText = CsvCreator.getCsvText(skill);
        const cleanedSkillName = CsvCreator.cleanSkillName(skill.skillName);
        const cleanedSectionName = CsvCreator.cleanSectionName(sectionName);
        const outFile = `${outFileBase}Part ${cleanedSectionName}-${cleanedSkillName}.csv`;
        Deno.writeTextFileSync(outFile, csvText);
      }
    }
    for (const unitNumber in downloadData.units) {
      const unit = downloadData.units[unitNumber];
      Deno.mkdirSync(`${outFileBase}Unit ${unitNumber}`);
      for (const levelNumber in unit) {
        const skillId = unit[levelNumber];
        const skill = downloadData.skills[skillId];
        const csvText = CsvCreator.getCsvText(skill);
        const cleanedSkillName = CsvCreator.cleanSkillName(skill.skillName);
        const outFile = `${outFileBase}Unit ${unitNumber}/Level ${levelNumber}-${cleanedSkillName}.csv`;
        Deno.writeTextFileSync(outFile, csvText);
      }
    }
  }
}
