import { getInputStrings } from "../utils/inputparsing.ts";

export const buildMachine = (instructions: Array<string>) => {
  return {
    run: (input: number) => {
      const remainingInstructions = [...instructions];
      let state = { w: 0, x: 0, y: 0, z: 0 };
      const inputString = input.toString();
      let inputPointer = 0;
      while (remainingInstructions.length) {
        const nextInstruction = remainingInstructions.pop();
        if (!nextInstruction) throw new Error("Popped nothing!");
        const [command, arg1, arg2] = nextInstruction.split(" ");
        switch (command) {
          case "inp": {
            if (inputPointer >= inputString.length) {
              throw new Error("Ran out of input to consume");
            }
            state = {
              ...state,
              [arg1]: parseInt(inputString[inputPointer]),
            };
            inputPointer++;
            break;
          }
          case "add": {
            const a = state[arg1 as keyof typeof state];
            const b = parseInt(arg2) ||
              state[arg2 as keyof typeof state];
            state = {
              ...state,
              [arg1]: a + b,
            };
            break;
          }
          case "mul": {
            // TODO
            break;
          }
          case "div": {
            // TODO
            break;
          }
          case "mod": {
            // TODO
            break;
          }
          case "eql": {
            // TODO
            break;
          }
          default: {
            throw new Error(`Unrecognised instruction: ${nextInstruction}`);
          }
        }
      }

      return state.z === 0 ? "VALID" : "INVALID";
    },
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
