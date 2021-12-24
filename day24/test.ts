import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { buildMachine } from "./alu.ts";

Deno.test("day24/empty machine is valid", () => {
  // A machine with no instructions
  const validMachine = buildMachine([]);
  // And no input
  const result = validMachine.run(0);
  // Is a valid result
  assertEquals(result, "VALID");
});

Deno.test("day24/invalid machine", () => {
  // A machine that just sets Z to one
  const invalidMachine = buildMachine(["add z 1"]);
  const result = invalidMachine.run(0);
  assertEquals(result, "INVALID");
});

Deno.test("day24/machine reads input", () => {
  const readingMachine = buildMachine(["inp z"]);
  assertEquals(readingMachine.run(0), "VALID");
  assertEquals(readingMachine.run(1), "INVALID");
});

Deno.test("day24/multiplication", () => {
  const multiplier = buildMachine(["add z 1", "inp w", "mul z w"]);
  assertEquals(multiplier.run(0), "VALID");
  assertEquals(multiplier.run(1), "INVALID");
});
