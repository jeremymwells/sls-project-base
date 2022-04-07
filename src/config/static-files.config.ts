import * as path from 'path';
import * as fs from 'fs';

import { readSync, ReadDirOptions } from 'readdir';

import { InitConfig } from './init.config';

export class StaticFilesConfig {
  paths: string[] = [];

  files: { name: string, path: string, contents: string }[];

  root = path.resolve(process.cwd(), process.env.STATIC_FILES_PATH);

  constructor(initConfig: InitConfig) {
    this.initialize(initConfig);
  }

  private initialize(initConfig: InitConfig) {
    if (process.env.STATIC_FILES_PATH && !initConfig._.initialized) {
      try {
        const options = [ReadDirOptions.ABSOLUTE_PATHS, ReadDirOptions.CASELESS_SORT];
        initConfig._.dirpath = this.root;
        if (fs.existsSync(this.root)) {
          this.paths = readSync(this.root, ['*', '**/*'], options);
          this.eagerLoadStaticFiles();
        } else {
          initConfig._.errors.push(new Error(`Directory ${this.root} does not exist.`).stack);
        }
      } catch (ex) {
        initConfig._.errors.push(ex.stack);
      }
    }
  }

  private eagerLoadStaticFiles() {
    if (process.env.STATIC_FILES_EAGER_LOAD && !this.files) {
      this.files = this.paths.map(filepath => this.expandFile(filepath));
    }
  }

  private expandFile(filepath) {
    if (!filepath) { return; }
    return {
      name: path.basename(filepath),
      path: filepath,
      contents: fs.readFileSync(filepath).toString(),
    };
  }

  expandFileByName(filename: string, filterByFileName = true) {
    const basenameFilter = x => path.basename(x).toLowerCase() === filename.toLowerCase();
    const fullPathFilter = x => x === filename;
    const matchedFilePath = this.paths.filter(filterByFileName ? basenameFilter : fullPathFilter)[0];
    return this.expandFile(matchedFilePath);
  }
}
