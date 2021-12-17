import { input } from "./input.ts";

type Bit = 0 | 1;

type BitArray = Array<Bit>;

const toBitArray = (binaryString: string): Array<Bit> => {
  const bitArray = new Array<0 | 1>(binaryString.length).fill(0);
  for (let bitPosition = 0; bitPosition < binaryString.length; bitPosition++) {
    const valueAtPosition =
      (parseInt(binaryString, 2) >> (binaryString.length - 1 - bitPosition)) %
      2;
    bitArray[bitPosition] += valueAtPosition;
  }
  return bitArray;
};

const toDecimal = (bitArray: BitArray) =>
  bitArray
    .map((bit, index) => bit * 2 ** (bitArray.length - 1 - index))
    .reduce((acc, curr) => acc + curr, 0);

const getValuesAtPosition = (bitArrays: Array<BitArray>, position: number) =>
  bitArrays
    .map((bitArray) => bitArray[position])
    .reduce(
      (acc, curr) => {
        if (curr === 0) acc.zeroes++;
        if (curr === 1) acc.ones++;
        return acc;
      },
      {
        zeroes: 0,
        ones: 0,
      },
    );

const getRatingByCriteria = (
  readings: Array<BitArray>,
  criteria: (bitCounts: { zeroes: number; ones: number }) => Bit,
  columnIndex = 0,
): BitArray => {
  if (readings.length === 1) return readings[0];
  const filteredReadings = readings.filter(
    (reading) =>
      reading[columnIndex] ===
        criteria(getValuesAtPosition(readings, columnIndex)),
  );
  return getRatingByCriteria(filteredReadings, criteria, columnIndex + 1);
};

const getOxygenGeneratorRating = (readings: Array<BitArray>) =>
  getRatingByCriteria(readings, ({ zeroes, ones }) => (ones >= zeroes ? 1 : 0));

const getCO2ScrubberRating = (readings: Array<BitArray>) =>
  getRatingByCriteria(readings, ({ zeroes, ones }) => (ones >= zeroes ? 0 : 1));

const oxygenGeneratorRating = getOxygenGeneratorRating(input.map(toBitArray));
const cO2ScrubberRating = getCO2ScrubberRating(input.map(toBitArray));

console.log(toDecimal(oxygenGeneratorRating) * toDecimal(cO2ScrubberRating)); // 4856080
