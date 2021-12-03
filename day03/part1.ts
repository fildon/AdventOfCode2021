import { input } from "./input.ts";

// Assume every input row has the same length
const inputWidth = input[0].length;

const bitCounts = new Array<number>(inputWidth).fill(0);

input
  .map((reading) => parseInt(reading, 2))
  .forEach((reading) => {
    // Reading bitPositions left-to-right
    for (let bitPosition = 0; bitPosition < inputWidth; bitPosition++) {
      const valueAtPosition = (reading >> (inputWidth - 1 - bitPosition)) % 2;
      bitCounts[bitPosition] += valueAtPosition;
    }
  });

const gammaRateBinary = bitCounts.map((bitCount) =>
  bitCount > input.length / 2 ? 1 : 0
);

const epsilonRateBinary = gammaRateBinary.map((bit) => (bit ? 0 : 1));

const gammaRateDec = gammaRateBinary
  .map((bit, index) => bit * 2 ** (inputWidth - 1 - index))
  .reduce<number>((acc, curr) => acc + curr, 0);

const epsilonRateDec = epsilonRateBinary
  .map((bit, index) => bit * 2 ** (inputWidth - 1 - index))
  .reduce<number>((acc, curr) => acc + curr, 0);

console.log(gammaRateDec * epsilonRateDec); // 3242606
