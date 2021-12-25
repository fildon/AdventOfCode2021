import { getInputStrings } from "../utils/inputparsing.ts";

type Cucumbers = Array<string>;

export const equals = (a: Cucumbers, b: Cucumbers): boolean =>
  a.length === b.length && a.every((str, index) => str === b[index]);

export const step = (current: Cucumbers): Cucumbers => {
  const height = current.length;
  const afterEastMoves = current.map((line) => {
    const { movers, neighbours } = [...line].map((
      _,
      i,
    ) => [i, (i + 1) % line.length])
      .filter(([mover, neighbour]) =>
        line[mover] === ">" && line[neighbour] === "."
      ).reduce((acc, [mover, neighbour]) => {
        acc.movers.add(mover);
        acc.neighbours.add(neighbour);
        return acc;
      }, {
        movers: new Set<number>(),
        neighbours: new Set<number>(),
      });
    return [...line].map((cell, i) =>
      movers.has(i) ? "." : neighbours.has(i) ? ">" : cell
    ).join("");
  });

  const afterSouthMoves = afterEastMoves.map((line, y) =>
    [...line].map((cell, x) => {
      if (cell === ">") return ">";
      if (cell === "v") {
        if (afterEastMoves[(y + 1) % height][x] === ".") return ".";
        return "v";
      }
      // cell === "."
      if (afterEastMoves[(y + height - 1) % height][x] === "v") return "v";
      return ".";
    }).join("")
  );
  return afterSouthMoves;
};

/**
 * Repeatedly update cucumber state until it stops changing,
 * returns the number of steps taken
 */
export const stepsToStop = (
  initial: Cucumbers,
): number => {
  let previous = initial;
  let current = initial;
  let steps = 0;
  do {
    previous = current;
    current = step(current);
    steps++;
  } while (previous.join("") !== current.join(""));
  return steps;
};

const nonEmpty = (input: { length: number }) => input.length > 0;

export const solvePart1 = (filePath: string) =>
  stepsToStop(getInputStrings(filePath).filter(nonEmpty));
