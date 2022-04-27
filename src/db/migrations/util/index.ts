
export const addId = (seed: any) => {
  return {
    ...seed,
    id: Date.now().toString()
  };
};
