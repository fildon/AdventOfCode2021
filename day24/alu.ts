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

/**
 * Builds a machine from an instruction list
 *
 * Returns a function which takes input and returns the validity of the z
 * variable after running all instructions with that input
 */
export const buildMachine = (instructions: Array<string>) =>
  (input: number) =>
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
      : "INVALID";

export const solvePart1 = () => {
  // TODO get non-empty instruction strings
  // TODO build machine
  // TODO binary chop between zero and the largest 14 digit number
  // The number must also not have any zero digits
  throw new Error("not implemented");
};
