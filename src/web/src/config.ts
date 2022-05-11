
import { version } from './version';

interface iConfig { 
  stage: string;
  baseHref: string;
  apiRoot: string;
  version: string;
  basicAuthKey: string;
  isLocal?: boolean;
  dummyCreds?: { username: string, password: string }
}

const currentStage = process.env.REACT_APP_STAGE || '';
const apiRoot = process.env.REACT_APP_API_ROOT || '';

const configBase = {
  stage: currentStage,
  baseHref: `/`,
  apiRoot,
  version,
} as iConfig;


const configHash: any = {
  nonprod: { ...configBase, env: 'nonprod' },
  dev: { ...configBase, env: 'dev' },
  prod: { ...configBase, env: 'prod' },
};

export const config = configHash[currentStage] || configHash.prod;
