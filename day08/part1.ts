import { getInputStrings } from "../utils/inputparsing.ts";

const solve = (filePath: string) => {
  // get input lines
  return (
    getInputStrings(filePath)
      // remove empty entries
      .filter((str) => str.length > 0)
      // slice off only the part after the pipe
      .map((line) => line.split("|")[1])
      // map to only the words
      .flatMap((line) => line.split(" "))
      // count how many words match target lengths
      .filter((str) => [2, 3, 4, 7].includes(str.length)).length
  );
};

console.log(solve("day08/input.txt"));
