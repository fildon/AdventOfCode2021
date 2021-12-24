import { getInputStrings } from "../utils/inputparsing.ts";

type Variables = {
  w: number;
  x: number;
  y: number;
  z: number;
};

/**
 * Given an input number, manages state of input consumption
 *
 * Returns a function to be invoked each time an input instruction
 * needs to be run.
 */
const buildInputHandler = (input: number) => {
  const inputString = input.toString();
  let inputPointer = 0;
  return (state: Variables, target: string) => {
    if (inputPointer >= inputString.length) {
      throw new Error("Ran out of input to consume");
    }
    const inputValue = parseInt(inputString[inputPointer++]);
    return {
      ...state,
      [target]: inputValue,
    };
  };
};

/**
 * Parses an instruction string to a collection of useful values
 */
const parseInstruction = (
  instruction: string | undefined,
  state: Variables,
) => {
  if (!instruction) throw new Error("Tried to parse undefined instruction!");
  const [command, target, ...others] = instruction.split(" ");
  const args = [target, ...others].map((keyOrValue) =>
    parseInt(keyOrValue) || state[keyOrValue as keyof typeof state]
  );
  return {
    command,
    target,
    args,
  };
};

const add = (a: number, b: number) => a + b;
const mul = (a: number, b: number) => a * b;
const div = (a: number, b: number) => Math.floor(a / b);
const mod = (a: number, b: number) => 0; // TODO
const eql = (a: number, b: number) => a === b ? 1 : 0;

/**
 * Given an instruction and a state returns a new state after executing that instruction
 */
const executeInstruction = (
  inputHandler: ReturnType<typeof buildInputHandler>,
) =>
  (
    state: Variables,
    instruction: string,
  ): Variables => {
    const { command, target, args } = parseInstruction(instruction, state);
    if (command === "inp") return inputHandler(state, target);
    const executable = { add, mul, div, mod, eql }[command];
    if (!executable) throw new Error("Unrecognised instruction");
    return { ...state, [target]: args.reduce(executable) };
  };

export const buildMachine = (instructions: Array<string>) => {
  return {
    run: (input: number) =>
      instructions.reduce(executeInstruction(buildInputHandler(input)), {
          w: 0,
          x: 0,
          y: 0,
          z: 0,
        }).z ===
          0
        ? "VALID"
        : "INVALID",
  };
};

export const solvePart1 = (filePath: string) => {
  const instructions = getInputStrings(filePath).filter((str) =>
    str.length > 0
  );
  const machine = buildMachine(instructions);
  // TODO binary chop between zero and the largest 14 digit number
  // The number must also not have any zero digits
  throw new Error("not implemented");
};
