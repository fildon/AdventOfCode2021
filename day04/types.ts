type BoardCell = { value: number; marked: boolean };
export type BoardRow = [BoardCell, BoardCell, BoardCell, BoardCell, BoardCell];
export type Board = [BoardRow, BoardRow, BoardRow, BoardRow, BoardRow];
