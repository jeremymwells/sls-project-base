
import axios from 'axios';
import { CognitoConfig } from './configs/cognito';
import { version } from './configs/version';

interface iConfig { 
  stage: string;
  baseHref: string;
  apiRoot: string;
  version: string;
  isLocal?: boolean;
  cognito: CognitoConfig;
}

const cognito = {
  userPoolName: process.env.REACT_APP_COGNITO_USERPOOL_NAME,
  userPoolClientName: process.env.REACT_APP_COGNITO_USERPOOL_CLIENT_NAME,
  region: process.env.REACT_APP_AWS_REGION,
};

const currentStage = process.env.REACT_APP_STAGE || '';
const apiRoot = process.env.REACT_APP_API_ROOT || '';
axios.defaults.baseURL = `${apiRoot}/`;

const configBase = {
  stage: currentStage,
  baseHref: `/`,
  apiRoot,
  version,
  cognito,
} as iConfig;


const configHash: any = {
  nonprod: { ...configBase, env: 'nonprod' },
  dev: { ...configBase, env: 'dev' },
  prod: { ...configBase, env: 'prod' },
};

export const config = configHash[currentStage] || configHash.prod;
