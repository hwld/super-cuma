export const buildSearchParamObject = (
  urlString: string
): Record<string, string> => {
  const url = new URL(urlString);
  const searchParams = Object.fromEntries(url.searchParams.entries());

  return searchParams;
};
