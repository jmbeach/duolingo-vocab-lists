import fs from 'fs';
export default class CsvCombiner {
  /**
   * @param {string} languagePath
   */
  constructor(languagePath) {
    this.languagePath = languagePath;
  }

  _combineFiles(files) {
    return files.reduce((text, file) => {
      const fileText = fs.readFileSync(file.path, {encoding: 'utf-8'});
      return `${text}${fileText}\n`;
    }, '');
  }

  // inspired by https://dev.to/leonard/get-files-recursive-with-the-node-js-file-system-fs-2n7o
  _getFiles (path = './') {
    const entries = fs.readdirSync(path, { withFileTypes: true });
    const files = entries.filter(x => !x.isDirectory()).map(f => ({...f, path: `${path}${f.name}`}));
    const directories = entries.filter(x => x.isDirectory());
    for (const directory of directories) {
      files.push(...this._getFiles(`${path}${directory.name}/`));
    }

    return files;
  }

  combine() {
    const files = this._getFiles(`${this.languagePath}/`).filter(x => x.name.endsWith('.csv') && x.name.indexOf('combined') < 0);
    const combined = this._combineFiles(files);
    fs.writeFileSync(`${this.languagePath}/combined.csv`, combined, {encoding: 'utf-8'});
  }

  combineParts() {
    const files = this._getFiles(`${this.languagePath}/`).filter(x => x.name.endsWith('.csv') && x.name.indexOf('combined') < 0);
    const parts = files.reduce((map, file) => {
      const part = /Part \d+/.exec(file.name)[0];
      if (!map[part]) {
        map[part] = [];
      }

      map[part].push(file);
      return map;
    }, {});
    for (const part of Object.keys(parts)) {
      const files = parts[part];
      const combined = this._combineFiles(files);
      fs.writeFileSync(`${this.languagePath}/${part}/${part}-combined.csv`, combined, {encoding: 'utf-8'});
    }
  }
}