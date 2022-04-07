import { InitConfig } from "./init.config";

export class AuthConfig {
  basicAuthToken = process.env.BASIC_AUTH_TOKEN;

  constructor(_initConfig: InitConfig) {
  }

}