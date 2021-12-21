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

const lookupPixel = (image: Image, defaultPixel: string) =>
  ([x, y]: Coordinate) => image[y]?.[x] ?? defaultPixel;

const sum = (a: number, b: number) => a + b;

const countLights = (image: Image) =>
  image.flatMap((imageLine) => [...imageLine]).filter((pixel) => pixel === "#")
    .length;

const binaryPowerOf = (
  pixel: string,
  index: number,
) => (pixel === "#" ? 2 ** (8 - index) : 0);

const enhancePixel = (
  image: Image,
  enhancementRules: string,
  location: Coordinate,
  steps = 0,
): string => {
  if (steps < 1) {
    return lookupPixel(image, steps % 2 === 0 ? "." : "#")(location);
  }
  return enhancementRules[
    neighboursOf(location)
      .map((neighbour) =>
        enhancePixel(image, enhancementRules, neighbour, steps - 1)
      )
      .map(binaryPowerOf)
      .reduce(sum)
  ];
};

const enhanceImage = (
  image: Image,
  enhancementRules: string,
  defaultPixel = ".",
) => {
  const result: Image = [];
  for (let row = -1; row < image.length + 1; row++) {
    const newRow: Array<string> = [];
    for (let col = -1; col < image[0].length + 1; col++) {
      newRow.push(
        enhancementRules[
          neighboursOf([col, row]).map(
            lookupPixel(image, defaultPixel),
          ).map(binaryPowerOf).reduce(
            sum,
          )
        ],
      );
    }
    result.push(newRow.join(""));
  }
  return result;
};

const enhanceTimes = (image: Image, rules: string, steps: number) => {
  let result = image;
  let infiniteColour = ".";
  for (let i = 0; i < steps; i++) {
    result = enhanceImage(result, rules, infiniteColour);
    infiniteColour = infiniteColour === "."
      ? rules[0]
      : rules[rules.length - 1];
  }

  return result;
};

export const solvePart1 = (filePath: string) => {
  const { enhancementRules, image } = parseInput(filePath);

  const result = enhanceTimes(image, enhancementRules, 2);

  return countLights(result);
};

export const solvePart2 = (filePath: string) => {
  const { enhancementRules, image } = parseInput(filePath);

  const result = enhanceTimes(image, enhancementRules, 50);

  return countLights(result);
};
