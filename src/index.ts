import * as dotenv from 'dotenv';
import TranslationDownloader from './translation-downloader';
import * as yargs from 'yargs';
import CsvCreator from './csv-creator';
import CsvCombiner from './csv-combiner';
import { hideBin } from 'yargs/helpers';
import AnkiUpdater from './anki-updater';
import SkillTreeParser from './course-data-parser';

dotenv.config();

const argv: any = yargs(hideBin(process.argv))
  .command(
    'download',
    'Downloads translations using vocab html page. Saves as json file.',
    {
      skillTreeFile: {
        description:
          'Path to the skill tree JSON file (generated using the skilltree command)',
        alias: 's',
        type: 'string',
        demandOption: true,
      },
      vocabHtmlFile: {
        description: 'Path to the vocab html file',
        alias: 'f',
        type: 'string',
        demandOption: true,
      },
      googleApiKey: {
        description: 'Google API key',
        alias: 'a',
        type: 'string',
        demandOption: false,
      },
    }
  )
  .command(
    'skilltree',
    'Creates skill tree index using Duolingo home HTML page. Saves as json file.',
    {
      htmlFile: {
        description: 'Path to the Duolingo home page HTML file',
        alias: 'f',
        type: 'string',
        demandOption: true,
      },
    }
  )
  .command('create', "Creates CSV's after they are downloaded.", {
    jsonFilePath: {
      description: 'Path to JSON file created by download command',
      alias: 'f',
      type: 'string',
      demandOption: true,
    },
  })
  .command('combine', "Combines all vocab CSV's into one", {
    languagePath: {
      description:
        "The path to the folder containing the CSV's. Ex: ./english-spanish",
      alias: 'p',
      type: 'string',
      demandOption: true,
    },
  })
  .command(
    'anki',
    "Updates vocab words using anki (really specific to author's setup)"
  )
  .help()
  .alias('help', 'h').argv;

if (argv._.includes('download')) {
  const downloader = new TranslationDownloader(
    argv.skillTreeFile,
    argv.vocabHtmlFile,
    process.env.GOOGLE_TRANSLATE_API_KEY || argv.googleApiKey
  );
  downloader.downloadTranslation();
} else if (argv._.includes('create')) {
  const creator = new CsvCreator(argv.jsonFilePath);
  creator.create();
} else if (argv._.includes('combine')) {
  const combiner = new CsvCombiner(argv.languagePath.toString());
  combiner.combine();
  combiner.combineParts();
} else if (argv._.includes('anki')) {
  const ankiUpdater = new AnkiUpdater();
  ankiUpdater.run().then(x => {
    console.log('done');
  });
} else if (argv._.includes('skilltree')) {
  const parser = new SkillTreeParser(argv.htmlFile);
  parser.parse();
} else {
  yargs.showHelp();
}
