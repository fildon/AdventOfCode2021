import { getInputStrings } from "../utils/inputparsing.ts";

type Image = Array<string>;
type Coordinate = [number, number];

export const parseInput = (filePath: string) => {
  const inputStrings = getInputStrings(filePath);
  const imageEnhancement = inputStrings[0];
  const image = inputStrings.slice(1).filter((str) => str.length > 0);
  return { imageEnhancement, image };
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

export const solvePart1 = (filePath: string) => {
  const { imageEnhancement, image } = parseInput(filePath);

  // TODO
  // return enhance(image, imageEnhancement).times(2).countLight();
};
