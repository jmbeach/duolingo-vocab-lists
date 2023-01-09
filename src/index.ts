import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts';
import TranslationDownloader from './translation-downloader.ts';
import yargs from 'https://deno.land/x/yargs@v17.6.2-deno/deno.ts';
import CsvCreator from './csv-creator.ts';
import CsvCombiner from './csv-combiner.ts';
import AnkiUpdater from './anki-updater.ts';

const conf = {
  ...config(),
  ...Deno.env.toObject(),
};
const yargConf = yargs(Deno.args)
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
  .alias('help', 'h');
const argv: any = yargConf.parse();

if (argv._.includes('download')) {
  const downloader = new TranslationDownloader(
    argv.skillTreeFile,
    argv.vocabHtmlFile,
    conf.GOOGLE_TRANSLATE_API_KEY || argv.googleApiKey
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
} else {
  yargConf.showHelp();
}
