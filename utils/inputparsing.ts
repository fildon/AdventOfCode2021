export const getInputStrings = (filePath: string) => {
  return Deno.readTextFileSync(filePath).split(/\r\n/);
};

export const getInputNumbers = (filePath: string) => {
  return getInputStrings(filePath)
    .filter((str) => str.length > 0)
    .map((str) => parseInt(str));
};
