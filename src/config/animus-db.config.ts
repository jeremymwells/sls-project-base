import * as path from 'path';

import { MongoClientOptions } from 'mongodb';

export class AnimusDBConfig {
  url: string;

  config: any;

  constructor(_: any) {
    this.initialize();
  }

  private initialize() {

    const remoteDbConfig: MongoClientOptions = {
      tls: true,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      // useUnifiedTopology: true,
      tlsCAFile: path.resolve(process.cwd(), 'src/static-files/rds-combined-ca-bundle.pem'),
    };

    const localDeltaConfig = {
      ...remoteDbConfig,
      socketTimeoutMS: 60000 * 15,
      tlsInsecure: true,
      useUnifiedTopology: false,
    };

    this.url = process.env.IS_OFFLINE || process.env.IS_LOCAL ? process.env.LOCAL_DB_URL : process.env.DB_URL;
    this.config = process.env.IS_OFFLINE || process.env.IS_LOCAL ? localDeltaConfig : remoteDbConfig;
    console.log('ANIMUS DB CONFIG', this);
  }

}
