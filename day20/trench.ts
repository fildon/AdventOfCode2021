import { getInputStrings } from "../utils/inputparsing.ts";

type Image = Array<string>;
type Coordinate = [number, number];

export const parseInput = (filePath: string) => {
  const inputStrings = getInputStrings(filePath);
  const enhancementRules = inputStrings[0];
  const image = inputStrings.slice(1).filter((str) => str.length > 0);
  return { enhancementRules, image };
};

export const neighboursOf = ([x, y]: Coordinate) =>
  [-1, 0, 1].flatMap((yOffset) =>
    [-1, 0, 1].map((xOffset) => [x + xOffset, y + yOffset])
  ) as Array<Coordinate>;

const lookupPixel =
  (image: Image) =>
  ([x, y]: Coordinate) =>
    image[y]?.[x] ?? ".";

const sum = (a: number, b: number) => a + b;

/**
 * Given an image and a coordinate in that image, computes the lookup key
 * to enhance that pixel
 */
export const getKeyAt = (image: Image, coord: Coordinate) =>
  neighboursOf(coord)
    .map(lookupPixel(image))
    .map((pixel, index) => (pixel === "#" ? 2 ** (8 - index) : 0))
    .reduce(sum);

export const enhance = (image: Image, enhancementRules: string): Image => {
  const newImage: Image = [];
  /**
   * Unusual indexes here are to deal with the image expanding
   */
  for (let row = -1; row <= image.length; row++) {
    const newRow: Array<string> = [];
    for (let col = -1; col <= image[0].length; col++) {
      const lookupKey = getKeyAt(image, [col, row]);
      newRow.push(enhancementRules[lookupKey]);
    }
    newImage.push(newRow.join(""));
  }
  return newImage;
};

const enhanceTimes = (
  image: Image,
  enhancementRules: string,
  steps: number
): Image => {
  if (steps < 1) return image;
  return enhanceTimes(
    enhance(image, enhancementRules),
    enhancementRules,
    steps - 1
  );
};

const countLights = (image: Image) =>
  image.flatMap((imageLine) => [...imageLine]).filter((pixel) => pixel === "#")
    .length;

const print = (image: Image) => console.log(image.join("\n"));

export const solvePart1 = (filePath: string) => {
  const { enhancementRules, image } = parseInput(filePath);

  print(image);
  const one = enhanceTimes(image, enhancementRules, 1);
  print(one);
  const two = enhanceTimes(image, enhancementRules, 2);
  print(two);

  return countLights(two);
};
