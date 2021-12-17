import type { Board } from "./types.ts";
import {
  applyNumberToBoard,
  applyNumberToBoards,
  getScore,
  isWin,
  parseInput,
} from "./utils.ts";

const playLoserToEnd = (
  incomingNumbers: Array<number>,
  loser: Board,
): number => {
  const [numberToApply, ...remainingNumbers] = incomingNumbers;
  const newBoard = applyNumberToBoard(loser, numberToApply);
  if (isWin(newBoard)) return getScore(newBoard, numberToApply);
  return playLoserToEnd(remainingNumbers, newBoard);
};

const playToLose = (
  incomingNumbers: Array<number>,
  boards: Array<Board>,
): number => {
  const [numberToApply, ...remainingNumbers] = incomingNumbers;
  // Apply the number and filter out winners
  const newBoards = applyNumberToBoards(boards, numberToApply).filter(
    (board) => !isWin(board),
  );
  // If there are still more than one board remaining, keep going
  if (newBoards.length > 1) return playToLose(remainingNumbers, newBoards);
  // Otherwise play the sole remaining board to its end
  return playLoserToEnd(remainingNumbers, newBoards[0]);
};

const { incomingNumbers, boards } = await parseInput("day04/input.txt");
const loserScore = playToLose(incomingNumbers, boards);
console.log(loserScore); // 17408
