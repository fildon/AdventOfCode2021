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

export const buildSimpleDie = () => {
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
  const die = buildSimpleDie();
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
  const loserScore = Math.min(...scores);
  const rollCount = die.getCurrentRollCount();
  return loserScore * rollCount;
};

/**
 * Models a game in progress
 *
 * 'copies' represents how many duplicates we have of this state
 */
type PartialGame = {
  nextPlayer: 0 | 1;
  scores: [number, number];
  positions: [number, number];
  copies: number;
};

const hashGame = (
  { nextPlayer, scores: [scoreP1, scoreP2], positions: [posP1, posP2] }:
    PartialGame,
) =>
  [nextPlayer, scoreP1, scoreP2, posP1, posP2].map((n) => n.toString()).join(
    ",",
  );

/**
 * All possible results of rolling a dirac die three times
 * weighted by the number of universes with that result
 */
const diracOutcomes = [
  { result: 3, weight: 1 },
  { result: 4, weight: 3 },
  { result: 5, weight: 6 },
  { result: 6, weight: 7 },
  { result: 7, weight: 6 },
  { result: 8, weight: 3 },
  { result: 9, weight: 1 },
];

export const advanceDiracGame = (
  { nextPlayer, positions, scores, copies }: PartialGame,
) => {
  const range1To10 = buildCircularRange({ min: 1, max: 10 });
  const newGames: Array<PartialGame> = [];
  let newP1Wins = 0;
  let newP2Wins = 0;
  for (const { result, weight } of diracOutcomes) {
    const newPosition = range1To10(positions[nextPlayer] + result);
    const newScore = scores[nextPlayer] + newPosition;
    if (newScore >= 21) {
      if (nextPlayer === 0) {
        newP1Wins += copies * weight;
      } else {
        newP2Wins += copies * weight;
      }
    } else {
      newGames.push({
        nextPlayer: nextPlayer === 0 ? 1 : 0,
        scores: nextPlayer === 0
          ? [newScore, scores[1]]
          : [scores[0], newScore],
        positions: nextPlayer === 0
          ? [newPosition, positions[1]]
          : [positions[0], newPosition],
        copies: copies * weight,
      });
    }
  }
  return {
    newGames,
    newP1Wins,
    newP2Wins,
  };
};

const matchingGame = (gameA: PartialGame) =>
  (gameB: PartialGame) => hashGame(gameA) === hashGame(gameB);

export const solvePart2 = (p1Start: number, p2Start: number) => {
  const gamesInProgress: Array<PartialGame> = [{
    nextPlayer: 0,
    scores: [0, 0],
    positions: [p1Start, p2Start],
    copies: 1,
  }];

  let p1Wins = 0;
  let p2Wins = 0;

  while (gamesInProgress.length > 0) {
    // Pop the game that is closest to finishing
    const gameToAdvance = gamesInProgress.sort((a, b) =>
      a.scores[a.nextPlayer] - b.scores[b.nextPlayer]
    ).pop()!;
    const { newGames, newP1Wins, newP2Wins } = advanceDiracGame(gameToAdvance);
    p1Wins += newP1Wins;
    p2Wins += newP2Wins;
    newGames.forEach((newGame) => {
      const matchingExistingGame = gamesInProgress.find(matchingGame(newGame));
      if (matchingExistingGame) {
        // Merge this new game with an existing game entry
        matchingExistingGame.copies += newGame.copies;
      } else {
        gamesInProgress.push(newGame);
      }
    });
  }

  return Math.max(p1Wins, p2Wins);
};
