import { getInputStrings } from "../utils/inputparsing.ts";

export const parseInput = (filePath: string) => {
  const inputStrings = getInputStrings(filePath);
  const imageEnhancement = inputStrings[0];
  const image = inputStrings.slice(1).filter((str) => str.length > 0);
  return { imageEnhancement, image };
};

/**
 * Given a raw image enhancement string returns a lookup utility
 */
export const buildLookup = (imageEnhancement: string) => {
  const lightSet = new Set<number>();
  for (let i = 0; i < imageEnhancement.length; i++) {
    if (imageEnhancement[i] === "#") lightSet.add(i);
  }
  return {
    get: (key: number) => (lightSet.has(key) ? "#" : "."),
  };
};
