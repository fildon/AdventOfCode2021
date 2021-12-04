type BoardCell = { value: number; marked: boolean };
type BoardRow = [BoardCell, BoardCell, BoardCell, BoardCell, BoardCell];
type Board = [BoardRow, BoardRow, BoardRow, BoardRow, BoardRow];

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

const parseInput = async (filePath: string) => {
  const text = await Deno.readTextFile(filePath);

  const inputParts = text.split(/\r\n/);
  const incomingNumbers = inputParts[0];

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

const { incomingNumbers, boards } = await parseInput("day04/testInput.txt");

console.log(incomingNumbers);
console.log(boards);
