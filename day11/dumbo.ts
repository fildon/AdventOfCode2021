type Dumbo = {
  energy: number;
  flashed: boolean;
  row: number;
  col: number;
};

type DumboMap = Array<Array<Dumbo>>;

export const buildDumboMap = (inputLines: Array<string>): DumboMap => {
  return inputLines.map((inputLine, row) =>
    [...inputLine].map((inputChar, col) => ({
      energy: parseInt(inputChar),
      flashed: false,
      row,
      col,
    }))
  );
};

export const updateDumboAt = (
  dumboMap: DumboMap,
  newDumbo: Dumbo
): DumboMap => {
  return dumboMap.map((dumboRow, row) =>
    dumboRow.map((dumbo, col) =>
      row === newDumbo.row && col === newDumbo.col ? newDumbo : dumbo
    )
  );
};

const incrementDumboAt = (
  dumboMap: DumboMap,
  { row, col }: { row: number; col: number }
): DumboMap => {
  const dumbo = dumboMap[row]?.[col];
  // This will only happen if you try to update a dumbo outside the map
  if (!dumbo) return dumboMap;

  return updateDumboAt(dumboMap, { ...dumbo, energy: dumbo.energy + 1 });
};

export const incrementAll = (dumboMap: DumboMap): DumboMap => {
  return dumboMap
    .flat()
    .reduce((map, dumbo) => incrementDumboAt(map, dumbo), dumboMap);
};

export const getNeighbours = (
  dumboMap: DumboMap,
  location: { row: number; col: number }
): Array<Dumbo> => {
  return dumboMap.flat().filter((dumbo) => {
    const rowDiff = Math.abs(dumbo.row - location.row);
    const colDiff = Math.abs(dumbo.col - location.col);
    return rowDiff < 2 && colDiff < 2 && rowDiff + colDiff > 0;
  });
};

export const flashWaveOnce = (dumboMap: DumboMap): DumboMap => {
  const flashers = dumboMap.flatMap((row) =>
    row.filter((dumbo) => dumbo.energy > 9 && !dumbo.flashed)
  );

  const toBeIncremented = flashers.flatMap((flasher) =>
    getNeighbours(dumboMap, flasher).map(({ row, col }) => ({ row, col }))
  );

  const mapAfterIncrements = toBeIncremented.reduce(
    (map, location) => incrementDumboAt(map, location),
    dumboMap
  );

  const mapAfterMarkingFlashers = flashers.reduce(
    (map, flasher) => updateDumboAt(map, { ...flasher, flashed: true }),
    mapAfterIncrements
  );

  return mapAfterMarkingFlashers;
};

export const resetFlashed = (
  dumboMap: DumboMap
): { dumboMap: DumboMap; flashCount: number } => {
  const flashed = dumboMap.flat().filter((dumbo) => dumbo.flashed);
  const resetMap = flashed.reduce(
    (map, dumbo) => updateDumboAt(map, { ...dumbo, energy: 0, flashed: false }),
    dumboMap
  );
  return { dumboMap: resetMap, flashCount: flashed.length };
};

const flashUntilDone = (dumboMap: DumboMap): DumboMap => {
  if (dumboMap.flat().every(({ energy, flashed }) => energy < 10 || flashed))
    return dumboMap;
  return flashUntilDone(flashWaveOnce(dumboMap));
};

const stepOnce = (
  dumboMap: DumboMap
): { dumboMap: DumboMap; flashCount: number } => {
  const map = incrementAll(dumboMap);

  const mapAfterAllSettled = flashUntilDone(map);

  return resetFlashed(mapAfterAllSettled);
};

export const stepN = (
  dumboMap: DumboMap,
  n: number,
  flashCount = 0
): number => {
  if (n < 1) return flashCount;
  const { dumboMap: newMap, flashCount: newFlashCount } = stepOnce(dumboMap);
  return stepN(newMap, n - 1, flashCount + newFlashCount);
};
