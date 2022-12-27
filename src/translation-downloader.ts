import DuolingoClient from './duolingoclient.ts';
import googleTranslate from './google-translate.ts';
import CourseDataParser from './course-data-parser.ts';
import DownloadedWordParser from './downloaded-word-parser.ts';

export default class TranslationDownloader {
  htmlPagePath: string;
  googleApiKey: string;
  courseDataPath: string;
  fromLanguage = 'es';
  toLanguage = 'en';
  constructor(
    courseDataPath: string,
    htmlPagePath: string,
    googleApiKey: string
  ) {
    this.htmlPagePath = htmlPagePath;
    this.googleApiKey = googleApiKey;
    this.courseDataPath = courseDataPath;
  }

  downloadTranslation() {
    const fileBody = Deno.readTextFileSync(this.htmlPagePath);
    const rawCourseData = JSON.parse(
      Deno.readTextFileSync(this.courseDataPath)
    );
    const courseData = new CourseDataParser(rawCourseData).parse();
    const parser = new DownloadedWordParser(fileBody, courseData);
    const client = new DuolingoClient();
    const parsedCourse = parser.parse();

    const translate = async () => {
      for (const sectionName in parsedCourse.sections) {
        const part = parsedCourse.sections[sectionName];
        for (const skillId of part) {
          const skill = parsedCourse.skills[skillId];
          for (const word in skill.words) {
            let translation;
            try {
              translation = await client.getDefinition(
                this.fromLanguage,
                this.toLanguage,
                encodeURI(word)
              );
            } catch (err) {
              console.error(
                'could not translate word from duolingo. trying google translate',
                word
              );

              translation = (
                await googleTranslate({
                  key: this.googleApiKey,
                  q: word,
                  source: this.fromLanguage,
                  target: this.toLanguage,
                })
              ).data.data.translations.map(x => x.translatedText);
            }
            console.log(word, translation);
            parsedCourse.skills[skillId].words[word].translations = translation;
          }
        }
      }

      Deno.writeTextFileSync(
        this.htmlPagePath.replace('.html', '.json'),
        JSON.stringify(parsedCourse)
      );
    };

    translate();
  }
}
