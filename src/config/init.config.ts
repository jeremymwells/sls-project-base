import { AnimusDBConfig } from './animus-db.config';
import { AtlassianConnectConfig } from './atlassian-connect.config';
import { AuthConfig } from './auth.config';
import { StaticFilesConfig } from './static-files.config';

export class InitConfig {
  _: { errors: any[], initialized: boolean, dirpath: string };

  staticFiles: StaticFilesConfig;

  ['atlassian-connect']: AtlassianConnectConfig;

  animusDb: AnimusDBConfig;
  
  auth: AuthConfig;

  constructor() {
    this.initialize();
  }

  private initialize() {
    this._ = {
      errors: [],
      initialized: false,
      dirpath: '',
    };

    // call any config initialization here
    this.staticFiles = new StaticFilesConfig(this);
    this['atlassian-connect'] = new AtlassianConnectConfig(this);
    this.animusDb = new AnimusDBConfig(this);
    this.auth = new AuthConfig(this);
    this._.initialized = true;
  }
}
