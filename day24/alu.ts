import { getInputStrings } from "../utils/inputparsing.ts";

/**
 * The state of the machine at a point in time
 */
type MachineState = {
  w: number;
  x: number;
  y: number;
  z: number;
};

/**
 * A common interface for all executable functions
 */
type Executable = (...args: number[]) => number;

/**
 * Given an input number, manages state of input consumption
 *
 * Returns an executable to be invoked each time an input instruction
 * needs to be run.
 */
const buildInputHandler = (input: number): Executable => {
  const inputString = input.toString();
  let inputPointer = 0;
  return () => parseInt(inputString[inputPointer++]);
};

/**
 * Parses an instruction string to a collection of useful values
 */
const parseInstruction = (
  instruction: string | undefined,
  state: MachineState,
) => {
  if (!instruction) throw new Error("Tried to parse undefined instruction!");
  const [command, target, ...others] = instruction.split(" ");
  // Each arg is either a primitive integer, or a key to use for value lookup
  const args = [target, ...others].map((keyOrValue) =>
    parseInt(keyOrValue) || state[keyOrValue as keyof typeof state]
  );
  return {
    command,
    target,
    args,
  };
};

const compileInstruction = (
  instruction: string | undefined,
  state: { w: string; x: string; y: string; z: string },
) => {
  if (!instruction) throw new Error("Tried to compile undefined instruction!");
  const [command, target, ...others] = instruction.split(" ");
  const args = [target, ...others].filter((x) => !!x).map((arg) => {
    if (["w", "x", "y", "z"].includes(arg)) {
      return state[arg as keyof typeof state];
    }
    return arg;
  });
  return {
    command,
    target,
    args,
  };
};

/**
 * Builds the set of executables for a given input
 */
const buildExecutables = (
  input: number,
): Partial<Record<string, Executable>> => ({
  inp: buildInputHandler(input),
  add: (a, b) => a + b,
  mul: (a, b) => a * b,
  div: (a, b) => Math.floor(a / b),
  mod: (a, b) => a % b,
  eql: (a, b) => a === b ? 1 : 0,
});

/**
 * Given an instruction and a state returns a new state after executing that instruction
 */
const executeInstruction = (
  executables: Partial<Record<string, Executable>>,
) =>
  (
    state: MachineState,
    instruction: string,
  ): MachineState => {
    const { command, target, args } = parseInstruction(instruction, state);
    const executable = executables[command];
    if (!executable) throw new Error("Unrecognised instruction");
    return { ...state, [target]: executable(...args) };
  };

const buildInputCompiler = () => {
  const inputVariables = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
  ];
  let inputPointer = 0;
  return () => inputVariables[inputPointer++];
};

const buildCommandCompilers = (): Partial<
  Record<string, (...args: string[]) => string>
> => ({
  inp: buildInputCompiler(),
  add: (a, b) => {
    if (a === "0") return b;
    if (b === "0") return a;
    return `(${a} + ${b})`;
  },
  mul: (a, b) => {
    if (a === "0" || b === "0") return "0";
    if (a === "1") return b;
    if (b === "1") return a;
    return `(${a} * ${b})`;
  },
  div: (a, b) => {
    if (b === "1") return a;
    return `(${a} / ${b})`;
  },
  mod: (a, b) => `(${a} % ${b})`,
  eql: (a, b) => `(${a} === ${b})`,
});

const compose = (
  commandCompilers: Partial<Record<string, (...args: string[]) => string>>,
) =>
  (
    state: { w: string; x: string; y: string; z: string },
    instruction: string,
  ) => {
    const { command, target, args } = compileInstruction(instruction, state);
    const commandCompiler = commandCompilers[command];
    if (!commandCompiler) {
      throw new Error(`Unrecognised instruction: ${instruction}`);
    }
    return { ...state, [target]: commandCompiler(...args) };
  };

/**
 * Builds a machine from an instruction list
 *
 * Returns a function which takes input and returns the validity of the z
 * variable after running all instructions with that input
 */
export const buildMachine = (instructions: Array<string>) => ({
  /**
   * Compiles this instruction to a set of mathematical expressions
   *
   * The resulting expression is the value of z after all instructions are applied
   *
   * For each of the 14 input digits, the letters A-N are used
   */
  compile: () =>
    instructions.reduce(compose(buildCommandCompilers()), {
      w: "0",
      x: "0",
      y: "0",
      z: "0",
    }).z,
  /**
   * Runs this machine for a given input
   */
  run: (input: number) =>
    instructions.reduce(
        executeInstruction(buildExecutables(input)),
        {
          w: 0,
          x: 0,
          y: 0,
          z: 0,
        },
      ).z ===
        0
      ? "VALID"
      : "INVALID",
});

const nonEmpty = (input: { length: number }) => input.length > 0;

export const solvePart1 = (filePath: string) => {
  const instructions = getInputStrings(filePath).filter(nonEmpty);
  const machine = buildMachine(instructions);
  return machine.compile();
};
