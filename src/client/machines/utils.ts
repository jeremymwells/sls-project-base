const withSuffix = (str: string, suffix: string) => {
  return `${str} ${suffix}`;
}

export const start = (str: string) => {
  return withSuffix(str, 'Start');
}

export const finish = (str: string) => {
  return withSuffix(str, 'Finish');
}