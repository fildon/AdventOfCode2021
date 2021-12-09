import { getInputStrings } from "../utils/inputparsing.ts";

type Map = number[][];

export const buildMapFromStrings = (inputLines: string[]): Map =>
  inputLines.map((line) => [...line].map((cell) => parseInt(cell)));

const getLowPointCoordinates = (map: Map) => {
  const coords: Array<[number, number]> = [];
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
        coords.push([row, col]);
      }
    }
  }
  return coords;
};

const getRiskAtCoordinate = (map: Map, coordinate: [number, number]) => {
  const [row, col] = coordinate;
  return map[row][col] + 1;
};

export const getRiskOfLowPoints = () => {
  const map = buildMapFromStrings(
    getInputStrings("day09/input.txt").filter((line) => line.length > 0)
  );
  const lowPoints = getLowPointCoordinates(map);
  const risks = lowPoints.map((lowPoint) => getRiskAtCoordinate(map, lowPoint));
  return risks.reduce((acc, curr) => acc + curr);
};

const getBasinSizeRecursive = (
  map: Map,
  checked: Array<[number, number]>,
  toCheck: Array<[number, number]>
): number => {
  if (toCheck.length === 0) return checked.length;
  const [next, ...waiting] = toCheck;
  const [nextRow, nextCol] = next;
  const candidates = [
    [nextRow + 1, nextCol],
    [nextRow, nextCol + 1],
    [nextRow - 1, nextCol],
    [nextRow, nextCol - 1],
  ]
    // Candidate is inside the map
    .filter(([x, y]) => typeof map[x]?.[y] === "number")
    // Candidate is not a nine
    .filter(([x, y]) => map[x][y] < 9)
    // Candidate is not already in the checked list
    .filter(([x, y]) =>
      checked.every((checked) => x !== checked[0] || y !== checked[1])
    )
    // Candidate is not already in the toCheck list
    .filter(([x, y]) =>
      toCheck.every((toCheck) => x !== toCheck[0] || y !== toCheck[1])
    ) as Array<[number, number]>;
  // Add 'next' to checked and valid candidates to toCheck
  return getBasinSizeRecursive(
    map,
    [next, ...checked],
    [...candidates, ...waiting]
  );
};

export const getBasinSize = (map: Map, coordinate: [number, number]) => {
  return getBasinSizeRecursive(map, [], [coordinate]);
};

const getBasinSizes = (map: Map) => {
  const lowPoints = getLowPointCoordinates(map);
  return lowPoints.map((lowPoint) => getBasinSize(map, lowPoint));
};

export const getProductOfThreeLargestBasins = () => {
  const map = buildMapFromStrings(
    getInputStrings("day09/input.txt").filter((line) => line.length > 0)
  );
  const basinSizes = getBasinSizes(map);
  // Sort descending by value, i.e. biggest first
  return basinSizes
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, curr) => acc * curr);
};
