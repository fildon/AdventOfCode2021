import { getInputStrings } from "../utils/inputparsing.ts";

type Image = Array<string>;
type Coordinate = [number, number];

export const parseInput = (filePath: string) => {
  const inputStrings = getInputStrings(filePath);
  const rules = inputStrings[0];
  const image = inputStrings.slice(1).filter((str) => str.length > 0);
  return { rules, image };
};

export const neighboursOf = ([x, y]: Coordinate) =>
  [-1, 0, 1].flatMap((yOffset) =>
    [-1, 0, 1].map((xOffset) => [x + xOffset, y + yOffset])
  ) as Array<Coordinate>;

const lookupPixel = (image: Image, colourAtInfinity: string) =>
  ([x, y]: Coordinate) => image[y]?.[x] ?? colourAtInfinity;

const sum = (a: number, b: number) => a + b;

const countLights = (image: Image) =>
  image.flatMap((imageLine) => [...imageLine]).filter((pixel) => pixel === "#")
    .length;

const asBinary = (
  pixel: string,
  index: number,
) => (pixel === "#" ? 2 ** (8 - index) : 0);

const enhanceImage = (
  image: Image,
  enhancementRules: string,
  colourAtInfinity: string,
) => {
  const enhancedImage: Image = [];
  for (let row = -1; row < image.length + 1; row++) {
    const enhancedRow: Array<string> = [];
    for (let col = -1; col < image[0].length + 1; col++) {
      enhancedRow.push(
        enhancementRules[
          neighboursOf([col, row]).map(
            lookupPixel(image, colourAtInfinity),
          ).map(asBinary).reduce(
            sum,
          )
        ],
      );
    }
    enhancedImage.push(enhancedRow.join(""));
  }
  return enhancedImage;
};

const enhancer = (image: Image, rules: string) => ({
  times: (steps: number) => {
    // Keeps track of the current colour that fills infinity
    let infiniteColour = ".";
    let result = image;
    for (let i = 0; i < steps; i++) {
      result = enhanceImage(result, rules, infiniteColour);
      infiniteColour = infiniteColour === "." ? rules.at(0)! : rules.at(-1)!;
    }

    return result;
  },
});

export const solvePart1 = (filePath: string) => {
  const { rules, image } = parseInput(filePath);

  const result = enhancer(image, rules).times(2);

  return countLights(result);
};

export const solvePart2 = (filePath: string) => {
  const { rules, image } = parseInput(filePath);

  const result = enhancer(image, rules).times(50);

  return countLights(result);
};
