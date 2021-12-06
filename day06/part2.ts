import { getInputStrings } from "../utils/inputparsing.ts";

/**
 * A fish collection is indexed by age group
 * And each value is the count in that age group
 */
type FishCollection = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

const parseInput = (filePath: string): FishCollection => {
  const fishArray = getInputStrings(filePath)
    .filter((line) => line.length > 0)
    .map((line) => line.split(","))
    .flat()
    .map((str) => parseInt(str));

  // Collect fish into an array where each index represents an age group and each value is the count at that age
  return Array(9)
    .fill(null)
    .map(
      (_, index) => fishArray.filter((age) => age === index).length
    ) as FishCollection;
};

/**
 * Every day decreases age counter by one
 * But 0 counter creates an 8 and a 6
 */
const stepOneDay = (fishCollection: FishCollection): FishCollection => [
  fishCollection[1],
  fishCollection[2],
  fishCollection[3],
  fishCollection[4],
  fishCollection[5],
  fishCollection[6],
  fishCollection[7] + fishCollection[0],
  fishCollection[8],
  fishCollection[0],
];

const stepNDays = (
  fishCollection: FishCollection,
  days: number
): FishCollection =>
  days <= 0 ? fishCollection : stepNDays(stepOneDay(fishCollection), days - 1);

const countAllFish = (fishCollection: FishCollection): number =>
  fishCollection.reduce((acc, curr) => acc + curr);

console.log(countAllFish(stepNDays(parseInput("day06/input.txt"), 256))); // 1632146183902
