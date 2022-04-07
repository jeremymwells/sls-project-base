const _template = require('lodash.template');
import { InitConfig } from './init.config';
import { isLocal } from './helpers';

export class AtlassianConnectConfig {
  scopes: string[];
  
  constructor(initConfig: InitConfig) {
    this.initialize(initConfig);
  }

  private initialize(initConfig: InitConfig) {

    const atlassianConnectFileName = isLocal() ? 'atlassian-connect.local.json' : 'atlassian-connect.json';

    const atlassianConnectRawFile = initConfig.staticFiles.expandFileByName(atlassianConnectFileName);
    if (atlassianConnectRawFile && atlassianConnectRawFile.contents) {
      process.env.BASE_URL = isLocal() ? process.env.TUNNEL : process.env.BASE_URL;
      const fileContents = _template(atlassianConnectRawFile.contents)({ ...this, process });
      const parsedConfig = JSON.parse(fileContents || {} as any);
      Object.assign(this, parsedConfig);
      return;
    }

    if (!atlassianConnectRawFile || !atlassianConnectRawFile.contents) {
      initConfig._.errors.push(new Error('atlassian-connect.json not found').stack);
    }

  }
}
