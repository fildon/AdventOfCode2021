import { getInputStrings } from "../utils/inputparsing.ts";

type Coordinate = {
  x: number;
  y: number;
};

type Path = [Coordinate, Coordinate];

const parsePath = (inputString: string): Path => {
  const [start, end] = inputString.split("->").map((str) => str.trim());
  const [startX, startY] = start.split(",").map((num) => parseInt(num));
  const [endX, endY] = end.split(",").map((num) => parseInt(num));
  return [
    { x: startX, y: startY },
    { x: endX, y: endY },
  ];
};

const parsePaths = (inputStrings: Array<string>): Array<Path> => {
  return inputStrings.filter((str) => str.length > 0).map(parsePath);
};

const createDiagram = (x: number, y: number): Array<Array<number>> => {
  const diagram: Array<Array<number>> = [];
  // We use inclusive ranges to include the max value in the diagram
  for (let i = 0; i <= y; i++) {
    const row: Array<number> = [];
    for (let j = 0; j <= x; j++) {
      row.push(0);
    }
    diagram.push(row);
  }
  return diagram;
};

const getCoordinatesAlongPath = ([start, end]: Path): Array<Coordinate> => {
  const xHeading = end.x > start.x ? 1 : end.x === start.x ? 0 : -1;
  const yHeading = end.y > start.y ? 1 : end.y === start.y ? 0 : -1;
  let xPosition = start.x;
  let yPosition = start.y;
  const coordinates: Array<Coordinate> = [];
  while (xPosition !== end.x || yPosition !== end.y) {
    coordinates.push({ x: xPosition, y: yPosition });
    xPosition += xHeading;
    yPosition += yHeading;
  }
  coordinates.push(end);
  return coordinates;
};

const solve = (filePath: string) => {
  const inputStrings = getInputStrings(filePath).filter(
    (str) => str.length > 0,
  );
  const paths = parsePaths(inputStrings);
  const { x: maxX, y: maxY } = paths.flat().reduce(
    (acc, curr) => ({
      x: Math.max(acc.x, curr.x),
      y: Math.max(acc.y, curr.y),
    }),
    { x: 0, y: 0 },
  );
  const diagram = createDiagram(maxX, maxY);
  const coordsToPaint = paths.map(getCoordinatesAlongPath).flat();
  coordsToPaint.forEach(({ x, y }) => diagram[y][x]++);
  return diagram.flat().filter((n) => n > 1).length;
};

console.log(solve("day05/input.txt")); // 20484
