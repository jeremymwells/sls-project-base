export interface CognitoConfig {
  region: string;
  userPoolName: string;
  userPoolClientName: string
}

export const cognito: CognitoConfig = {
  region: '',
  userPoolName: '',
  userPoolClientName: '',
}