import dotenv from 'dotenv';
import TranslationDownloader from './translation-downloader';
import yargs from 'yargs';
import CsvCreator from './csv-creator';
import CsvCombiner from './csv-combiner';
import {hideBin} from 'yargs/helpers';

dotenv.config();

const argv = yargs(hideBin(process.argv)).command('download', 'Downloads translations using vocab html page. Saves as json file.', {
  vocabHtmlFile: {
    description: 'Path to the vocab html file',
    alias: 'f',
    type: 'string',
    demandOption: true
  },
  googleApiKey: {
    description: 'Google API key',
    alias: 'a',
    type: 'string',
    demandOption: false
  }
})
.command('create', 'Creates CSV\'s after they are downloaded.', {
  jsonFilePath: {
    description: 'Path to JSON file created by download command',
    alias: 'f',
    type: 'string',
    demandOption: true
  }
})
.command('combine', 'Combines all vocab CSV\'s into one', {
  languagePath: {
    description: 'The path to the folder containing the CSV\'s. Ex: ./english-spanish',
    alias: 'p',
    type: 'string',
    demandOption: true
  }
}).help().alias('help', 'h').argv;

if (argv._.includes('download')) {
  const downloader = new TranslationDownloader(argv.vocabHtmlFile, process.env.GOOGLE_TRANSLATE_API_KEY || argv.googleApiKey);
  downloader.downloadTranslation();
} else if (argv._.includes('create')) {
  const creator = new CsvCreator(argv.jsonFilePath);
  creator.create();
} else if (argv._.includes('combine')) {
  const combiner = new CsvCombiner(argv.languagePath.toString());
  combiner.combine();
} else {
  yargs.showHelp();
}