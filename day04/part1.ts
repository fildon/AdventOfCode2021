import type { Board } from "./types.ts";
import {
  applyNumberToBoards,
  findWinner,
  getScore,
  parseInput,
} from "./utils.ts";

/**
 * @returns The final score of the winner
 */
const playUntilWinner = (
  incomingNumbers: Array<number>,
  boards: Array<Board>,
): number => {
  const [numberToApply, ...remainingNumbers] = incomingNumbers;
  const newBoards = applyNumberToBoards(boards, numberToApply);
  const winner = findWinner(newBoards);
  if (!winner) return playUntilWinner(remainingNumbers, newBoards);
  return getScore(winner, numberToApply);
};

const { incomingNumbers, boards } = await parseInput("day04/input.txt");
const winnerScore = playUntilWinner(incomingNumbers, boards);
console.log(winnerScore); // 50008
