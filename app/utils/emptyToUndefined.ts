export const emptyToUndefined = <T>(obj: T) => {
  const entries = Object.entries(obj);
  const removeEmptyEntries = entries.map(([key, value]) => {
    return [key, value === "" ? undefined : value];
  });

  const removeEmpty = Object.fromEntries(removeEmptyEntries) as {
    [K in keyof T]: T[K] | undefined;
  };
  return removeEmpty;
};
