import { InitConfig } from './init.config';

export const config = {
  ...new InitConfig(),
  up: true,
  'env.STATIC_FILES_PATH': process.env.STATIC_FILES_PATH,
};