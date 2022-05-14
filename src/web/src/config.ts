
import axios from 'axios';
import { version } from './version';

interface iConfig { 
  stage: string;
  baseHref: string;
  apiRoot: string;
  version: string;
  isLocal?: boolean;
  dummyCreds?: { username: string, password: string }
}

const currentStage = process.env.REACT_APP_STAGE || '';
const apiRoot = process.env.REACT_APP_API_ROOT || '';
// const isJest = process.env.JEST_WORKER_ID || '';
axios.defaults.baseURL = `${apiRoot}/`;

const configBase = {
  stage: currentStage,
  baseHref: `/`,
  apiRoot,
  version
} as iConfig;


const configHash: any = {
  nonprod: { ...configBase, env: 'nonprod' },
  dev: { ...configBase, env: 'dev' },
  prod: { ...configBase, env: 'prod' },
};

export const config = configHash[currentStage] || configHash.prod;
