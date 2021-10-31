# Duolingo Vocab Lists ![Node.js CI](https://github.com/jmbeach/duolingo-vocab-lists/workflows/Node.js%20CI/badge.svg)

This repository is a collection of Duolingo courses' vocabs.

Currently, the only course is Spanish (learned from English) in the "english-spanish" folder.

The list of words for a course can be downloaded in JSON and CSV format.

The main purpose of this project is to provide a means of getting the vocab in a format that is easy to import into a memorization tool. Tinycards does not seem to be maintained that well anymore (sadface).

# Parsing other courses

Originially, I wrote this program to parse the words in the Spanish course from [an awesome post in a Duolingo discussion](https://forum.duolingo.com/comment/41639645). Thank you so much [FieryCat](https://www.duolingo.com/profile/FieryCat)!

However, now the program parses words from the website [duome](https://duome.eu/Jared5788/progress) which has a very comprehensive list of the words for each course. Switched to this approach based on the [detailed blog post](https://melledijkstra.github.io/science/extracting-duolingo-vocabulary-to-quizlet) by [Melle Dijkstra](https://melledijkstra.github.io/).

To use the provided code:

## Step 1: Clone it.

Run `git clone git@github.com:jmbeach/duolingo-vocab-lists.git`

## Step 2: Install Dependencies

Run `yarn install`.

## Step 3: Get Skill Tree

Login to [Duolingo.com](https://www.duolingo.com/learn). Scroll to the very bottom of the home page to make it load the entire course skill tree. Save the page as an HTML file. **NOTE**: you may have to clean the html file to ensure there is only one root note. For example: only Body as root.

Run `node lib/index.js skilltree -f <path-to-html-file>` to generate the skill tree JSON file. This is used to figure out what section each skill belongs to.

## Step 4: Get Vocab List HTML

Go to `https://duome.eu/<your-user-name>/progress`. The skills tab contains an in-order list of all of the skills in your language. In the chrome developer console, run `document.querySelectorAll('.click.skill')` to expand every item on the page.

Save the page to an HTML file. **NOTE**: you may have to clean the html file to ensure there is only one root note. For example: only Body as root.

## Step 5: Download Translations

Run `yarn build` to build the code.

Then run `node lib/index.js download -f <path-to-vocab-html-file> [-a <google-api-key>]` to download the translations to a JSON file.

The translator defaults to finding transaltions of words on Duolingo.com. However, if it can't find one, it uses Google Translate. To use google translate you'll have to get an API key and then put your API key into a .env file like this:

```
GOOGLE_TRANSLATE_API_KEY=<my-api-key>
```

## Step 6: Generate CSV Files

Finally, run `node lib/index.js create -f <path-to-json-file>` to turn the translations into CSV's.

If the new CSV's aren't in this repository yet, please feel free to create a pull request to add them. Currently, I've only processed Spanish (for English speakers), but would love to get other languages in here.

## Step 7 (Optional): Create Combined CSV Files

It might be preferable for some people to have all of the CSV files for each section combined into one file. To generate these, run `node lib/index.js combine -p <path to language directory>`.
