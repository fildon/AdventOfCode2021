import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { buildMachine } from "./alu.ts";

Deno.test("day24/empty machine is valid", () => {
  // A machine with no instructions
  const validMachine = buildMachine([]);
  // And no input
  const result = validMachine(0);
  // Is a valid result
  assertEquals(result, "VALID");
});

Deno.test("day24/invalid machine", () => {
  // A machine that just sets Z to one
  const invalidMachine = buildMachine(["add z 1"]);
  const result = invalidMachine(0);
  assertEquals(result, "INVALID");
});

Deno.test("day24/machine reads input", () => {
  const readingMachine = buildMachine(["inp z"]);
  assertEquals(readingMachine(0), "VALID");
  assertEquals(readingMachine(1), "INVALID");
});

Deno.test("day24/multiplication", () => {
  const multiplier = buildMachine(["add z 1", "inp w", "mul z w"]);
  assertEquals(multiplier(0), "VALID");
  assertEquals(multiplier(1), "INVALID");
});

Deno.test("day24/equality", () => {
  const equalizer = buildMachine(["inp z", "eql z 2"]);
  // 1 !== 2 therefore z gets 0 which is VALID
  assertEquals(equalizer(1), "VALID");
  // 2 === 2 therefore z gets 1 which is INVALID
  assertEquals(equalizer(2), "INVALID");
});

Deno.test("day24/division", () => {
  const divider = buildMachine(["inp z", "div z 2", "eql z 3"]);
  // 7 / 2 === 3 so z is 1 "INVALID"
  assertEquals(divider(7), "INVALID");
  // 6 / 2 === 3 so z is 1 "INVALID"
  assertEquals(divider(6), "INVALID");
  // 5 / 2 === 2 so z is 0 "VALID"
  assertEquals(divider(5), "VALID");
});

Deno.test("day24/modulo", () => {
  const modder = buildMachine(["inp z", "mod z 2"]);
  assertEquals(modder(8), "VALID");
  assertEquals(modder(9), "INVALID");
});
