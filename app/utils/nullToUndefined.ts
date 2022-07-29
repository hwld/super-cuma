// TODO
// prismaのnullをundefinedにするために使ってるんだけど、これをやるよりprismaの結果を直接返さないで、
// model層みたいなのを作って、そこでprismaのデータを変換する。そうすることによって、 property ?? undefinedで
// nullをundefinedに変えるだけで良くなりそう

// github.com/airjp73/remix-validated-form/issues/68#issue-1148753165
type RecursivelyReplaceNullWithUndefined<T> = T extends null
  ? undefined
  : T extends Date
  ? T
  : {
      [K in keyof T]: T[K] extends (infer U)[]
        ? RecursivelyReplaceNullWithUndefined<U>[]
        : RecursivelyReplaceNullWithUndefined<T[K]>;
    };

export function nullsToUndefined<T>(
  obj?: T
): RecursivelyReplaceNullWithUndefined<T> {
  if (obj === null || obj === undefined) {
    return undefined as any;
  }

  // object check based on: https://stackoverflow.com/a/51458052/6489012
  //@ts-ignore
  if (obj.constructor.name === "Object") {
    for (let key in obj) {
      obj[key] = nullsToUndefined(obj[key]) as any;
    }
  }
  return obj as any;
}
