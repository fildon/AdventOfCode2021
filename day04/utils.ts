import type { Board, BoardRow } from "./types.ts";

const toBoardRow = (rowString: string): BoardRow => {
  const boardRow = rowString
    .split(" ")
    .filter((str) => str.length > 0)
    .map((str) => parseInt(str))
    .map((num) => ({ value: num, marked: false }));
  if (boardRow.length !== 5)
    throw new Error(
      `Parse error: unexpected row width. Row string was: ${rowString}`
    );
  return boardRow as BoardRow;
};

const toBoard = (boardString: Array<string>): Board => {
  const rows = boardString.map(toBoardRow);
  if (rows.length !== 5)
    throw new Error(
      `Parse error: unexpected board height. Board string was: ${boardString}`
    );
  return rows as Board;
};

export const parseInput = async (filePath: string) => {
  const text = await Deno.readTextFile(filePath);

  const inputParts = text.split(/\r\n/);
  const incomingNumbers = inputParts[0].split(",").map((str) => parseInt(str));

  const boardStream = inputParts.filter(
    (line, index) => index > 0 && line.length > 0
  );
  const boardStrings: Array<Array<string>> = [];
  let startIndex = 0;
  while (startIndex < boardStream.length) {
    const boardString: Array<string> = [];
    for (let i = 0; i < 5; i++) {
      boardString.push(boardStream[startIndex + i]);
    }
    boardStrings.push(boardString);
    startIndex += 5;
  }

  const boards = boardStrings.map(toBoard);

  return { incomingNumbers, boards };
};

const hasRowWin = (board: Board): boolean => {
  return board.some((row) => row.every((cell) => cell.marked));
};

const hasColWin = (board: Board): boolean => {
  for (let colIndex = 0; colIndex < board[0].length; colIndex++) {
    const column = board.map((row) => row[colIndex]);
    if (column.every((cell) => cell.marked)) return true;
  }
  return false;
};

const isWin = (board: Board): boolean => {
  return hasRowWin(board) || hasColWin(board);
};

const applyNumberToRow = (row: BoardRow, numberToMark: number): BoardRow => {
  const newRow = row.map(({ value, marked }) => ({
    value,
    marked: marked || numberToMark === value,
  }));
  return newRow as BoardRow;
};

const applyNumberToBoard = (board: Board, numberToMark: number): Board => {
  const newBoard = board.map((row) => applyNumberToRow(row, numberToMark));
  return newBoard as Board;
};

export const applyNumberToBoards = (
  boards: Array<Board>,
  numberToMark: number
): Array<Board> => {
  return boards.map((board) => applyNumberToBoard(board, numberToMark));
};

/**
 * @returns undefined if there are no winners yet
 */
export const findWinner = (boards: Array<Board>): Board | undefined => {
  return boards.find(isWin);
};

export const getScore = (board: Board, lastCalledNumber: number): number => {
  const unmarkedSum = board
    .flatMap((row) => row)
    .filter((cell) => !cell.marked)
    .map((cell) => cell.value)
    .reduce((acc, curr) => acc + curr, 0);
  return unmarkedSum * lastCalledNumber;
};
