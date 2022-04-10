
interface iConfig { 
  stage: string;
  baseHref: string;
  apiRoot: string;
  basicAuthKey: string;
  isLocal?: boolean;
  dummyCreds?: { username: string, password: string }
}

const currentStage = process.env.REACT_APP_STAGE || '';
const apiRoot = process.env.REACT_APP_API_ROOT || '';

const configBase = {
  baseHref: `/`,
  apiRoot
} as iConfig;


const configHash: any = {
  nonprod: { ...configBase },
  dev: { ...configBase },
  uat: { ...configBase },
  prod: { ...configBase },
};

export const config = configHash[currentStage] || configHash.prod;
console.log('CONFIG', config, process.env);
