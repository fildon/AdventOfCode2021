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

export const advanceDiracGame = (game: PartialGame) => {
  // One turn has 3 - 9 => 7 possible outcomes (not equally weighted!)
  // ways to make each result = [1, 3, 6, 7, 6, 3, 1] = 27 total outcomes (3 ** 3)
  return {
    // TODO remember to multiply certain numbers by the current universe copies
    newGames: [] as Array<PartialGame>, // TODO new partial games to consider
    newP1Wins: 0, // TODO as many games were won by p1 as a result of this turn
    newP2Wins: 0, // TODO as many games were won by p2 as a result of this turn
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
