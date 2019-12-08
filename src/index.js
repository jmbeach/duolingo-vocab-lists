import 'core-js/stable';
import 'regenerator-runtime/runtime';
import WordParser from './wordparser';
import DuolingoClient from './duolingoclient';
import Translator from './translator';
import fs from 'fs';

const fileBody = fs.readFileSync('./english-spanish/duolingo-spanish.html', {
    encoding: 'utf8'
});
const parser = new WordParser(fileBody);
const client = new DuolingoClient();
const parsedCourse = parser.parse(fileBody);
const translate = async () => {
    for (let partName in parsedCourse) {
        const part = parsedCourse[partName];
        for (let skillName in part) {
            const skill = part[skillName];
            for (let word of skill.words) {
                const translation = await client.getDefinition('es', 'en', encodeURI(word));
                console.log(word, translation);
            }
        }
    }
}

translate();