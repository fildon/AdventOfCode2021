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

const countLights = (image: Image) =>
  image.flatMap((imageLine) => [...imageLine]).filter((pixel) => pixel === "#")
    .length;

const enhancePixel = (
  image: Image,
  enhancementRules: string,
  location: Coordinate,
  steps = 0
): string => {
  if (steps < 1) return lookupPixel(image)(location);
  return enhancementRules[
    neighboursOf(location)
      .map((neighbour) =>
        enhancePixel(image, enhancementRules, neighbour, steps - 1)
      )
      .map((pixel, index) => (pixel === "#" ? 2 ** (8 - index) : 0))
      .reduce(sum)
  ];
};

export const solvePart1 = (filePath: string) => {
  const { enhancementRules, image } = parseInput(filePath);

  const STEPS = 2;

  const enhancedImage: Image = [];
  for (let row = -STEPS; row < image.length + STEPS; row++) {
    const enhancedRow: Array<string> = [];
    for (let col = -10; col < image[0].length + 10; col++) {
      const pixel = enhancePixel(image, enhancementRules, [row, col], STEPS);
      enhancedRow.push(pixel);
    }
    enhancedImage.push(enhancedRow.join(""));
  }
  return countLights(enhancedImage);
};
