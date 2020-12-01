import fs from 'fs';
export default class CsvCombiner {
  /**
   * @param {string} languagePath
   */
  constructor(languagePath) {
    this.languagePath = languagePath;
  }

  // inspired by https://dev.to/leonard/get-files-recursive-with-the-node-js-file-system-fs-2n7o
  getFiles (path = './') {
    const entries = fs.readdirSync(path, { withFileTypes: true });
    const files = entries.filter(x => !x.isDirectory()).map(f => ({...f, path: `${path}${f.name}`}));
    const directories = entries.filter(x => x.isDirectory());
    for (const directory of directories) {
      files.push(...this.getFiles(`${path}${directory.name}/`));
    }

    return files;
  }

  combine() {
    const files = this.getFiles(`${this.languagePath}/`).filter(x => x.name.endsWith('.csv'));
    const combined = files.reduce((text, file) => {
      const fileText = fs.readFileSync(file.path, {encoding: 'utf-8'});
      return `${text}${fileText}\n`;
    }, '');
    fs.writeFileSync(`${this.languagePath}/combined.csv`, combined, {encoding: 'utf-8'});
  }
}