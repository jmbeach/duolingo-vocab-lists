# Duolingo Vocab Lists ![Node.js CI](https://github.com/jmbeach/duolingo-vocab-lists/workflows/Node.js%20CI/badge.svg)

This repository is a collection of Duolingo courses' vocabs.

Currently, the only course is Spanish (learned from English) in the "english-spanish" folder.

The list of words for a course can be downloaded in JSON and CSV format.

The main purpose of this project is to provide a means of getting the vocab in a format that is easy to import into a memorization tool. Tinycards does not seem to be maintained that well anymore (sadface).

# Parsing other courses

I wrote a NodeJS program to parse the words in the Spanish course from [an awesome post in a Duolingo discussion](https://forum.duolingo.com/comment/41639645). Thank you so much [FieryCat](https://www.duolingo.com/profile/FieryCat)!

There are similar posts for other languages that could be processed in the same way to generate these files.

To use the provided NodeJS code:

## Step 1: Clone it.

Run `git clone git@github.com:jmbeach/duolingo-vocab-lists.git`

## Step 2: Install Dependencies

Run `yarn install`.

## Step 3: Get Vocab List HTML

Go to [this list of vocabularies](https://forum.duolingo.com/comment/31074292/List-of-Vocabularies-for-Language-Courses-of-Duolingo) and find the language you are interested in.

Save the page to an HTML file. **NOTE**: you may have to clean the html file to ensure there is only one root note. For example: only Body as root.

## Step 4: Download Translations

Run `yarn build` to build the code.

Then run `node lib/index.js download -f <path-to-vocab-html-file> [-a <google-api-key>]` to download the translations to a JSON file.

The translator defaults to finding transaltions of words on Duolingo.com. However, if it can't find one, it uses Google Translate. To use google translate you'll have to get an API key and then put your API key into a .env file like this:

```
GOOGLE_TRANSLATE_API_KEY=<my-api-key>
```

## Step 5: Generate CSV Files

Finally, run `node lib/lindex.js create -f <path-to-json-file>` to turn the translations into CSV's.

If the new CSV's aren't in this repository yet, please feel free to create a pull request to add them. Currently, I've only processed Spanish (for English speakers), but would love to get other languages in here.