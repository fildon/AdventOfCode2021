/**
 * Simulates modulo numbers, but with a configurable min and max
 *
 * min-max range is inclusive at both ends
 */
export const buildCircularRange = (
  { min = 1, max }: { min?: number; max: number },
) =>
  (value: number) => {
    let result = value;
    const rangeSize = max - min + 1;
    while (result < min) {
      result += rangeSize;
    }
    while (result > max) {
      result -= rangeSize;
    }
    return result;
  };

export const buildDie = () => {
  const range1To100 = buildCircularRange({ min: 1, max: 100 });
  let currentValue = 0;
  let rollCounter = 0;

  const roll = () => {
    rollCounter++;
    currentValue = range1To100(currentValue + 1);
    return currentValue;
  };

  return {
    roll,
    getCurrentRollCount: () => rollCounter,
  };
};

export const solvePart1 = (p1Start: number, p2Start: number) => {
  return 0;
};
