import EnglishSpanish from '../english-spanish/english-spanish.json';
import fs from 'fs';

for (let partName in EnglishSpanish) {
    const part = EnglishSpanish[partName];
    for (let skillName in part) {
        let csvText = 'Word,Translations';
        const skill = part[skillName];
        for (let word in skill.words) {
            const data = skill.words[word];
            csvText += `\n${word},"${data.translations.join(', ')}"`
        }

        fs.writeFileSync('./english-spanish/english-spanish-' + partName + '-' + skillName + '.csv', csvText);
    }
}