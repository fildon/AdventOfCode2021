import { getInputStrings } from "../utils/inputparsing.ts";

export const buildMapFromStrings = (inputLines: string[]) =>
  inputLines.map((line) => [...line].map((cell) => parseInt(cell)));

export const solve = () => {
  const map = buildMapFromStrings(
    getInputStrings("day09/input.txt").filter((line) => line.length > 0)
  );
  let answer = 0;
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      const cell = map[row][col];
      // We allow unsafe index access,
      // but then filter out invalid accesses later
      const neighbours = [
        map[row + 1]?.[col],
        map[row][col + 1],
        map[row - 1]?.[col],
        map[row][col - 1],
        // filter out cell accesses that fall outside the map
      ].filter((n) => typeof n === "number");
      if (neighbours.every((neighbour) => neighbour > cell)) {
        answer += cell + 1;
      }
    }
  }
  return answer;
};

console.log(solve()); //528
