import 'core-js/stable';
import 'regenerator-runtime/runtime';
import WordParser from './wordparser';
import DuolingoClient from './duolingoclient';
import GoogleTranslate from 'google-translate';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const fileBody = fs.readFileSync('./english-spanish/duolingo-spanish.html', {
    encoding: 'utf8'
});
const parser = new WordParser(fileBody);
const client = new DuolingoClient();
const parsedCourse = parser.parse(fileBody);
const translateClient = GoogleTranslate(process.env.GOOGLE_TRANSLATE_API_KEY);

const translate = async () => {
    for (let partName in parsedCourse) {
        const part = parsedCourse[partName];
        for (let skillName in part) {
            const skill = part[skillName];
            for (let word in skill.words) {
                const translation = await client.getDefinition('es', 'en', encodeURI(word))
                    .catch(err => {
                        console.error('could not translate word from duolingo. trying google translate', word);
                        const p = new Promise((resolve, reject) => {
                        translateClient.translate(word, 'es', 'en', (err, result) => {
                                let translations = [];
                                translations.push(result.translatedText);
                                resolve(translations);
                            });
                        });
                        
                        return p;
                    });
                console.log(word, translation);
                parsedCourse[partName][skillName].words[word].translations = translation;
            }
        }
    }

    fs.writeFileSync('english-spanish/english-spanish.json', JSON.stringify(parsedCourse));
}

translate();