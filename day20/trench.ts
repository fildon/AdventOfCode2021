import { getInputStrings } from "../utils/inputparsing.ts";

export const parseInput = (filePath: string) => {
  const inputStrings = getInputStrings(filePath);
  const imageEnhancement = inputStrings[0];
  const image = inputStrings.slice(1).filter((str) => str.length > 0);
  return { imageEnhancement, image };
};
