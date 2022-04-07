export function isLocal() {
  return process.env.IS_OFFLINE || process.env.IS_LOCAL;
}