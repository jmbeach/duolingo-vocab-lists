# Duolingo Vocab Lists

This repository is a collection of Duolingo courses' vocabs.

Currently, the only course is Spanish (learned from English) in the "english-spanish" folder.

The list of words for a course can be downloaded in JSON and CSV format.

The main purpose of this project is to provide a means of getting the vocab in a format that is easy to import into a memorization tool. Tinycards does not seem to be maintained that well anymore (sadface).

# Parsing other courses

I wrote a NodeJS program to parse the words in the Spanish course from [an awesome post in a Duolingo discussion](https://forum.duolingo.com/comment/31508369). Thank you so much [FieryCat](https://www.duolingo.com/profile/FieryCat)!

There are similar posts for other languages that could be processed in the same way to generate these files.

To use the provided NodeJS code, clone it.

Run `yarn install`.

**NOTE**: This will not work out of the box. You will likely have to tweak index.js and wordparser.js a little to make this work.

Go to [this list of vocabularies](https://forum.duolingo.com/comment/31074292/List-of-Vocabularies-for-Language-Courses-of-Duolingo) (English only. Hopefully others exist for other language learners) and find the language you're interested in.

Save the page to an HTML file. **NOTE**: you may have to clean the html file to ensure there is only one root note. For example: only Body as root.

Tweak the index.js and wordparser to no longer be looking for spanish files/words.

The translator defaults to finding transaltions of words on Duolingo.com. However, if it can't find one, it uses Google Translate. To use google translate you'll have to get an API key and then put your API key into a .env file like this:

```
GOOGLE_TRANSLATE_API_KEY=<my-api-key>
```