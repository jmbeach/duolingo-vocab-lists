import fs from 'fs';

export default class CsvCreator {
    constructor (jsonFilePath) {
        this.jsonFilePath = jsonFilePath;
    }
    create() {
        const downloadData = JSON.parse(fs.readFileSync(this.jsonFilePath, {encoding: 'utf-8'}));
        const outFileBase = this.jsonFilePath.replace('.json', '') + '-';
        for (let partName in downloadData) {
            const part = downloadData[partName];
            for (let skillName in part) {
                let csvText = 'Word,Translations';
                const skill = part[skillName];
                for (let word in skill.words) {
                    const data = skill.words[word];
                    if (data.translations.length === 1) {
                        csvText += `\n${word},${data.translations.join(', ')}`;
                    } else {
                        csvText += `\n${word},"${data.translations.join(', ')}"`;
                    }
                }
        
                fs.writeFileSync(outFileBase + partName + '-' + skillName + '.csv', csvText);
            }
        }
    }
}
