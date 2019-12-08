import 'core-js/stable';
import 'regenerator-runtime/runtime';
import WordParser from './wordparser';
import fs from 'fs';

const fileBody = fs.readFileSync('./english-spanish/duolingo-spanish.html', {
    encoding: 'utf8'
});
const parser = new WordParser(fileBody);
parser.parse();