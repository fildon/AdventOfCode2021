/**
 * Simulates modulo numbers, but with a configurable min and max
 *
 * min-max range is inclusive at both ends
 */
export const buildCircularRange = (
  { min, max }: { min: number; max: number },
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
  const range1To10 = buildCircularRange({ min: 1, max: 10 });
  const die = buildDie();
  const scores = [0, 0];
  const positions = [p1Start, p2Start];
  let nextPlayer = 0;
  while (scores.every((score) => score < 1000)) {
    const rollResult = die.roll() + die.roll() + die.roll();
    const newPosition = range1To10(positions[nextPlayer] + rollResult);
    positions[nextPlayer] = newPosition;
    scores[nextPlayer] += newPosition;
    nextPlayer = nextPlayer ? 0 : 1;
  }
  const loserScore = Math.min(scores[0], scores[1]);
  const rollCount = die.getCurrentRollCount();
  return loserScore * rollCount;
};
