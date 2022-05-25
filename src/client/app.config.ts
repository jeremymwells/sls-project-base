import axios from 'axios';

interface iConfig { 
  stage: string;
  baseHref: string;
  apiRoot: string;
  version: string;
  dummyCreds?: { username: string, password: string }
}

const currentStage = process.env.REACT_APP_STAGE || '';
const apiRoot = process.env.REACT_APP_API_ROOT || '';
const baseUrl = process.env.REACT_APP_PUBLIC_URL || '';
axios.defaults.baseURL = `${baseUrl}/${apiRoot}/`;
console.log('hello', baseUrl);
const configBase = {
  stage: currentStage,
  baseHref: `/`,
  apiRoot,
} as iConfig;


const configHash: any = {
  nonprod: { ...configBase, env: 'nonprod' },
  dev: { ...configBase, env: 'dev' },
  prod: { ...configBase, env: 'prod' },
};

export default (appJson: { config: any }) => {

  return {
    ...appJson.config,
    extra: {
      ...(configHash[currentStage] || configHash.prod) as iConfig,
      ...require('./version')
    }
  }
}