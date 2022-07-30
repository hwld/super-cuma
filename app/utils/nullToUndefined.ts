type NullToUndefined<T> = T extends null ? undefined : T;
type NullsToUndefiends<T> = {
  [K in keyof T]: NullToUndefined<T[K]>;
};

export const nullsToUndefineds = <T extends Record<string, unknown>>(
  obj: T
): NullsToUndefiends<T> => {
  const keys = Object.keys(obj);
  const entries = keys.map((key) => {
    const property = obj[key] === null ? undefined : obj[key];
    return [key, property] as const;
  });
  const nullsToUndefineds = Object.fromEntries(entries);
  return nullsToUndefineds as NullsToUndefiends<T>;
};
